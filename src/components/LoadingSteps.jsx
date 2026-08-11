import { useState, useEffect } from 'react';

/**
 * Multi-step loading animation component.
 *
 * @param {Object} props
 * @param {Array<string>} props.steps — array of step labels
 * @param {number} props.delayPerStep — ms between each step completing (default 1000)
 * @param {function} props.onComplete — called when all steps finish
 */
export default function LoadingSteps({ steps, delayPerStep = 1000, onComplete }) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (activeIndex >= steps.length) {
      // All steps done — fire callback after a short pause
      const t = setTimeout(() => onComplete?.(), 400);
      return () => clearTimeout(t);
    }

    const t = setTimeout(() => {
      setActiveIndex((prev) => prev + 1);
    }, delayPerStep);

    return () => clearTimeout(t);
  }, [activeIndex, steps.length, delayPerStep, onComplete]);

  return (
    <div className="loading-steps">
      {steps.map((label, i) => {
        let status = 'pending';
        if (i < activeIndex) status = 'done';
        else if (i === activeIndex) status = 'active';

        return (
          <div key={i} className={`loading-step ${status}`}>
            <div className="loading-step-icon">
              {status === 'done' ? '✓' : status === 'active' ? '⟳' : '○'}
            </div>
            <div className="loading-step-text">{label}</div>
          </div>
        );
      })}
    </div>
  );
}
