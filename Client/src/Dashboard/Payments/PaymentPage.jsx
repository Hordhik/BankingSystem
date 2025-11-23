import React, { useState, useEffect } from 'react';
import QRCode from 'react-qr-code';
import { useParams, Link } from 'react-router-dom';
import './PaymentPage.css';
import cardIcon from '/src/assets/icons/card.svg';
import transferIcon from '/src/assets/icons/transfer.svg';
import walletIcon from '/src/assets/icons/wallet.svg';
import dashboardIcon from '/src/assets/icons/dashboard.svg';
import { transfer, getAccounts } from '../../services/bankApi';

export default function PaymentPage() {
  const { type } = useParams();
  const [selectedPayment, setSelectedPayment] = useState('card');
  const billTypeKeys = ['mobile', 'dth', 'electricity', 'gas', 'broadband', 'water', 'insurance', 'education'];
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
  const [qrRef, setQrRef] = useState('');
  const [qrValue, setQrValue] = useState('');
  const [accounts, setAccounts] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);

  const paymentTypes = [
    { key: 'card', label: 'Card' },
    { key: 'banks', label: 'Bank Transfer' },
    { key: 'self', label: 'Self Transfer' },
    { key: 'upi', label: 'UPI' },
    { key: 'wallet', label: 'Wallet' },
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

  // Generate a fresh QR value when UPI/QR is selected or amount changes
  useEffect(() => {
    if (selectedPayment !== 'upi') return;
    const ref = `UPI-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
    setQrRef(ref);
    const amt = amount || 0;
    const payload = `upi://pay?pa=demo@bank&pn=Demo%20Merchant&am=${amt}&tn=${encodeURIComponent(ref)}`;
    setQrValue(payload);
  }, [selectedPayment, paymentDetails.amount, billType]);

  // Fetch accounts when Bank Transfer is selected
  useEffect(() => {
    if (selectedPayment === 'banks') {
      getAccounts().then(data => {
        const myAccountId = localStorage.getItem('primaryAccountId');
        // Filter out current user's account
        const filtered = data.filter(acc => acc.id.toString() !== myAccountId);
        setAccounts(filtered);
      }).catch(err => console.error('Failed to fetch accounts:', err));
    }
  }, [selectedPayment]);

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

  const handlePay = async (e) => {
    if (e) e.preventDefault();

    if (selectedPayment === 'banks') {
      try {
        const fromId = localStorage.getItem('primaryAccountId');
        if (!fromId) {
          alert("Account ID not found. Please login again.");
          return;
        }
        await transfer(fromId, paymentDetails.receiverAccount, amount);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 1800);
      } catch (err) {
        console.error("Transfer failed", err);
        alert("Transfer failed: " + (err.message || "Unknown error"));
      }
    } else {
      // Mock for other types
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 1800);
    }
  };

  return (
    <div className={`payment-page ${billType ? 'is-bill' : ''}`}>
      <Link to="/dashboard" className="back-link">← Back to Dashboard</Link>

      <div className="payment-3col">
        {/* 1) Selecting Payment Methods */}
        <section className="panel methods">
          <h2 className="panel-title">Select Payment Method</h2>
          <div className="methods-grid">
            {(billType ? paymentTypes.filter((p) => p.key !== 'self') : paymentTypes).map((p) => (
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
                          p.key === 'wallet' ? walletIcon :
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
                        onChange={(e) => setBillDetails(prev => ({ ...prev, mobileNumber: e.target.value }))}
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
                        onChange={(e) => setBillDetails(prev => ({ ...prev, operator: e.target.value }))}
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
                        onChange={(e) => setBillDetails(prev => ({ ...prev, customerId: e.target.value }))}
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
                        onChange={(e) => setBillDetails(prev => ({ ...prev, provider: e.target.value }))}
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
                        onChange={(e) => setBillDetails(prev => ({ ...prev, consumerNumber: e.target.value }))}
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
                        onChange={(e) => setBillDetails(prev => ({ ...prev, state: e.target.value }))}
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
                        onChange={(e) => setBillDetails(prev => ({ ...prev, customerId: e.target.value }))}
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
                        onChange={(e) => setBillDetails(prev => ({ ...prev, provider: e.target.value }))}
                        required
                      />
                    </div>
                  </div>
                )}

                {billType === 'broadband' && (
                  <div className="field-grid">
                    <div className="form-field">
                      <label>Customer ID</label>
                      <input
                        type="text"
                        name="customerId"
                        placeholder="Broadband Customer ID"
                        value={billDetails.customerId}
                        onChange={(e) => setBillDetails(prev => ({ ...prev, customerId: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="form-field">
                      <label>Provider</label>
                      <input
                        type="text"
                        name="provider"
                        placeholder="e.g., Airtel, JioFiber"
                        value={billDetails.provider}
                        onChange={(e) => setBillDetails(prev => ({ ...prev, provider: e.target.value }))}
                        required
                      />
                    </div>
                  </div>
                )}

                {billType === 'water' && (
                  <div className="field-grid">
                    <div className="form-field">
                      <label>Consumer Number</label>
                      <input
                        type="text"
                        name="consumerNumber"
                        placeholder="Water Consumer Number"
                        value={billDetails.consumerNumber}
                        onChange={(e) => setBillDetails(prev => ({ ...prev, consumerNumber: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="form-field">
                      <label>Board / City</label>
                      <input
                        type="text"
                        name="state"
                        placeholder="e.g., HMWS&SB"
                        value={billDetails.state}
                        onChange={(e) => setBillDetails(prev => ({ ...prev, state: e.target.value }))}
                        required
                      />
                    </div>
                  </div>
                )}

                {billType === 'insurance' && (
                  <div className="field-grid">
                    <div className="form-field">
                      <label>Policy Number</label>
                      <input
                        type="text"
                        name="customerId"
                        placeholder="Policy Number"
                        value={billDetails.customerId}
                        onChange={(e) => setBillDetails(prev => ({ ...prev, customerId: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="form-field">
                      <label>Provider</label>
                      <input
                        type="text"
                        name="provider"
                        placeholder="e.g., LIC, HDFC Life"
                        value={billDetails.provider}
                        onChange={(e) => setBillDetails(prev => ({ ...prev, provider: e.target.value }))}
                        required
                      />
                    </div>
                  </div>
                )}

                {billType === 'education' && (
                  <div className="field-grid">
                    <div className="form-field">
                      <label>Student ID</label>
                      <input
                        type="text"
                        name="customerId"
                        placeholder="Student ID"
                        value={billDetails.customerId}
                        onChange={(e) => setBillDetails(prev => ({ ...prev, customerId: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="form-field">
                      <label>Institute</label>
                      <input
                        type="text"
                        name="provider"
                        placeholder="Institute / University"
                        value={billDetails.provider}
                        onChange={(e) => setBillDetails(prev => ({ ...prev, provider: e.target.value }))}
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
                <h3>{selectedPayment === 'wallet' ? 'Wallet Details' : 'Receiver Details'}</h3>
                {selectedPayment === 'upi' && (
                  <div className="qr-box">
                    <div className="qr-inner">
                      <QRCode value={qrValue || 'upi://pay?pa=demo@bank'} size={140} />
                    </div>
                    <div className="qr-meta">
                      <span>Scan to pay</span>
                      <span className="qr-ref">Ref: {qrRef || '—'}</span>
                    </div>
                  </div>
                )}
                {selectedPayment === 'banks' ? (
                  <>
                    <label>Select Receiver Account</label>
                    <select
                      name="receiverAccount"
                      value={paymentDetails.receiverAccount}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Choose Account</option>
                      {accounts.map(acc => (
                        <option key={acc.id} value={acc.id}>
                          {acc.ownerName} - Account #{acc.id} ({acc.accountNumber})
                        </option>
                      ))}
                    </select>
                  </>
                ) : (
                  <>
                    <label>{selectedPayment === 'wallet' ? 'Wallet ID / Mobile' : 'Receiver Account / UPI'}</label>
                    <input
                      type="text"
                      name="receiverAccount"
                      placeholder={
                        selectedPayment === 'upi' ? 'name@bank' :
                          selectedPayment === 'wallet' ? 'wallet id or mobile number' :
                            'Enter account number'
                      }
                      value={paymentDetails.receiverAccount}
                      onChange={handleInputChange}
                      required
                    />
                  </>
                )}

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
          <button className="pay-btn summary-btn" onClick={handlePay} disabled={!amount}>{selectedPayment === 'wallet' ? 'Add Money' : 'Pay Now'}</button>
          <p className="summary-note">Fees are illustrative. No real payments are processed.</p>
        </aside>
      </div>
      {showSuccess && (
        <div className="success-overlay">
          <div className="success-modal">
            <div className="success-check">
              <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </div>
            <div className="success-text">Payment Successful</div>
          </div>
        </div>
      )}
    </div>
  );
}
