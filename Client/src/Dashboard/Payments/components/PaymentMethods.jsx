import React from 'react';
import './PaymentMethods.css';
import wallet from '/src/assets/icons/wallet.svg';
import card from '/src/assets/icons/card.svg';
import transfer from '/src/assets/icons/transfer.svg';
import ticket from '/src/assets/icons/ticket.svg';

export const PaymentMethods = () => {
  const methods = [
    { icon: wallet, text: 'Transfer via Card Number' },
    { icon: card, text: 'Transfer to Other banks' },
    { icon: transfer, text: 'Self Transfer' },
    { icon: ticket, text: 'Transfer via Mobile / UPI ID' },
  ];

  return (
    <div className="payment-methods-container">
      <h3 className="payment-methods__title">Payment Methods</h3>
      <div className="payment-methods__grid">
        {methods.map((method, index) => (
          <div className="method-card" key={index}>
            <img src={method.icon} alt="" />
            <p>{method.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
