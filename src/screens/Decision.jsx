import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLoan } from '../context/LoanContext';
import ProgressBar from '../components/ProgressBar';
import { formatINR, totalInterest } from '../engine/creditEngine';

export default function Decision() {
  const { state, nextStep, reset } = useLoan();
  const { creditResult, loanParams } = state;
  const navigate = useNavigate();

  if (!creditResult) return null;

  const handleDecline = () => {
    reset();
    navigate('/'); // Go back to landing page to show modal again
  };

  const renderOfferGrid = (result) => {
    const interest = totalInterest(result.approvedAmount, result.interestRate, result.tenure);
    return (
      <div className="offer-grid mb-4">
        <div className="offer-item">
          <div className="offer-item-label">Approved Amount</div>
          <div className="offer-item-value">{formatINR(result.approvedAmount)}</div>
        </div>
        <div className="offer-item">
          <div className="offer-item-label">Interest Rate</div>
          <div className="offer-item-value">{result.interestRate}% p.a.</div>
        </div>
        <div className="offer-item">
          <div className="offer-item-label">Tenure</div>
          <div className="offer-item-value">{result.tenure} months</div>
        </div>
        <div className="offer-item">
          <div className="offer-item-label">Monthly EMI</div>
          <div className="offer-item-value">{formatINR(result.emi)}</div>
        </div>
        <div className="offer-item">
          <div className="offer-item-label">Processing Fee</div>
          <div className="offer-item-value">{formatINR(result.processingFee)}</div>
        </div>
        <div className="offer-item">
          <div className="offer-item-label">Total Interest</div>
          <div className="offer-item-value">{formatINR(interest)}</div>
        </div>
      </div>
    );
  };

  if (creditResult.decision === 'APPROVED') {
    return (
      <div className="screen">
        <ProgressBar />
        <div className="screen-center">
          <div className="flex-center flex-col mb-6">
            <div className="status-icon status-icon-success mb-2">✓</div>
            <h2 className="heading-xl text-center">Congratulations!</h2>
            <p className="text-body text-center">Your loan is approved</p>
          </div>
          
          <div className="flex-center mb-4">
            <span className="badge badge-success">APPROVED</span>
          </div>

          <div className="card card-success mb-4">
            {renderOfferGrid(creditResult)}
          </div>

          <div className="card mb-4 text-center">
            <p className="text-body">{creditResult.reason}</p>
          </div>

          <div className="flex-center mb-6">
            <span className="badge badge-neutral">CIBIL: {creditResult.creditScore}</span>
          </div>

          <button className="btn btn-cta btn-block" onClick={nextStep}>
            Accept Offer
          </button>
        </div>
      </div>
    );
  }

  if (creditResult.decision === 'APPROVED_CONDITIONS') {
    return (
      <div className="screen">
        <ProgressBar />
        <div className="screen-center">
          <div className="flex-center flex-col mb-6">
            <div className="status-icon status-icon-warning mb-2">⚡</div>
            <h2 className="heading-lg text-center">Loan Approved with Conditions</h2>
          </div>
          
          <div className="flex-center mb-4">
            <span className="badge badge-warning">CONDITIONAL</span>
          </div>

          {creditResult.approvedAmount < loanParams.amount && (
            <div className="card card-accent mb-4 text-center">
              <p className="text-sm font-medium">Requested: {formatINR(loanParams.amount)} → Approved: {formatINR(creditResult.approvedAmount)}</p>
            </div>
          )}

          <div className="card mb-4">
            {renderOfferGrid(creditResult)}
          </div>

          <div className="card mb-4" style={{ backgroundColor: 'var(--bg-warning)', borderColor: 'var(--warning)' }}>
            <p className="text-body text-warning">{creditResult.reason}</p>
          </div>

          {creditResult.bankStatementWeightage && (
            <p className="text-sm text-muted text-center mb-4">
              ⓘ Offer based on bank statement analysis (alternate data underwriting)
            </p>
          )}

          <div className="mt-6 flex flex-col gap-2">
            <button className="btn btn-cta btn-block" onClick={nextStep}>
              Accept Offer
            </button>
            <button className="btn btn-ghost btn-block" onClick={handleDecline}>
              Decline
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (creditResult.decision === 'REJECTED') {
    return (
      <div className="screen">
        <ProgressBar />
        <div className="screen-center">
          <div className="flex-center flex-col mb-6">
            <div className="status-icon status-icon-error mb-2">✕</div>
            <h2 className="heading-lg text-center">Application Not Approved</h2>
          </div>
          
          <div className="flex-center mb-4">
            <span className="badge badge-error">DECLINED</span>
          </div>

          <div className="card mb-4">
            <p className="text-body text-center">{creditResult.reason}</p>
          </div>

          <div className="flex-between card bg-secondary mb-4">
            <div className="text-center w-full border-r border-gray-200">
              <div className="text-xs text-muted">Credit Score</div>
              <div className="heading-md">{creditResult.creditScore || 'N/A'}</div>
            </div>
            <div className="text-center w-full">
              <div className="text-xs text-muted">DTI Ratio</div>
              <div className="heading-md">{creditResult.dti ? `${creditResult.dti}%` : 'N/A'}</div>
            </div>
          </div>

          {creditResult.suggestions && creditResult.suggestions.length > 0 && (
            <div className="mb-6">
              <h3 className="heading-sm mb-2">Suggestions for next time:</h3>
              <div className="flex-col gap-2">
                {creditResult.suggestions.map((suggestion, idx) => (
                  <div key={idx} className="card py-3">
                    <p className="text-sm">{suggestion}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-6 flex flex-col gap-2">
            <button className="btn btn-secondary btn-block" onClick={handleDecline}>
              Fill new loan form
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (creditResult.decision === 'KYC_FLAG') {
    const refId = `CF-${Math.floor(Math.random() * 1000000)}`;
    return (
      <div className="screen">
        <ProgressBar />
        <div className="screen-center">
          <div className="flex-center flex-col mb-6">
            <div className="status-icon status-icon-info mb-2">🔍</div>
            <h2 className="heading-lg text-center">Application Under Review</h2>
          </div>
          
          <div className="flex-center mb-4">
            <span className="badge badge-info">MANUAL REVIEW</span>
          </div>

          <p className="text-body text-center mb-4">
            Your application has been routed to our compliance team for manual verification.
          </p>

          <div className="card mb-4" style={{ backgroundColor: 'var(--bg-info)', borderColor: 'var(--info)' }}>
            <p className="text-sm font-medium">Flag Reason:</p>
            <p className="text-body">{creditResult.mismatchDetail || creditResult.reason}</p>
          </div>

          <div className="card text-center mb-6">
            <p className="text-sm text-muted">Reference ID:</p>
            <p className="heading-sm">{refId}</p>
          </div>

          <p className="text-sm text-muted text-center mb-6">
            You will receive an update within 24-48 hours on your registered mobile number.
          </p>

          <button className="btn btn-secondary btn-block" onClick={handleDecline}>
            Start New Application
          </button>
        </div>
      </div>
    );
  }

  return null;
}
