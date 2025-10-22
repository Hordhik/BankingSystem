import React from 'react';
import './Payments.css';
import { DebitCardDisplay } from './components/DebitCardDisplay.jsx';
import { PaymentMethods } from './components/PaymentMethods.jsx';
import { RecentActivities } from './components/RecentActivities.jsx';
import {RechargeAndBills} from './components/RechargeAndBills.jsx';

const transactionsData = [
    { id: 1, to: 'Eswar Reddy', type: 'Online Payment', date: 'October, 03', amount: '- ₹5000.00', status: 'Failed' },
    { id: 2, to: 'Eswar Reddy', type: 'Online Payment', date: 'October, 03', amount: '+ ₹50000.00', status: 'Completed' },
    { id: 3, to: 'Eswar Reddy', type: 'EMI', date: 'October, 03', amount: '+ ₹2378.00', status: 'Completed' },
    { id: 4, to: 'Eswar Reddy', type: 'Merchant', date: 'September, 29', amount: '- ₹3000.00', status: 'Success' },
    { id: 5, to: 'Eswar Reddy', type: 'Electric Bill', date: 'September, 25', amount: '+ ₹2584.43', status: 'Pending' },
    { id: 6, to: 'Eswar Reddy', type: 'Insurance', date: 'September, 25', amount: '- ₹10000.00', status: 'Completed' },
];

function Payments() {
  return (
    <div className='payments-container'>
      <div className="payments-grid">
        <div className="payments-grid__main">
          <DebitCardDisplay />
          <RechargeAndBills />
        </div>
        <div className="payments-grid__sidebar">
          <PaymentMethods />
        </div>
      </div>
      <div className="payments-activities">
        <RecentActivities transactions={transactionsData} />
      </div>
    </div>
  );
}

export default Payments;