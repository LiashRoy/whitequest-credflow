import React, { useState, useEffect } from 'react';
import { useLoan } from '../context/LoanContext';
import ProgressBar from '../components/ProgressBar';
import { formatINR, generateUTR, generateLoanId } from '../engine/creditEngine';
import { detectProfile, getProfileById } from '../engine/mockProfiles';

export default function Disbursement() {
  const { state, dispatch, nextStep } = useLoan();
  const [phase, setPhase] = useState('processing');
  const [progress, setProgress] = useState(0);

  const { creditResult, employmentData, testProfile } = state;
  const profile = testProfile ? getProfileById(testProfile) : detectProfile(employmentData);

  const netAmount = creditResult ? creditResult.approvedAmount : 0;
  const upiId = profile?.upiId || 'borrower@bank';

  useEffect(() => {
    if (phase === 'processing') {
      const interval = setInterval(() => {
        setProgress(p => {
          if (p >= 100) {
            clearInterval(interval);
            return 100;
          }
          return p + 5;
        });
      }, 150);

      const timer = setTimeout(() => {
        dispatch({ 
          type: 'SET_DISBURSEMENT', 
          payload: { 
            utr: generateUTR(), 
            amount: netAmount, 
            timestamp: new Date().toISOString(), 
            upiId: upiId 
          } 
        });
        dispatch({ type: 'SET_LOAN_ID', loanId: generateLoanId() });
        setPhase('success');
      }, 3000);

      return () => {
        clearTimeout(timer);
        clearInterval(interval);
      };
    }
  }, [phase, dispatch, netAmount, upiId]);

  return (
    <div className="screen">
      <ProgressBar />
      
      <div className="screen-center flex-col flex-center h-full">
        {phase === 'processing' ? (
          <div className="flex-col flex-center gap-4 text-center">
            <div className="loading-spinner" style={{ width: '60px', height: '60px', borderWidth: '4px' }}></div>
            <h2 className="heading-lg mt-4">Disbursing to your bank account...</h2>
            <p className="text-body text-muted">UPI ID: {upiId}</p>
            <div className="heading-xl text-accent" style={{ animation: 'pulse 1.5s infinite' }}>
              {formatINR(netAmount)}
            </div>
            
            <div className="w-full mt-4" style={{ height: '6px', backgroundColor: 'var(--bg-secondary)', borderRadius: '3px', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${progress}%`, backgroundColor: 'var(--accent)', transition: 'width 0.2s ease' }}></div>
            </div>
          </div>
        ) : (
          <div className="flex-col flex-center gap-4 text-center w-full" style={{ animation: 'fadeIn 0.5s ease-out' }}>
            <div className="status-icon status-icon-success mb-2" style={{ animation: 'scaleIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)' }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '40px', height: '40px', color: 'var(--success)' }}>
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
            
            <h1 className="heading-xl text-success">{formatINR(netAmount)} Credited!</h1>
            <p className="text-body text-muted mb-4">Money is on its way to your bank account</p>
            
            <div className="card w-full text-left bg-secondary p-6 rounded-xl mb-6 shadow-md border border-border">
              <div className="mb-4 pb-4 border-b border-border" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="text-sm text-muted font-medium">UTR Number -</span>
                <span className="text-sm font-semibold tracking-wide" style={{ textAlign: 'right' }}>{state.disbursement?.utr}</span>
              </div>
              <div className="mb-4 pb-4 border-b border-border" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="text-sm text-muted font-medium">Amount -</span>
                <span className="text-sm font-bold text-success" style={{ textAlign: 'right' }}>{formatINR(state.disbursement?.amount || netAmount)}</span>
              </div>
              <div className="mb-4 pb-4 border-b border-border" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="text-sm text-muted font-medium">Date & Time -</span>
                <span className="text-sm font-semibold" style={{ textAlign: 'right' }}>
                  {state.disbursement?.timestamp ? new Date(state.disbursement.timestamp).toLocaleString() : 'Just now'}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="text-sm text-muted font-medium">UPI ID -</span>
                <span className="text-sm font-semibold" style={{ textAlign: 'right' }}>{state.disbursement?.upiId}</span>
              </div>
            </div>
            
            <button className="btn btn-primary btn-block" onClick={nextStep}>
              View Loan Details
            </button>
          </div>
        )}
      </div>
      
      <style>{`
        @keyframes pulse {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.05); opacity: 0.8; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes scaleIn {
          0% { transform: scale(0); }
          100% { transform: scale(1); }
        }
        @keyframes fadeIn {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
