import { useState } from 'react';
import './TransfersPayments.css';
import horizonCard from '../../../src/assets/images/horizon-card.png';

const TransfersPayments = () => {
  const [activeSection, setActiveSection] = useState('transfers');

  return (
    <div className="transfers-payments">
      <div className="tp-header">
        <h2>Payment Methods</h2>
      </div>

      <div className="cards-section">
        <div className="card-wrapper">
          <img src={horizonCard} alt="Horizon Credit Card" className="credit-card-image" />
          <div className="card-details">
            <div className="balance-info">
              <h4>Card Balance</h4>
              <span className="balance-amount">₹39,800.02</span>
            </div>
            <div className="card-actions">
              <button className="action-btn">History</button>
              <button className="action-btn">Transfer</button>
            </div>
          </div>
        </div>
      </div>

      <div className="transfer-section">
        <div className="section-header">
          <h3>Transfer Options</h3>
        </div>
        <div className="transfer-grid">
          <div className="transfer-option">
            <div className="option-icon">💳</div>
            <div className="option-details">
              <h4>Transfer via Card Number</h4>
              <p>Send money to other cards</p>
            </div>
          </div>
          <div className="transfer-option">
            <div className="option-icon">🏦</div>
            <div className="option-details">
              <h4>Transfer to Other Banks</h4>
              <p>NEFT/RTGS/IMPS</p>
            </div>
          </div>
          <div className="transfer-option">
            <div className="option-icon">↔️</div>
            <div className="option-details">
              <h4>Self Transfer</h4>
              <p>Between your accounts</p>
            </div>
          </div>
          <div className="transfer-option">
            <div className="option-icon">📱</div>
            <div className="option-details">
              <h4>Transfer via Mobile/UPI ID</h4>
              <p>Quick transfers using UPI</p>
            </div>
          </div>
        </div>
      </div>

      <div className="recent-activities">
        <div className="section-header">
          <h3>Recent Activities</h3>
        </div>
        <div className="activities-table">
          <table>
            <thead>
              <tr>
                <th>TO</th>
                <th>TYPE</th>
                <th>DATE</th>
                <th>AMOUNT</th>
                <th>STATUS</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Eswar Reddy</td>
                <td>Online Payment</td>
                <td>October, 03</td>
                <td className="amount negative">- ₹5000.00</td>
                <td className="status failed">Failed</td>
              </tr>
              <tr>
                <td>Eswar Reddy</td>
                <td>Online Payment</td>
                <td>October, 03</td>
                <td className="amount positive">+ ₹50000.00</td>
                <td className="status completed">Completed</td>
              </tr>
              <tr>
                <td>Eswar Reddy</td>
                <td>EMI</td>
                <td>October, 03</td>
                <td className="amount negative">- ₹2378.00</td>
                <td className="status completed">Completed</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TransfersPayments;