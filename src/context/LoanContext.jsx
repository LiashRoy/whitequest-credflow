import { createContext, useContext, useReducer, useCallback } from 'react';

// ================================================================
// Loan Application Context — single source of truth
// ================================================================

const LoanContext = createContext(null);

const NAMES = {
  'A': 'Robert',
  'B': 'Chris',
  'C': 'Benedict'
};
const PANS = {
  'A': 'ABCPS1234R',
  'B': 'BKVPS5566T',
  'C': 'CMLPS9988X'
};

function getInitialState(profileId = 'A') {
  return {
    currentStep: 1,
    totalSteps: 12,

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
    disbursement: null,   // { utr, amount, timestamp, upiId }

    // Step 10 — Loan ID
    loanId: null,

    // Demo mode
    testProfile: profileId,
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
