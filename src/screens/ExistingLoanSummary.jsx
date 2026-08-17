import React from 'react';
import { useLoan } from '../context/LoanContext';
import ProgressBar from '../components/ProgressBar';
import { formatINR } from '../engine/creditEngine';

export default function ExistingLoanSummary() {
  const { state, dispatch } = useLoan();
  const { existingLoanData, demoName } = state;

  if (!existingLoanData) return null;

  const progress = (existingLoanData.emiPaid / existingLoanData.tenure) * 100;
  const emisRemaining = existingLoanData.tenure - existingLoanData.emiPaid;

  const handleApplyTopUp = () => {
    // Jump to loan parameters step (step 3 in returning flow)
    dispatch({ type: 'SET_STEP', step: 3 });
  };

  return (
    <div className="screen">
      <ProgressBar />
      <div className="screen-center">
        <div className="flex-center flex-col mb-4">
          <h2 className="heading-lg text-center">Your Active Loan</h2>
          <p className="text-sm text-muted text-center mt-1">Hi {demoName}, you have an existing loan with us</p>
        </div>

        <div className="card mb-4" style={{ padding: '0', overflow: 'hidden', border: '1px solid var(--border)' }}>
          {/* Header */}
          <div style={{ padding: '1rem 1.25rem', background: 'linear-gradient(135deg, rgba(59,130,246,0.15), rgba(59,130,246,0.05))', borderBottom: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p className="text-xs text-muted">Loan ID</p>
                <p className="font-bold text-sm font-mono">{existingLoanData.loanId}</p>
              </div>
              <span className="badge badge-success" style={{ fontSize: '10px' }}>● ACTIVE</span>
            </div>
          </div>

          {/* Amount section */}
          <div style={{ padding: '1.25rem' }}>
            <div style={{ textAlign: 'center', marginBottom: '16px' }}>
              <p className="text-xs text-muted mb-1">Remaining Balance</p>
              <p className="font-bold" style={{ fontSize: '1.8rem', lineHeight: 1.2 }}>{formatINR(existingLoanData.remainingAmount)}</p>
              <p className="text-xs text-muted mt-1">of {formatINR(existingLoanData.approvedAmount)} total</p>
            </div>

            {/* Progress bar */}
            <div style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span className="text-xs text-muted">{existingLoanData.emiPaid} of {existingLoanData.tenure} EMIs paid</span>
                <span className="text-xs font-medium">{Math.round(progress)}%</span>
              </div>
              <div style={{ height: '8px', background: 'rgba(255,255,255,0.06)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: `${progress}%`, height: '100%', background: '#10B981', borderRadius: '4px', transition: 'width 1s ease' }}></div>
              </div>
            </div>

            {/* Stats grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="card bg-secondary" style={{ padding: '0.75rem', textAlign: 'center' }}>
                <p className="text-xs text-muted">Monthly EMI</p>
                <p className="font-bold text-sm">{formatINR(existingLoanData.emi)}</p>
              </div>
              <div className="card bg-secondary" style={{ padding: '0.75rem', textAlign: 'center' }}>
                <p className="text-xs text-muted">Interest Rate</p>
                <p className="font-bold text-sm">{existingLoanData.interestRate}% p.a.</p>
              </div>
              <div className="card bg-secondary" style={{ padding: '0.75rem', textAlign: 'center' }}>
                <p className="text-xs text-muted">EMIs Remaining</p>
                <p className="font-bold text-sm">{emisRemaining}</p>
              </div>
              <div className="card bg-secondary" style={{ padding: '0.75rem', textAlign: 'center' }}>
                <p className="text-xs text-muted">Next Due</p>
                <p className="font-bold text-sm">{existingLoanData.nextDueDate}</p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div style={{ padding: '0.75rem 1.25rem', background: 'rgba(0,0,0,0.2)', borderTop: '1px solid var(--border)', textAlign: 'center' }}>
            <p className="text-xs text-muted">Total Paid: {formatINR(existingLoanData.totalPaid)} • Disbursed: {new Date(existingLoanData.disbursedOn).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
          </div>
        </div>

        <div className="card mb-4" style={{ padding: '1rem', background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)' }}>
          <p className="text-sm text-center">
            <strong>Top-Up Loan Available!</strong><br/>
            <span className="text-xs text-muted">Based on your clean repayment track record, you are eligible for additional credit. Your existing EMI of {formatINR(existingLoanData.emi)} will be factored into the new assessment.</span>
          </p>
        </div>

        <button className="btn btn-cta btn-block" onClick={handleApplyTopUp}>
          Apply for Top-Up Loan →
        </button>
      </div>
    </div>
  );
}
