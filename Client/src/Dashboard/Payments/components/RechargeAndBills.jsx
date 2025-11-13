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
      <div className="recharge-bills__header">
        <h3 className="recharge-bills__title">Recharge & Bills</h3>
        <a href="#" className="recharge-bills__see-all">All Categories →</a>
      </div>
      <div className="recharge-bills__grid">
        {billOptions.map((option) => (
          <div
            className="bill-option"
            key={option.name}
            onClick={() => navigate(`/payment/${option.type}`)} // ✅ lowercase type
          >
            <div className="bill-option__icon">
              {option.type === 'mobile' && <Smartphone size={22} />}
              {option.type === 'dth' && <SatelliteDish size={22} />}
              {option.type === 'electricity' && <Zap size={22} />}
              {option.type === 'gas' && <Flame size={22} />}
              {option.type === 'broadband' && <Wifi size={22} />}
              {option.type === 'water' && <Droplets size={22} />}
              {option.type === 'insurance' && <ShieldCheck size={22} />}
              {option.type === 'education' && <GraduationCap size={22} />}
            </div>
            <p>{option.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
