import { useState, useEffect } from 'react';
import { useLoan } from '../context/LoanContext';
import ProgressBar from '../components/ProgressBar';
import { getDynamicProfile } from '../engine/mockProfiles';
import { assessCredit } from '../engine/creditEngine';
import LoadingSteps from '../components/LoadingSteps';

export default function CIBILEvaluation() {
  const { state, dispatch, nextStep } = useLoan();
  const [status, setStatus] = useState('loading'); // loading, approved, more_info
  
  const profile = getDynamicProfile(state);
  
  const creditScore = profile.creditScore;

  const steps = [
    'Verifying PAN with NSDL...',
    'Fetching CIBIL report...',
    'Evaluating creditworthiness...'
  ];

  const handleComplete = () => {
    if (creditScore > 750) {
      // Run credit assessment immediately since we don't need bank statements
      const params = {
        requestedAmount: state.loanParams.amount,
        tenure: state.loanParams.tenure,
        monthlyIncome: state.employmentData?.monthlyIncome || profile.employment.monthlyIncome,
        existingEMI: state.employmentData?.existingEMI || profile.employment.existingEMI,
        creditScore: creditScore,
        employmentType: state.employmentData?.type || profile.employment.type,
        kycMismatch: profile.kycMismatch,
        mismatchDetail: profile.mismatchDetail,
        bankStatement: null // Not needed for fast-track!
      };
      const result = assessCredit(params);
      dispatch({ type: 'SET_CREDIT_RESULT', payload: result });
      setStatus('approved');
    } else {
      setStatus('more_info');
    }
  };

  const handleContinue = () => {
    if (status === 'approved') {
      // Fast-track: skip bank statement (6) & credit assessment (7) -> jump to Decision (8)
      dispatch({ type: 'SET_STEP', step: 8 });
    } else {
      // Normal track: proceed to DigiLocker (step 6)
      nextStep();
    }
  };

  return (
    <div className="screen">
      <ProgressBar />

      {status === 'loading' && (
        <div className="screen-center" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', paddingTop: '48px' }}>
          <h2 className="heading-lg mb-6 text-center">Checking Eligibility</h2>
          <LoadingSteps
            steps={steps}
            delayPerStep={1200}
            onComplete={handleComplete}
          />
        </div>
      )}

      {status === 'approved' && (
        <div className="screen-center w-full" style={{ animation: 'fadeSlideUp 0.4s ease both' }}>
          <div className="card text-center mb-6 w-full">
            <div className="status-icon status-icon-success" style={{ margin: '0 auto 16px' }}>✓</div>
            <h2 className="heading-xl text-success mb-2">Pre-Approved!</h2>
            <p className="text-body text-muted mb-6">
              Great news! With a CIBIL score of <strong className="text-primary">{creditScore}</strong>, your loan is automatically approved. No bank statements required.
            </p>
            <button onClick={handleContinue} className="btn btn-primary btn-block">
              View Offer Details
            </button>
          </div>
        </div>
      )}

      {status === 'more_info' && (
        <div className="screen-center w-full" style={{ animation: 'fadeSlideUp 0.4s ease both' }}>
          <div className="card text-center mb-6 w-full">
            <div className="status-icon" style={{ background: 'var(--bg-tertiary)', color: 'var(--text-primary)', margin: '0 auto 16px' }}>i</div>
            <h2 className="heading-lg mb-2">Additional Details Needed</h2>
            <p className="text-body text-muted mb-6">
              Your CIBIL score is <strong className="text-primary">{creditScore}</strong>. We just need to verify your income via bank statements to finalize your approval.
            </p>
            <button onClick={handleContinue} className="btn btn-primary btn-block">
              Verify Bank Statements
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
