import React, { useState, useRef } from 'react';
import { useLoan } from '../context/LoanContext';
import ProgressBar from '../components/ProgressBar';

export default function ReturningUserLogin() {
  const { state, dispatch, nextStep } = useLoan();
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [verifying, setVerifying] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const inputRefs = useRef([]);

  const phone = '9876501234'; // Mark's registered number
  const isOtpComplete = otp.every(d => d !== '');

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) inputRefs.current[index + 1].focus();
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleSendOTP = () => {
    dispatch({ type: 'SET_MOBILE', mobile: phone });
    setOtpSent(true);
    // Auto-fill OTP for demo
    setTimeout(() => setOtp(['7', '8', '6', '5', '4', '3']), 800);
  };

  const handleVerify = () => {
    setVerifying(true);
    setTimeout(() => {
      setVerifying(false);
      setIsSuccess(true);
      
      setTimeout(() => {
        // If existing loan data is present, go to step 2 (ExistingLoanSummary)
        // Otherwise skip to step 3 (Landing/Loan params)
        if (state.existingLoanData) {
          nextStep(); // goes to step 2 = ExistingLoanSummary
        } else {
          // Skip to loan params (step 3 in returning flow)
          dispatch({ type: 'SET_STEP', step: 3 });
        }
      }, 3500);
    }, 1500);
  };

  if (isSuccess) {
    return (
      <div className="screen" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', position: 'relative', overflow: 'hidden', margin: 0, padding: 0 }}>
        <style>{`
          @keyframes fadeScaleInOut {
            0% { opacity: 0; transform: scale(0.95); }
            15% { opacity: 1; transform: scale(1); }
            85% { opacity: 1; transform: scale(1); }
            100% { opacity: 0; transform: scale(1.05); }
          }
          .success-highlight {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 150vw;
            height: 150vw;
            background: radial-gradient(circle, rgba(16, 185, 129, 0.08) 0%, rgba(0,0,0,0) 60%);
            animation: fadeScaleInOut 3.5s ease-in-out forwards;
            pointer-events: none;
            z-index: 0;
          }
          .success-content {
            position: relative;
            z-index: 1;
            animation: fadeScaleInOut 3.5s ease-in-out forwards;
            display: flex;
            flex-direction: column;
            align-items: center;
          }
        `}</style>
        <div className="success-highlight"></div>
        <div className="success-content w-full">
          <div style={{ width: '90px', height: '90px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px', border: '1px solid rgba(16, 185, 129, 0.3)', boxShadow: '0 0 40px rgba(16,185,129,0.2)' }}>
            <svg width="46" height="46" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
          </div>
          <h2 className="heading-xl text-center mb-2" style={{ fontSize: '2rem' }}>Welcome back, {state.demoName}!</h2>
          <p className="text-body text-muted text-center" style={{ fontSize: '1.1rem' }}>Your account has been securely verified.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="screen">
      <ProgressBar />
      <div className="screen-center">
        <div className="flex-center flex-col mb-8">
          <div style={{ width: '56px', height: '56px', borderRadius: '14px', background: 'rgba(255,255,255,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px', border: '1px solid var(--border)' }}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--text-primary)' }}><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path><polyline points="10 17 15 12 10 7"></polyline><line x1="15" y1="12" x2="3" y2="12"></line></svg>
          </div>
          <h2 className="heading-lg text-center">Login to your account</h2>
          <p className="text-sm text-muted text-center mt-1">Enter your registered mobile number</p>
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
                <div className="otp-container mb-2 flex-center gap-2" style={{ display: 'flex', justifyContent: 'center' }}>
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                      ref={el => inputRefs.current[index] = el}
                      className="otp-box form-input text-center text-lg w-12"
                      style={{ width: '48px', height: '48px' }}
                    />
                  ))}
                </div>
                <p className="text-xs text-muted text-center mt-2">
                  Auto-reading OTP...
                </p>
              </div>
              <button 
                className="btn btn-primary btn-block mb-6" 
                onClick={handleVerify}
                disabled={!isOtpComplete || verifying}
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
