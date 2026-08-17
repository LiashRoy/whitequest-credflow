import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLoan } from '../context/LoanContext';
import ProgressBar from '../components/ProgressBar';
import { formatINR, generateSchedule, totalInterest } from '../engine/creditEngine';

export default function Dashboard() {
  const { state, dispatch, reset } = useLoan();
  const navigate = useNavigate();
  const { creditResult, loanId, disbursement, existingLoanData } = state;
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'schedule' | 'details'
  
  // Generate schedule for existing loan (if any)
  let existingSchedule = [];
  if (existingLoanData) {
    existingSchedule = generateSchedule(
      existingLoanData.approvedAmount, 
      existingLoanData.interestRate, 
      existingLoanData.tenure
    ).map(item => ({
      ...item,
      loanName: 'Existing Top-Up',
      status: item.emiNumber <= existingLoanData.emiPaid ? 'Paid' : 'Upcoming'
    }));
  }

  // Generate schedule for new loan
  const newSchedule = creditResult ? generateSchedule(
    creditResult.approvedAmount, 
    creditResult.interestRate, 
    creditResult.tenure
  ).map(item => ({
    ...item,
    loanName: existingLoanData ? 'New Loan' : 'Loan'
  })) : [];

  const schedule = [...existingSchedule, ...newSchedule];

  const paidCount = schedule.filter(s => s.status === 'Paid').length;
  const upcomingCount = schedule.filter(s => s.status === 'Upcoming').length;
  const totalEMIs = schedule.length;
  const paidAmount = schedule.filter(s => s.status === 'Paid').reduce((sum, s) => sum + s.amount, 0);
  const remainingAmount = schedule.filter(s => s.status === 'Upcoming').reduce((sum, s) => sum + s.amount, 0);
  const totalPayable = paidAmount + remainingAmount;
  
  // Total interest combines both if existing is present
  const newLoanInt = creditResult ? totalInterest(creditResult.approvedAmount, creditResult.interestRate, creditResult.tenure) : 0;
  const existingLoanInt = existingLoanData ? totalInterest(existingLoanData.approvedAmount, existingLoanData.interestRate, existingLoanData.tenure) : 0;
  const totalInt = newLoanInt + existingLoanInt;
  
  const progressPercent = totalEMIs > 0 ? Math.round((paidCount / totalEMIs) * 100) : 0;

  // Next upcoming EMI
  const nextEMI = schedule.find(s => s.status === 'Upcoming');

  return (
    <div className="screen">
      <ProgressBar />
      
      <div className="screen-header mt-4 mb-4">
        <h1 className="heading-xl">Loan Dashboard</h1>
        <p className="text-sm text-muted mt-1">Track your repayment progress</p>
      </div>

      <div className="screen-center flex-col gap-4">
        
        {/* Loan ID & Status Header - Always Visible */}
        <div className="card card-accent" style={{ padding: '1.25rem 1.5rem', marginBottom: '8px' }}>
          <div className="flex-between">
            <div>
              <p className="text-xs text-muted mb-1">Loan ID</p>
              <p className="font-semibold text-sm">{loanId || existingLoanData?.loanId || 'CF-XXXX-XXXX'}</p>
            </div>
            <div className={`badge ${remainingAmount === 0 && totalEMIs > 0 ? 'badge-secondary' : 'badge-success'}`} style={{ alignSelf: 'flex-start' }}>
              {remainingAmount === 0 && totalEMIs > 0 ? 'CLEARED' : 'ACTIVE'}
            </div>
          </div>
        </div>

        {/* Custom Tab Navigation */}
        <div style={{ display: 'flex', gap: '8px', padding: '4px', background: 'var(--bg-secondary)', borderRadius: '8px', border: '1px solid var(--border)' }}>
          <button 
            style={{ flex: 1, padding: '10px', borderRadius: '6px', fontSize: '13px', fontWeight: 600, background: activeTab === 'overview' ? 'var(--accent)' : 'transparent', color: activeTab === 'overview' ? '#000' : 'var(--text-muted)', transition: 'all 0.2s', border: 'none', cursor: 'pointer' }}
            onClick={() => setActiveTab('overview')}
          >Overview</button>
          <button 
            style={{ flex: 1, padding: '10px', borderRadius: '6px', fontSize: '13px', fontWeight: 600, background: activeTab === 'schedule' ? 'var(--accent)' : 'transparent', color: activeTab === 'schedule' ? '#000' : 'var(--text-muted)', transition: 'all 0.2s', border: 'none', cursor: 'pointer' }}
            onClick={() => setActiveTab('schedule')}
          >Schedule</button>
          <button 
            style={{ flex: 1, padding: '10px', borderRadius: '6px', fontSize: '13px', fontWeight: 600, background: activeTab === 'details' ? 'var(--accent)' : 'transparent', color: activeTab === 'details' ? '#000' : 'var(--text-muted)', transition: 'all 0.2s', border: 'none', cursor: 'pointer' }}
            onClick={() => setActiveTab('details')}
          >Details</button>
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="animate-fadeSlideUp flex-col gap-4" style={{ display: 'flex' }}>
            
            {/* Progress Overview Card */}
            <div className="card bg-secondary" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                {/* Circular Progress */}
                <div style={{ position: 'relative', width: '90px', height: '90px', flexShrink: 0 }}>
                  <svg viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)', width: '100%', height: '100%' }}>
                    <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="8" />
                    <circle 
                      cx="50" cy="50" r="42" fill="none" 
                      stroke="var(--accent)" strokeWidth="8" 
                      strokeLinecap="round"
                      strokeDasharray={`${2 * Math.PI * 42}`}
                      strokeDashoffset={`${2 * Math.PI * 42 * (1 - progressPercent / 100)}`}
                      style={{ transition: 'stroke-dashoffset 1s ease-out' }}
                    />
                  </svg>
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: '18px', fontWeight: 700, color: 'var(--accent)' }}>{progressPercent}%</span>
                    <span style={{ fontSize: '9px', color: 'var(--text-muted)', marginTop: '2px' }}>PAID</span>
                  </div>
                </div>
                {/* Stats */}
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <div>
                      <p className="text-xs text-muted">EMIs Paid</p>
                      <p className="font-bold" style={{ fontSize: '1.1rem', color: '#10B981' }}>{paidCount} <span className="text-xs text-muted font-normal">of {totalEMIs}</span></p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p className="text-xs text-muted">EMIs Left</p>
                      <p className="font-bold" style={{ fontSize: '1.1rem' }}>{upcomingCount}</p>
                    </div>
                  </div>
                  <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.08)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ width: `${progressPercent}%`, height: '100%', background: 'linear-gradient(90deg, #10B981, var(--accent))', borderRadius: '3px', transition: 'width 1s ease-out' }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Key Financial Summary Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="card bg-secondary" style={{ padding: '1rem 1.2rem' }}>
                <p className="text-xs text-muted mb-1">Loan Amount</p>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <p className="font-bold" style={{ fontSize: '1.2rem' }}>
                    {formatINR((existingLoanData?.approvedAmount || 0) + (creditResult?.approvedAmount || 0))}
                  </p>
                  {existingLoanData && (
                    <p className="text-xs text-muted mt-1" style={{ fontSize: '0.7rem' }}>
                      {formatINR(existingLoanData.approvedAmount)} (Existing) <br/>
                      <span style={{ color: '#10B981' }}>+ {formatINR(creditResult?.approvedAmount || 0)} (Top-up)</span>
                    </p>
                  )}
                </div>
              </div>
              <div className="card bg-secondary" style={{ padding: '1rem 1.2rem' }}>
                <p className="text-xs text-muted mb-1">Interest Rate</p>
                <p className="font-bold" style={{ fontSize: '1rem' }}>{creditResult?.interestRate || 0}% <span className="text-xs text-muted font-normal">p.a.</span></p>
              </div>
            </div>

            {/* Amount Paid vs Remaining */}
            <div className="card bg-secondary" style={{ padding: '1.25rem' }}>
              <div className="flex-between mb-3">
                <p className="text-sm font-semibold">Payment Progress</p>
                <p className="text-xs text-muted">{formatINR(paidAmount)} of {formatINR(totalPayable)}</p>
              </div>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <div style={{ flex: 1, height: '10px', background: 'rgba(255,255,255,0.06)', borderRadius: '5px', overflow: 'hidden' }}>
                  <div style={{ width: `${totalPayable > 0 ? (paidAmount / totalPayable * 100) : 0}%`, height: '100%', background: '#10B981', borderRadius: '5px', transition: 'width 1s ease-out' }} />
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10B981' }} />
                  <span className="text-xs text-muted">Paid: {formatINR(paidAmount)}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'rgba(255,255,255,0.15)' }} />
                  <span className="text-xs text-muted">Remaining: {formatINR(remainingAmount)}</span>
                </div>
              </div>
            </div>

            {/* Next EMI Due */}
            {nextEMI && (
              <div className="card" style={{ padding: '0', border: '1px solid var(--border-accent)', background: 'linear-gradient(145deg, rgba(255,255,255,0.05), rgba(255,255,255,0.01))', overflow: 'hidden' }}>
                <div style={{ padding: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent)', boxShadow: '0 0 10px var(--accent)' }}></div>
                        <p className="text-xs font-semibold text-accent uppercase tracking-wider">Next EMI Due</p>
                      </div>
                      <p className="font-bold" style={{ fontSize: '1.8rem', lineHeight: '1.2' }}>{formatINR(nextEMI.amount)}</p>
                      <p className="text-sm text-muted mt-2" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                        {nextEMI.date}
                      </p>
                    </div>
                  </div>
                </div>
                <div style={{ padding: '0.75rem 1.25rem', background: 'rgba(0,0,0,0.2)', borderTop: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="text-xs font-medium text-muted">Amount Breakup</span>
                  <div style={{ display: 'flex', gap: '16px' }}>
                    <span className="text-xs font-medium"><span className="text-muted">Principal:</span> {formatINR(nextEMI.principal)}</span>
                    <span className="text-xs font-medium"><span className="text-muted">Interest:</span> {formatINR(nextEMI.interest)}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: SCHEDULE */}
        {activeTab === 'schedule' && (
          <div className="animate-fadeSlideUp flex-col gap-4" style={{ display: 'flex' }}>
            <h3 className="heading-sm mb-1 mt-2">Full EMI Schedule</h3>
            <div className="card bg-secondary p-0" style={{ overflow: 'hidden' }}>
              {/* Table Header */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr 0.8fr', padding: '12px 16px', background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.06)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', fontWeight: 600 }}>
                <span>Loan / #</span>
                <span>Due Date</span>
                <span>EMI</span>
                <span>Principal</span>
                <span>Interest</span>
                <span style={{ textAlign: 'right' }}>Status</span>
              </div>
              
              {/* Table Rows - Show ALL rows in this tab */}
              <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                {schedule.map((item, idx) => (
                  <div 
                    key={idx} 
                    style={{ 
                      display: 'grid', 
                      gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr 0.8fr', 
                      padding: '10px 16px', 
                      borderBottom: idx < schedule.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                      fontSize: '12px',
                      opacity: item.status === 'Paid' ? 0.6 : 1,
                      alignItems: 'center'
                    }}
                  >
                    <span className="text-muted flex flex-col">
                      <span style={{ fontSize: '9px', fontWeight: 'bold' }}>{item.loanName}</span>
                      <span>#{item.emiNumber}</span>
                    </span>
                    <span>{item.date}</span>
                    <span className="font-medium">{formatINR(item.amount)}</span>
                    <span>{formatINR(item.principal)}</span>
                    <span className="text-muted">{formatINR(item.interest)}</span>
                    <span style={{ textAlign: 'right' }}>
                      {item.status === 'Paid' ? (
                        <span style={{ color: '#10B981', fontSize: '11px', fontWeight: 600 }}>✓ Paid</span>
                      ) : (
                        <span style={{ color: 'var(--text-muted)', fontSize: '11px' }}>Upcoming</span>
                      )}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: DETAILS */}
        {activeTab === 'details' && (
          <div className="animate-fadeSlideUp flex-col gap-4" style={{ display: 'flex' }}>
            <h3 className="heading-sm mb-1 mt-2">Disbursement Details</h3>
            <div className="card bg-secondary" style={{ padding: '1rem 1.25rem' }}>
              <div className="flex-between mb-3 border-b border-border pb-3">
                <span className="text-xs text-muted">Disbursed On</span>
                <span className="text-sm font-medium">{disbursement?.timestamp ? new Date(disbursement.timestamp).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' }) : 'N/A'}</span>
              </div>
              <div className="flex-between mb-3 border-b border-border pb-3">
                <span className="text-xs text-muted">UTR Reference</span>
                <span className="text-sm font-medium font-mono">{disbursement?.utr || 'N/A'}</span>
              </div>
              <div className="flex-between">
                <span className="text-xs text-muted">Bank Account</span>
                <span className="text-sm font-medium" style={{ textAlign: 'right' }}>{disbursement?.bankAccount || 'N/A'}<br/><span className="text-xs text-muted font-normal">{disbursement?.ifsc || ''}</span></span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '8px' }}>
              <div className="card bg-secondary" style={{ padding: '1rem 1.2rem' }}>
                <p className="text-xs text-muted mb-1">Total Interest</p>
                <p className="font-bold" style={{ fontSize: '1rem', color: '#FBBF24' }}>{formatINR(totalInt)}</p>
              </div>
              <div className="card bg-secondary" style={{ padding: '1rem 1.2rem' }}>
                <p className="text-xs text-muted mb-1">Total Payable</p>
                <p className="font-bold" style={{ fontSize: '1rem' }}>{formatINR(totalPayable)}</p>
              </div>
            </div>

            <div className="card bg-secondary text-center p-4 mt-4 border border-border">
              <h4 className="heading-sm mb-2">Need Help?</h4>
              <p className="text-sm text-muted mb-1">Email: support@whitequest.in</p>
              <p className="text-sm text-muted">Phone: 1800-123-4567</p>
            </div>
            
            <button 
              className="btn btn-secondary btn-block mt-2"
              onClick={() => alert('PDF download will be available shortly')}
            >
              Download Loan Agreement
            </button>
            
            <div style={{ textAlign: 'center', marginTop: '1rem', marginBottom: '1rem' }}>
              <p className="text-xs text-muted" style={{ opacity: 0.6 }}>
                Loans powered by our RBI-registered NBFC partner:<br/>
                <strong>Apex Financial Services Ltd.</strong>
              </p>
            </div>
          </div>
        )}

        {/* Global Action always at bottom */}
        <div style={{ marginTop: '16px' }}>
          {!creditResult ? (
            <button className="btn btn-cta btn-block" onClick={() => dispatch({ type: 'SET_STEP', step: 3 })}>
              Apply for New Loan →
            </button>
          ) : (
            <button className="btn btn-primary btn-block" onClick={() => { reset(); navigate('/'); }}>
              Start New Application
            </button>
          )}
        </div>
      </div>
      <style>{`
        .animate-fadeSlideUp {
          animation: fadeSlideUp 0.3s ease;
        }
        @keyframes fadeSlideUp {
          0% { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
