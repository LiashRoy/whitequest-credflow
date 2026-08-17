import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApplications, aggregateMetrics, getStatusLabel, getStatusBadgeClass } from '../context/ApplicationsContext';
import { formatINR } from '../engine/creditEngine';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { applications, resetToSeed } = useApplications();
  const [activeTab, setActiveTab] = useState('applications');
  const [selectedApp, setSelectedApp] = useState(null);

  const metrics = aggregateMetrics(applications);
  
  // Sort applications by updatedAt descending
  const sortedApps = [...applications].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

  const renderSidebar = () => (
    <div className="admin-sidebar">
      <div className="admin-sidebar-brand" style={{ display: 'block', marginRight: 'var(--sp-4)' }}>
        <h1 className="font-bold text-lg font-logo">White<span>Quest</span> Admin</h1>
      </div>

      <button className={`admin-nav-item ${activeTab === 'applications' ? 'active' : ''}`} onClick={() => setActiveTab('applications')}>
        <span className="admin-nav-icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
        </span>
        <span className="admin-nav-label">Live Applications</span>
      </button>
      <button className={`admin-nav-item ${activeTab === 'pm' ? 'active' : ''}`} onClick={() => setActiveTab('pm')}>
        <span className="admin-nav-icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
        </span>
        <span className="admin-nav-label">PM Analytics</span>
      </button>
      <button className={`admin-nav-item ${activeTab === 'risk' ? 'active' : ''}`} onClick={() => setActiveTab('risk')}>
        <span className="admin-nav-icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
        </span>
        <span className="admin-nav-label">Risk & Underwriting</span>
      </button>
      <button className={`admin-nav-item ${activeTab === 'compliance' ? 'active' : ''}`} onClick={() => setActiveTab('compliance')}>
        <span className="admin-nav-icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 16l3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="M2 16l3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="M7 21h10"/><path d="M12 3v18"/><path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2"/></svg>
        </span>
        <span className="admin-nav-label">Compliance Logs</span>
      </button>

      <div className="admin-nav-divider"></div>
      <button 
        className="btn btn-secondary admin-nav-home" 
        onClick={() => navigate('/')}
      >
        <span className="admin-nav-icon">←</span>
        <span className="admin-nav-label">Back to Home</span>
      </button>
    </div>
  );

  const renderAppDetail = () => {
    if (!selectedApp) return null;
    
    // Reverse status history for timeline display (newest first)
    const history = [...(selectedApp.statusHistory || [])].reverse();
    
    return (
      <div className="app-detail-overlay" onClick={() => setSelectedApp(null)}>
        <div className="app-detail-panel" onClick={e => e.stopPropagation()}>
          <div className="flex-between mb-4">
            <h2 className="heading-lg">Application Details</h2>
            <button className="app-detail-close" onClick={() => setSelectedApp(null)}>×</button>
          </div>
          
          <div className="flex-between mb-6">
            <div>
              <p className="text-xs text-muted">Applicant</p>
              <p className="font-bold text-lg">{selectedApp.applicantName || 'Unknown'}</p>
              <p className="text-sm text-muted">{selectedApp.mobile}</p>
              {selectedApp.employmentData?.email && (
                <p className="text-sm text-muted">{selectedApp.employmentData.email}</p>
              )}
            </div>
            <div className="text-right">
              <p className="text-xs text-muted mb-1">Status</p>
              <span className={getStatusBadgeClass(selectedApp.status)}>{getStatusLabel(selectedApp.status)}</span>
            </div>
          </div>
          
          <div className="admin-dual-col mb-6">
            <div className="card bg-secondary p-4">
              <h4 className="font-semibold text-sm mb-3">Loan Details</h4>
              <div className="flex-between mb-2">
                <span className="text-sm text-muted">Requested</span>
                <span className="text-sm font-medium">{formatINR(selectedApp.loanParams?.amount || 0)}</span>
              </div>
              <div className="flex-between mb-2">
                <span className="text-sm text-muted">Tenure</span>
                <span className="text-sm font-medium">{selectedApp.loanParams?.tenure || 0} mos</span>
              </div>
              {selectedApp.creditResult && (
                <>
                  <div className="flex-between mb-2 mt-2 pt-2 border-t border-gray-100">
                    <span className="text-sm text-muted">Approved</span>
                    <span className="text-sm font-semibold text-accent">{formatINR(selectedApp.creditResult.approvedAmount)}</span>
                  </div>
                  <div className="flex-between mb-2">
                    <span className="text-sm text-muted">Rate</span>
                    <span className="text-sm font-medium">{selectedApp.creditResult.interestRate}%</span>
                  </div>
                </>
              )}
            </div>
            
            <div className="card bg-secondary p-4">
              <h4 className="font-semibold text-sm mb-3">Underwriting</h4>
              {selectedApp.creditResult ? (
                <>
                  <div className="flex-between mb-2">
                    <span className="text-sm text-muted">Credit Score</span>
                    <span className="text-sm font-medium">{selectedApp.creditResult.creditScore || 'N/A'}</span>
                  </div>
                  <div className="flex-between mb-2">
                    <span className="text-sm text-muted">DTI Ratio</span>
                    <span className="text-sm font-medium">{selectedApp.creditResult.dti ? `${selectedApp.creditResult.dti}%` : 'N/A'}</span>
                  </div>
                  <div className="flex-between mb-2">
                    <span className="text-sm text-muted">Decision</span>
                    <span className="text-sm font-medium">{selectedApp.creditResult.decision}</span>
                  </div>
                  {selectedApp.creditResult.reason && (
                    <p className="text-xs text-warning mt-2 pt-2 border-t border-gray-100 line-clamp-2">
                      {selectedApp.creditResult.reason}
                    </p>
                  )}
                </>
              ) : (
                <div className="text-center text-sm text-muted py-4">Pending assessment</div>
              )}
            </div>
          </div>
          
          <h4 className="font-semibold text-sm mb-2">Timeline</h4>
          <div className="status-timeline">
            {history.map((h, i) => (
              <div key={i} className={`timeline-item ${i === 0 ? 'current' : 'done'}`}>
                <div className="timeline-item-status">{getStatusLabel(h.status)}</div>
                <div className="timeline-item-time">{new Date(h.timestamp).toLocaleString()}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderApplicationsTable = () => (
    <div>
      <div className="admin-content-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-4)' }}>
          <h2>Live Applications</h2>
          <div className="badge badge-info bg-opacity-20 text-info">
            {sortedApps.length} Total
          </div>
        </div>
        <button 
          className="btn btn-secondary" 
          style={{ padding: 'var(--sp-2) var(--sp-4)', fontSize: 'var(--fs-xs)', borderColor: 'var(--error)', color: 'var(--error)' }}
          onClick={() => {
            if (window.confirm('Delete all new applications and restore the original seed data?')) {
              resetToSeed();
              setSelectedApp(null);
            }
          }}
        >
          Reset Demo Data
        </button>
      </div>

      <div className="card p-0 overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border text-xs text-muted uppercase tracking-wider bg-secondary">
              <th className="p-4 font-medium">Applicant</th>
              <th className="p-4 font-medium">Requested</th>
              <th className="p-4 font-medium">Status</th>
              <th className="p-4 font-medium">Updated</th>
            </tr>
          </thead>
          <tbody>
            {sortedApps.map((app) => (
              <tr 
                key={app.id} 
                className={`border-b border-border last:border-0 app-row-clickable ${!app.id.includes('HIST') ? 'app-row-live' : ''}`}
                onClick={() => setSelectedApp(app)}
              >
                <td className="p-4">
                  <div className="font-medium text-sm">{app.applicantName || 'Anonymous User'}</div>
                  <div className="text-xs text-muted">{app.mobile || 'No mobile'}</div>
                </td>
                <td className="p-4">
                  <div className="font-medium text-sm">{formatINR(app.loanParams?.amount || 0)}</div>
                  <div className="text-xs text-muted">{app.loanParams?.tenure || 0} months</div>
                </td>
                <td className="p-4">
                  <span className={getStatusBadgeClass(app.status)} style={{ fontSize: '11px', padding: '2px 6px' }}>
                    {getStatusLabel(app.status)}
                  </span>
                </td>
                <td className="p-4 text-sm text-muted whitespace-nowrap">
                  {new Date(app.updatedAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </td>
              </tr>
            ))}
            {sortedApps.length === 0 && (
              <tr>
                <td colSpan="4" className="p-8 text-center text-muted">No applications found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderPMTab = () => {
    const conversionRate = metrics.total > 0 ? Math.round((metrics.approved / metrics.total) * 100) : 0;
    
    return (
      <div className="animate-fadeSlideUp">
        <div className="admin-content-header">
          <h2>PM Analytics</h2>
          <span className="text-sm text-muted">Funnel & Conversion</span>
        </div>
        
        <div className="admin-stats-grid">
          <div className="card text-center">
            <p className="text-sm text-muted mb-2">Total Starts</p>
            <p className="heading-lg text-accent">{metrics.total}</p>
          </div>
          <div className="card text-center">
            <p className="text-sm text-muted mb-2">KYC Completed</p>
            <p className="heading-lg">{metrics.kycDone}</p>
            <p className="text-xs text-muted mt-1">{metrics.total > 0 ? Math.round(metrics.kycDone/metrics.total*100) : 0}% of starts</p>
          </div>
          <div className="card text-center">
            <p className="text-sm text-muted mb-2">Approved</p>
            <p className="heading-lg text-success">{metrics.approved}</p>
            <p className="text-xs text-muted mt-1">{conversionRate}% conversion</p>
          </div>
          <div className="card text-center">
            <p className="text-sm text-muted mb-2">Disbursed Volume</p>
            <p className="heading-md mt-1">{formatINR(metrics.totalDisbursedAmt)}</p>
            <p className="text-xs text-success mt-1">{metrics.disbursed} loans</p>
          </div>
        </div>

        <div className="card mt-6" style={{ background: 'linear-gradient(145deg, var(--bg-card), var(--bg-tertiary))', border: '1px solid var(--border-light)', boxShadow: '0 8px 32px rgba(0,0,0,0.2)' }}>
          <h3 className="heading-sm mb-5" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--accent)' }}><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>
            Application Funnel Drop-off
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* Started */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 'var(--fs-sm)' }}>
              <div style={{ width: '130px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(59, 130, 246, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#60A5FA' }}>▶</div>
                <span style={{ fontWeight: '500' }}>Started</span>
              </div>
              <div style={{ flex: 1, margin: '0 20px', background: 'var(--bg-secondary)', height: '10px', borderRadius: '5px', overflow: 'hidden' }}>
                <div style={{ width: '100%', height: '100%', background: 'linear-gradient(90deg, #3B82F6, #60A5FA)', borderRadius: '5px', transition: 'width 1s ease-out' }}></div>
              </div>
              <div style={{ width: '40px', textAlign: 'right', fontWeight: '700', fontSize: 'var(--fs-md)' }}>{metrics.total}</div>
            </div>

            {/* KYC Verified */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 'var(--fs-sm)' }}>
              <div style={{ width: '130px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(52, 211, 153, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#34D399' }}>🛡</div>
                <span style={{ fontWeight: '500' }}>KYC Verified</span>
              </div>
              <div style={{ flex: 1, margin: '0 20px', background: 'var(--bg-secondary)', height: '10px', borderRadius: '5px', overflow: 'hidden' }}>
                <div style={{ width: `${metrics.total > 0 ? (metrics.kycDone/metrics.total)*100 : 0}%`, height: '100%', background: 'linear-gradient(90deg, #10B981, #34D399)', borderRadius: '5px', transition: 'width 1s ease-out' }}></div>
              </div>
              <div style={{ width: '40px', textAlign: 'right', fontWeight: '700', fontSize: 'var(--fs-md)' }}>{metrics.kycDone}</div>
            </div>

            {/* Assessed */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 'var(--fs-sm)' }}>
              <div style={{ width: '130px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(251, 191, 36, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FBBF24' }}>⚡</div>
                <span style={{ fontWeight: '500' }}>Assessed</span>
              </div>
              <div style={{ flex: 1, margin: '0 20px', background: 'var(--bg-secondary)', height: '10px', borderRadius: '5px', overflow: 'hidden' }}>
                <div style={{ width: `${metrics.total > 0 ? (metrics.assessed/metrics.total)*100 : 0}%`, height: '100%', background: 'linear-gradient(90deg, #F59E0B, #FBBF24)', borderRadius: '5px', transition: 'width 1s ease-out' }}></div>
              </div>
              <div style={{ width: '40px', textAlign: 'right', fontWeight: '700', fontSize: 'var(--fs-md)' }}>{metrics.assessed}</div>
            </div>

            {/* Approved */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 'var(--fs-sm)' }}>
              <div style={{ width: '130px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10B981' }}>✓</div>
                <span style={{ fontWeight: '500' }}>Approved</span>
              </div>
              <div style={{ flex: 1, margin: '0 20px', background: 'var(--bg-secondary)', height: '10px', borderRadius: '5px', overflow: 'hidden' }}>
                <div style={{ width: `${metrics.total > 0 ? (metrics.approved/metrics.total)*100 : 0}%`, height: '100%', background: 'linear-gradient(90deg, #059669, #10B981)', borderRadius: '5px', transition: 'width 1s ease-out' }}></div>
              </div>
              <div style={{ width: '40px', textAlign: 'right', fontWeight: '700', fontSize: 'var(--fs-md)' }}>{metrics.approved}</div>
            </div>

            {/* Disbursed */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 'var(--fs-sm)' }}>
              <div style={{ width: '130px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(5, 150, 105, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#059669' }}>💸</div>
                <span style={{ fontWeight: '500' }}>Disbursed</span>
              </div>
              <div style={{ flex: 1, margin: '0 20px', background: 'var(--bg-secondary)', height: '10px', borderRadius: '5px', overflow: 'hidden' }}>
                <div style={{ width: `${metrics.total > 0 ? (metrics.disbursed/metrics.total)*100 : 0}%`, height: '100%', background: 'linear-gradient(90deg, #047857, #059669)', borderRadius: '5px', transition: 'width 1s ease-out' }}></div>
              </div>
              <div style={{ width: '40px', textAlign: 'right', fontWeight: '700', fontSize: 'var(--fs-md)' }}>{metrics.disbursed}</div>
            </div>

          </div>
        </div>
      </div>
    );
  };

  const renderRiskTab = () => (
    <div className="animate-fadeSlideUp">
      <div className="admin-content-header">
        <h2>Risk & Underwriting</h2>
        <span className="text-sm text-muted">Portfolio Quality</span>
      </div>

      <div className="admin-stats-grid">
        <div className="card text-center">
          <p className="text-sm text-muted mb-2">Avg Ticket Size</p>
          <p className="heading-md">{formatINR(metrics.avgTicket)}</p>
        </div>
        <div className="card text-center">
          <p className="text-sm text-muted mb-2">Avg Credit Score</p>
          <p className="heading-md">{metrics.avgScore}</p>
        </div>
        <div className="card text-center">
          <p className="text-sm text-muted mb-2">Avg DTI</p>
          <p className="heading-md">{metrics.avgDTI}%</p>
        </div>
        <div className="card text-center">
          <p className="text-sm text-muted mb-2">Approval Rate</p>
          <p className="heading-md text-success">{metrics.assessed > 0 ? Math.round((metrics.approved / metrics.assessed) * 100) : 0}%</p>
        </div>
      </div>

      <div className="admin-dual-col mt-6">
        <div className="card" style={{ background: 'linear-gradient(145deg, var(--bg-card), var(--bg-tertiary))', border: '1px solid var(--border-light)', boxShadow: '0 8px 32px rgba(0,0,0,0.2)' }}>
          <h3 className="heading-sm mb-5" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--accent)' }}><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
            Decision Breakdown
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.2)', borderRadius: '8px' }}>
              <span style={{ color: '#10B981', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}><div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10B981', boxShadow: '0 0 8px #10B981' }}></div> Approved Prime</span>
              <span style={{ fontWeight: '700', fontSize: 'var(--fs-lg)' }}>{metrics.decisionBreakdown?.APPROVED || 0}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', background: 'rgba(251, 191, 36, 0.05)', border: '1px solid rgba(251, 191, 36, 0.2)', borderRadius: '8px' }}>
              <span style={{ color: '#FBBF24', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}><div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#FBBF24', boxShadow: '0 0 8px #FBBF24' }}></div> Manual Approval</span>
              <span style={{ fontWeight: '700', fontSize: 'var(--fs-lg)' }}>{metrics.decisionBreakdown?.APPROVED_CONDITIONS || 0}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '8px' }}>
              <span style={{ color: '#EF4444', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}><div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#EF4444', boxShadow: '0 0 8px #EF4444' }}></div> Rejected</span>
              <span style={{ fontWeight: '700', fontSize: 'var(--fs-lg)' }}>{metrics.decisionBreakdown?.REJECTED || 0}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', background: 'rgba(59, 130, 246, 0.05)', border: '1px solid rgba(59, 130, 246, 0.2)', borderRadius: '8px' }}>
              <span style={{ color: '#60A5FA', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}><div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#60A5FA', boxShadow: '0 0 8px #60A5FA' }}></div> Manual Review (KYC)</span>
              <span style={{ fontWeight: '700', fontSize: 'var(--fs-lg)' }}>{metrics.decisionBreakdown?.KYC_FLAG || 0}</span>
            </div>
          </div>
        </div>
        
        <div className="card" style={{ background: 'linear-gradient(145deg, var(--bg-card), var(--bg-tertiary))', border: '1px solid var(--border-light)', boxShadow: '0 8px 32px rgba(0,0,0,0.2)' }}>
          <h3 className="heading-sm mb-5" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--accent)' }}><path d="M21.21 15.89A10 10 0 1 1 8 2.83"></path><path d="M22 12A10 10 0 0 0 12 2v10z"></path></svg>
            Risk Distribution (DTI)
          </h3>
          <div style={{ height: '180px', display: 'flex', alignItems: 'flex-end', gap: '16px', padding: '0 16px 30px', borderBottom: '1px solid var(--border)', position: 'relative' }}>
            <div style={{ flex: 1, background: 'linear-gradient(180deg, #10B981, rgba(16,185,129,0.2))', height: '70%', borderRadius: '6px 6px 0 0', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', transition: 'height 1s ease-out' }} title="<35%"></div>
            <div style={{ flex: 1, background: 'linear-gradient(180deg, #FBBF24, rgba(251,191,36,0.2))', height: '40%', borderRadius: '6px 6px 0 0', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', transition: 'height 1s ease-out' }} title="35-50%"></div>
            <div style={{ flex: 1, background: 'linear-gradient(180deg, #EF4444, rgba(239,68,68,0.2))', height: '15%', borderRadius: '6px 6px 0 0', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', transition: 'height 1s ease-out' }} title=">50%"></div>
            
            <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', display: 'flex', justifyContent: 'space-around', paddingTop: '10px', fontSize: '11px', color: 'var(--text-muted)', fontWeight: '500' }}>
              <span>Low (&lt;35%)</span>
              <span>Med (35-50%)</span>
              <span>High (&gt;50%)</span>
            </div>
          </div>
          <p className="text-xs text-center text-muted mt-5" style={{ fontStyle: 'italic' }}>Illustrative portfolio DTI spread</p>
        </div>
      </div>
    </div>
  );

  const renderComplianceTab = () => {
    // Sort consents newest first
    const sortedConsents = [...metrics.allConsents].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    return (
      <div className="animate-fadeSlideUp">
        <div className="admin-content-header">
          <h2>Compliance & Audit</h2>
          <span className="badge badge-success">Fully RBI Compliant</span>
        </div>

        <div className="card p-0 overflow-x-auto">
          <div className="p-4 border-b border-border flex-between bg-secondary">
            <h3 className="font-semibold">Master Consent Log</h3>
            <span className="text-xs text-muted">{sortedConsents.length} records</span>
          </div>
          <table className="w-full text-left text-sm border-collapse">
            <thead className="bg-secondary" style={{ opacity: 0.9 }}>
              <tr className="border-b border-border text-xs" style={{ textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)' }}>
                <th className="p-3 font-semibold" style={{ textAlign: 'left' }}>Timestamp</th>
                <th className="p-3 font-semibold" style={{ textAlign: 'left' }}>Applicant</th>
                <th className="p-3 font-semibold" style={{ textAlign: 'left' }}>Consent Type</th>
                <th className="p-3 font-semibold" style={{ textAlign: 'left' }}>Status</th>
                <th className="p-3 font-semibold" style={{ textAlign: 'left' }}>IP / Device (Simulated)</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ height: '16px' }}></tr>
              {sortedConsents.slice(0, 15).map((log, i) => (
                <tr key={i} className="border-b border-border last:border-0 hover:bg-secondary">
                  <td className="p-3 whitespace-nowrap text-xs text-muted">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="p-3">
                    <div className="font-medium">{log.applicantName}</div>
                    <div className="text-xs text-muted mt-1">{log.borrowerId || 'Unknown'}</div>
                  </td>
                  <td className="p-3">
                    <span className="badge badge-neutral bg-opacity-10 text-xs py-1 px-2">{log.type}</span>
                  </td>
                  <td className="p-3">
                    <span className="text-success text-xs font-semibold">GRANTED ✓</span>
                  </td>
                  <td className="p-3 text-xs text-muted font-mono">
                    10.24.{Math.floor(Math.random()*255)}.{Math.floor(Math.random()*255)}
                  </td>
                </tr>
              ))}
              {sortedConsents.length === 0 && (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-muted">No consent records found</td>
                </tr>
              )}
            </tbody>
          </table>
          {sortedConsents.length > 15 && (
            <div className="p-3 text-center border-t border-border bg-secondary">
              <span className="text-xs text-accent cursor-pointer">View older records...</span>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="admin-layout video-bg-container">
      {renderSidebar()}
      
      <div className="admin-content" style={{ position: 'relative', zIndex: 1, overflowY: 'auto', height: '100vh' }}>
        {activeTab === 'applications' && renderApplicationsTable()}
        {activeTab === 'pm' && renderPMTab()}
        {activeTab === 'risk' && renderRiskTab()}
        {activeTab === 'compliance' && renderComplianceTab()}
      </div>
      
      {renderAppDetail()}
    </div>
  );
}
