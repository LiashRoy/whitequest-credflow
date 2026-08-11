import { createContext, useContext, useReducer, useCallback, useRef, useEffect } from 'react';

// ================================================================
// Application status configuration
// ================================================================

export const STATUS_CONFIG = {
  STARTED:             { label: 'Application Started',        color: 'neutral',  order: 0 },
  CONSENTED:           { label: 'Consent Granted',            color: 'neutral',  order: 1 },
  KYC_VERIFIED:        { label: 'KYC Verified',               color: 'info',     order: 2 },
  DOCUMENTS_VERIFIED:  { label: 'Documents Verified',         color: 'info',     order: 3 },
  UNDER_REVIEW:        { label: 'Under Credit Review',        color: 'warning',  order: 4 },
  APPROVED:            { label: 'Approved',                   color: 'success',  order: 5 },
  APPROVED_CONDITIONS: { label: 'Approved (Conditional)',     color: 'warning',  order: 5 },
  REJECTED:            { label: 'Rejected',                   color: 'error',    order: 5 },
  KYC_FLAG:            { label: 'Manual Review (KYC Flag)',   color: 'info',     order: 5 },
  AGREEMENT_SIGNED:    { label: 'Agreement Signed',           color: 'success',  order: 6 },
  DISBURSED:           { label: 'Disbursed',                  color: 'success',  order: 7 },
};

export function getStatusLabel(status) {
  return STATUS_CONFIG[status]?.label || status;
}

export function getStatusBadgeClass(status) {
  const c = STATUS_CONFIG[status]?.color || 'neutral';
  return `badge badge-${c}`;
}

// ================================================================
// Seed data — historical applications for realistic admin view
// ================================================================

function ts(daysAgo, minutesOffset = 0) {
  return new Date(Date.now() - daysAgo * 86400000 + minutesOffset * 60000).toISOString();
}

function makeHistory(statuses, daysAgo) {
  return statuses.map((s, i) => ({ status: s, timestamp: ts(daysAgo, i * 2) }));
}

const FULL_FLOW = ['STARTED', 'CONSENTED', 'KYC_VERIFIED', 'DOCUMENTS_VERIFIED', 'UNDER_REVIEW', 'APPROVED', 'AGREEMENT_SIGNED', 'DISBURSED'];

