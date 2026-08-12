import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLoan } from '../context/LoanContext';
import { useApplications, deriveStatusFromLoanState, extractAppDataFromLoanState } from '../context/ApplicationsContext';
import ProfileSwitcher from '../components/ProfileSwitcher';
import Landing from './Landing';
import MobileConsent from './MobileConsent';
import AadhaarKYC from './AadhaarKYC';
import DigiLocker from './DigiLocker';
import Employment from './Employment';
import CreditAssessment from './CreditAssessment';
import Decision from './Decision';
import Agreement from './Agreement';
import Disbursement from './Disbursement';
import Dashboard from './Dashboard';
import PANInput from './PANInput';
import CIBILEvaluation from './CIBILEvaluation';

const SCREENS = {
  1: MobileConsent, 2: Employment, 3: Landing, 4: PANInput,
  5: CIBILEvaluation, 6: DigiLocker, 7: CreditAssessment, 
  8: Decision, 9: AadhaarKYC, 10: Agreement, 11: Disbursement, 12: Dashboard
};

export default function BorrowerFlow() {
  const { state, prevStep } = useLoan();
  const { syncApplication, resetCurrentApp } = useApplications();
  const navigate = useNavigate();
  const prevStepRef = useRef(0);

  // ---- Live application tracking ----
  // Reset the current app tracker when the user is at step 1 (fresh start)
  useEffect(() => {
    if (state.currentStep === 1) {
      resetCurrentApp();
    }
  }, [state.currentStep, resetCurrentApp]);

  // Sync to ApplicationsContext whenever a milestone is hit
  useEffect(() => {
    if (state.currentStep >= 2) {
      const status = deriveStatusFromLoanState(state);
      const data = extractAppDataFromLoanState(state);
      syncApplication(status, data);
    }
    prevStepRef.current = state.currentStep;
  }, [
    state.currentStep,
    state.mobile,
    state.aadhaarVerified,
    state.digiLockerPulled,
    state.creditResult,
    state.agreementSigned,
    state.disbursement,
    syncApplication,
  ]);

  const Screen = SCREENS[state.currentStep] || Landing;

  return (
    <div className="borrower-desktop-frame video-bg-container">
      {/* Ambient background video */}
      <video className="bg-video" autoPlay loop muted playsInline>
        <source src="https://cdn.coverr.co/videos/coverr-dark-abstract-background-2721/1080p.mp4" type="video/mp4" />
        <source src="https://assets.codepen.io/3364143/7btrrd.mp4" type="video/mp4" />
      </video>
      <div className="bg-video-overlay" />

      <div className="borrower-desktop-card">
        {/* Desktop side panel (hidden on mobile via CSS) */}
      <div className="borrower-side-panel">
        <div className="side-panel-inner">
          <h1 className="side-panel-logo font-logo">White<span>Quest</span></h1>
          <p className="side-panel-tagline">Educational loans, reimagined.</p>

          <div className="side-panel-features">
            <div className="side-panel-feature">
              <div className="side-panel-feature-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
              </div>
              <div>
                <div style={{ fontWeight: 500, color: 'var(--text-primary)', marginBottom: 2 }}>Aadhaar eKYC</div>
                <div style={{ fontSize: '12px' }}>Digital identity verification in seconds</div>
              </div>
            </div>
            <div className="side-panel-feature">
              <div className="side-panel-feature-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
              </div>
              <div>
                <div style={{ fontWeight: 500, color: 'var(--text-primary)', marginBottom: 2 }}>Instant Credit Decision</div>
                <div style={{ fontSize: '12px' }}>AI-powered risk assessment engine</div>
              </div>
            </div>
            <div className="side-panel-feature">
              <div className="side-panel-feature-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
              </div>
              <div>
                <div style={{ fontWeight: 500, color: 'var(--text-primary)', marginBottom: 2 }}>UPI Disbursement</div>
                <div style={{ fontSize: '12px' }}>Money in your account instantly</div>
              </div>
            </div>
            <div className="side-panel-feature">
              <div className="side-panel-feature-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
              </div>
              <div>
                <div style={{ fontWeight: 500, color: 'var(--text-primary)', marginBottom: 2 }}>Digital Agreement</div>
                <div style={{ fontSize: '12px' }}>Paperless e-sign and e-mandate</div>
              </div>
            </div>
          </div>
        </div>
        
        <button 
          className="btn btn-primary text-base shadow-lg" 
          onClick={() => navigate('/')}
          style={{ padding: '14px 24px', marginTop: 'auto', alignSelf: 'flex-start' }}
        >
          ← Back to Home
        </button>
      </div>

      {/* The actual borrower flow */}
      <div className="borrower-flow-container">
        <div className="app-shell" style={{ position: 'relative' }}>
          <Screen key={state.currentStep} />
          <ProfileSwitcher />
        </div>
      </div>
      </div>
    </div>
  );
}
