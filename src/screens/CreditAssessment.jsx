import React from 'react';
import { useLoan } from '../context/LoanContext';
import ProgressBar from '../components/ProgressBar';
import LoadingSteps from '../components/LoadingSteps';
import { getDynamicProfile } from '../engine/mockProfiles';
import { assessCredit } from '../engine/creditEngine';

export default function CreditAssessment() {
  const { state, dispatch, nextStep } = useLoan();

  const handleComplete = () => {
    const profile = getDynamicProfile(state);

    if (!profile) {
      console.error("No profile found!");
      return;
    }

    const { amount, tenure } = state.loanParams;
    
    let monthlyIncome = state.employmentData?.monthlyIncome || 0;
    let existingEMI = state.employmentData?.existingEMI || 0;
    
    if (state.testProfile && profile.employment) {
      monthlyIncome = profile.employment.monthlyIncome;
      existingEMI = profile.employment.existingEMI;
    }

    const params = {
      requestedAmount: amount,
      tenure: tenure,
      monthlyIncome: monthlyIncome,
      existingEMI: existingEMI,
      creditScore: profile.creditScore,
      employmentType: state.employmentData?.type || profile.employment?.type,
      kycMismatch: profile.kycMismatch,
      mismatchDetail: profile.mismatchDetail,
      bankStatement: state.bankStatementData || profile.bankStatement
    };

    const result = assessCredit(params);
    dispatch({ type: 'SET_CREDIT_RESULT', payload: result });
    nextStep();
  };

  const steps = [
    'Fetching credit score from CIBIL...',
    'Checking eligibility criteria...',
    'Analyzing debt-to-income ratio...',
    'Calculating personalized offer...'
  ];

  return (
    <div className="screen">
      <ProgressBar />
      <div className="screen-center flex-col flex-center h-full">
        <h2 className="heading-lg mb-6 text-center">Analyzing your profile</h2>
        
        <div className="loading-spinner mb-8" style={{ width: '64px', height: '64px' }}></div>
        
        <div className="w-full">
          <LoadingSteps 
            steps={steps} 
            delayPerStep={900} 
            onComplete={handleComplete} 
          />
        </div>

        <p className="text-muted mt-8 text-center animate-pulse">
          This usually takes a few seconds...
        </p>
      </div>
    </div>
  );
}
