import React, { useState, useEffect, useRef } from 'react';
import { useLoan } from '../context/LoanContext';
import ProgressBar from '../components/ProgressBar';
import { getDynamicProfile } from '../engine/mockProfiles';

export default function AadhaarKYC() {
  const { state, dispatch, nextStep } = useLoan();
  const [kycState, setKycState] = useState('input'); // input, otp, verifying, success
  const [aadhaar, setAadhaar] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef([]);
  
  const formatAadhaar = (val) => {
    const raw = val.replace(/\D/g, '');
    const groups = raw.match(/.{1,4}/g) || [];
    return groups.join(' ').substring(0, 14);
  };
  
  const handleAadhaarChange = (e) => {
    setAadhaar(formatAadhaar(e.target.value));
  };
  
  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };
  
  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };
  
  const isAadhaarValid = aadhaar.replace(/\s/g, '').length === 12;
  const isOtpComplete = otp.every(d => d !== '');
  
  const handleSendOtp = () => setKycState('otp');
  
  const handleVerifyOtp = () => {
    setKycState('verifying');
  };
  
  useEffect(() => {
    if (kycState === 'verifying') {
      const timer = setTimeout(() => {
        setKycState('success');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [kycState]);
  
  const handleContinue = () => {
    const profile = getDynamicProfile(state);
    dispatch({ type: 'SET_AADHAAR_DATA', payload: profile.aadhaar });
    nextStep();
  };
  
  return (
    <div className="screen">
      <ProgressBar />
      
      {kycState === 'input' && (
        <div className="mt-6 w-full">
          <h2 className="heading-lg">Aadhaar eKYC</h2>
          <p className="text-body text-muted mt-2 mb-6">Enter your 12-digit Aadhaar number.</p>
          
          <div className="form-group mb-6">
            <input 
              type="text" 
              value={aadhaar} 
              onChange={handleAadhaarChange}
              className="form-input text-center text-lg tracking-widest" 
              placeholder="XXXX XXXX XXXX"
            />
          </div>
          
          <button 
            onClick={handleSendOtp} 
            disabled={!isAadhaarValid} 
            className="btn btn-primary btn-block"
          >
            Send OTP
          </button>
        </div>
      )}
      
      {kycState === 'otp' && (
        <div className="mt-6 text-center w-full">
          <h2 className="heading-lg">Enter OTP</h2>
          <p className="text-body text-muted mt-2 mb-6">
            OTP sent to your Aadhaar linked mobile number ending in {aadhaar.replace(/\s/g, '').slice(-4)}.
          </p>
          
          <div className="otp-container mb-6 flex-center gap-2">
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
              />
            ))}
          </div>
          
          <button 
            onClick={handleVerifyOtp} 
            disabled={!isOtpComplete} 
            className="btn btn-primary btn-block"
          >
            Verify OTP
          </button>
        </div>
      )}
      
      {kycState === 'verifying' && (
        <div className="mt-6 flex-col flex-center text-center h-64 w-full">
          <div className="loading-spinner mb-4 w-12 h-12 border-4 border-t-blue-500 rounded-full animate-spin"></div>
          <p className="text-lg">Verifying with UIDAI...</p>
        </div>
      )}
      
      {kycState === 'success' && (
        <div className="mt-6 text-center w-full">
          <div className="status-icon status-icon-success mx-auto mb-4" style={{ animation: 'scaleIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)' }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '40px', height: '40px', color: 'var(--success)' }}>
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
          <h2 className="heading-lg mb-4">Identity Verified!</h2>
          
          <div className="card text-left mb-6 bg-slate-50 p-4 rounded-lg">
            {(() => {
              const p = getDynamicProfile(state);
              return (
                <>
                  <p className="text-sm font-semibold mb-1">Name: {p.aadhaar.name}</p>
                  <p className="text-sm mb-1">DOB: {p.aadhaar.dob}</p>
                  <p className="text-xs text-muted">Address: {p.aadhaar.address.substring(0, 30)}...</p>
                </>
              );
            })()}
          </div>
          
          <button onClick={handleContinue} className="btn btn-primary btn-block">
            Continue
          </button>
        </div>
      )}
    </div>
  );
}
