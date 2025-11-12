import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import './PaymentPage.css';

export default function PaymentPage() {
  const { type } = useParams();
  const [activeTab, setActiveTab] = useState('billing');
  const [selectedBill, setSelectedBill] = useState('');
  const [selectedPayment, setSelectedPayment] = useState('');
  const [selectedBank, setSelectedBank] = useState('');
  const [paymentDetails, setPaymentDetails] = useState({
    myCardNumber: '',
    cardHolder: '',
    expiry: '',
    cvv: '',
    receiverAccount: '',
  });

  const billTypes = ['Mobile', 'DTH', 'Electricity', 'Gas', 'Water', 'Broadband'];
  const paymentTypes = [
    { key: 'card', label: 'Transfer via Card Number' },
    { key: 'banks', label: 'Transfer to Other Banks' },
    { key: 'self', label: 'Self Transfer' },
    { key: 'upi', label: 'Transfer via Mobile / UPI ID' },
  ];

  const bankList = ['HDFC Bank', 'ICICI Bank', 'SBI', 'Axis Bank', 'Kotak Bank'];

  // Auto-select based on URL param
  useEffect(() => {
    if (!type) return;

    const normalizedType = type.toLowerCase();

    const matchedBill = billTypes.find(
        (b) => b.toLowerCase() === normalizedType
    );
    const matchedPayment = paymentTypes.find(
        (p) => p.key.toLowerCase() === normalizedType
    );

    if (matchedBill) {
        setActiveTab('billing');
        setSelectedBill(matchedBill);
    } else if (matchedPayment) {
        setActiveTab('payment');
        setSelectedPayment(matchedPayment.key);
    }
    }, [type]);


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPaymentDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handlePay = (e) => {
    e.preventDefault();
    const selected = selectedBill || selectedPayment;
    alert(`Processing ${selected || 'General'} Payment...`);
  };

  return (
    <div className="payment-page">
      <Link to="/" className="back-link">← Back to Dashboard</Link>

      <div className="payment-page__header">
        <button
          className={`tab-btn ${activeTab === 'billing' ? 'active' : ''}`}
          onClick={() => setActiveTab('billing')}
        >
          Billing
        </button>
        <button
          className={`tab-btn ${activeTab === 'payment' ? 'active' : ''}`}
          onClick={() => setActiveTab('payment')}
        >
          Payment
        </button>
      </div>

      <div className="payment-page__content">
        {/* BILLING SECTION */}
        {activeTab === 'billing' && (
          <div className="billing-section">
            <h2>Select Bill Type</h2>
            <div className="billing-options">
              {billTypes.map((bill) => (
                <div
                  key={bill}
                  className={`bill-type ${selectedBill === bill ? 'selected' : ''}`}
                  onClick={() => setSelectedBill(bill)}
                >
                  {bill}
                </div>
              ))}
            </div>

            {selectedBill && (
              <div className="billing-input">
                <label htmlFor="bill-id">Enter {selectedBill} ID / Number</label>
                <input id="bill-id" type="text" placeholder={`Enter your ${selectedBill} ID`} />
              </div>
            )}
          </div>
        )}

        {/* PAYMENT SECTION */}
        {activeTab === 'payment' && (
          <div className="payment-section">
            <h2>Select Payment Type</h2>
            <div className="payment-type-grid">
              {paymentTypes.map((p) => (
                <div
                  key={p.key}
                  className={`payment-type ${selectedPayment === p.key ? 'selected' : ''}`}
                  onClick={() => setSelectedPayment(p.key)}
                >
                  {p.label}
                </div>
              ))}
            </div>

            {selectedPayment && (
              <form className="payment-form" onSubmit={handlePay}>
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

                <h3>Receiver Details</h3>
                <label>Receiver Account Number</label>
                <input
                  type="text"
                  name="receiverAccount"
                  placeholder="Enter receiver's account number"
                  value={paymentDetails.receiverAccount}
                  onChange={handleInputChange}
                  required
                />

                {/* Show additional dropdown for “Transfer to Other Banks” */}
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

                <button type="submit" className="pay-btn">
                  Pay Now
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
