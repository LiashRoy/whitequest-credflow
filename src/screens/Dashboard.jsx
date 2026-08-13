import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLoan } from '../context/LoanContext';
import ProgressBar from '../components/ProgressBar';
import { formatINR, generateSchedule } from '../engine/creditEngine';

export default function Dashboard() {
  const { state, reset } = useLoan();
  const navigate = useNavigate();
  const { creditResult, loanId, disbursement } = state;
  
  const schedule = creditResult ? generateSchedule(
    creditResult.approvedAmount, 
    creditResult.interestRate, 
    creditResult.tenure, 
    3
  ) : [];

  return (
    <div className="screen">
      <ProgressBar />
      
      <div className="screen-header mt-4 mb-4">
        <h1 className="heading-xl">Your Loan Details</h1>
      </div>

      <div className="screen-center flex-col gap-4">
        <div className="card card-accent mb-4">
          <div className="flex-between mb-4 pb-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
            <div>
              <p className="text-xs text-muted mb-1">Loan ID</p>
              <p className="font-semibold text-sm">{loanId || 'CF-XXXX-XXXX'}</p>
            </div>
            <div className="badge badge-success" style={{ alignSelf: 'flex-start' }}>ACTIVE</div>
          </div>
          
          <div className="offer-grid mb-4">
            <div className="offer-item">
              <span className="offer-item-label">Amount</span>
              <span className="offer-item-value">{formatINR(creditResult?.approvedAmount || 0)}</span>
            </div>
            <div className="offer-item">
              <span className="offer-item-label">Interest</span>
              <span className="offer-item-value">{creditResult?.interestRate || 0}% p.a.</span>
            </div>
            <div className="offer-item">
              <span className="offer-item-label">Tenure</span>
              <span className="offer-item-value">{creditResult?.tenure || 0} Mo</span>
            </div>
            <div className="offer-item">
              <span className="offer-item-label">EMI</span>
              <span className="offer-item-value">{formatINR(creditResult?.emi || 0)}</span>
            </div>
          </div>
          
          <div className="text-xs text-center mt-2 opacity-80">
            Disbursed on {disbursement?.timestamp ? new Date(disbursement.timestamp).toLocaleDateString() : 'N/A'}
          </div>
        </div>

        <div className="mb-4">
          <h3 className="heading-sm mb-3">Upcoming EMIs</h3>
          <div className="schedule-list card bg-secondary">
            {schedule.map((item, idx) => (
              <div key={idx} className="schedule-item flex-between py-3 border-b border-border last:border-0" style={{ borderBottom: idx < schedule.length - 1 ? '1px solid var(--border-color)' : 'none' }}>
                <div>
                  <div className="text-xs text-muted mb-1">EMI {item.installment}</div>
                  <div className="schedule-item-date font-semibold">{item.date}</div>
                </div>
                <div className="text-right">
                  <div className="schedule-item-amount font-bold mb-1">{formatINR(item.amount)}</div>
                  <div className="badge badge-neutral text-xs inline-block">Upcoming</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button 
          className="btn btn-secondary btn-block mb-4"
          onClick={() => alert('PDF download will be available shortly')}
        >
          Download Loan Agreement
        </button>

        <button className="btn btn-primary btn-block mb-4" onClick={() => { reset(); navigate('/'); }}>
          Start New Application
        </button>

        <div className="card bg-secondary text-center p-4 mb-6">
          <h4 className="heading-sm mb-2">Need Help?</h4>
          <p className="text-sm text-muted mb-1">Email: support@whitequest.in</p>
          <p className="text-sm text-muted">Phone: 1800-123-4567</p>
        </div>
      </div>
    </div>
  );
}
