import { createContext, useContext, useReducer, useCallback } from 'react';

// ================================================================
// Loan Application Context — single source of truth
// ================================================================

const LoanContext = createContext(null);

const NAMES = {
  'A': 'Robert',
  'B': 'Chris',
  'C': 'Benedict',
  'F': 'Mark',
  'F_LOAN': 'Mark',
};
const PANS = {
  'A': 'ABCPS1234R',
  'B': 'BKVPS5566T',
  'C': 'CMLPS9988X',
  'F': 'FGHPM7890V',
  'F_LOAN': 'FGHPM7890V',
};
const CLEARED_LOAN_MOCK = {
  loanId: 'WQ-2025-00123',
  approvedAmount: 150000,
  interestRate: 6,
  tenure: 6,
  emi: 25445,
  emiPaid: 6,
  disbursedOn: '2025-01-10',
  nextDueDate: null,
  totalPaid: 152670,
  remainingAmount: 0,
  status: 'Closed',
};

// Mock existing loan data for Mark B (has active loan)
const EXISTING_LOAN_MOCK = {
  loanId: 'WQ-2026-00412',
  approvedAmount: 300000,
  interestRate: 5,
  tenure: 12,
  emi: 25685,
  emiPaid: 9, // at least 2/3 paid (9/12)
  disbursedOn: '2026-02-15',
  nextDueDate: '15 Nov 2026',
  totalPaid: 231165,
  remainingAmount: 77055,
  status: 'Active',
};

function getInitialState(profileId = 'A') {
  const isReturning = profileId === 'F' || profileId === 'F_LOAN';
  // For 'F' (cleared loan) and 'F_LOAN' (active loan)
  const existingLoanData = profileId === 'F_LOAN' ? EXISTING_LOAN_MOCK : 
                           (profileId === 'F' ? CLEARED_LOAN_MOCK : null);

  // For returning users with F_LOAN, use the base 'F' profile for mock data
  const effectiveProfileId = (profileId === 'F_LOAN') ? 'F' : profileId;

  return {
    currentStep: 1,
    totalSteps: isReturning ? 9 : 12,

    // Step 1 — Loan parameters
    loanParams: { amount: 200000, tenure: 12 },

    // Step 2 — Mobile & consent
    mobile: '',
    consents: [],         // { type, text, timestamp, status }

    // Step 3 — Aadhaar KYC
    aadhaarVerified: false,
    aadhaarData: null,    // filled from mock profile after OTP

    // Step 4 — PAN
    panNumber: '',

    // Step 4 — DigiLocker
    digiLockerPulled: false,
    panData: null,
    bankStatementData: null,

    // Step 5 — Employment & income
    employmentData: null, // { type, employer, monthlyIncome, existingEMI }

    // Step 6-7 — Credit assessment
    creditResult: null,   // output of assessCredit()

    // Step 8 — Agreement
    agreementSigned: false,
    signatureName: '',

    // Step 9 — Disbursement
    disbursement: null,   // { utr, amount, timestamp, bankAccount, ifsc }

    // Step 10 — Loan ID
    loanId: null,

    // Returning user state
    isReturningUser: isReturning,
    existingLoanData,

    // Demo mode
    testProfile: effectiveProfileId,
    demoName: NAMES[profileId],
    demoPan: PANS[profileId],
    showProfileSwitcher: false,
  };
}

const initialState = getInitialState('A');

function reducer(state, action) {
  switch (action.type) {
    case 'SET_STEP':
      return { ...state, currentStep: action.step };
    case 'NEXT_STEP':
      return { ...state, currentStep: Math.min(state.currentStep + 1, state.totalSteps) };
    case 'PREV_STEP':
      return { ...state, currentStep: Math.max(state.currentStep - 1, 1) };
    case 'SET_LOAN_PARAMS':
      return { ...state, loanParams: { ...state.loanParams, ...action.payload } };
    case 'SET_MOBILE':
      return { ...state, mobile: action.mobile };
    case 'ADD_CONSENT':
      return {
        ...state,
        consents: [
          ...state.consents,
          {
            ...action.payload,
            timestamp: new Date().toISOString(),
            borrowerId: state.mobile || 'DEMO',
          },
        ],
      };
    case 'SET_AADHAAR_DATA':
      return { ...state, aadhaarVerified: true, aadhaarData: action.payload };
    case 'SET_PAN_NUMBER':
      return { ...state, panNumber: action.payload };
    case 'SET_DIGILOCKER_DATA':
      return {
        ...state,
        digiLockerPulled: true,
        panData: action.payload.pan,
        bankStatementData: action.payload.bankStatement,
      };
    case 'SET_EMPLOYMENT':
      return { ...state, employmentData: action.payload };
    case 'SET_CREDIT_RESULT':
      return { ...state, creditResult: action.payload };
    case 'SIGN_AGREEMENT':
      return { ...state, agreementSigned: true, signatureName: action.name || '' };
    case 'SET_DISBURSEMENT':
      return { ...state, disbursement: action.payload };
    case 'SET_LOAN_ID':
      return { ...state, loanId: action.loanId };
    case 'SET_TEST_PROFILE':
      return { ...state, testProfile: action.profile };
    case 'TOGGLE_PROFILE_SWITCHER':
      return { ...state, showProfileSwitcher: !state.showProfileSwitcher };
    case 'HIDE_PROFILE_SWITCHER':
      return { ...state, showProfileSwitcher: false };
    case 'LOGOUT_TO_HOME': {
      const isNowReturning = !!state.creditResult || state.isReturningUser;
      const loanData = state.creditResult ? {
        loanId: state.loanId || 'WQ-2026-NEW',
        approvedAmount: (state.existingLoanData?.approvedAmount || 0) + state.creditResult.approvedAmount,
        interestRate: state.creditResult.interestRate,
        tenure: state.loanParams.tenure,
        emi: state.creditResult.emi + (state.existingLoanData?.emi || 0),
        emiPaid: 0,
        disbursedOn: state.disbursement?.timestamp || new Date().toISOString(),
        nextDueDate: '05 Sep 2026',
        totalPaid: state.existingLoanData?.totalPaid || 0,
        remainingAmount: state.creditResult.totalPayable + (state.existingLoanData?.remainingAmount || 0),
        status: 'Active',
        utr: state.disbursement?.utr || null,
        bankAccount: state.disbursement?.bankAccount || null,
        ifsc: state.disbursement?.ifsc || null,
      } : state.existingLoanData;

      return {
        ...getInitialState(state.testProfile),
        isReturningUser: isNowReturning,
        existingLoanData: loanData,
        showProfileSwitcher: false,
      };
    }
    case 'RESET':
      return getInitialState(action.profileId || 'A');
    default:
      return state;
  }
}

export function LoanProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const nextStep = useCallback(() => dispatch({ type: 'NEXT_STEP' }), []);
  const prevStep = useCallback(() => dispatch({ type: 'PREV_STEP' }), []);
  const goToStep = useCallback((step) => dispatch({ type: 'SET_STEP', step }), []);
  const reset = useCallback((profileId) => dispatch({ type: 'RESET', profileId }), []);

  return (
    <LoanContext.Provider value={{ state, dispatch, nextStep, prevStep, goToStep, reset }}>
      {children}
    </LoanContext.Provider>
  );
}

export function useLoan() {
  const ctx = useContext(LoanContext);
  if (!ctx) throw new Error('useLoan must be used within a LoanProvider');
  return ctx;
}

export default LoanContext;
