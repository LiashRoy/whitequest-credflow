import React, { useState } from 'react';
import { useLoan } from '../context/LoanContext';
import ProgressBar from '../components/ProgressBar';

export default function MobileConsent() {
  const { dispatch, nextStep } = useLoan();
  const [mobile, setMobile] = useState('');
  const [consents, setConsents] = useState({
    credit: false,
    digilocker: false,
    terms: false
  });
  const [otpSent, setOtpSent] = useState(false);
  const [otpValue, setOtpValue] = useState('');
  const [verifying, setVerifying] = useState(false);
  
  const isMobileValid = mobile.length === 10 && /^\d+$/.test(mobile);
  const allConsentsChecked = consents.credit && consents.digilocker && consents.terms;
  
  const handleSendOTP = () => {
    setOtpSent(true);
    // Auto-fill OTP for demo
    setTimeout(() => setOtpValue('786543'), 800);
  };

  const handleVerify = () => {
    setVerifying(true);
    setTimeout(() => {
      setVerifying(false);
      dispatch({ type: 'SET_MOBILE', mobile });
      dispatch({ type: 'ADD_CONSENT', payload: { type: 'credit_bureau', text: 'I authorize WhiteQuest to pull my credit report from CIBIL/Experian for the purpose of evaluating this loan application.', status: 'granted' } });
      dispatch({ type: 'ADD_CONSENT', payload: { type: 'digilocker', text: 'I authorize WhiteQuest to access my Aadhaar and PAN details via DigiLocker for digital KYC verification.', status: 'granted' } });
      dispatch({ type: 'ADD_CONSENT', payload: { type: 'terms', text: 'I have read and agree to the Terms of Service and Privacy Policy.', status: 'granted' } });
      nextStep();
    }, 1500);
  };
  
  return (
    <div className="screen">
      <ProgressBar />
      <div className="mt-6 w-full">
        <h2 className="heading-lg">Create your account</h2>
        <p className="text-body text-muted mt-2 mb-6">Enter your mobile number to get started.</p>
        
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
              className="btn btn-primary btn-block mb-4" 
              onClick={handleVerify}
              disabled={verifying}
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
