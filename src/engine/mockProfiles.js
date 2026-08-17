// ================================================================
// Mock Borrower Profiles — 5 pre-seeded scenarios for demo
// ================================================================

export const PROFILES = {
  A: {
    id: 'A',
    label: 'Prime Borrower',
    tagline: 'High income, clean credit — instant approval',
    icon: '🟢',
    color: '#10B981',
    aadhaar: {
      number: '2345 6789 0123',
      maskedNumber: 'XXXX XXXX 0123',
      name: 'Robert Williams',
      dob: '15/03/1990',
      gender: 'Male',
      address: '42, Sector 15, Gurugram, Haryana — 122001',
      photo: null,
    },
    pan: {
      number: 'ABCPS1234R',
      name: 'ROBERT WILLIAMS',
      status: 'Valid',
    },
    bankStatement: {
      bank: 'HDFC Bank',
      accountNumber: 'XXXX XXXX 4521',
      ifsc: 'HDFC0001234',
      avgBalance3m: 285000,
      salaryCredits: [120000, 120000, 122000],
      avgMonthlyCredit: 125000,
      months: ['May 2026', 'Jun 2026', 'Jul 2026'],
    },
    employment: {
      type: 'salaried',
      employer: 'Infosys Technologies Ltd.',
      email: 'robert.williams@infosys.com',
      monthlyIncome: 120000,
      existingEMI: 5000,
    },
    creditScore: 782,
    creditHistory: '6+ years, no defaults',
    upiId: 'robert.williams@hdfcbank',
  },

  B: {
    id: 'B',
    label: 'Near-Prime',
    tagline: 'Moderate income, some debt — conditional approval',
    icon: '🟡',
    color: '#F59E0B',
    aadhaar: {
      number: '3456 7890 1234',
      maskedNumber: 'XXXX XXXX 1234',
      name: 'Chris Evans',
      dob: '22/08/1993',
      gender: 'Male',
      address: 'B-204, Vasant Vihar, New Delhi — 110057',
      photo: null,
    },
    pan: {
      number: 'BDFPM5678Q',
      name: 'CHRIS EVANS',
      status: 'Valid',
    },
    bankStatement: {
      bank: 'ICICI Bank',
      accountNumber: 'XXXX XXXX 7890',
      ifsc: 'ICIC0002345',
      avgBalance3m: 72000,
      salaryCredits: [55000, 56000, 54000],
      avgMonthlyCredit: 58000,
      months: ['May 2026', 'Jun 2026', 'Jul 2026'],
    },
    employment: {
      type: 'salaried',
      employer: 'Wipro Technologies',
      email: 'chris.evans@wipro.com',
      monthlyIncome: 55000,
      existingEMI: 18000,
    },
    creditScore: 710,
    creditHistory: '3 years, 1 late payment',
    upiId: 'chris.evans@icici',
  },

  C: {
    id: 'C',
    label: 'High Risk',
    tagline: 'Low income, high debt — rejected on credit',
    icon: '🔴',
    color: '#F43F5E',
    aadhaar: {
      number: '4567 8901 2345',
      maskedNumber: 'XXXX XXXX 2345',
      name: 'Benedict Cumberbatch',
      dob: '10/12/1988',
      gender: 'Male',
      address: '221B Baker Street, London (Simulated)',
      photo: null,
    },
    pan: {
      number: 'CEGPV9012S',
      name: 'BENEDICT CUMBERBATCH',
      status: 'Valid',
    },
    bankStatement: {
      bank: 'SBI',
      accountNumber: 'XXXX XXXX 3456',
      ifsc: 'SBIN0003456',
      avgBalance3m: 18000,
      salaryCredits: [25000, 24000, 25500],
      avgMonthlyCredit: 26000,
      months: ['May 2026', 'Jun 2026', 'Jul 2026'],
    },
    employment: {
      type: 'salaried',
      employer: 'Retail Solutions Pvt. Ltd.',
      email: 'benedict@retailsolutions.com',
      monthlyIncome: 25000,
      existingEMI: 15000,
    },
    creditScore: 580,
    creditHistory: '2 years, 3 defaults',
    upiId: 'benedict@sbi',
  },

  D: {
    id: 'D',
    label: 'KYC Flag',
    tagline: 'Name mismatch → routed to manual review',
    icon: '🟠',
    color: '#3B82F6',
    aadhaar: {
      number: '9999 8888 7777',
      maskedNumber: 'XXXX XXXX 7777',
      name: 'Sneha R. Kulkarni',        // Aadhaar name
      dob: '05/06/1995',
      gender: 'Female',
      address: '12, Koramangala, Bengaluru, Karnataka — 560034',
      photo: null,
    },
    pan: {
      number: 'DHKPK3456T',
      name: 'SNEHA RAMESH KULKARNI',    // PAN name (slightly different)
      status: 'Valid',
    },
    bankStatement: {
      bank: 'Kotak Mahindra Bank',
      accountNumber: 'XXXX XXXX 5678',
      ifsc: 'KKBK0004567',
      avgBalance3m: 145000,
      salaryCredits: [80000, 82000, 80000],
      avgMonthlyCredit: 84000,
      months: ['May 2026', 'Jun 2026', 'Jul 2026'],
    },
    employment: {
      type: 'salaried',
      employer: 'TCS Digital',
      monthlyIncome: 80000,
      existingEMI: 8000,
    },
    creditScore: 740,
    creditHistory: '4 years, no defaults',
    kycMismatch: true,
    mismatchDetail: 'Aadhaar name "Sneha R. Kulkarni" does not match PAN name "SNEHA RAMESH KULKARNI". Middle name discrepancy flagged for manual verification.',
    upiId: 'sneha.kulkarni@kotak',
  },

  E: {
    id: 'E',
    label: 'Thin File (Self-Employed)',
    tagline: 'No credit history, self-declared income — alternate data underwriting',
    icon: '🟣',
    color: '#A855F7',
    aadhaar: {
      number: '5678 9012 3456',
      maskedNumber: 'XXXX XXXX 3456',
      name: 'Karan Joshi',
      dob: '18/01/1997',
      gender: 'Male',
      address: '78, Navrangpura, Ahmedabad, Gujarat — 380009',
      photo: null,
    },
    pan: {
      number: 'EFGPJ6789U',
      name: 'KARAN JOSHI',
      status: 'Valid',
    },
    bankStatement: {
      bank: 'Axis Bank',
      accountNumber: 'XXXX XXXX 9012',
      ifsc: 'UTIB0005678',
      avgBalance3m: 58000,
      salaryCredits: [],            // No salary — self-employed
      avgMonthlyCredit: 48000,      // Irregular business income
      businessCredits: [42000, 55000, 47000],
      months: ['May 2026', 'Jun 2026', 'Jul 2026'],
    },
    employment: {
      type: 'self-employed',
      businessName: 'Joshi Digital Solutions',
      monthlyIncome: 45000,
      existingEMI: 0,
    },
    creditScore: 0,                 // No credit history
    creditHistory: 'No bureau record found',
    upiId: 'karan.joshi@axisbank',
  },

  F: {
    id: 'F',
    label: 'Returning User (Mark) - Cleared Loan',
    tagline: 'Registered user — returning for a new loan',
    icon: '🔵',
    color: '#3B82F6',
    aadhaar: {
      number: '6789 0123 4567',
      maskedNumber: 'XXXX XXXX 4567',
      name: 'Mark Taylor',
      dob: '28/07/1991',
      gender: 'Male',
      address: '15, Banjara Hills, Hyderabad, Telangana — 500034',
      photo: null,
    },
    pan: {
      number: 'FGHPM7890V',
      name: 'MARK TAYLOR',
      status: 'Valid',
    },
    bankStatement: {
      bank: 'Kotak Mahindra Bank',
      accountNumber: 'XXXX XXXX 6789',
      ifsc: 'KKBK0006789',
      avgBalance3m: 195000,
      salaryCredits: [95000, 96000, 95000],
      avgMonthlyCredit: 98000,
      months: ['May 2026', 'Jun 2026', 'Jul 2026'],
    },
    employment: {
      type: 'salaried',
      employer: 'HCL Technologies Ltd.',
      email: 'mark.taylor@hcl.com',
      monthlyIncome: 95000,
      existingEMI: 8000,
    },
    creditScore: 760,
    creditHistory: '5+ years, no defaults',
    upiId: 'mark.taylor@kotak',
    mobile: '9876501234',
  },

  F_LOAN: {
    id: 'F_LOAN',
    label: 'Returning User (Mark) - Active Loan',
    tagline: 'Registered user — has an active ₹3L top-up loan',
    icon: '🔷',
    color: '#2563EB',
    aadhaar: {
      number: '6789 0123 4567',
      maskedNumber: 'XXXX XXXX 4567',
      name: 'Mark Taylor',
      dob: '28/07/1991',
      gender: 'Male',
      address: '15, Banjara Hills, Hyderabad, Telangana — 500034',
      photo: null,
    },
    pan: {
      number: 'FGHPM7890V',
      name: 'MARK TAYLOR',
      status: 'Valid',
    },
    bankStatement: {
      bank: 'Kotak Mahindra Bank',
      accountNumber: 'XXXX XXXX 6789',
      ifsc: 'KKBK0006789',
      avgBalance3m: 195000,
      salaryCredits: [95000, 96000, 95000],
      avgMonthlyCredit: 98000,
      months: ['May 2026', 'Jun 2026', 'Jul 2026'],
    },
    employment: {
      type: 'salaried',
      employer: 'HCL Technologies Ltd.',
      email: 'mark.taylor@hcl.com',
      monthlyIncome: 95000,
      existingEMI: 33685,
    },
    creditScore: 760,
    creditHistory: '5+ years, no defaults',
    upiId: 'mark.taylor@kotak',
  },
};