function generateSeedApplications() {
  return [
    {
      id: 'APP-HIST-001',
      status: 'DISBURSED',
      statusHistory: makeHistory(FULL_FLOW, 2),
      applicantName: 'Vikram Singh',
      mobile: '9876543210',
      loanParams: { amount: 300000, tenure: 24 },
      employmentData: { type: 'salaried', employer: 'Google India Pvt. Ltd.', monthlyIncome: 180000, existingEMI: 12000 },
      creditResult: { decision: 'APPROVED', approvedAmount: 300000, interestRate: 12, emi: 14122, creditScore: 790, dti: 7, processingFee: 4500, tenure: 24, requestedAmount: 300000 },
      consents: [
        { type: 'credit_bureau', text: 'Credit bureau pull consent', status: 'granted', timestamp: ts(2, 0), borrowerId: '9876543210' },
        { type: 'digilocker', text: 'DigiLocker access consent', status: 'granted', timestamp: ts(2, 0), borrowerId: '9876543210' },
        { type: 'terms', text: 'Terms of Service', status: 'granted', timestamp: ts(2, 0), borrowerId: '9876543210' },
        { type: 'e_mandate', text: 'NACH Auto-Debit', status: 'granted', timestamp: ts(2, 10), borrowerId: '9876543210' },
        { type: 'loan_agreement', text: 'Digital Loan Agreement', status: 'granted', timestamp: ts(2, 10), borrowerId: '9876543210' },
      ],
      profileId: 'A',
      disbursement: { utr: 'UTR9A8B7C6D5E4F', amount: 295500, timestamp: ts(2, 14), upiId: 'vikram@hdfc' },
      loanId: 'CF2026VS001',
      createdAt: ts(2), updatedAt: ts(2, 14),
    },
    {
      id: 'APP-HIST-002',
      status: 'DISBURSED',
      statusHistory: makeHistory(FULL_FLOW, 1),
      applicantName: 'Ananya Reddy',
      mobile: '9123456789',
      loanParams: { amount: 150000, tenure: 12 },
      employmentData: { type: 'salaried', employer: 'Microsoft India', monthlyIncome: 140000, existingEMI: 8000 },
      creditResult: { decision: 'APPROVED', approvedAmount: 150000, interestRate: 12, emi: 13327, creditScore: 765, dti: 6, processingFee: 2250, tenure: 12, requestedAmount: 150000 },
      consents: [
        { type: 'credit_bureau', text: 'Credit bureau pull consent', status: 'granted', timestamp: ts(1, 0), borrowerId: '9123456789' },
        { type: 'digilocker', text: 'DigiLocker access consent', status: 'granted', timestamp: ts(1, 0), borrowerId: '9123456789' },
        { type: 'terms', text: 'Terms of Service', status: 'granted', timestamp: ts(1, 0), borrowerId: '9123456789' },
        { type: 'e_mandate', text: 'NACH Auto-Debit', status: 'granted', timestamp: ts(1, 10), borrowerId: '9123456789' },
        { type: 'loan_agreement', text: 'Digital Loan Agreement', status: 'granted', timestamp: ts(1, 10), borrowerId: '9123456789' },
      ],
      profileId: 'A',
      disbursement: { utr: 'UTR4X3Y2Z1W0V9U', amount: 147750, timestamp: ts(1, 14), upiId: 'ananya@msft' },
      loanId: 'CF2026AR002',
      createdAt: ts(1), updatedAt: ts(1, 14),
    },
    {
      id: 'APP-HIST-003',
      status: 'AGREEMENT_SIGNED',
      statusHistory: makeHistory(['STARTED', 'CONSENTED', 'KYC_VERIFIED', 'DOCUMENTS_VERIFIED', 'UNDER_REVIEW', 'APPROVED_CONDITIONS', 'AGREEMENT_SIGNED'], 0.25),
      applicantName: 'Mohit Aggarwal',
      mobile: '9234567890',
      loanParams: { amount: 200000, tenure: 18 },
      employmentData: { type: 'salaried', employer: 'Wipro Technologies', monthlyIncome: 60000, existingEMI: 15000 },
      creditResult: { decision: 'APPROVED_CONDITIONS', approvedAmount: 180000, interestRate: 18, emi: 11813, creditScore: 705, dti: 25, processingFee: 2700, tenure: 18, requestedAmount: 200000 },
      consents: [
        { type: 'credit_bureau', text: 'Credit bureau pull consent', status: 'granted', timestamp: ts(0.25, 0), borrowerId: '9234567890' },
        { type: 'digilocker', text: 'DigiLocker access consent', status: 'granted', timestamp: ts(0.25, 0), borrowerId: '9234567890' },
        { type: 'terms', text: 'Terms of Service', status: 'granted', timestamp: ts(0.25, 0), borrowerId: '9234567890' },
        { type: 'e_mandate', text: 'NACH Auto-Debit', status: 'granted', timestamp: ts(0.25, 10), borrowerId: '9234567890' },
      ],
      profileId: 'B',
      createdAt: ts(0.25), updatedAt: ts(0.25, 12),
    },
    {
      id: 'APP-HIST-004',
      status: 'APPROVED_CONDITIONS',
      statusHistory: makeHistory(['STARTED', 'CONSENTED', 'KYC_VERIFIED', 'DOCUMENTS_VERIFIED', 'UNDER_REVIEW', 'APPROVED_CONDITIONS'], 0.125),
      applicantName: 'Fatima Khan',
      mobile: '9345678901',
      loanParams: { amount: 400000, tenure: 36 },
      employmentData: { type: 'salaried', employer: 'Tata Consultancy Services', monthlyIncome: 65000, existingEMI: 20000 },
      creditResult: { decision: 'APPROVED_CONDITIONS', approvedAmount: 250000, interestRate: 18, emi: 9041, creditScore: 715, dti: 31, processingFee: 3750, tenure: 36, requestedAmount: 400000 },
      consents: [
        { type: 'credit_bureau', text: 'Credit bureau pull consent', status: 'granted', timestamp: ts(0.125, 0), borrowerId: '9345678901' },
        { type: 'digilocker', text: 'DigiLocker access consent', status: 'granted', timestamp: ts(0.125, 0), borrowerId: '9345678901' },
        { type: 'terms', text: 'Terms of Service', status: 'granted', timestamp: ts(0.125, 0), borrowerId: '9345678901' },
      ],
      profileId: 'B',
      createdAt: ts(0.125), updatedAt: ts(0.125, 10),
    },
    {
      id: 'APP-HIST-005',
      status: 'REJECTED',
      statusHistory: makeHistory(['STARTED', 'CONSENTED', 'KYC_VERIFIED', 'DOCUMENTS_VERIFIED', 'UNDER_REVIEW', 'REJECTED'], 1.5),
      applicantName: 'Deepak Tiwari',
      mobile: '9456789012',
      loanParams: { amount: 500000, tenure: 36 },
      employmentData: { type: 'salaried', employer: 'Retail Solutions Pvt. Ltd.', monthlyIncome: 28000, existingEMI: 16000 },
      creditResult: { decision: 'REJECTED', approvedAmount: null, interestRate: null, emi: null, creditScore: 560, dti: 57, processingFee: null, tenure: 36, requestedAmount: 500000, reason: 'Credit score below minimum threshold' },
      consents: [
        { type: 'credit_bureau', text: 'Credit bureau pull consent', status: 'granted', timestamp: ts(1.5, 0), borrowerId: '9456789012' },
        { type: 'digilocker', text: 'DigiLocker access consent', status: 'granted', timestamp: ts(1.5, 0), borrowerId: '9456789012' },
        { type: 'terms', text: 'Terms of Service', status: 'granted', timestamp: ts(1.5, 0), borrowerId: '9456789012' },
      ],
      profileId: 'C',
      createdAt: ts(1.5), updatedAt: ts(1.5, 10),
    },
    {
      id: 'APP-HIST-006',
      status: 'KYC_FLAG',
      statusHistory: makeHistory(['STARTED', 'CONSENTED', 'KYC_VERIFIED', 'DOCUMENTS_VERIFIED', 'UNDER_REVIEW', 'KYC_FLAG'], 0.17),
      applicantName: 'Rashmi Iyer',
      mobile: '9567890123',
      loanParams: { amount: 250000, tenure: 18 },
      employmentData: { type: 'salaried', employer: 'TCS Digital', monthlyIncome: 82000, existingEMI: 9000 },
      creditResult: { decision: 'KYC_FLAG', creditScore: 738, dti: 11, requestedAmount: 250000, reason: 'Name mismatch detected', detail: 'Aadhaar name vs PAN name discrepancy' },
      consents: [
        { type: 'credit_bureau', text: 'Credit bureau pull consent', status: 'granted', timestamp: ts(0.17, 0), borrowerId: '9567890123' },
        { type: 'digilocker', text: 'DigiLocker access consent', status: 'granted', timestamp: ts(0.17, 0), borrowerId: '9567890123' },
        { type: 'terms', text: 'Terms of Service', status: 'granted', timestamp: ts(0.17, 0), borrowerId: '9567890123' },
      ],
      profileId: 'D',
      createdAt: ts(0.17), updatedAt: ts(0.17, 10),
    },
    {
      id: 'APP-HIST-007',
      status: 'DOCUMENTS_VERIFIED',
      statusHistory: makeHistory(['STARTED', 'CONSENTED', 'KYC_VERIFIED', 'DOCUMENTS_VERIFIED'], 0.04),
      applicantName: 'Suresh Patil',
      mobile: '9678901234',
      loanParams: { amount: 100000, tenure: 6 },
      employmentData: null,
      creditResult: null,
      consents: [
        { type: 'credit_bureau', text: 'Credit bureau pull consent', status: 'granted', timestamp: ts(0.04, 0), borrowerId: '9678901234' },
        { type: 'digilocker', text: 'DigiLocker access consent', status: 'granted', timestamp: ts(0.04, 0), borrowerId: '9678901234' },
        { type: 'terms', text: 'Terms of Service', status: 'granted', timestamp: ts(0.04, 0), borrowerId: '9678901234' },
      ],
      profileId: null,
      createdAt: ts(0.04), updatedAt: ts(0.04, 6),
    },
    {
      id: 'APP-HIST-008',
      status: 'STARTED',
      statusHistory: [{ status: 'STARTED', timestamp: ts(0.02) }],
      applicantName: '',
      mobile: '9789012345',
      loanParams: { amount: 75000, tenure: 12 },
      employmentData: null,
      creditResult: null,
      consents: [],
      profileId: null,
      createdAt: ts(0.02), updatedAt: ts(0.02),
    },
  ];
}

