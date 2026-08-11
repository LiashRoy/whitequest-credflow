import { useState } from 'react';
import { useLoan } from '../context/LoanContext';
import ProgressBar from '../components/ProgressBar';
import LoadingSteps from '../components/LoadingSteps';
import { getDynamicProfile } from '../engine/mockProfiles';
import { formatINR } from '../engine/creditEngine';

export default function DigiLocker() {
  const { state, dispatch, nextStep } = useLoan();
  const [status, setStatus] = useState('loading');

  const steps = [
    'Connecting to banking partner...',
    'Fetching statement summary...',
    'Parsing recent credits...'
  ];

  const profile = getDynamicProfile(state);

  const handleComplete = () => {
    dispatch({
      type: 'SET_DIGILOCKER_DATA',
      payload: { pan: profile.pan, bankStatement: profile.bankStatement }
    });
    // Set digiLockerPulled to true manually since we modified the payload handling earlier maybe?
    // Wait, SET_DIGILOCKER_DATA already does it.
    setStatus('done');
  };

  return (
    <div className="screen">
      <ProgressBar />

      {status === 'loading' && (
        <div className="screen-center" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', paddingTop: '48px' }}>
          <h2 className="heading-lg mb-6">Fetching your documents</h2>
          <LoadingSteps
            steps={steps}
            delayPerStep={1200}
            onComplete={handleComplete}
          />
        </div>
      )}

      {status === 'done' && (
        <div className="mt-6 w-full" style={{ animation: 'fadeSlideUp 0.4s ease both' }}>
          <div className="text-center mb-6">
            <div className="status-icon status-icon-success" style={{ margin: '0 auto' }}>✓</div>
            <h2 className="heading-lg mt-4">Documents Verified</h2>
          </div>

          {/* PAN Card Section Removed */}

          {/* Bank Statement */}
          <div className="card mb-6">
            <div className="flex flex-between items-center mb-3">
              <h3 className="heading-sm">Bank Statement</h3>
              <span className="badge badge-success">Verified</span>
            </div>
            <div className="flex flex-col gap-2 mb-4">
              <div className="flex flex-between">
                <span className="text-sm text-muted">Bank</span>
                <span className="text-sm">{profile.bankStatement.bank}</span>
              </div>
              <div className="flex flex-between">
                <span className="text-sm text-muted">Account</span>
                <span className="text-sm">{profile.bankStatement.accountNumber}</span>
              </div>
              <div className="flex flex-between">
                <span className="text-sm text-muted">Avg. Balance (3M)</span>
                <span className="text-sm" style={{ fontWeight: 600 }}>{formatINR(profile.bankStatement.avgBalance3m)}</span>
              </div>
            </div>

            <div className="divider" />

            <p className="text-xs text-muted mb-3" style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Recent Salary/Income Credits
            </p>
            {profile.bankStatement.months.map((month, i) => (
              <div key={i} className="flex flex-between mb-2">
                <span className="text-sm text-secondary">{month}</span>
                <span className="text-sm text-success" style={{ fontWeight: 500 }}>
                  {formatINR(
                    profile.bankStatement.salaryCredits[i] ||
                    (profile.bankStatement.businessCredits && profile.bankStatement.businessCredits[i]) ||
                    0
                  )}
                </span>
              </div>
            ))}
          </div>

          <button onClick={nextStep} className="btn btn-primary btn-block">
            Continue
          </button>
        </div>
      )}
    </div>
  );
}
