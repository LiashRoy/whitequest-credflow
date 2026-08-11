import React, { useState, useEffect } from 'react';
import { useLoan } from '../context/LoanContext';
import ProgressBar from '../components/ProgressBar';
import { getProfileById } from '../engine/mockProfiles';

export default function Employment() {
  const { state, dispatch, nextStep } = useLoan();
  
  const [type, setType] = useState('salaried');
  const [employer, setEmployer] = useState('');
  const [monthlyIncome, setMonthlyIncome] = useState('');
  const [existingEMI, setExistingEMI] = useState(0);

  useEffect(() => {
    if (state.testProfile) {
      const profile = getProfileById(state.testProfile);
      if (profile && profile.employment) {
        setType(profile.employment.type || 'salaried');
        setEmployer(profile.employment.employer || profile.employment.businessName || '');
        setMonthlyIncome(profile.employment.monthlyIncome || '');
        setExistingEMI(profile.employment.existingEMI || 0);
      }
    } else if (state.employmentData) {
      setType(state.employmentData.type || 'salaried');
      setEmployer(state.employmentData.employer || state.employmentData.businessName || '');
      setMonthlyIncome(state.employmentData.monthlyIncome || '');
      setExistingEMI(state.employmentData.existingEMI || 0);
    }
  }, [state.testProfile, state.employmentData]);

  const numIncome = Number(monthlyIncome) || 0;
  const numEmi = Number(existingEMI) || 0;
  const dti = numIncome > 0 ? ((numEmi / numIncome) * 100).toFixed(1) : 0;
  
  let dtiColor = 'var(--success)';
  if (dti >= 35 && dti <= 50) dtiColor = 'var(--warning)';
  else if (dti > 50) dtiColor = 'var(--error)';

  const isValid = type && employer && numIncome > 0;

  const handleContinue = () => {
    if (!isValid) return;
    dispatch({
      type: 'SET_EMPLOYMENT',
      payload: {
        type,
        ...(type === 'self-employed' ? { businessName: employer } : { employer }),
        monthlyIncome: numIncome,
        existingEMI: numEmi
      }
    });
    nextStep();
  };

  const formatWords = (num) => {
    if (num >= 100000) return `₹${(num/100000).toFixed(2)} Lakhs`;
    if (num >= 1000) return `₹${(num/1000).toFixed(1)} Thousands`;
    return `₹${num}`;
  };

  return (
    <div className="screen">
      <ProgressBar />
      <div className="screen-center">
        <h2 className="heading-lg mb-4 text-center">Employment & Income</h2>
        
        <div className="card">
          <div className="form-group">
            <label className="form-label">Employment Type</label>
            <select 
              className="form-select" 
              value={type}
              onChange={(e) => {
                setType(e.target.value);
                setEmployer('');
              }}
            >
              <option value="salaried">Salaried</option>
              <option value="self-employed">Self-Employed</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">
              {type === 'self-employed' ? 'Business Name' : 'Employer Name'}
            </label>
            <input 
              type="text" 
              className="form-input" 
              value={employer}
              onChange={(e) => setEmployer(e.target.value)}
              placeholder={type === 'self-employed' ? 'Enter business name' : 'Enter employer name'}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Monthly Income (₹)</label>
            <input 
              type="number" 
              className="form-input" 
              value={monthlyIncome}
              onChange={(e) => setMonthlyIncome(e.target.value)}
              placeholder="e.g. 50000"
            />
            {numIncome > 0 && <div className="form-hint">{formatWords(numIncome)}</div>}
          </div>

          <div className="form-group">
            <label className="form-label">Existing Monthly EMI (₹)</label>
            <input 
              type="number" 
              className="form-input" 
              value={existingEMI}
              onChange={(e) => setExistingEMI(e.target.value)}
              placeholder="0"
            />
            <div className="form-hint">Include all loan EMIs, credit card minimum dues</div>
          </div>
        </div>

        {numIncome > 0 && (
          <div className="card mt-4" style={{ borderColor: dtiColor, borderWidth: '1px', borderStyle: 'solid' }}>
            <div className="flex-between items-center">
              <span className="text-body font-medium">Debt-to-Income:</span>
              <span className="heading-md" style={{ color: dtiColor }}>{dti}%</span>
            </div>
          </div>
        )}

        <div className="screen-footer mt-6">
          <button 
            className="btn btn-primary btn-block" 
            disabled={!isValid}
            onClick={handleContinue}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