// ================================================================
// Aggregation utilities for admin dashboard
// ================================================================

export function aggregateMetrics(applications) {
  const total = applications.length;
  const byStatus = {};
  applications.forEach(app => {
    byStatus[app.status] = (byStatus[app.status] || 0) + 1;
  });

  const kycDone = applications.filter(a => STATUS_CONFIG[a.status]?.order >= 2).length;
  const assessed = applications.filter(a => STATUS_CONFIG[a.status]?.order >= 4).length;
  const approved = applications.filter(a =>
    ['APPROVED', 'APPROVED_CONDITIONS', 'AGREEMENT_SIGNED', 'DISBURSED'].includes(a.status)
  ).length;
  const disbursed = applications.filter(a => a.status === 'DISBURSED').length;
  const rejected = applications.filter(a => a.status === 'REJECTED').length;
  const flagged = applications.filter(a => a.status === 'KYC_FLAG').length;

  const totalDisbursedAmt = applications
    .filter(a => a.status === 'DISBURSED' && a.disbursement)
    .reduce((sum, a) => sum + (a.disbursement.amount || 0), 0);

  const approvedApps = applications.filter(a => a.creditResult?.approvedAmount);
  const avgTicket = approvedApps.length > 0
    ? approvedApps.reduce((s, a) => s + a.creditResult.approvedAmount, 0) / approvedApps.length
    : 0;

  const scores = applications
    .filter(a => a.creditResult?.creditScore > 0)
    .map(a => a.creditResult.creditScore);
  const avgScore = scores.length > 0 ? Math.round(scores.reduce((s, v) => s + v, 0) / scores.length) : 0;

  const dtis = applications
    .filter(a => a.creditResult?.dti != null)
    .map(a => a.creditResult.dti);
  const avgDTI = dtis.length > 0 ? Math.round(dtis.reduce((s, v) => s + v, 0) / dtis.length) : 0;

  // All consents across all applications
  const allConsents = applications.flatMap(a => (a.consents || []).map(c => ({
    ...c,
    applicantName: a.applicantName || 'Unknown',
    appId: a.id,
  })));

  return {
    total, byStatus, kycDone, assessed, approved, disbursed, rejected, flagged,
    totalDisbursedAmt, avgTicket, avgScore, avgDTI, allConsents,
  };
}

