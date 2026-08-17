import React, { useState } from 'react';
import { useLoan } from '../context/LoanContext';
import ProgressBar from '../components/ProgressBar';

export default function ReturningUserLogin() {
  const { state, dispatch, nextStep } = useLoan();
  const [otpSent, setOtpSent] = useState(false);
  const [otpValue, setOtpValue] = useState('');
  const [verifying, setVerifying] = useState(false);

  const phone = '9876501234'; // Mark's registered number

  const handleSendOTP = () => {
    dispatch({ type: 'SET_MOBILE', mobile: phone });
    setOtpSent(true);
    // Auto-fill OTP for demo
    setTimeout(() => setOtpValue('786543'), 800);
  };

  const handleVerify = () => {
    setVerifying(true);
    setTimeout(() => {
      setVerifying(false);
      // If existing loan data is present, go to step 2 (ExistingLoanSummary)
      // Otherwise skip to step 3 (Landing/Loan params)
      if (state.existingLoanData) {
        nextStep(); // goes to step 2 = ExistingLoanSummary
      } else {
        // Skip to loan params (step 3 in returning flow)
        dispatch({ type: 'SET_STEP', step: 3 });
      }
    }, 1500);
  };

  return (
    <div className="screen">
      <ProgressBar />
      <div className="screen-center">
        <div className="flex-center flex-col mb-6">
          <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'linear-gradient(135deg, #3B82F6, #1D4ED8)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
          </div>
          <h2 className="heading-lg text-center">Welcome back, {state.demoName}!</h2>
          <p className="text-sm text-muted text-center mt-1">Login with your registered mobile number</p>
        </div>

        <div className="mt-2 w-full">
          <div className="form-group mb-6" style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)', fontWeight: '600', pointerEvents: 'none' }}>
              +91
            </div>
            <input
              type="text"
              className="form-input"
              value={phone}
              readOnly
              style={{ paddingLeft: '52px', fontWeight: 600, letterSpacing: '2px' }}
            />
          </div>

          {!otpSent ? (
            <button className="btn btn-primary btn-block mb-6" onClick={handleSendOTP}>
              Send OTP
            </button>
          ) : (
            <>
              <div className="form-group mb-6">
                <input
                  type="text"
                  className="form-input"
                  value={otpValue}
                  readOnly
                  maxLength={6}
                  placeholder="Enter OTP"
                  style={{ letterSpacing: '8px', textAlign: 'center', fontWeight: 700, fontSize: '1.2rem' }}
                />
                <p className="text-xs text-muted text-center mt-2">
                  Auto-reading OTP...
                </p>
              </div>
              <button 
                className="btn btn-primary btn-block mb-6" 
                onClick={handleVerify}
                disabled={verifying}
              >
                {verifying ? (
                  <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    <div className="loading-spinner" style={{ width: '18px', height: '18px', borderWidth: '2px' }}></div>
                    Verifying...
                  </span>
                ) : 'Verify & Login'}
              </button>
            </>
          )}
        </div>

        <div className="card bg-secondary text-center" style={{ padding: '0.75rem' }}>
          <p className="text-xs text-muted">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
            KYC already verified • No re-verification required
          </p>
        </div>
      </div>
    </div>
  );
}
