import React from 'react'
import './Payments.css'
import DebitCards from '../components/cards/DebitCards'
import card from '../../assets/icons/card.svg'
import wallet from '../../assets/icons/wallet.svg'
import transfer from '../../assets/icons/transfer.svg'
import ticket from '../../assets/icons/ticket.svg'

const transactionsData = [
    { id: 1, to: 'Eswar Reddy', type: 'Online Payment', date: 'October, 03', amount: '- ₹5000.00', status: 'Failed' },
    { id: 2, to: 'Eswar Reddy', type: 'Online Payment', date: 'October, 03', amount: '+ ₹50000.00', status: 'Completed' },
    { id: 3, to: 'Eswar Reddy', type: 'EMI', date: 'October, 03', amount: '₹2378.00', status: 'Completed' },
    { id: 4, to: 'Eswar Reddy', type: 'Marchant', date: 'September, 29', amount: '₹3000.00', status: 'Success' },
    { id: 5, to: 'Eswar Reddy', type: 'Electric Bill', date: 'September, 25', amount: '₹2584.43', status: 'Pending' },
    { id: 6, to: 'Eswar Reddy', type: 'Insurance', date: 'September, 25', amount: '₹10000.00', status: 'Completed' },
];
function Payments() {

    const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case 'completed':
      case 'success':
        return 'status-completed';
      case 'failed':
        return 'status-failed';
      case 'pending':
        return 'status-pending';
      default:
        return '';
    }
  };
  return (
    <div className='payments'>
        <div className="section-1">
            <div className="left">
                <DebitCards/>
                <div className="bills">
                    <div className="head">
                        <p className="title">Recharge & Bills</p>
                        <p className="see-all">All Categories →</p>
                    </div>
                    <div className="types">
                        <div className="type">
                            <img src={card} alt="Wallet" />
                            <p>History</p>
                        </div>
                        <div className="type">
                            <img src={card} alt="Wallet" />
                            <p>History</p>
                        </div>
                        <div className="type">
                            <img src={card} alt="Wallet" />
                            <p>History</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="payment-methods">
                <div className="head">
                    <p className="title">Payment Methods</p>
                </div>
                <div className="methods-grid">
                    <div className="method">
                        <img src={wallet} alt="Digital Wallet" />
                        <p>Transfer via Card Number</p>
                    </div>
                    <div className="method">
                        <img src={card} alt="Credit Card" />
                        <p>Transfer to Other banks</p>
                    </div>
                    <div className="method">
                        <img src={transfer} alt="Bank Transfer" />
                        <p>Self Transfer</p>
                    </div>
                    <div className="method">
                        <img src={ticket} alt="Bill Payment" />
                        <p>Transfer via Mobile / UPI ID</p>
                    </div>
                </div>
            </div>
        </div>
        <div className="activities-container">
      <h2>Recent Activities</h2>
      <div className="table-wrapper">
        <table className="activities-table">
          <thead>
            <tr>
              <th>To</th>
              <th>Type</th>
              <th>Date</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {transactionsData.map((transaction) => (
              <tr key={transaction.id}>
                <td>{transaction.to}</td>
                <td>{transaction.type}</td>
                <td>{transaction.date}</td>
                <td>{transaction.amount}</td>
                <td>
                  <span className={`status ${getStatusClass(transaction.status)}`}>
                    {transaction.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    </div>
  )
}

export default Payments