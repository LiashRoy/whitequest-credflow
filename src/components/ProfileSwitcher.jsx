import { useLoan } from '../context/LoanContext';
import { PROFILE_LIST } from '../engine/mockProfiles';

export default function ProfileSwitcher() {
  const { state, dispatch, reset } = useLoan();
  const { showProfileSwitcher, testProfile } = state;

  if (!showProfileSwitcher) return null;

  const handleSelect = (profileId) => {
    reset(profileId);
    dispatch({ type: 'HIDE_PROFILE_SWITCHER' });
  };

  return (
    <div className="profile-switcher">
      <div className="profile-switcher-header">
        <div>
          <div className="heading-sm">Demo Profiles</div>
          <div className="text-sm text-muted">Select a profile to simulate different outcomes</div>
        </div>
        <button
          className="btn btn-ghost"
          onClick={() => dispatch({ type: 'HIDE_PROFILE_SWITCHER' })}
        >
          ✕
        </button>
      </div>

      <div
        className={`profile-card ${testProfile === null ? 'active' : ''}`}
        onClick={() => {
          reset();
          dispatch({ type: 'SET_TEST_PROFILE', profile: null });
        }}
      >
        <div className="profile-card-icon" style={{ background: 'rgba(148,163,184,0.1)' }}>
          🔄
        </div>
        <div className="profile-card-info">
          <div className="profile-card-name">Auto-detect</div>
          <div className="profile-card-desc">Profile chosen based on income / employment inputs</div>
        </div>
      </div>

      {PROFILE_LIST.map((p) => (
        <div
          key={p.id}
          className={`profile-card ${testProfile === p.id ? 'active' : ''}`}
          onClick={() => handleSelect(p.id)}
        >
          <div
            className="profile-card-icon"
            style={{ background: `${p.color}18`, color: p.color }}
          >
            {p.icon}
          </div>
          <div className="profile-card-info">
            <div className="profile-card-name">
              Profile {p.id} — {p.label}
            </div>
            <div className="profile-card-desc">{p.tagline}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