// ================================================================
// Reducer
// ================================================================

function reducer(applications, action) {
  switch (action.type) {
    case 'SET_ALL':
      return action.data;

    case 'RESET_TO_SEED':
      return generateSeedApplications();

    case 'CREATE': {
      const now = new Date().toISOString();
      return [...applications, {
        id: action.id,
        status: action.status,
        statusHistory: [{ status: action.status, timestamp: now }],
        applicantName: action.data.applicantName || '',
        mobile: action.data.mobile || '',
        loanParams: action.data.loanParams || {},
        employmentData: action.data.employmentData || null,
        creditResult: action.data.creditResult || null,
        consents: action.data.consents || [],
        profileId: action.data.profileId || null,
        aadhaarData: action.data.aadhaarData || null,
        panData: action.data.panData || null,
        bankStatementData: action.data.bankStatementData || null,
        disbursement: action.data.disbursement || null,
        loanId: action.data.loanId || null,
        createdAt: now,
        updatedAt: now,
      }];
    }

    case 'UPDATE': {
      const now = new Date().toISOString();
      return applications.map(app => {
        if (app.id !== action.id) return app;
        const updated = {
          ...app,
          ...action.data,
          status: action.status,
          updatedAt: now,
        };
        // Append to status history if status changed
        if (action.status !== app.status) {
          updated.statusHistory = [...(app.statusHistory || []), { status: action.status, timestamp: now }];
        }
        // Merge consents (append new ones)
        if (action.data.consents && action.data.consents.length > app.consents?.length) {
          updated.consents = action.data.consents;
        }
        return updated;
      });
    }

    default:
      return applications;
  }
}