// Auto-detect profile from employment data (fallback when no profile is explicitly selected)
export function detectProfile(employmentData) {
  const { monthlyIncome, existingEMI, type } = employmentData;

  // Self-employed with no/low existing EMI → thin file
  if (type === 'self-employed') return PROFILES.E;

  // Low income or very high debt load → high risk
  if (monthlyIncome < 30000 || (existingEMI / monthlyIncome) > 0.5) return PROFILES.C;

  // Moderate income range → near-prime
  if (monthlyIncome >= 30000 && monthlyIncome < 80000) return PROFILES.B;

  // High income → prime
  return PROFILES.A;
}

export function getProfileById(id) {
  return PROFILES[id] || null;
}

export function getDynamicProfile(state) {
  const baseProfile = getProfileById(state.testProfile) || detectProfile(state.employmentData) || PROFILES.A;
  const profile = JSON.parse(JSON.stringify(baseProfile)); // Deep clone
  
  if (state.demoName) {
    profile.aadhaar.name = state.demoName;
    profile.pan.name = state.demoName.toUpperCase();
    
    // Generate a matching UPI ID based on the new name
    const cleanName = state.demoName.toLowerCase().replace(/[^a-z0-9]/g, '');
    const bank = profile.bankStatement?.bank ? profile.bankStatement.bank.toLowerCase().replace(/[^a-z]/g, '') : 'bank';
    profile.upiId = `${cleanName}@${bank}`;
    
    // Generate a work email based on name and employer
    const employerDomain = profile.employment?.employer 
      ? profile.employment.employer.toLowerCase().replace(/[^a-z0-9]/g, '').replace(/(ltd|pvt|inc|llc|technologies|solutions)/g, '') + '.com'
      : 'company.com';
    
    if (!profile.employment) profile.employment = {};
    profile.employment.email = `${cleanName}@${employerDomain}`;
  } else {
    // Generate default email if no demoName
    if (profile.employment) {
      const cleanName = profile.aadhaar.name.split(' ')[0].toLowerCase().replace(/[^a-z0-9]/g, '');
      const employerDomain = profile.employment.employer 
        ? profile.employment.employer.toLowerCase().replace(/[^a-z0-9]/g, '').replace(/(ltd|pvt|inc|llc|technologies|solutions)/g, '') + '.com'
        : 'company.com';
      profile.employment.email = `${cleanName}@${employerDomain}`;
    }
  }
  
  if (state.demoPan) {
    profile.pan.number = state.demoPan;
  }
  
  return profile;
}

export const PROFILE_LIST = Object.values(PROFILES);
