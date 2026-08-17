import React, { useState, useRef } from 'react';
import { useLoan } from '../context/LoanContext';
import ProgressBar from '../components/ProgressBar';

export default function MobileConsent() {
  const { state, dispatch, nextStep } = useLoan();
  const [mobile, setMobile] = useState(() => {
    if (!state.demoName) return '';
    if (state.demoName.includes('Robert')) return '9876543210';
    if (state.demoName.includes('Chris')) return '8765432109';
    if (state.demoName.includes('Benedict')) return '7654321098';
    if (state.demoName.includes('Karan')) return '6543210987';
    return '9999999999';
  });
  const [name, setName] = useState(state.demoName || '');
  const [consents, setConsents] = useState({
    credit: false,
    digilocker: false,
    terms: false
  });
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [verifying, setVerifying] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const inputRefs = useRef([]);
  
  const isMobileValid = mobile.length === 10 && /^\d+$/.test(mobile);
  const allConsentsChecked = consents.credit && consents.digilocker && consents.terms;
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
        dispatch({ type: 'SET_MOBILE', mobile });
        dispatch({ type: 'ADD_CONSENT', payload: { type: 'credit_bureau', text: 'I authorize WhiteQuest to pull my credit report from CIBIL/Experian for the purpose of evaluating this loan application.', status: 'granted' } });
        dispatch({ type: 'ADD_CONSENT', payload: { type: 'digilocker', text: 'I authorize WhiteQuest to access my Aadhaar and PAN details via DigiLocker for digital KYC verification.', status: 'granted' } });
        dispatch({ type: 'ADD_CONSENT', payload: { type: 'terms', text: 'I have read and agree to the Terms of Service and Privacy Policy.', status: 'granted' } });
        nextStep();
      }, 4000);
    }, 1500);
  };
  
  if (isSuccess) {
    return (
      <div className="screen" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', position: 'relative', overflow: 'hidden', margin: 0, padding: 0 }}>
        <style>{`
          @keyframes fadeInOutMessage {
            0% { opacity: 0; transform: translateY(10px) scale(0.98); }
            15% { opacity: 1; transform: translateY(0) scale(1); }
            75% { opacity: 1; transform: translateY(0) scale(1); }
            100% { opacity: 0; transform: translateY(-10px) scale(1.02); }
          }
          @keyframes fadeInOutBg {
            0% { opacity: 0; }
            20% { opacity: 1; }
            80% { opacity: 1; }
            100% { opacity: 0; }
          }
          .success-highlight {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 150vw;
            height: 150vw;
            background: radial-gradient(circle, rgba(16, 185, 129, 0.08) 0%, rgba(0,0,0,0) 60%);
            animation: fadeInOutBg 3.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
            pointer-events: none;
            z-index: 0;
          }
          .success-content {
            position: relative;
            z-index: 1;
            animation: fadeInOutMessage 3.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
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
          <h2 className="heading-xl text-center mb-2" style={{ fontSize: '2rem', textShadow: '0 0 20px rgba(255,255,255,0.3), 0 0 40px rgba(16,185,129,0.3)' }}>Hi {state.demoName}!</h2>
          <p className="text-body text-muted text-center" style={{ fontSize: '1.1rem', textShadow: '0 0 15px rgba(255,255,255,0.1)' }}>Your mobile number has been verified.</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="screen">
      <ProgressBar />
      <div className="mt-6 w-full">
        <h2 className="heading-lg">Create your account</h2>
        <p className="text-body text-muted mt-2 mb-6">Enter your mobile number to get started.</p>
        <div className="form-group mb-4" style={{ position: 'relative' }}>
          <div style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
          </div>
          <input 
            type="text" 
            value={name} 
            onChange={(e) => setName(e.target.value)}
            className="form-input" 
            placeholder="Full Name"
            style={{ paddingLeft: '44px', fontWeight: 600 }}
            disabled={otpSent}
          />
        </div>

        <div className="form-group mb-6" style={{ position: 'relative' }}>
          <div style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)', fontWeight: '600', pointerEvents: 'none' }}>
            +91
          </div>
          <input 
            type="text" 
            maxLength={10} 
            value={mobile} 
            onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
            className="form-input" 
            placeholder="Mobile Number"
            style={{ paddingLeft: '52px', fontWeight: 600, letterSpacing: '2px' }}
            disabled={otpSent}
          />
        </div>
        
        {!otpSent ? (
          <>
            <div className="consent-block mb-6">
              <div className="checkbox-group mb-4">
                <input 
                  type="checkbox" 
                  id="consent-credit" 
                  className="checkbox-input" 
                  checked={consents.credit}
                  onChange={(e) => setConsents({...consents, credit: e.target.checked})}
                />
                <label htmlFor="consent-credit" className="checkbox-label text-sm">
                  I authorize WhiteQuest to pull my credit report from CIBIL/Experian for the purpose of evaluating this loan application.
                </label>
              </div>
              
              <div className="checkbox-group mb-4">
                <input 
                  type="checkbox" 
                  id="consent-digilocker" 
                  className="checkbox-input" 
                  checked={consents.digilocker}
                  onChange={(e) => setConsents({...consents, digilocker: e.target.checked})}
                />
                <label htmlFor="consent-digilocker" className="checkbox-label text-sm">
                  I authorize WhiteQuest to access my Aadhaar and PAN details via DigiLocker for digital KYC verification.
                </label>
              </div>
              
              <div className="checkbox-group mb-4">
                <input 
                  type="checkbox" 
                  id="consent-terms" 
                  className="checkbox-input" 
                  checked={consents.terms}
                  onChange={(e) => setConsents({...consents, terms: e.target.checked})}
                />
                <label htmlFor="consent-terms" className="checkbox-label text-sm">
                  I have read and agree to the Terms of Service and Privacy Policy.
                </label>
              </div>
            </div>
            
            <button 
              onClick={handleSendOTP} 
              disabled={!isMobileValid || !allConsentsChecked} 
              className="btn btn-primary btn-block mb-4"
            >
              Send OTP
            </button>
          </>
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
              className="btn btn-primary btn-block mb-4" 
              onClick={handleVerify}
              disabled={!isOtpComplete || verifying}
            >
              {verifying ? (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <div className="loading-spinner" style={{ width: '18px', height: '18px', borderWidth: '2px' }}></div>
                  Verifying...
                </span>
              ) : 'Verify & Continue'}
            </button>
          </>
        )}
        
        <p className="text-xs text-muted text-center">
          Your data is encrypted and processed as per RBI data protection guidelines.
        </p>
      </div>
    </div>
  );
}