// ================================================================
// Context + Provider
// ================================================================

const ApplicationsContext = createContext(null);

export function ApplicationsProvider({ children }) {
  const [applications, dispatch] = useReducer(reducer, null, () => {
    try {
      const stored = localStorage.getItem('credflow_apps');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Failed to load apps from local storage', e);
    }
    return generateSeedApplications();
  });
  
  const currentAppIdRef = useRef(null);

  // Persist to local storage whenever applications change
  useEffect(() => {
    localStorage.setItem('credflow_apps', JSON.stringify(applications));
  }, [applications]);

  // Listen for changes from other tabs
  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === 'credflow_apps' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed)) {
            dispatch({ type: 'SET_ALL', data: parsed });
          }
        } catch (err) {
          console.warn('Failed to parse cross-tab storage data', err);
        }
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const syncApplication = useCallback((status, data) => {
    if (!currentAppIdRef.current) {
      const id = `APP-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 5).toUpperCase()}`;
      currentAppIdRef.current = id;
      dispatch({ type: 'CREATE', id, status, data });
    } else {
      dispatch({ type: 'UPDATE', id: currentAppIdRef.current, status, data });
    }
  }, []);

  const resetCurrentApp = useCallback(() => {
    currentAppIdRef.current = null;
  }, []);

  const getCurrentAppId = useCallback(() => currentAppIdRef.current, []);

  const resetToSeed = useCallback(() => {
    dispatch({ type: 'RESET_TO_SEED' });
  }, []);

  return (
    <ApplicationsContext.Provider value={{ applications, syncApplication, resetCurrentApp, getCurrentAppId, resetToSeed }}>
      {children}
    </ApplicationsContext.Provider>
  );
}

export function useApplications() {
  const ctx = useContext(ApplicationsContext);
  if (!ctx) throw new Error('useApplications must be used within an ApplicationsProvider');
  return ctx;
}

// ================================================================
// Status derivation helper (used by BorrowerFlow to auto-track)
// ================================================================

export function deriveStatusFromLoanState(loanState) {
  if (loanState.disbursement) return 'DISBURSED';
  if (loanState.agreementSigned) return 'AGREEMENT_SIGNED';
  if (loanState.creditResult) return loanState.creditResult.decision; // APPROVED | APPROVED_CONDITIONS | REJECTED | KYC_FLAG
  if (loanState.employmentData) return 'UNDER_REVIEW';
  if (loanState.digiLockerPulled) return 'DOCUMENTS_VERIFIED';
  if (loanState.aadhaarVerified) return 'KYC_VERIFIED';
  if (loanState.consents?.length > 0) return 'CONSENTED';
  return 'STARTED';
}

export function extractAppDataFromLoanState(loanState) {
  return {
    applicantName: loanState.aadhaarData?.name || loanState.demoName || '',
    mobile: loanState.mobile || '',
    loanParams: loanState.loanParams,
    aadhaarData: loanState.aadhaarData,
    panData: loanState.panData,
    bankStatementData: loanState.bankStatementData,
    employmentData: loanState.employmentData,
    creditResult: loanState.creditResult,
    consents: loanState.consents,
    disbursement: loanState.disbursement,
    loanId: loanState.loanId,
    profileId: loanState.testProfile,
  };
}

export default ApplicationsContext;
