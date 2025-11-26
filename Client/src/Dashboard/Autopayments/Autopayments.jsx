import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Autopayments.css';
import { CheckCircle, AlertCircle, Loader, ArrowLeft, Tv, Zap } from 'lucide-react';

const API = 'http://localhost:6060';

const Autopayments = ({ setActiveTab }) => {
    const [activeSection, setActiveSection] = useState('loans'); // 'loans' or 'subscriptions'
    const [loans, setLoans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [status, setStatus] = useState({ type: '', message: '' });
    const [totalDue, setTotalDue] = useState(0);

    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');

    function CloudIcon({ size }) { return <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.5 19c0-3.037-2.463-5.5-5.5-5.5S6.5 15.963 6.5 19" /><path d="M19 19v-2a3 3 0 0 0-3-3" /><path d="M5 19v-2a3 3 0 0 1 3-3" /><path d="M12 13.5V9" /><path d="M12 5a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" /></svg> }

    // Mock Subscriptions Data with State
    const [subscriptions, setSubscriptions] = useState([
        { id: 1, name: 'Netflix Premium', amount: 649, date: '5th of every month', icon: Tv, status: 'Active' },
        { id: 2, name: 'Spotify Duo', amount: 149, date: '12th of every month', icon: Zap, status: 'Active' },
        { id: 3, name: 'Google One', amount: 130, date: '28th of every month', icon: CloudIcon, status: 'Active' },
    ]);

    useEffect(() => {
        fetchLoans();
    }, []);

    const fetchLoans = async () => {
        try {
            const res = await axios.get(`${API}/api/loans/user/${userId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            const activeLoans = res.data.filter(loan => loan.status === 'ACTIVE');
            setLoans(activeLoans);

            const total = activeLoans.reduce((sum, loan) => {
                const emiStr = loan.monthlyEmi.replace(/[^0-9.]/g, '');
                return sum + (Number(emiStr) || 0);
            }, 0);

            setTotalDue(total);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching loans:", err);
            setLoading(false);
        }
    };

    const handleProcessAutopay = async () => {
        setProcessing(true);
        setStatus({ type: '', message: '' });

        try {
            const res = await axios.post(`${API}/api/autopayments/process/${userId}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setStatus({ type: 'success', message: res.data });
        } catch (err) {
            const errorMsg = err.response?.data || "Transaction failed. Please try again.";
            setStatus({ type: 'error', message: errorMsg });
        } finally {
            setProcessing(false);
        }
    };

    const toggleSubscription = (id) => {
        setSubscriptions(subs => subs.map(sub => {
            if (sub.id === id) {
                return { ...sub, status: sub.status === 'Active' ? 'Paused' : 'Active' };
            }
            return sub;
        }));
    };

    if (loading) return <div className="loading-spinner"><Loader className="animate-spin" /> Loading...</div>;

    return (
        <div className="autopayments-container">
            <div className="autopayments-top-bar">
                <button className="back-btn" onClick={() => setActiveTab('Dashboard')}>
                    <ArrowLeft size={20} /> Back
                </button>
                <h2>Autopayments</h2>
            </div>

            <div className="autopayments-tabs">
                <button
                    className={`tab-btn ${activeSection === 'loans' ? 'active' : ''}`}
                    onClick={() => setActiveSection('loans')}
                >
                    EMI / LOANS
                </button>
                <button
                    className={`tab-btn ${activeSection === 'subscriptions' ? 'active' : ''}`}
                    onClick={() => setActiveSection('subscriptions')}
                >
                    SUBSCRIPTIONS
                </button>
            </div>

            {activeSection === 'loans' ? (
                <div className="section-content fade-in">
                    <div className="autopayments-summary-card">
                        <div className="summary-info">
                            <h3>Total Monthly Commitment</h3>
                            <div className="total-amount">₹{totalDue.toLocaleString()}</div>
                        </div>

                        <button
                            className="process-btn"
                            onClick={handleProcessAutopay}
                            disabled={processing || totalDue === 0}
                        >
                            {processing ? <Loader className="animate-spin" size={20} /> : <CheckCircle size={20} />}
                            {processing ? 'Processing...' : 'Process Autopay'}
                        </button>
                    </div>

                    {status.message && (
                        <div className={`status-message ${status.type}`}>
                            {status.type === 'error' && <AlertCircle size={18} style={{ display: 'inline', marginRight: '8px' }} />}
                            {status.message}
                        </div>
                    )}

                    <div className="loans-list-container">
                        <div className="loans-list-header">
                            <span>Loan Type</span>
                            <span>Monthly EMI</span>
                        </div>

                        {loans.length > 0 ? (
                            loans.map((loan) => (
                                <div className="loan-item" key={loan.id}>
                                    <div className="loan-info">
                                        <h4>{loan.loanType}</h4>
                                        <p>Account: {loan.accountNumber}</p>
                                    </div>
                                    <div className="loan-emi">
                                        {loan.monthlyEmi}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="no-loans">
                                <p>No active loans found.</p>
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <div className="section-content fade-in">
                    <div className="subscriptions-list">
                        {subscriptions.map(sub => (
                            <div className={`subscription-card ${sub.status === 'Paused' ? 'paused' : ''}`} key={sub.id}>
                                <div className="sub-icon-wrapper">
                                    <sub.icon size={24} />
                                </div>
                                <div className="sub-details">
                                    <h4>{sub.name}</h4>
                                    <p>{sub.status === 'Active' ? `Auto-debit on ${sub.date}` : 'Autopay paused'}</p>
                                </div>
                                <div className="sub-right-col">
                                    <div className="sub-amount">
                                        ₹{sub.amount}
                                    </div>
                                    <label className="switch-toggle" title={sub.status === 'Active' ? 'Stop Autopay' : 'Resume Autopay'}>
                                        <input
                                            type="checkbox"
                                            checked={sub.status === 'Active'}
                                            onChange={() => toggleSubscription(sub.id)}
                                        />
                                        <span className="slider"></span>
                                    </label>
                                </div>
                            </div>
                        ))}

                        <div className="add-sub-card" onClick={() => setActiveTab('Dashboard')}>
                            <p>+ Add New Subscription</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Autopayments;
