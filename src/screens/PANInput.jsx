import { useState } from 'react';
import { useLoan } from '../context/LoanContext';
import ProgressBar from '../components/ProgressBar';
import { PROFILES, getDynamicProfile } from '../engine/mockProfiles';

export default function PANInput() {
  const { state, dispatch, nextStep } = useLoan();
  // Pre-fill PAN from dynamic profile to speed up demo
  const mockPan = getDynamicProfile(state)?.pan?.number || '';
  const [pan, setPan] = useState(mockPan);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (pan.length >= 10) {
      dispatch({ type: 'SET_PAN_NUMBER', payload: pan.toUpperCase() });
      nextStep();
    }
  };

  return (
    <div className="screen">
      <ProgressBar />

      <div className="screen-center">
        <h2 className="heading-xl text-center mb-2">Provide PAN Details</h2>
        <p className="text-body text-muted text-center mb-8">
          We need your PAN to fetch your credit score and offer the best rates.
        </p>

        <form className="card w-full max-w-sm" onSubmit={handleSubmit} style={{ animation: 'fadeSlideUp 0.5s ease both' }}>
          <div className="form-group mb-6">
            <label className="form-label text-xs uppercase tracking-wider text-muted">Permanent Account Number (PAN)</label>
            <input
              type="text"
              className="form-input text-center"
              style={{ textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '1.25rem', fontWeight: 600 }}
              placeholder="ABCDE1234F"
              value={pan}
              onChange={(e) => setPan(e.target.value.toUpperCase())}
              maxLength={10}
              autoFocus
              required
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary btn-block"
            disabled={pan.length < 10}
          >
            Check CIBIL Score
          </button>
        </form>
      </div>
    </div>
  );
}
