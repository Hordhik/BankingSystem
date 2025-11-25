import React from 'react';
import { CreditCard, Coins, ShieldCheck, Wallet, TrendingUp, Banknote, Landmark, ArrowRightLeft, PieChart } from 'lucide-react';
import './BackgroundAnimation.css';

const BackgroundAnimation = () => {
    return (
        <div className="hero-background-animation">
            <div className="floating-item icon-container coin-1">
                <Coins size={48} strokeWidth={1.5} />
            </div>
            <div className="floating-item icon-container wallet-1">
                <Wallet size={48} strokeWidth={1.5} />
            </div>
            <div className="floating-item icon-container card-1">
                <CreditCard size={64} strokeWidth={1.5} />
            </div>
            <div className="floating-item icon-container graph-1">
                <TrendingUp size={48} strokeWidth={1.5} />
            </div>
            <div className="floating-item icon-container shield-1">
                <ShieldCheck size={56} strokeWidth={1.5} />
            </div>
            <div className="floating-item icon-container cash-1">
                <Banknote size={52} strokeWidth={1.5} />
            </div>
            <div className="floating-item icon-container bank-1">
                <Landmark size={60} strokeWidth={1.5} />
            </div>
            <div className="floating-item icon-container transfer-1">
                <ArrowRightLeft size={40} strokeWidth={1.5} />
            </div>
            <div className="floating-item icon-container chart-1">
                <PieChart size={44} strokeWidth={1.5} />
            </div>
        </div>
    );
};

export default BackgroundAnimation;
