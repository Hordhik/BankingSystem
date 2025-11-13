import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './PaymentMethods.css';
import { CreditCard, Landmark, ArrowLeftRight, Smartphone, Wallet, QrCode } from 'lucide-react';

export const PaymentMethods = () => {
  const navigate = useNavigate();

  const methods = [
    { icon: <CreditCard size={22} />, text: 'Transfer via Card Number', route: 'card' },
    { icon: <Landmark size={22} />, text: 'Transfer to Other Banks', route: 'banks' },
    { icon: <ArrowLeftRight size={22} />, text: 'Self Transfer', route: 'self' },
    { icon: <Smartphone size={22} />, text: 'Transfer via Mobile / UPI ID', route: 'upi' },
  { icon: <QrCode size={22} />, text: 'Scan & Pay (QR / UPI)', route: 'upi' },
  { icon: <Wallet size={22} />, text: 'Wallets', route: 'wallet' },
  ];

  return (
    <div className="payment-methods-container">
      <h3 className="payment-methods__title">Payment Methods</h3>
      <div className="payment-methods__grid">
        {methods.map((method, index) => (
          <div
            className="method-card"
            key={index}
            onClick={() => navigate(`/payment/${method.route}`)} // ✅ lowercase route
          >
            <div className="method-icon">{method.icon}</div>
            <p>{method.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

