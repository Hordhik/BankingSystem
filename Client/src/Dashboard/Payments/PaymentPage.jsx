import React, { useState, useEffect } from 'react';
import QRCode from 'react-qr-code';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import './PaymentPage.css';
import { CreditCard, Landmark, Smartphone, Wallet, LayoutDashboard, ArrowLeft, Check, XCircle } from 'lucide-react';
import { transfer, cardTransfer, getAccounts, getCards } from '../../services/bankApi';

export default function PaymentPage() {
  const location = useLocation();
  const { type } = useParams();
  const navigate = useNavigate();
  const [selectedPayment, setSelectedPayment] = useState('card');
  const billTypeKeys = ['mobile', 'dth', 'electricity', 'gas', 'broadband', 'water', 'insurance', 'education'];
  const [billType, setBillType] = useState('');
  const [selectedBank, setSelectedBank] = useState('');
  const [paymentDetails, setPaymentDetails] = useState({
    myCardNumber: '',
    cardHolder: '',
    expiry: '',
    cvv: '',
    receiverCardNumber: '',
    receiverAccount: '',
    amount: '',
  });
  // ... existing billDetails state ...
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
  const [cards, setCards] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showFailure, setShowFailure] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Loan Payment State
  const isLoanPayment = location.state?.isLoanPayment || false;
  const loanDetails = location.state?.loanDetails || null;

  const paymentTypes = [
    { key: 'card', label: 'Card', icon: CreditCard },
    { key: 'banks', label: 'Bank Transfer', icon: Landmark },
    { key: 'self', label: 'Self Transfer', icon: Smartphone },
    { key: 'upi', label: 'UPI', icon: Wallet },
    { key: 'wallet', label: 'Wallet', icon: Wallet },
  ];

  const bankList = ['HDFC Bank', 'ICICI Bank', 'SBI', 'Axis Bank', 'Kotak Bank'];

  // Preselect via route param or location state
  useEffect(() => {
    if (isLoanPayment) {
      if (location.state?.preselectedMethod) {
        // Map uppercase to lowercase if needed, or use direct value
        const method = location.state.preselectedMethod.toLowerCase();
        const methodMap = { 'card': 'card', 'upi': 'upi', 'netbanking': 'banks', 'banks': 'banks' };
        setSelectedPayment(methodMap[method] || 'card');
      }
      if (location.state?.amount) {
        setPaymentDetails(prev => ({ ...prev, amount: String(location.state.amount) }));
      }
      return;
    }

    if (!type) return;
    const key = String(type).toLowerCase();
    const match = paymentTypes.find(p => p.key === key);
    if (match) {
      setSelectedPayment(match.key);
      setBillType('');
    } else if (billTypeKeys.includes(key)) {
      setBillType(key);
    }
  }, [type, isLoanPayment]);

  // Auto-fill card details from localStorage or Database
  useEffect(() => {
    const savedCard = localStorage.getItem('cardNumber');
    if (savedCard) {
      setPaymentDetails(prev => ({
        ...prev,
        myCardNumber: savedCard,
        cardHolder: localStorage.getItem('cardHolder') || '',
        expiry: localStorage.getItem('cardExpiry') || '',
        cvv: ''
      }));
    }
  }, []);

  // Generate QR Code
  useEffect(() => {
    if (selectedPayment === 'upi') {
      const randomRef = Math.floor(100000 + Math.random() * 900000);
      setQrRef(randomRef);
      setQrValue(`upi://pay?pa=shop@bank&pn=Shop&am=${paymentDetails.amount || '0'}&tr=${randomRef}&tn=Payment`);
    }
  }, [selectedPayment, paymentDetails.amount]);

  // Fetch Accounts and Cards
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cardsData, accountsData] = await Promise.all([getCards(), getAccounts()]);
        setCards(cardsData || []);
        setAccounts(accountsData || []);

        // Prefill sender card details if available
        if (cardsData && cardsData.length > 0) {
          const myCard = cardsData[0]; // Assuming the first card is the primary one
          setPaymentDetails(prev => ({
            ...prev,
            myCardNumber: prev.myCardNumber || myCard.cardNumber,
            cardHolder: prev.cardHolder || myCard.ownerName,
            expiry: prev.expiry || myCard.expiryDate,
            cvv: prev.cvv || myCard.cvv
          }));
        }
      } catch (error) {
        console.error("Failed to fetch payment data:", error);
      }
    };
    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPaymentDetails((prev) => ({ ...prev, [name]: value }));
  };

  const parseAmt = (v) => {
    const n = parseFloat(v);
    return Number.isFinite(n) ? n : 0;
  };

  const amount = parseAmt(paymentDetails.amount);
  // Zero fees for loan payments
  const convenienceFee = isLoanPayment ? 0 : (amount ? Math.max(2, amount * 0.01) : 0);
  const taxes = isLoanPayment ? 0 : (amount ? +(convenienceFee * 0.18).toFixed(2) : 0);
  const total = +(amount + convenienceFee + taxes).toFixed(2);

  const handlePay = async (e) => {
    if (e) e.preventDefault();

    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }
    if (!selectedPayment) {
      alert('Please select a payment method');
      return;
    }

    // For bank transfer, validate receiver ONLY if NOT loan payment
    if (!isLoanPayment && selectedPayment === 'banks' && !paymentDetails.receiverAccount) {
      alert('Please select a receiver account');
      return;
    }

    setIsProcessing(true);

    // Simulate processing delay for "Premium" feel
    await new Promise(resolve => setTimeout(resolve, 600));

    try {
      const numericAmount = Number(amount);
      const fee = convenienceFee;
      const tax = taxes;
      const totalDebited = (numericAmount + fee + tax).toFixed(2);

      if (isLoanPayment) {
        // Loan Payment Logic
        const receipt = {
          transactionId: "TXN" + Math.random().toString(36).substr(2, 9).toUpperCase(),
          dateISO: new Date().toISOString(),
          amount: `- ₹${numericAmount.toFixed(2)}`,
          to: `Loan Repayment (${loanDetails?.product || 'Loan'})`,
          type: 'LOAN_PAYMENT',
          status: 'Completed',
          fee: `₹0.00`,
          tax: `₹0.00`,
          totalDebited: `₹${totalDebited}`
        };

        setShowSuccess(true);
        setTimeout(() => {
          navigate('/dashboard', {
            state: {
              activeTab: 'Transactions',
              receipt: receipt
            }
          });
        }, 2500);
        return;
      }

      if (selectedPayment === 'banks') {
        const fromAccountId = localStorage.getItem('primaryAccountId');
        if (!fromAccountId) {
          throw new Error("Account ID not found. Please login again.");
        }
        // Pass fee and tax to backend
        await transfer(fromAccountId, paymentDetails.receiverAccount, numericAmount, fee, tax);

        // Construct receipt object
        const receipt = {
          transactionId: "TXN" + Math.random().toString(36).substr(2, 9).toUpperCase(),
          dateISO: new Date().toISOString(),
          amount: `- ₹${numericAmount.toFixed(2)}`,
          to: accounts.find(a => a.id == paymentDetails.receiverAccount)?.ownerName || 'Unknown',
          type: 'TRANSFER_SENT',
          status: 'Completed',
          fee: `₹${fee.toFixed(2)}`,
          tax: `₹${tax.toFixed(2)}`,
          totalDebited: `₹${totalDebited}`
        };

        setShowSuccess(true);

        // Redirect after animation
        setTimeout(() => {
          navigate('/dashboard', {
            state: {
              activeTab: 'Transactions',
              receipt: receipt
            }
          });
        }, 2500);

      } else if (selectedPayment === 'card') {
        // Remove spaces from card numbers
        const fromCard = paymentDetails.myCardNumber.replace(/\s/g, '');
        const toCard = paymentDetails.receiverCardNumber.replace(/\s/g, '');

        await cardTransfer(fromCard, toCard, amount, paymentDetails.cvv, paymentDetails.expiry);

        // Construct receipt object for Card Transfer
        const receipt = {
          transactionId: "TXN" + Math.random().toString(36).substr(2, 9).toUpperCase(),
          dateISO: new Date().toISOString(),
          amount: `- ₹${numericAmount.toFixed(2)}`,
          to: cards.find(c => c.cardNumber === paymentDetails.receiverCardNumber)?.ownerName || 'Card Transfer',
          type: 'CARD_PAYMENT',
          status: 'Completed',
          fee: `₹${fee.toFixed(2)}`,
          tax: `₹${tax.toFixed(2)}`,
          totalDebited: `₹${totalDebited}`
        };

        setShowSuccess(true);

        // Redirect after animation
        setTimeout(() => {
          navigate('/dashboard', {
            state: {
              activeTab: 'Transactions',
              receipt: receipt
            }
          });
        }, 2500);

      } else {
        // Mock for other types
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 1800);
      }
    } catch (err) {
      console.error("Payment failed:", err);

      // Construct failed receipt object
      const numericAmount = Number(amount);
      const fee = convenienceFee;
      const tax = taxes;
      const totalDebited = (numericAmount + fee + tax).toFixed(2);

      const failedReceipt = {
        transactionId: "TXN" + Math.random().toString(36).substr(2, 9).toUpperCase(),
        dateISO: new Date().toISOString(),
        amount: `- ₹${numericAmount.toFixed(2)}`,
        to: isLoanPayment ? `Loan Repayment (${loanDetails?.product})` : (accounts.find(a => a.id == paymentDetails.receiverAccount)?.ownerName || 'Unknown'),
        type: isLoanPayment ? 'LOAN_PAYMENT' : 'TRANSFER_SENT',
        status: 'Failed',
        fee: `₹${fee.toFixed(2)}`,
        tax: `₹${tax.toFixed(2)}`,
        totalDebited: `₹${totalDebited}`
      };

      setShowFailure(true);

      // Redirect after animation
      setTimeout(() => {
        navigate('/dashboard', {
          state: {
            activeTab: 'Transactions',
            receipt: failedReceipt
          }
        });
      }, 2500);

    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className={`payment-page ${billType ? 'is-bill' : ''}`}>
      <Link to="/dashboard" className="back-link">
        <ArrowLeft size={18} /> Back to Dashboard
      </Link>

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
                <p.icon size={20} strokeWidth={1.5} className="method-icon-img" />
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

                <label>Receiver Card Number</label>
                {!isLoanPayment && (
                  <select
                    name="receiverCardNumber"
                    value={paymentDetails.receiverCardNumber}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Choose Card</option>
                    {cards.map(card => (
                      <option key={card.id} value={card.cardNumber}>
                        {card.ownerName} ({card.cardNumber})
                      </option>
                    ))}
                  </select>
                )}
                {isLoanPayment && (
                  <input
                    type="text"
                    value="Loan Repayment"
                    disabled
                    className="disabled-input"
                  />
                )}
              </>
            )}

            {selectedPayment !== 'card' && (
              <>
                <h3>{selectedPayment === 'wallet' ? 'Wallet Details' : 'Receiver Details'}</h3>

                {isLoanPayment ? (
                  <>
                    <label>Receiver Account</label>
                    <input
                      type="text"
                      value="Loan Repayment"
                      disabled
                      className="disabled-input"
                    />
                  </>
                ) : (
                  <>
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
                              {acc.ownerName}  ({acc.accountNumber})
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
          <button className="pay-btn summary-btn" onClick={handlePay} disabled={!amount || isProcessing}>
            {isProcessing ? 'Processing...' : (selectedPayment === 'wallet' ? 'Add Money' : 'Pay Now')}
          </button>
          <p className="summary-note">Fees are illustrative. No real payments are processed.</p>
        </aside>
      </div>

      {showSuccess && (
        <div className="success-overlay">
          <div className="success-modal">
            <div className="success-check">
              <Check size={32} strokeWidth={3} color="white" />
            </div>
            <div className="success-text">Payment Successful</div>
          </div>
        </div>
      )}

      {showFailure && (
        <div className="success-overlay">
          <div className="success-modal failure-modal">
            <div className="success-check failure-check">
              <XCircle size={32} strokeWidth={3} color="white" />
            </div>
            <div className="success-text">Payment Failed</div>
            <div className="failure-reason">Insufficient Funds</div>
          </div>
        </div>
      )}
    </div>
  );
}
