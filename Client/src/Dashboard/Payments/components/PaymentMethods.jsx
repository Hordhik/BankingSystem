import React from 'react';
import { Link } from 'react-router-dom';
import './PaymentMethods.css';
import wallet from '/src/assets/icons/wallet.svg';
import card from '/src/assets/icons/card.svg';
import transfer from '/src/assets/icons/transfer.svg';
import ticket from '/src/assets/icons/ticket.svg';
import { useNavigate } from 'react-router-dom';

export const PaymentMethods = () => {
  const navigate = useNavigate();

  const methods = [
    { icon: wallet, text: 'Transfer via Card Number', route: 'card' },
    { icon: card, text: 'Transfer to Other Banks', route: 'banks' },
    { icon: transfer, text: 'Self Transfer', route: 'self' },
    { icon: ticket, text: 'Transfer via Mobile / UPI ID', route: 'upi' },
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
            <img src={method.icon} alt="" />
            <p>{method.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

