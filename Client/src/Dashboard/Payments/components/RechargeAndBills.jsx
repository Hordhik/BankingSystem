import React from 'react';
import './RechargeAndBills.css';
import { useNavigate } from 'react-router-dom';

const Icon = ({ type }) => {
  const icons = {
    mobile: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect><line x1="12" y1="18" x2="12.01" y2="18"></line></svg>,
    dth: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>,
    electricity: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>,
    gas: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 16.5a2.5 2.5 0 1 1-3 0V3M8.5 16.5a2.5 2.5 0 1 0 3 0V3M14.5 3h-5a2.5 2.5 0 0 0 0 5h5a2.5 2.5 0 0 1 0 5h-5a2.5 2.5 0 0 0 0 5h5"/></svg>,
  };
  return icons[type] || null;
};

export const RechargeAndBills = () => {
  const navigate = useNavigate();

  const billOptions = [
    { type: 'mobile', name: 'Mobile' },
    { type: 'dth', name: 'DTH' },
    { type: 'electricity', name: 'Electricity' },
    { type: 'gas', name: 'Piped Gas' },
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
              <Icon type={option.type} />
            </div>
            <p>{option.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
