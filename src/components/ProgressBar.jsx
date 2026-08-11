import { useNavigate } from 'react-router-dom';
import { useLoan } from '../context/LoanContext';

export default function ProgressBar() {
  const { state, prevStep } = useLoan();
  const navigate = useNavigate();
  const { currentStep, totalSteps } = state;
  const pct = (currentStep / totalSteps) * 100;

  return (
    <div className="pb-4 pt-2">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginBottom: '12px' }}>
        <div>
          {currentStep > 1 && currentStep <= 8 && (
            <button 
              className="btn btn-secondary text-xs" 
              onClick={prevStep}
              style={{ padding: '6px 12px', height: 'auto', borderRadius: 'var(--radius-full)' }}
            >
              ← Back
            </button>
          )}
        </div>
        <div className="text-xs font-semibold tracking-wider text-muted uppercase text-right">
          Step {currentStep} of {totalSteps}
        </div>
      </div>
      <div className="w-full bg-border rounded-full h-1 overflow-hidden">
        <div className="bg-accent h-full rounded-full transition-all duration-300" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
