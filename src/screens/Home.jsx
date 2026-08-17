import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLoan } from '../context/LoanContext';

export default function Home() {
  const navigate = useNavigate();
  const { reset } = useLoan();

  const [showDemoModal, setShowDemoModal] = useState(false);
  const [modalStep, setModalStep] = useState('choose'); // 'choose' | 'new' | 'returning'

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
        <div className="modal-backdrop" onClick={() => { setShowDemoModal(false); setModalStep('choose'); }} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 100 }}>
          <div className="card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '700px', width: '95%', padding: '2.5rem', animation: 'fadeSlideUp 0.3s ease' }}>
            
            {/* STEP 1: Choose New or Registered */}
            {modalStep === 'choose' && (
              <>
                <h2 className="heading-xl mb-3 text-center">Welcome to WhiteQuest</h2>
                <p className="text-body text-muted text-center mb-8" style={{ fontSize: '1.1rem' }}>How would you like to proceed?</p>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div 
                    className="card"
                    onClick={() => setModalStep('new')}
                    style={{ cursor: 'pointer', padding: '2rem', textAlign: 'center', border: '1px solid var(--border)', transition: 'all 0.2s ease', background: 'var(--bg-secondary)' }}
                    onMouseEnter={e => { e.currentTarget.style.border = '1px solid var(--text-primary)'; e.currentTarget.style.background = 'var(--bg-tertiary)'; }}
                    onMouseLeave={e => { e.currentTarget.style.border = '1px solid var(--border)'; e.currentTarget.style.background = 'var(--bg-secondary)'; }}
                  >
                    <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', border: '1px solid var(--border-light)' }}>
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--text-primary)' }}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="12" y1="18" x2="12" y2="12"></line><line x1="9" y1="15" x2="15" y2="15"></line></svg>
                    </div>
                    <h3 className="heading-sm mb-1 text-white">New User</h3>
                    <p className="text-xs text-muted">First time applying for a loan</p>
                  </div>

                  <div 
                    className="card"
                    onClick={() => setModalStep('returning')}
                    style={{ cursor: 'pointer', padding: '2rem', textAlign: 'center', border: '1px solid var(--border)', transition: 'all 0.2s ease', background: 'var(--bg-secondary)' }}
                    onMouseEnter={e => { e.currentTarget.style.border = '1px solid var(--text-primary)'; e.currentTarget.style.background = 'var(--bg-tertiary)'; }}
                    onMouseLeave={e => { e.currentTarget.style.border = '1px solid var(--border)'; e.currentTarget.style.background = 'var(--bg-secondary)'; }}
                  >
                    <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', border: '1px solid var(--border-light)' }}>
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--text-primary)' }}><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><polyline points="17 11 19 13 23 9"></polyline></svg>
                    </div>
                    <h3 className="heading-sm mb-1 text-white">Registered User</h3>
                    <p className="text-xs text-muted">Already have an account with us</p>
                  </div>
                </div>
              </>
            )}

            {/* STEP 2a: New User — Show 3 demo profiles */}
            {modalStep === 'new' && (
              <>
                <button className="text-xs text-muted mb-4" onClick={() => setModalStep('choose')} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
                  Back
                </button>
                <h2 className="heading-xl mb-3 text-center">Select Demo Scenario</h2>
                <p className="text-body text-muted text-center mb-8" style={{ fontSize: '1.1rem' }}>Choose a borrower profile to test different flow branches.</p>
                
                <div className="flex flex-col gap-4">
                  <button className="btn btn-secondary text-left flex flex-col items-start p-5 h-auto" onClick={() => startDemo('A')} style={{ overflow: 'hidden' }}>
                    <div className="flex flex-between w-full mb-1">
                      <span className="font-semibold text-white flex gap-2 items-center">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
                        Robert — Prime Customer
                      </span>
                      <span className="badge badge-neutral border border-border text-muted bg-opacity-10">CIBIL 782</span>
                    </div>
                    <span className="text-xs text-muted font-normal text-left w-full" style={{ whiteSpace: 'normal', wordWrap: 'break-word', lineHeight: '1.4' }}>Fast-track approval. Bypasses bank statement upload completely.</span>
                  </button>

                  <button className="btn btn-secondary text-left flex flex-col items-start p-5 h-auto" onClick={() => startDemo('B')} style={{ overflow: 'hidden' }}>
                    <div className="flex flex-between w-full mb-1">
                      <span className="font-semibold text-white flex gap-2 items-center">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="20" width="20" height="2"></rect><rect x="4" y="10" width="4" height="10"></rect><rect x="16" y="10" width="4" height="10"></rect><polygon points="12 4 2 10 22 10 12 4"></polygon></svg>
                        Chris — Near-Prime Customer
                      </span>
                      <span className="badge badge-neutral border border-border text-muted bg-opacity-10">CIBIL 710</span>
                    </div>
                    <span className="text-xs text-muted font-normal text-left w-full" style={{ whiteSpace: 'normal', wordWrap: 'break-word', lineHeight: '1.4' }}>Requires bank statement verification, but gets approved based on income.</span>
                  </button>

                  <button className="btn btn-secondary text-left flex flex-col items-start p-5 h-auto" onClick={() => startDemo('C')} style={{ overflow: 'hidden' }}>
                    <div className="flex flex-between w-full mb-1">
                      <span className="font-semibold text-white flex gap-2 items-center">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                        Benedict — Sub-Prime Customer
                      </span>
                      <span className="badge badge-neutral border border-border text-muted bg-opacity-10">CIBIL 650</span>
                    </div>
                    <span className="text-xs text-muted font-normal text-left w-full" style={{ whiteSpace: 'normal', wordWrap: 'break-word', lineHeight: '1.4' }}>Requires bank statement verification. Rejected due to high DTI ratio.</span>
                  </button>
                </div>
              </>
            )}

            {/* STEP 2b: Registered User — Show Mark's 2 demo scenarios */}
            {modalStep === 'returning' && (
              <>
                <button className="text-xs text-muted mb-4" onClick={() => setModalStep('choose')} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
                  Back
                </button>
                <h2 className="heading-xl mb-3 text-center">Returning User: Mark Taylor</h2>
                <p className="text-body text-muted text-center mb-8" style={{ fontSize: '1.1rem' }}>Select a demo scenario for the registered user flow.</p>
                
                <div className="flex flex-col gap-4">
                  <button className="btn btn-secondary text-left flex flex-col items-start p-5 h-auto" onClick={() => startDemo('F')} style={{ overflow: 'hidden' }}>
                    <div className="flex flex-between w-full mb-1">
                      <span className="font-semibold text-white flex gap-2 items-center">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                        Mark — No Existing Loan
                      </span>
                      <span className="badge badge-neutral border border-border text-muted bg-opacity-10">CIBIL 760</span>
                    </div>
                    <span className="text-xs text-muted font-normal text-left w-full" style={{ whiteSpace: 'normal', wordWrap: 'break-word', lineHeight: '1.4' }}>Previously registered user with no active loans. Skips KYC and applies for a fresh loan directly.</span>
                  </button>

                  <button className="btn btn-secondary text-left flex flex-col items-start p-5 h-auto" onClick={() => startDemo('F_LOAN')} style={{ overflow: 'hidden' }}>
                    <div className="flex flex-between w-full mb-1">
                      <span className="font-semibold text-white flex gap-2 items-center">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"></rect><path d="M2 10h20"></path></svg>
                        Mark — Has Active Loan (₹3L)
                      </span>
                      <span className="badge badge-neutral border border-border text-muted bg-opacity-10">TOP-UP</span>
                    </div>
                    <span className="text-xs text-muted font-normal text-left w-full" style={{ whiteSpace: 'normal', wordWrap: 'break-word', lineHeight: '1.4' }}>Has an active ₹3,00,000 loan with 4 EMIs paid. Views existing loan summary, then applies for a top-up loan.</span>
                  </button>
                </div>
              </>
            )}

          </div>
        </div>
      )}
    </div>
  );
}
