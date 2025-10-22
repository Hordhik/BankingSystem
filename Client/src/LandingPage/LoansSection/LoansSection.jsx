import React from 'react';
import './LoansSection.css';
import check from '../../assets/icons/check.svg';
import Zap from '../../assets/icons/Zap.png';
import CalendarClock from '../../assets/icons/CalendarClock.png';
import TrendingDown from '../../assets/icons/TrendingDown.png';
import filecheck from '../../assets/icons/filecheck.png';
import graduation from '../../assets/icons/graduation.png';


export const LoansSection = () => {

    const loanData = [
        { 
            title: "Personal Loan", 
            description: "Cover unexpected expenses or fund your next big purchase.", 
            features: [
                { icon: <img src={check} alt="check" className='feature-icon' />, text: "Any purpose" },
                { icon: <img src={Zap} alt="zap" className='feature-icon'/>, text: "Instant disbursal" },
                { icon: <img src={CalendarClock} alt="check" className='feature-icon'/>, text: "Flexible EMI tenures" },
            ],
        },
        { 
            title: "Home Loan", 
            description: "Build your future with attractive home loan rates.", 
            features: [
                { icon: <img src={TrendingDown} alt="check" className='feature-icon'/>, text: "Low interest rates" },
                { icon: <img src={CalendarClock} alt="check"className='feature-icon' />, text: "Long repayment periods" },
                { icon: <img src={filecheck} alt="check" className='feature-icon'/>, text: "Easy documentation" },
            ],
        },
        { 
            title: "Education Loan", 
            description: "Finance your academic goals and invest in your future.", 
            features: [
                 { icon: <img src={TrendingDown} alt="check" className='feature-icon'/>, text: "Low interest rates" },
                 { icon: <img src={CalendarClock} alt="check" className='feature-icon'/>, text: "Long repayment periods" },
                 { icon: <img src={graduation} alt="check" className='feature-icon'/>, text: "Moratorium period" },
            ],
        },
    ];

    return (
        <div id="loans-section" className="loans-section">
            <h2 className="section-title">
                Tailored Loans for Every Dream
            </h2>
            <p className="section-subtitle">
                Quick approvals, competitive rates, and flexible repayment options
            </p>

            <div className="loans-grid">
                {loanData.map((loan, index) => (
                    <div key={index} className={"loan-card"}>
                        <h3 className="loan-title">{loan.title}</h3>
                        <p className="loan-description">{loan.description}</p>
                        <ul className="features-list">
                            {loan.features.map((feature, i) => (
                                <li key={i} className="feature-item">
                                    {feature.icon}
                                    <span className="feature-text">{feature.text}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>

            <div className="explore-button-container">
                    <a href="#" className="explore-button">
                    Explore All Loan Options
                </a>
            </div>
        </div>
    );
};

