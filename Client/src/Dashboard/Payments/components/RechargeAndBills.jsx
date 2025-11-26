import React from 'react';
import './RechargeAndBills.css';
import { useNavigate } from 'react-router-dom';
import { Smartphone, SatelliteDish, Zap, Flame, Wifi, Droplets, ShieldCheck, GraduationCap } from 'lucide-react';

export const RechargeAndBills = () => {
  const navigate = useNavigate();

  const billOptions = [
    { type: 'mobile', name: 'Mobile' },
    { type: 'dth', name: 'DTH' },
    { type: 'electricity', name: 'Electricity' },
    { type: 'gas', name: 'Piped Gas' },
    { type: 'broadband', name: 'Broadband' },
    { type: 'water', name: 'Water' },
    { type: 'insurance', name: 'Insurance' },
    { type: 'education', name: 'Education' },
  ];

  return (
    <div className="recharge-bills-container">
      {/* Upcoming Payments Section - Now on top */}
      <div className="upcoming-payments" style={{ marginTop: 0, borderTop: 'none', marginBottom: '32px', borderBottom: '1px solid rgba(0,0,0,0.05)', paddingBottom: '24px', paddingTop: 0 }}>
        <h4 className="upcoming-title">Upcoming Payments</h4>
        <div className="upcoming-list">
          <div className="upcoming-item">
            <div className="upcoming-icon bg-neutral">
              <Wifi size={18} />
            </div>
            <div className="upcoming-details">
              <p className="upcoming-name">Jio Fiber</p>
              <p className="upcoming-date">Due in 2 days</p>
            </div>
            <div className="upcoming-amount">₹999</div>
            <button className="upcoming-pay-btn" onClick={() => alert('Proceeding to pay Jio Fiber...')}>Pay</button>
          </div>
          <div className="upcoming-item">
            <div className="upcoming-icon bg-neutral">
              <Zap size={18} />
            </div>
            <div className="upcoming-details">
              <p className="upcoming-name">Bescom Electricity</p>
              <p className="upcoming-date">Due in 5 days</p>
            </div>
            <div className="upcoming-amount">₹1,450</div>
            <button className="upcoming-pay-btn" onClick={() => alert('Proceeding to pay Bescom Electricity...')}>Pay</button>
          </div>
        </div>
      </div>

      <div className="recharge-bills__header">
        <h3 className="recharge-bills__title">Recharge & Bills</h3>
        <div className="header-actions">
          <button className="auto-pay-btn" onClick={() => navigate('/autopay')}>
            Auto Payments
          </button>
          <a href="#" className="recharge-bills__see-all">All Categories →</a>
        </div>
      </div>
      <div className="recharge-bills__grid">
        {billOptions.map((option) => (
          <div
            className={`bill-option bill-option--${option.type}`}
            key={option.name}
            onClick={() => navigate(`/payment/${option.type}`)}
          >
            <div className="bill-option__icon">
              {option.type === 'mobile' && <Smartphone size={24} strokeWidth={1.5} />}
              {option.type === 'dth' && <SatelliteDish size={24} strokeWidth={1.5} />}
              {option.type === 'electricity' && <Zap size={24} strokeWidth={1.5} />}
              {option.type === 'gas' && <Flame size={24} strokeWidth={1.5} />}
              {option.type === 'broadband' && <Wifi size={24} strokeWidth={1.5} />}
              {option.type === 'water' && <Droplets size={24} strokeWidth={1.5} />}
              {option.type === 'insurance' && <ShieldCheck size={24} strokeWidth={1.5} />}
              {option.type === 'education' && <GraduationCap size={24} strokeWidth={1.5} />}
            </div>
            <p>{option.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
