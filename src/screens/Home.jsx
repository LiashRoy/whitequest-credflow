import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLoan } from '../context/LoanContext';

export default function Home() {
  const navigate = useNavigate();
  const { reset } = useLoan();

  const [showDemoModal, setShowDemoModal] = useState(false);

  const handleApplyClick = () => {
    setShowDemoModal(true);
  };

  const startDemo = (profileId) => {
    reset(profileId); // Set specific profile and clear state
    navigate('/apply');
  };

  return (
    <div className="home-page video-bg-container">
      {/* Ambient background video & glow */}
      <video className="bg-video" autoPlay loop muted playsInline>
        <source src="https://cdn.coverr.co/videos/coverr-dark-abstract-background-2721/1080p.mp4" type="video/mp4" />
        <source src="https://assets.codepen.io/3364143/7btrrd.mp4" type="video/mp4" />
      </video>
      <div className="bg-video-overlay" />
      
      <div className="home-glow home-glow-1" />
      <div className="home-glow home-glow-2" />

      <div className="home-content">
        {/* Brand */}
        <div className="home-brand">
          <div className="home-logo-mark">
            <svg width="84" height="84" viewBox="0 0 48 48" fill="none">
              <rect width="48" height="48" rx="14" fill="url(#logo-grad)" />
              <path d="M24 12L34 20L24 36L14 20L24 12Z" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M14 20L34 20" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"/>
              <path d="M24 12V36" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"/>
              <defs>
                <linearGradient id="logo-grad" x1="0" y1="0" x2="48" y2="48">
                  <stop stopColor="#333333" />
                  <stop offset="1" stopColor="#000000" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <h1 className="home-title font-logo">White<span>Quest</span></h1>
          <p className="home-tagline">Educational loans, reimagined.</p>
        </div>

        {/* Trust badges */}
        <div className="home-trust">
          <div className="home-trust-item">
            <span className="home-trust-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>
            </span>
            <span>100% Digital</span>
          </div>
          <div className="home-trust-item">
            <span className="home-trust-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="20" width="20" height="2"/><rect x="4" y="10" width="4" height="10"/><rect x="16" y="10" width="4" height="10"/><path d="M12 10v10"/><path d="M2 10l10-8 10 8z"/></svg>
            </span>
            <span>RBI-Compliant</span>
          </div>
          <div className="home-trust-item">
            <span className="home-trust-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
            </span>
            <span>Instant Decision</span>
          </div>
          <div className="home-trust-item">
            <span className="home-trust-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
            </span>
            <span>No Paperwork</span>
          </div>
        </div>

        {/* Portal cards */}
        <div className="home-cards">
          <div className="home-card home-card-borrower" onClick={handleApplyClick}>
            <div className="home-card-icon-wrap home-card-icon-teal">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="5" width="20" height="14" rx="2" />
                <path d="M2 10h20" />
              </svg>
            </div>
            <h2 className="home-card-title">Apply for a Loan</h2>
            <p className="home-card-desc">
              Get up to ₹20,00,000 with instant digital KYC, real-time credit assessment, and same-day UPI disbursement.
            </p>
            <div className="home-card-cta">
              Start Application
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </div>
          </div>

          <div className="home-card home-card-admin" onClick={() => navigate('/admin')}>
            <div className="home-card-icon-wrap home-card-icon-amber">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z" />
              </svg>
            </div>
            <h2 className="home-card-title">Lender / Admin</h2>
            <p className="home-card-desc">
              View live applications, portfolio analytics, risk distribution, and compliance audit trail.
            </p>
            <div className="home-card-cta">
              Admin Login
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>
        
        <div style={{ textAlign: 'center', marginTop: '2.5rem', marginBottom: '1rem' }}>
          <p className="text-xs text-muted" style={{ opacity: 0.6 }}>
            Loans powered by our RBI-registered NBFC partner:<br/>
            <strong>Apex Financial Services Ltd.</strong>
          </p>
        </div>
      </div>

      {showDemoModal && (
        <div className="modal-backdrop" onClick={() => setShowDemoModal(false)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 100 }}>
          <div className="card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '700px', width: '95%', padding: '2.5rem', animation: 'fadeSlideUp 0.3s ease' }}>
            <h2 className="heading-xl mb-3 text-center">Select Demo Scenario</h2>
            <p className="text-body text-muted text-center mb-8" style={{ fontSize: '1.1rem' }}>Choose a borrower profile to test different flow branches.</p>
            
            <div className="flex flex-col gap-4">
              <button className="btn btn-secondary text-left flex flex-col items-start p-5 h-auto" onClick={() => startDemo('A')}>
                <div className="flex flex-between w-full mb-1">
                  <span className="font-semibold text-white flex gap-2 items-center">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
                    Prime Customer
                  </span>
                  <span className="badge badge-neutral border border-border text-muted bg-opacity-10">CIBIL 782</span>
                </div>
                <span className="text-xs text-muted font-normal text-left">Fast-track approval. Bypasses bank statement upload completely.</span>
              </button>

              <button className="btn btn-secondary text-left flex flex-col items-start p-5 h-auto" onClick={() => startDemo('B')}>
                <div className="flex flex-between w-full mb-1">
                  <span className="font-semibold text-white flex gap-2 items-center">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="20" width="20" height="2"></rect><rect x="4" y="10" width="4" height="10"></rect><rect x="16" y="10" width="4" height="10"></rect><polygon points="12 4 2 10 22 10 12 4"></polygon></svg>
                    Near-Prime Customer
                  </span>
                  <span className="badge badge-neutral border border-border text-muted bg-opacity-10">CIBIL 710</span>
                </div>
                <span className="text-xs text-muted font-normal text-left">Requires bank statement verification, but gets approved based on income.</span>
              </button>

              <button className="btn btn-secondary text-left flex flex-col items-start p-5 h-auto" onClick={() => startDemo('C')}>
                <div className="flex flex-between w-full mb-1">
                  <span className="font-semibold text-white flex gap-2 items-center">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                    Sub-Prime Customer
                  </span>
                  <span className="badge badge-neutral border border-border text-muted bg-opacity-10">CIBIL 650</span>
                </div>
                <span className="text-xs text-muted font-normal text-left">Requires bank statement verification. Rejected due to high DTI ratio.</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
