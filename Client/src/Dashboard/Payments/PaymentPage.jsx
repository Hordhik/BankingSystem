import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import './PaymentPage.css';
import cardIcon from '/src/assets/icons/card.svg';
import transferIcon from '/src/assets/icons/transfer.svg';
import walletIcon from '/src/assets/icons/wallet.svg';
import dashboardIcon from '/src/assets/icons/dashboard.svg';

export default function PaymentPage() {
  const { type } = useParams();
  const [selectedPayment, setSelectedPayment] = useState('card');
  const billTypeKeys = ['mobile','dth','electricity','gas'];
  const [billType, setBillType] = useState('');
  const [selectedBank, setSelectedBank] = useState('');
  const [paymentDetails, setPaymentDetails] = useState({
    myCardNumber: '',
    cardHolder: '',
    expiry: '',
    cvv: '',
    receiverAccount: '',
    amount: '',
  });
  const [billDetails, setBillDetails] = useState({
    operator: '',
    provider: '',
    customerId: '',
    consumerNumber: '',
    mobileNumber: '',
    state: '',
  });

  const paymentTypes = [
    { key: 'card', label: 'Card' },
    { key: 'banks', label: 'Bank Transfer' },
    { key: 'self', label: 'Self Transfer' },
    { key: 'upi', label: 'UPI' },
  ];

  const bankList = ['HDFC Bank', 'ICICI Bank', 'SBI', 'Axis Bank', 'Kotak Bank'];

  // Preselect via route param if provided
  useEffect(() => {
    if (!type) return;
    const key = String(type).toLowerCase();
    const match = paymentTypes.find(p => p.key === key);
    if (match) {
      setSelectedPayment(match.key);
      setBillType('');
    } else if (billTypeKeys.includes(key)) {
      setBillType(key);
    }
  }, [type]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPaymentDetails((prev) => ({ ...prev, [name]: value }));
  };

  const parseAmt = (v) => {
    const n = parseFloat(v);
    return Number.isFinite(n) ? n : 0;
  };

  const amount = parseAmt(paymentDetails.amount);
  const convenienceFee = amount ? Math.max(2, amount * 0.01) : 0; // 1% (min 2)
  const taxes = amount ? +(convenienceFee * 0.18).toFixed(2) : 0; // 18% GST on fee
  const total = +(amount + convenienceFee + taxes).toFixed(2);

  const handlePay = (e) => {
    if (e) e.preventDefault();
    alert(`Processing ${selectedPayment} payment of ₹${amount.toFixed(2)}...`);
  };

  return (
    <div className={`payment-page ${billType ? 'is-bill' : ''}`}>
      <Link to="/dashboard" className="back-link">← Back to Dashboard</Link>

      <div className="payment-3col">
        {/* 1) Selecting Payment Methods */}
        <section className="panel methods">
          <h2 className="panel-title">Select Payment Method</h2>
          <div className="methods-grid">
            {(billType ? paymentTypes.filter((p)=>p.key !== 'self') : paymentTypes).map((p) => (
              <button
                type="button"
                key={p.key}
                className={`method-card ${selectedPayment === p.key ? 'selected' : ''}`}
                onClick={() => setSelectedPayment(p.key)}
              >
                <img
                  className="method-icon-img"
                  src={
                    p.key === 'card' ? cardIcon :
                    p.key === 'banks' ? transferIcon :
                    p.key === 'upi' ? walletIcon :
                    dashboardIcon
                  }
                  alt={p.label}
                />
                <span>{p.label}</span>
              </button>
            ))}
          </div>
        </section>

        {/* 2) Payment Details */}
        <section className="panel details">
          <h2 className="panel-title">Payment Details</h2>
          <form className="payment-form" onSubmit={handlePay}>
            {/* Bill details section (only when coming from Recharge & Bills) */}
            {billType && (
              <div className="bill-details">
                <h3>Bill Details</h3>
                {billType === 'mobile' && (
                  <div className="field-grid">
                    <div className="form-field">
                      <label>Mobile Number</label>
                      <input
                        type="tel"
                        name="mobileNumber"
                        placeholder="10-digit mobile number"
                        value={billDetails.mobileNumber}
                        onChange={(e)=>setBillDetails(prev=>({...prev, mobileNumber: e.target.value}))}
                        required
                      />
                    </div>
                    <div className="form-field">
                      <label>Operator</label>
                      <input
                        type="text"
                        name="operator"
                        placeholder="e.g., Airtel, Jio"
                        value={billDetails.operator}
                        onChange={(e)=>setBillDetails(prev=>({...prev, operator: e.target.value}))}
                        required
                      />
                    </div>
                  </div>
                )}

                {billType === 'dth' && (
                  <div className="field-grid">
                    <div className="form-field">
                      <label>Customer ID</label>
                      <input
                        type="text"
                        name="customerId"
                        placeholder="DTH Customer ID"
                        value={billDetails.customerId}
                        onChange={(e)=>setBillDetails(prev=>({...prev, customerId: e.target.value}))}
                        required
                      />
                    </div>
                    <div className="form-field">
                      <label>Provider</label>
                      <input
                        type="text"
                        name="provider"
                        placeholder="e.g., Tata Play, Airtel DTH"
                        value={billDetails.provider}
                        onChange={(e)=>setBillDetails(prev=>({...prev, provider: e.target.value}))}
                        required
                      />
                    </div>
                  </div>
                )}

                {billType === 'electricity' && (
                  <div className="field-grid">
                    <div className="form-field">
                      <label>Consumer Number</label>
                      <input
                        type="text"
                        name="consumerNumber"
                        placeholder="Electricity Consumer Number"
                        value={billDetails.consumerNumber}
                        onChange={(e)=>setBillDetails(prev=>({...prev, consumerNumber: e.target.value}))}
                        required
                      />
                    </div>
                    <div className="form-field">
                      <label>State / Board</label>
                      <input
                        type="text"
                        name="state"
                        placeholder="e.g., TSSPDCL"
                        value={billDetails.state}
                        onChange={(e)=>setBillDetails(prev=>({...prev, state: e.target.value}))}
                        required
                      />
                    </div>
                  </div>
                )}

                {billType === 'gas' && (
                  <div className="field-grid">
                    <div className="form-field">
                      <label>Customer ID</label>
                      <input
                        type="text"
                        name="customerId"
                        placeholder="Gas Customer ID"
                        value={billDetails.customerId}
                        onChange={(e)=>setBillDetails(prev=>({...prev, customerId: e.target.value}))}
                        required
                      />
                    </div>
                    <div className="form-field">
                      <label>Provider</label>
                      <input
                        type="text"
                        name="provider"
                        placeholder="e.g., Adani, IGL"
                        value={billDetails.provider}
                        onChange={(e)=>setBillDetails(prev=>({...prev, provider: e.target.value}))}
                        required
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            <label>Amount (₹)</label>
            <input
              type="number"
              name="amount"
              min="1"
              step="0.01"
              placeholder="1000"
              value={paymentDetails.amount}
              onChange={handleInputChange}
              required
            />

            {selectedPayment === 'card' && (
              <>
                <h3>Card Details</h3>
                <label>My Card Number</label>
                <input
                  type="text"
                  name="myCardNumber"
                  placeholder="XXXX XXXX XXXX XXXX"
                  value={paymentDetails.myCardNumber}
                  onChange={handleInputChange}
                  required
                />

                <label>Card Holder</label>
                <input
                  type="text"
                  name="cardHolder"
                  placeholder="Your Name"
                  value={paymentDetails.cardHolder}
                  onChange={handleInputChange}
                  required
                />

                <div className="card-details-row">
                  <div>
                    <label>Expiry</label>
                    <input
                      type="text"
                      name="expiry"
                      placeholder="MM/YY"
                      value={paymentDetails.expiry}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <label>CVV</label>
                    <input
                      type="password"
                      name="cvv"
                      placeholder="***"
                      value={paymentDetails.cvv}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
              </>
            )}

            {selectedPayment !== 'card' && (
              <>
                <h3>Receiver Details</h3>
                <label>Receiver Account / UPI</label>
                <input
                  type="text"
                  name="receiverAccount"
                  placeholder={selectedPayment === 'upi' ? 'name@bank' : 'Enter account number'}
                  value={paymentDetails.receiverAccount}
                  onChange={handleInputChange}
                  required
                />

                {selectedPayment === 'banks' && (
                  <>
                    <label>Select Bank</label>
                    <select
                      name="bank"
                      value={selectedBank}
                      onChange={(e) => setSelectedBank(e.target.value)}
                      required
                    >
                      <option value="">Choose Bank</option>
                      {bankList.map((bank) => (
                        <option key={bank} value={bank}>{bank}</option>
                      ))}
                    </select>
                  </>
                )}
              </>
            )}

            {/* Pay Now moved to Summary panel */}
          </form>
        </section>

        {/* 3) Total payment summary */}
        <aside className="panel summary">
          <h2 className="panel-title">Total Payment</h2>
          <div className="summary-row"><span>Amount</span><span>₹{amount.toFixed(2)}</span></div>
          <div className="summary-row"><span>Convenience Fee</span><span>₹{convenienceFee.toFixed(2)}</span></div>
          <div className="summary-row"><span>Taxes (18%)</span><span>₹{taxes.toFixed(2)}</span></div>
          <div className="summary-total"><span>Total</span><span>₹{total.toFixed(2)}</span></div>
          <button className="pay-btn summary-btn" onClick={handlePay} disabled={!amount}>Pay Now</button>
          <p className="summary-note">Fees are illustrative. No real payments are processed.</p>
        </aside>
      </div>
    </div>
  );
}
