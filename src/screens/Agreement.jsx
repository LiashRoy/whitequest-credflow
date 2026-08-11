import React, { useState } from 'react';
import { useLoan } from '../context/LoanContext';
import ProgressBar from '../components/ProgressBar';
import { formatINR } from '../engine/creditEngine';
import { getDynamicProfile } from '../engine/mockProfiles';

export default function Agreement() {
  const { state, dispatch, nextStep } = useLoan();
  const [mandateChecked, setMandateChecked] = useState(false);
  const [showSignInput, setShowSignInput] = useState(false);
  const profile = getDynamicProfile(state);
  const [signatureName, setSignatureName] = useState(profile?.aadhaar?.name || '');
  const [isSigned, setIsSigned] = useState(false);
  
  // Payment Modal State
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentStep, setPaymentStep] = useState('method'); // 'method', 'upi_apps', 'debit_banks', 'processing', 'success'
  const [selectedApp, setSelectedApp] = useState(null); // to store which app/bank they clicked
  
  // Card Form State
  const [cardDetails, setCardDetails] = useState({ number: '', expiry: '', cvv: '', name: '' });
  const [otp, setOtp] = useState('');

  const { creditResult, bankStatementData } = state;

  const bankAccount = bankStatementData?.accountNumber || profile?.bankStatement?.accountNumber || 'XXXX1234';
  const last4 = bankAccount.slice(-4);
  const emi = creditResult?.emi || 0;

  const handleSign = (e) => {
    if (e) e.stopPropagation();
    if (signatureName.trim().length > 0) {
      setIsSigned(true);
      setShowSignInput(false);
    }
  };

  const handleSubmit = () => {
    dispatch({ type: 'SIGN_AGREEMENT', name: signatureName });
    dispatch({ type: 'ADD_CONSENT', payload: { type: 'e_mandate', text: 'e-Mandate NACH Auto Debit (₹750 Token Paid)', status: 'granted' } });
    dispatch({ type: 'ADD_CONSENT', payload: { type: 'loan_agreement', text: 'Digital Loan Agreement', status: 'granted' } });
    nextStep();
  };

  const handleProcessPayment = (appName, isUpi = false) => {
    setSelectedApp(appName);
    if (isUpi) {
      setPaymentStep('qr');
      setTimeout(() => {
        setPaymentStep('processing');
        setTimeout(() => {
          setPaymentStep('success');
          setMandateChecked(true);
          setTimeout(() => {
            setShowPaymentModal(false);
            setPaymentStep('method'); // reset for future
          }, 1500);
        }, 1500);
      }, 3500); // Wait 3.5s at QR code screen
    } else {
      setPaymentStep('processing');
      setTimeout(() => {
        setPaymentStep('success');
        setMandateChecked(true);
        setTimeout(() => {
          setShowPaymentModal(false);
          setPaymentStep('method'); // reset for future
        }, 1500);
      }, 2500);
    }
  };

  const handleOpenModal = () => {
    setPaymentStep('method');
    setSelectedApp(null);
    setShowPaymentModal(true);
  };

  return (
    <div className="screen">
      <ProgressBar />
      <div className="screen-header mt-4">
        <h1 className="heading-xl">Loan Agreement</h1>
        <p className="text-body text-muted mb-2">Please review and sign your digital agreement</p>
      </div>

      <div className="screen-center flex-col gap-2">
        {creditResult && (
          <div className="card card-accent mb-2">
            <h3 className="heading-md mb-2">Loan Summary</h3>
            <div className="offer-grid">
              <div className="offer-item">
                <span className="offer-item-label">Amount</span>
                <span className="offer-item-value">{formatINR(creditResult.approvedAmount)}</span>
              </div>
              <div className="offer-item">
                <span className="offer-item-label">Interest Rate</span>
                <span className="offer-item-value">{creditResult.interestRate}% p.a.</span>
              </div>
              <div className="offer-item">
                <span className="offer-item-label">Tenure</span>
                <span className="offer-item-value">{creditResult.tenure} Months</span>
              </div>
              <div className="offer-item">
                <span className="offer-item-label">EMI</span>
                <span className="offer-item-value">{formatINR(creditResult.emi)}</span>
              </div>
            </div>
          </div>
        )}

        <div className="card card-glass mb-2" style={{ maxHeight: '150px', overflowY: 'auto' }}>
          <h3 className="heading-sm mb-2">Terms & Conditions</h3>
          <ol className="text-sm text-muted" style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <li>The loan amount will be disbursed to the borrower's UPI-linked bank account within 24 hours of agreement execution.</li>
            <li>EMI payments will be auto-debited on the 5th of every month via NACH e-mandate.</li>
            <li>Late payment penalty: 2% per month on the overdue amount.</li>
            <li>Prepayment is allowed after 3 EMIs with no foreclosure charges.</li>
            <li>The borrower acknowledges that this is an unsecured loan with no collateral requirement.</li>
            <li>Interest rate is fixed for the entire tenure and will not change.</li>
            <li>Processing fee is non-refundable and will be deducted from the disbursed amount.</li>
            <li>The borrower consents to automated recovery measures in case of default as per RBI guidelines.</li>
          </ol>
        </div>

        <div className="card mb-2">
          <h3 className="heading-sm mb-2">NACH Auto-Debit Authorization</h3>
          <p className="text-body text-muted mb-2">
            To automate your monthly EMI of {formatINR(emi)}, please set up an e-Mandate. A token amount of ₹750 will be deducted and immediately refunded to verify your bank account ending in {last4}.
          </p>
          
          {mandateChecked ? (
            <div className="flex gap-2 items-center p-3 rounded bg-success bg-opacity-10 border border-success border-opacity-30">
              <div className="text-success text-xl">✓</div>
              <div>
                <div className="text-sm font-semibold text-success">e-Mandate Registered</div>
                <div className="text-xs text-muted">Auto-debit setup is complete.</div>
              </div>
            </div>
          ) : (
            <button 
              className="btn btn-secondary w-full"
              onClick={handleOpenModal}
            >
              Setup e-Mandate (Pay ₹750)
            </button>
          )}
        </div>

        <div className="card mb-2" style={{ opacity: mandateChecked ? 1 : 0.5, pointerEvents: mandateChecked ? 'auto' : 'none' }}>
          <h3 className="heading-sm mb-2">Digital Signature</h3>
          {!mandateChecked && <p className="text-xs text-warning mb-2">Please complete the e-Mandate setup to unlock digital signature.</p>}
          <div 
            className={`signature-area ${isSigned ? 'signed' : ''}`}
            onClick={() => !isSigned && setShowSignInput(true)}
            style={{ 
              border: '2px dashed var(--border-light)', 
              borderRadius: '8px', 
              padding: '16px', 
              textAlign: 'center',
              cursor: isSigned ? 'default' : 'pointer',
              backgroundColor: isSigned ? 'var(--bg-secondary)' : 'transparent'
            }}
          >
            {isSigned ? (
              <div className="signature-text heading-lg text-accent" style={{ fontStyle: 'italic', fontFamily: 'cursive' }}>
                {signatureName}
              </div>
            ) : showSignInput ? (
              <div className="flex gap-2 items-center" onClick={(e) => e.stopPropagation()}>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="Type your full name" 
                  value={signatureName}
                  onChange={(e) => setSignatureName(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleSign(e); }}
                  autoFocus
                />
                <button className="btn btn-primary" onClick={handleSign}>Sign</button>
              </div>
            ) : (
              <p className="text-body text-muted">Tap to sign</p>
            )}
          </div>
        </div>
      </div>

      <div className="screen-footer">
        <button 
          className="btn btn-cta btn-block" 
          disabled={!mandateChecked || !isSigned}
          onClick={handleSubmit}
        >
          I Agree & Sign
        </button>
      </div>

      {/* Payment Modal for e-Mandate */}
      {showPaymentModal && (
        <div className="modal-overlay" onClick={() => paymentStep !== 'processing' && setShowPaymentModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            {paymentStep === 'processing' ? (
              <div className="loading-center py-8">
                <div style={{ position: 'relative', width: '64px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto' }}>
                  <div style={{ position: 'absolute', width: '100%', height: '100%', borderRadius: '50%', background: 'var(--accent)', opacity: 0.2, animation: 'pulse 1.5s infinite ease-in-out' }}></div>
                  <div className="loading-spinner" style={{ width: '40px', height: '40px', borderWidth: '3px', borderTopColor: 'var(--accent-light)', borderColor: 'rgba(255,255,255,0.1)' }}></div>
                </div>
                <h3 className="heading-sm mt-4 text-white" style={{ animation: 'pulse 1.5s infinite ease-in-out' }}>Verifying Payment securely...</h3>
                <p className="text-xs text-muted mt-2">Please do not close this window</p>
              </div>
            ) : paymentStep === 'success' ? (
              <div className="loading-center py-6">
                <div className="status-icon status-icon-success" style={{ width: '64px', height: '64px', marginBottom: '16px' }}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ strokeDasharray: 30, strokeDashoffset: 30, animation: 'checkmark 0.6s ease-out 0.2s forwards' }}>
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
                <h3 className="heading-md mb-2 text-white">e-Mandate Registered!</h3>
                <p className="text-sm text-muted">Auto-debit setup is complete.</p>
              </div>
            ) : paymentStep === 'qr' ? (
              <div className="text-center py-4">
                <h3 className="heading-md mb-2">Scan to Pay ₹750</h3>
                <p className="text-sm text-muted mb-4">Open your {selectedApp} app and scan this QR code to complete the mandate.</p>
                <div className="bg-white p-4 rounded-xl inline-block mb-4 shadow-lg">
                  <img src="https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=upi://pay?pa=onyx@upi&pn=Onyx&am=750&cu=INR" alt="QR Code" className="w-40 h-40" />
                </div>
                <div className="text-xs text-muted">Awaiting scan confirmation...</div>
              </div>
            ) : paymentStep === 'upi_apps' ? (
              <div>
                <div className="flex flex-between items-center mb-4">
                  <h3 className="heading-md">Select UPI App</h3>
                  <button className="text-sm text-muted hover:text-white" onClick={() => setPaymentStep('method')}>← Back</button>
                </div>
                <p className="text-sm text-muted mb-6">Choose an app to approve the ₹750 token mandate.</p>
                <div className="payment-grid-3 mb-4">
                  <div className="payment-app-card" onClick={() => handleProcessPayment('Google Pay', true)}>
                    <div className="payment-app-icon">
                      <img src="https://upload.wikimedia.org/wikipedia/commons/f/f2/Google_Pay_Logo.svg" alt="GPay" style={{ height: '24px' }} />
                    </div>
                    <span className="text-xs font-semibold text-white">GPay</span>
                  </div>
                  <div className="payment-app-card" onClick={() => handleProcessPayment('PhonePe', true)}>
                    <div className="payment-app-icon">
                      <img src="https://upload.wikimedia.org/wikipedia/commons/7/71/PhonePe_Logo.svg" alt="PhonePe" style={{ height: '28px' }} />
                    </div>
                    <span className="text-xs font-semibold text-white">PhonePe</span>
                  </div>
                  <div className="payment-app-card" onClick={() => handleProcessPayment('Paytm', true)}>
                    <div className="payment-app-icon">
                      <img src="https://upload.wikimedia.org/wikipedia/commons/2/24/Paytm_Logo_%28standalone%29.svg" alt="Paytm" style={{ height: '14px' }} />
                    </div>
                    <span className="text-xs font-semibold text-white">Paytm</span>
                  </div>
                </div>
              </div>
            ) : paymentStep === 'debit_banks' ? (
              <div>
                <div className="flex flex-between items-center mb-4">
                  <h3 className="heading-md">Enter Debit Card</h3>
                  <button className="text-sm text-muted hover:text-white" onClick={() => setPaymentStep('method')}>← Back</button>
                </div>
                <p className="text-sm text-muted mb-6">Enter your card details to set up the ₹750 mandate.</p>
                
                <div className="flex flex-col gap-4 mb-6">
                  <div>
                    <label className="text-xs text-muted mb-1 block">Cardholder Name</label>
                    <input 
                      type="text" 
                      className="input w-full" 
                      style={{ color: '#fff', backgroundColor: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.2)' }}
                      placeholder="Name on card"
                      value={cardDetails.name}
                      onChange={(e) => setCardDetails({...cardDetails, name: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted mb-1 block">Card Number</label>
                    <input 
                      type="text" 
                      className="input w-full" 
                      style={{ color: '#fff', backgroundColor: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.2)' }}
                      placeholder="XXXX XXXX XXXX XXXX"
                      maxLength="19"
                      value={cardDetails.number}
                      onChange={(e) => setCardDetails({...cardDetails, number: e.target.value})}
                    />
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="text-xs text-muted mb-1 block">Expiry</label>
                      <input 
                        type="text" 
                        className="input w-full" 
                        style={{ color: '#fff', backgroundColor: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.2)' }}
                        placeholder="MM/YY"
                        maxLength="5"
                        value={cardDetails.expiry}
                        onChange={(e) => setCardDetails({...cardDetails, expiry: e.target.value})}
                      />
                    </div>
                    <div className="flex-1">
                      <label className="text-xs text-muted mb-1 block">CVV</label>
                      <input 
                        type="password" 
                        className="input w-full" 
                        style={{ color: '#fff', backgroundColor: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.2)' }}
                        placeholder="***"
                        maxLength="3"
                        value={cardDetails.cvv}
                        onChange={(e) => setCardDetails({...cardDetails, cvv: e.target.value})}
                      />
                    </div>
                  </div>
                </div>

                <button 
                  className="btn btn-primary w-full mb-6"
                  onClick={() => setPaymentStep('debit_otp')}
                  disabled={!cardDetails.number || !cardDetails.expiry || !cardDetails.cvv || !cardDetails.name}
                >
                  Proceed to Pay ₹750
                </button>

                <div className="flex justify-center gap-4 border-t border-border pt-4 items-center">
                  <svg viewBox="0 0 32 10" style={{ height: '12px', opacity: 0.7 }} fill="#fff">
                    <path d="M12.5 0l-2.2 10h3.6l2.2-10h-3.6zm10.7 7.1c0-2-2.8-2.1-2.8-3 0-.3.3-.6.8-.7.3 0 1 .1 1.9.4l.3-1.6c-.5-.2-1.3-.4-2.3-.4-3.4 0-5.8 1.8-5.8 4.3 0 1.9 1.7 2.9 3 3.6 1.3.6 1.8 1.1 1.8 1.6 0 .8-1 1.2-1.9 1.2-1.3 0-2-.2-2.7-.5l-.4-1.6c.7.3 1.7.6 2.9.6 3.6 0 5.9-1.8 5.9-4.5zm-11.7-7.1l-2.3 7.2-.6-3.6c-.1-.7-.6-1.1-1.3-1.3l-3.6-.8v.2c1.1.2 2.4.7 2.9 1.2.4.4.6.9.7 1.6l1.2 6.1h3.7l5.6-10h-3.6zm15.4 10h3.3l-1.7-10h-2.8c-.8 0-1.5.5-1.7 1.2l-4.8 9.3h3.7l.7-2h4.5l.4 2zm-1.9-4.8l1.1-2.9.6 2.9h-1.7z" />
                  </svg>
                  <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" style={{ height: '20px', opacity: 0.7 }} />
                  <img src="https://upload.wikimedia.org/wikipedia/commons/c/cb/Rupay-Logo.png" alt="RuPay" style={{ height: '20px', opacity: 0.7 }} />
                </div>
              </div>
            ) : paymentStep === 'debit_otp' ? (
              <div>
                <div className="flex flex-between items-center mb-4">
                  <h3 className="heading-md">Bank Authentication</h3>
                  <button className="text-sm text-muted hover:text-white" onClick={() => setPaymentStep('debit_banks')}>← Back</button>
                </div>
                <div className="bg-white text-black p-4 rounded-xl mb-6 shadow-md text-center">
                  <p className="text-sm font-semibold mb-2">Transaction Amount: ₹750</p>
                  <p className="text-xs text-gray-600 mb-4">An OTP has been sent to your registered mobile number ending in 98XX.</p>
                  <input 
                    type="text" 
                    className="input w-full text-center tracking-widest font-mono mb-4" 
                    style={{ color: '#000', backgroundColor: '#f5f5f5', border: '1px solid #ccc' }}
                    placeholder="Enter 6-digit OTP"
                    maxLength="6"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                  />
                  <button 
                    className="btn btn-primary w-full"
                    disabled={otp.length < 4}
                    onClick={() => handleProcessPayment('Debit Card', false)}
                  >
                    Submit & Pay
                  </button>
                </div>
                <div className="text-xs text-center text-muted">Secured by 256-bit encryption</div>
              </div>
            ) : (
              <div>
                <h3 className="heading-md mb-2">e-Mandate Setup</h3>
                <p className="text-sm text-muted mb-6">Pay a token amount of ₹750 to authenticate and register your auto-debit mandate.</p>
                
                <div className="flex flex-col gap-3 mb-6">
                  <div 
                    className="payment-option"
                    onClick={() => setPaymentStep('upi_apps')}
                  >
                    <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-accent-light">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect><line x1="12" y1="18" x2="12.01" y2="18"></line></svg>
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-sm">UPI Autopay</div>
                      <div className="text-xs text-muted">GPay, PhonePe, Paytm</div>
                    </div>
                    <div className="text-muted">→</div>
                  </div>
                  
                  <div 
                    className="payment-option"
                    onClick={() => setPaymentStep('debit_banks')}
                  >
                    <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-accent-light">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-sm">Debit Card</div>
                      <div className="text-xs text-muted">HDFC, SBI, ICICI, etc.</div>
                    </div>
                    <div className="text-muted">→</div>
                  </div>
                </div>

                <button 
                  className="btn btn-secondary btn-block mt-3"
                  onClick={() => setShowPaymentModal(false)}
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
