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
  
  const isMobileValid = mobile.length === 10 && /^\d+$/.test(mobile);
  const allConsentsChecked = consents.credit && consents.digilocker && consents.terms;
  
  const handleContinue = () => {
    dispatch({ type: 'SET_MOBILE', mobile });
    dispatch({ type: 'ADD_CONSENT', payload: { type: 'credit_bureau', text: 'I authorize WhiteQuest to pull my credit report from CIBIL/Experian for the purpose of evaluating this loan application.', status: 'granted' } });
    dispatch({ type: 'ADD_CONSENT', payload: { type: 'digilocker', text: 'I authorize WhiteQuest to access my Aadhaar and PAN details via DigiLocker for digital KYC verification.', status: 'granted' } });
    dispatch({ type: 'ADD_CONSENT', payload: { type: 'terms', text: 'I have read and agree to the Terms of Service and Privacy Policy.', status: 'granted' } });
    nextStep();
  };
  
  return (
    <div className="screen">
      <ProgressBar />
      <div className="mt-6 w-full">
        <h2 className="heading-lg">Verify your identity</h2>
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
            style={{ paddingLeft: '52px' }}
          />
        </div>
        
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
          onClick={handleContinue} 
          disabled={!isMobileValid || !allConsentsChecked} 
          className="btn btn-primary btn-block"
        >
          Continue
        </button>
        
        <p className="text-xs text-muted text-center mt-4">
          Your data is encrypted and processed as per RBI data protection guidelines.
        </p>
      </div>
    </div>
  );
}
