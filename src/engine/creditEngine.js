// ================================================================
// Credit Decision Rules Engine
// ================================================================
// Formula: Eligible Amount = min(Requested, Income × Multiplier − Existing_EMI × 12)
// Combined with credit score gate and DTI threshold.
// ================================================================

/**
 * Calculate EMI using the standard reducing-balance formula.
 * EMI = P × r × (1+r)^n / ((1+r)^n − 1)
 */
export function calculateEMI(principal, annualRate, tenureMonths) {
  if (principal <= 0 || tenureMonths <= 0) return 0;
  if (annualRate === 0) return Math.round(principal / tenureMonths);

  const r = annualRate / 12 / 100;
  const n = tenureMonths;
  const emi = (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  return Math.round(emi);
}

/**
 * Calculate total interest payable.
 */
export function totalInterest(principal, annualRate, tenureMonths) {
  const emi = calculateEMI(principal, annualRate, tenureMonths);
  return emi * tenureMonths - principal;
}

/**
 * Format a number as Indian currency string: ₹1,23,456
 */
export function formatINR(amount) {
  if (amount == null) return '₹0';
  const num = Math.round(Math.abs(amount));
  const str = num.toString();
  // Indian number system: last 3 digits, then groups of 2
  let result = str.slice(-3);
  let rest = str.slice(0, -3);
  while (rest.length > 0) {
    result = rest.slice(-2) + ',' + result;
    rest = rest.slice(0, -2);
  }
  return '₹' + result;
}

/**
 * Format a number in short form: ₹1.2L, ₹50K
 */
export function formatINRShort(amount) {
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
  if (amount >= 1000) return `₹${(amount / 1000).toFixed(0)}K`;
  return formatINR(amount);
}

// ================================================================
// Credit Assessment
// ================================================================

const RATE_PRIME = 12;        // % p.a.
const RATE_NEAR_PRIME = 18;
const RATE_THIN_FILE = 21;
const PROCESSING_FEE_PCT = 1.5;   // % of approved amount

const MULTIPLIER_PRIME = 15;
const MULTIPLIER_NEAR_PRIME = 10;
const MULTIPLIER_THIN_FILE = 5;

const DTI_REJECT_THRESHOLD = 50;  // %
const DTI_NEAR_PRIME_THRESHOLD = 35;
const SCORE_PRIME_THRESHOLD = 750;
const SCORE_REJECT_THRESHOLD = 650;

/**
 * Run full credit assessment.
 *
 * @param {Object} params
 * @param {number} params.requestedAmount
 * @param {number} params.tenure
 * @param {number} params.monthlyIncome
 * @param {number} params.existingEMI
 * @param {number} params.creditScore  — 0 means no bureau record (thin file)
 * @param {string} params.employmentType — 'salaried' | 'self-employed'
 * @param {boolean} params.kycMismatch
 * @param {string}  params.mismatchDetail
 * @param {Object}  params.bankStatement — { avgBalance3m, avgMonthlyCredit }
 *
 * @returns {Object} decision result
 */
export function assessCredit(params) {
  const {
    requestedAmount,
    tenure,
    monthlyIncome,
    existingEMI,
    creditScore,
    employmentType,
    kycMismatch = false,
    mismatchDetail = '',
    bankStatement = {},
  } = params;

  // ------ Step 1: KYC Check ------
  if (kycMismatch) {
    return {
      decision: 'KYC_FLAG',
      reason: 'Name mismatch detected between Aadhaar and PAN records. Application routed to manual review per compliance policy.',
      detail: mismatchDetail,
      creditScore,
      dti: calcDTI(existingEMI, monthlyIncome),
      requestedAmount,
      approvedAmount: null,
      interestRate: null,
      emi: null,
      processingFee: null,
      tenure,
    };
  }

  // ------ Step 2: DTI Calculation ------
  const dti = calcDTI(existingEMI, monthlyIncome);

  // ------ Step 3: Thin File (no credit history) ------
  if (creditScore === 0) {
    const eligible = Math.min(
      requestedAmount,
      monthlyIncome * MULTIPLIER_THIN_FILE
    );
    const approvedAmount = roundToThousand(Math.max(eligible, 10000));
    
    let rate = RATE_THIN_FILE;
    if (tenure === 6) rate = 0;
    else if (tenure === 9) rate = 2;
    else if (tenure === 11) rate = 3.5;
    
    const emi = calculateEMI(approvedAmount, rate, tenure);

    return {
      decision: 'APPROVED_CONDITIONS',
      reason: 'Limited credit history. Offer based on bank statement analysis and verified income. Build your credit score with timely repayments to unlock higher limits.',
      creditScore,
      dti,
      requestedAmount,
      approvedAmount,
      interestRate: rate,
      emi,
      processingFee: Math.round(approvedAmount * PROCESSING_FEE_PCT / 100),
      tenure,
      bankStatementWeightage: true,
      tags: ['thin-file', 'bank-statement-underwriting'],
    };
  }

  // ------ Step 4: Credit Score Gate ------
  if (creditScore < SCORE_REJECT_THRESHOLD) {
    return {
      decision: 'REJECTED',
      reason: 'Your credit score is below our minimum eligibility threshold. We recommend improving your credit score by clearing existing dues and maintaining timely payments.',
      creditScore,
      dti,
      requestedAmount,
      approvedAmount: null,
      interestRate: null,
      emi: null,
      processingFee: null,
      tenure,
      suggestions: [
        'Clear outstanding credit card dues',
        'Ensure all existing EMIs are paid on time',
        'Try again after 3-6 months with an improved score',
        'Consider applying for a lower amount (under ₹50,000)',
      ],
    };
  }

  // ------ Step 5: DTI Gate ------
  if (dti > DTI_REJECT_THRESHOLD) {
    return {
      decision: 'REJECTED',
      reason: 'Your existing debt obligations are too high relative to your income. Your debt-to-income ratio exceeds our maximum threshold of 50%.',
      creditScore,
      dti,
      requestedAmount,
      approvedAmount: null,
      interestRate: null,
      emi: null,
      processingFee: null,
      tenure,
      suggestions: [
        'Reduce existing EMI obligations before applying',
        'Consider consolidating your existing loans',
        'Apply for a smaller loan amount',
        'Add a co-applicant with additional income',
      ],
    };
  }

  // ------ Step 6: Prime vs Near-Prime Decision ------
  const isPrime = creditScore >= SCORE_PRIME_THRESHOLD && dti <= DTI_NEAR_PRIME_THRESHOLD;
  const multiplier = isPrime ? MULTIPLIER_PRIME : MULTIPLIER_NEAR_PRIME;
  
  let rate = isPrime ? RATE_PRIME : RATE_NEAR_PRIME;
  if (tenure === 6) rate = 0;
  else if (tenure === 9) rate = 2;
  else if (tenure === 11) rate = 3.5;

  const eligible = monthlyIncome * multiplier - existingEMI * 12;
  const approvedAmount = roundToThousand(Math.min(requestedAmount, Math.max(eligible, 10000)));

  const emi = calculateEMI(approvedAmount, rate, tenure);

  if (isPrime && approvedAmount >= requestedAmount) {
    // Full approval — prime
    return {
      decision: 'APPROVED',
      reason: 'Congratulations! Based on your strong credit profile, you qualify for our best rates.',
      creditScore,
      dti,
      requestedAmount,
      approvedAmount: requestedAmount,
      interestRate: rate,
      emi: calculateEMI(requestedAmount, rate, tenure),
      processingFee: Math.round(requestedAmount * PROCESSING_FEE_PCT / 100),
      tenure,
      tags: ['prime', 'best-rate'],
    };
  }

  // Near-prime or reduced amount
  return {
    decision: 'APPROVED_CONDITIONS',
    reason: approvedAmount < requestedAmount
      ? `Based on your income and existing obligations, we can offer ₹${approvedAmount.toLocaleString('en-IN')} instead of your requested ₹${requestedAmount.toLocaleString('en-IN')}.`
      : 'Your application is approved.',
    creditScore,
    dti,
    requestedAmount,
    approvedAmount,
    interestRate: rate,
    emi,
    processingFee: Math.round(approvedAmount * PROCESSING_FEE_PCT / 100),
    tenure,
    tags: ['near-prime'],
  };
}

// ------ Helpers ------

function calcDTI(existingEMI, monthlyIncome) {
  if (monthlyIncome <= 0) return 100;
  return Math.round((existingEMI / monthlyIncome) * 100);
}

function roundToThousand(n) {
  return Math.round(n / 1000) * 1000;
}

/**
 * Generate a mock UTR number.
 */
export function generateUTR() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let utr = 'UTR';
  for (let i = 0; i < 12; i++) utr += chars.charAt(Math.floor(Math.random() * chars.length));
  return utr;
}

/**
 * Generate a mock Loan Agreement ID.
 */
export function generateLoanId() {
  return 'CF' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substring(2, 6).toUpperCase();
}

/**
 * Generate repayment schedule (first N EMIs).
 */
export function generateSchedule(approvedAmount, rate, tenure, count = 3) {
  const emi = calculateEMI(approvedAmount, rate, tenure);
  const schedule = [];
  const now = new Date();

  for (let i = 1; i <= count; i++) {
    const date = new Date(now);
    date.setMonth(date.getMonth() + i);
    date.setDate(5); // EMI on the 5th of each month
    schedule.push({
      installment: i,
      date: date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
      amount: emi,
      status: 'Upcoming',
    });
  }

  return schedule;
}
