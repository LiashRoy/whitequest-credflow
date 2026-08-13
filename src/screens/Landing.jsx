import React, { useState, useRef } from 'react';
import { useLoan } from '../context/LoanContext';
import { calculateEMI, formatINR, totalInterest } from '../engine/creditEngine';
import ProgressBar from '../components/ProgressBar';

export default function Landing() {
  const { dispatch, nextStep } = useLoan();
  const [amount, setAmount] = useState(100000);
  const [tenure, setTenure] = useState(12);
  const clickCountRef = useRef(0);
  
  const emi = calculateEMI(amount, 14, tenure);
  const interest = totalInterest(amount, 14, tenure);
  
  const handleApply = (selectedTenure) => {
    dispatch({ type: 'SET_LOAN_PARAMS', payload: { amount, tenure: selectedTenure } });
    nextStep();
  };
  
  const handleDemoClick = () => {
    clickCountRef.current += 1;
    if (clickCountRef.current >= 5) {
      dispatch({ type: 'TOGGLE_PROFILE_SWITCHER' });
      clickCountRef.current = 0;
    }
  };

  const PLANS = [
    { tenure: 6, rate: 2 },
    { tenure: 9, rate: 3.5 },
    { tenure: 11, rate: 5 },
    { tenure: 15, rate: 6.5 },
    { tenure: 18, rate: 7.5 }
  ];
  
  return (
    <div className="screen">
      <ProgressBar />
      
      <div className="screen-center">
        <div className="w-full mt-4 card-glass p-6 relative overflow-hidden" style={{ animation: 'fadeSlideUp 0.6s var(--ease-out) both', border: '1px solid var(--border-accent)', boxShadow: '0 10px 30px rgba(0,0,0,0.2), inset 0 0 20px rgba(255,255,255,0.02)' }}>
        {/* Subtle animated background glow for the box */}
        <div style={{ position: 'absolute', top: '-50px', left: '50%', transform: 'translateX(-50%)', width: '150px', height: '100px', background: 'var(--accent-glow)', filter: 'blur(40px)', opacity: 0.3, pointerEvents: 'none' }} />
        
        <div className="text-center mb-6 relative z-10">
          <p className="text-xs text-muted mb-2 uppercase tracking-widest font-semibold">Select Loan Amount</p>
          <div className="heading-xl text-shadow-sm">{formatINR(amount)}</div>
        </div>
        
        <input 
          type="range" 
          min="10000" 
          max="2000000" 
          step="5000" 
          value={amount} 
          onChange={(e) => setAmount(Number(e.target.value))}
          className="range-slider w-full"
          style={{ '--fill': `${((amount - 10000) / 1990000) * 100}%` }}
        />
        <div className="range-labels flex-between text-xs text-muted mt-2">
          <span>₹10K</span>
          <span>₹20L</span>
        </div>
      </div>
      
      <div className="w-full mt-6">
        <p className="form-label mb-4 text-center">Select Your EMI Plan</p>
        <div className="flex flex-col gap-3">
          {PLANS.map(plan => {
            const emi = calculateEMI(amount, plan.rate, plan.tenure);
            const interest = totalInterest(amount, plan.rate, plan.tenure);
            const total = amount + interest;
            
            return (
              <div 
                key={plan.tenure} 
                className="emi-plan-row" 
                onClick={() => handleApply(plan.tenure)}
              >
                {plan.rate === 0 && (
                  <div className="emi-plan-badge">
                    Best Value
                  </div>
                )}
                
                <div className="emi-plan-left">
                  <h3 className="heading-md m-0">{plan.tenure} <span className="text-xs text-muted font-normal">Months</span></h3>
                  <span className="badge badge-info bg-opacity-10 text-info border border-info border-opacity-20 text-[10px] px-2 py-0.5 w-fit">{plan.rate}% p.a.</span>
                </div>
                
                <div className="emi-plan-right">
                  <div className="text-right">
                    <p className="heading-sm text-accent m-0">{formatINR(emi)} <span className="text-xs text-muted font-normal">/ mo</span></p>
                    <p className="text-[10px] text-muted m-0 mt-1">Total: {formatINR(total)} <span className="opacity-75">| Int: {formatINR(interest)}</span></p>
                  </div>
                  <div className="emi-plan-arrow">→</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      </div>
    </div>
  );
}
