import React from 'react';
import './FlowchartSection.css';

const ArrowIcon = () => (
  <svg
    className="flowchart-arrow"
    width="24"
    height="48"
    viewBox="0 0 24 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 2V46M12 46L2 36M12 46L22 36"
      stroke="#1a1a1a"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const FlowchartSection = () => {
  const steps = [
    'Create your account online with just your mobile number and email.',
    'Complete e-KYC in minutes with Aadhaar & PAN — no paperwork needed.',
    'Receive your digital card instantly. Physical card delivered to your doorstep.',
    'Transfer money, track expenses, and earn rewards — all in-app.',
  ];

  return (
    <section  className="flowchart-section">
      <h2 className="flowchart-title">Start Banking in Just 3 Steps.</h2>
      <p className="flowchart-subtitle">
        No long queues. No paperwork. 100% digital onboarding.
      </p>
      <div className="flowchart-steps">
        {steps.map((step, index) => (
          <React.Fragment key={index}>
            <div className="flowchart-step">
              <p>{step}</p>
            </div>
            {index < steps.length - 1 && <ArrowIcon />}
          </React.Fragment>
        ))}
      </div>
    </section>
  );
};

