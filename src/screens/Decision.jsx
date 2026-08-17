import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLoan } from '../context/LoanContext';
import ProgressBar from '../components/ProgressBar';
import { formatINR, totalInterest } from '../engine/creditEngine';

export default function Decision() {
  const { state, nextStep, reset, dispatch } = useLoan();
  const { creditResult, loanParams } = state;
  const navigate = useNavigate();
  const [selectedOffer, setSelectedOffer] = useState('primary');

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
            <div className="status-icon status-icon-success mb-2">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '40px', height: '40px', color: 'currentColor' }}>
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
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
    const handleAcceptConditional = () => {
      if (selectedOffer === 'alternative' && creditResult.alternativeOffer) {
        dispatch({
          type: 'SET_CREDIT_RESULT',
          payload: {
            ...creditResult,
            approvedAmount: creditResult.alternativeOffer.approvedAmount,
            interestRate: creditResult.alternativeOffer.interestRate,
            emi: creditResult.alternativeOffer.emi,
            processingFee: creditResult.alternativeOffer.processingFee
          }
        });
      }
      nextStep();
    };

    return (
      <div className="screen">
        <ProgressBar />
        <div className="screen-center" style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div className="flex-center flex-col mb-6">
            <div className="status-icon status-icon-warning mb-2">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '40px', height: '40px', color: 'currentColor' }}>
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                <line x1="12" y1="9" x2="12" y2="13"></line>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
              </svg>
            </div>
            <h2 className="heading-lg text-center">Loan Approved with Conditions</h2>
          </div>
          
          <div className="flex-center mb-4">
            <span className="badge badge-warning">CONDITIONAL</span>
          </div>

          <div className="card mb-4" style={{ backgroundColor: 'var(--bg-warning)', borderColor: 'var(--warning)', textAlign: 'center' }}>
            <p className="text-body text-warning">{creditResult.reason}</p>
            <p className="text-sm font-medium mt-2">Please select your preferred offer below.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: creditResult.alternativeOffer ? '1fr 1fr' : '1fr', gap: '16px', marginBottom: '24px' }}>
            {/* Primary Offer */}
            <div 
              className="card" 
              style={{ 
                cursor: 'pointer',
                border: selectedOffer === 'primary' ? '2px solid var(--accent)' : '1px solid var(--border)',
                background: selectedOffer === 'primary' ? 'var(--bg-tertiary)' : 'var(--bg-card)',
                boxShadow: selectedOffer === 'primary' ? '0 0 15px rgba(255,255,255,0.1)' : 'none',
                transition: 'all 0.2s ease',
                position: 'relative'
              }}
              onClick={() => setSelectedOffer('primary')}
            >
              {selectedOffer === 'primary' && (
                <div style={{ position: 'absolute', top: '-10px', left: '50%', transform: 'translateX(-50%)', background: 'var(--accent)', color: '#000', padding: '2px 10px', borderRadius: '12px', fontSize: '10px', fontWeight: 'bold' }}>SELECTED</div>
              )}
              <h3 className="heading-sm mb-1 text-center" style={{ color: 'var(--accent)' }}>Recommended</h3>
              <p className="text-xs text-muted text-center mb-3">Best terms for your profile</p>
              {renderOfferGrid(creditResult)}
            </div>

            {/* Alternative Offer */}
            {creditResult.alternativeOffer && (
              <div 
                className="card" 
                style={{ 
                  cursor: 'pointer',
                  border: selectedOffer === 'alternative' ? '2px solid var(--accent)' : '1px solid var(--border)',
                  background: selectedOffer === 'alternative' ? 'var(--bg-tertiary)' : 'var(--bg-card)',
                  boxShadow: selectedOffer === 'alternative' ? '0 0 15px rgba(255,255,255,0.1)' : 'none',
                  transition: 'all 0.2s ease',
                  position: 'relative'
                }}
                onClick={() => setSelectedOffer('alternative')}
              >
                {selectedOffer === 'alternative' && (
                  <div style={{ position: 'absolute', top: '-10px', left: '50%', transform: 'translateX(-50%)', background: 'var(--accent)', color: '#000', padding: '2px 10px', borderRadius: '12px', fontSize: '10px', fontWeight: 'bold' }}>SELECTED</div>
                )}
                <h3 className="heading-sm mb-1 text-center text-warning">High Risk Alternative</h3>
                <p className="text-xs text-muted text-center mb-3">Full amount at a premium rate</p>
                {renderOfferGrid(creditResult.alternativeOffer)}
              </div>
            )}
          </div>

          <div className="mt-6 flex flex-col gap-2" style={{ maxWidth: '400px', margin: '0 auto' }}>
            <button className="btn btn-cta btn-block" onClick={handleAcceptConditional}>
              Accept Selected Offer
            </button>
            <button className="btn btn-ghost btn-block" onClick={handleDecline}>
              Decline Both Offers
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
            <div className="status-icon status-icon-error mb-2">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '40px', height: '40px', color: 'currentColor' }}>
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="15" y1="9" x2="9" y2="15"></line>
                <line x1="9" y1="9" x2="15" y2="15"></line>
              </svg>
            </div>
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
            <div className="status-icon status-icon-info mb-2">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '40px', height: '40px', color: 'currentColor' }}>
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="16" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12.01" y2="8"></line>
              </svg>
            </div>
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
