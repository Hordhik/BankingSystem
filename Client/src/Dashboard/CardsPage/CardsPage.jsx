import React, { useState, useEffect } from 'react';
import './CardsPage.css';
import { applyForCard, getCards } from '../../services/api';

const VisaLogoSVG = () => (
  <svg className="card-vendor-logo" viewBox="0 0 100 62" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="62" fill="transparent" />
    <path
      d="M72.952 23.01H65.816L60.012 39.01C59.66 40.04 59.204 40.544 58.748 40.544C57.732 40.544 57.06 39.772 56.604 38.648L52.124 23.01H45.228L40.924 38.648C40.468 39.772 39.796 40.544 38.78 40.544C38.324 40.544 37.868 40.04 37.516 39.01L31.712 23.01H24.576L21.432 39.01C20.976 40.04 20.472 40.544 19.964 40.544C18.948 40.544 18.276 39.772 17.82 38.648L13.34 23.01H6.444L2.14 38.648C1.684 39.772 1.012 40.544 0 40.544C-0.456 40.544 -0.96 40.04 -1.416 39.01L-7.22 23.01H-14.356L-17.496 39.01C-17.952 40.04 -18.456 40.544 -18.96 40.544C-19.976 40.544 -20.648 39.772 -21.104 38.648L-25.584 23.01H-32.48L-36.784 38.648C-37.24 39.772 -37.912 40.544 -38.928 40.544C-39.384 40.544 -39.888 40.04 -40.344 39.01L-46.148 23.01H-53.284"
      transform="translate(39 10)"
      fill="#fff"
    />
    <path
      d="M96.7932 23.0098H89.6572L83.8532 39.0098C83.5012 40.0498 83.0452 40.5438 82.5892 40.5438C81.5732 40.5438 80.9012 39.7718 80.4452 38.6478L75.9652 23.0098H69.0692L64.7652 38.6478C64.3092 39.7718 63.6372 40.5438 62.6212 40.5438C62.1652 40.5438 61.7092 40.0498 61.3572 39.0098L55.5532 23.0098H48.4172L45.2732 39.0098C44.8172 40.0498 44.3132 40.5438 43.8052 40.5438C42.7892 40.5438 42.1172 39.7718 41.6612 38.6478L37.1812 23.0098H30.2852L25.9812 38.6478C25.5252 39.7718 24.8532 40.5438 23.8372 40.5438C23.3812 40.5438 22.8772 40.0498 22.4212 39.0098L16.6172 23.0098H9.48122L6.33722 39.0098C5.88122 40.0498 5.37722 40.5438 4.86922 40.5438C3.85322 40.5438 3.18122 39.7718 2.72522 38.6478L-1.75478 23.0098H-8.65078L-12.9548 38.6478C-13.4108 39.7718 -14.0828 40.5438 -15.0988 40.5438C-15.5548 40.5438 -16.0588 40.0498 -16.5148 39.0098L-22.3188 23.0098H-29.4548"
      transform="translate(0 10)"
      fill="#F79500"
    />
  </svg>
);

const CardsPage = () => {
  const [activeTab, setActiveTab] = useState('details');
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);

  const [appliedCards, setAppliedCards] = useState({});

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [showMarketplaceModal, setShowMarketplaceModal] = useState(false); // New Marketplace Modal
  const [selectedCardForApp, setSelectedCardForApp] = useState(null);
  const [applicationForm, setApplicationForm] = useState({
    nameOnCard: localStorage.getItem('fullname') || '',
    network: 'Visa',
    cardType: 'Debit', // New field for card type selection
  });

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const data = await getCards();
        const formattedCards = data.map((card, index) => ({
          id: card.id,
          number: card.cardNumber.replace(/(\d{4})(?=\d)/g, '$1 '),
          holder: card.ownerName,
          expiry: card.expiryDate ? new Date(card.expiryDate).toLocaleDateString('en-US', { month: '2-digit', year: '2-digit' }) : 'MM/YY',
          cvv: card.cvv,
          isPrimary: index === 0, // Default first card as primary
          type: card.cardType
        }));
        setCards(formattedCards);
      } catch (error) {
        console.error("Failed to fetch cards", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCards();
  }, []);

  const currentCard = cards[currentCardIndex];

  if (loading) return <div className="cards-page-container">Loading cards...</div>;
  if (!currentCard) return <div className="cards-page-container">No cards found. Apply for a new card!</div>;

  const handleNextCard = (e) => {
    e.stopPropagation();
    setCurrentCardIndex((prev) => (prev + 1) % cards.length);
  };

  const handlePrevCard = (e) => {
    e.stopPropagation();
    setCurrentCardIndex((prev) => (prev - 1 + cards.length) % cards.length);
  };

  const setPrimaryCard = (e) => {
    e.stopPropagation();
    setCards((prev) =>
      prev.map((card, index) => ({
        ...card,
        isPrimary: index === currentCardIndex,
      }))
    );
  };

  const toggleFlip = () => setIsFlipped((prev) => !prev);

  const availableCards = [
    {
      id: 101,
      title: 'Elevate Credit Card',
      category: 'Premium',
      description: 'Earn cashback and rewards on every spend.',
      benefits: ['1.5% Unlimited Cashback', 'No Foreign Transaction Fees', 'Travel Insurance Included'],
      fee: '₹999/year',
      interest: '14.99% APR'
    },
    {
      id: 102,
      title: 'Zenith Credit Card',
      category: 'Premium',
      description: 'Unlock premium travel and lifestyle benefits.',
      benefits: ['Airport Lounge Access', 'Concierge Service', '5x Points on Travel'],
      fee: '₹2,999/year',
      interest: '18.99% APR'
    },
    {
      id: 103,
      title: 'Momentum Debit Card',
      category: 'Everyday',
      description: 'Your everyday card for seamless transactions.',
      benefits: ['Zero Monthly Fees', 'Free ATM Withdrawals', 'Budgeting Tools'],
      fee: 'Free',
      interest: 'N/A'
    },
    // Partner Cards
    {
      id: 201,
      title: 'Amazon Prime Rewards',
      category: 'Shopping',
      partner: 'Amazon',
      description: '5% Cashback on Amazon.in purchases.',
      benefits: ['5% Cashback on Amazon', 'Free Prime Membership', 'No Cost EMI options'],
      fee: '₹499/year (Waived on ₹1L spend)',
      interest: '15% APR'
    },
    {
      id: 202,
      title: 'Swiggy Gourmet Card',
      category: 'Dining',
      partner: 'Swiggy',
      description: 'Exclusive discounts on dining and delivery.',
      benefits: ['Free Swiggy One Membership', '20% off on Dining Out', 'Free Delivery on all orders'],
      fee: '₹1,499/year',
      interest: '16% APR'
    },
    {
      id: 203,
      title: 'MakeMyTrip Voyager',
      category: 'Travel',
      partner: 'MakeMyTrip',
      description: 'The ultimate card for frequent travelers.',
      benefits: ['Unlimited Lounge Access', 'MMT Black Membership', '3x Miles on Flights'],
      fee: '₹4,999/year',
      interest: '18% APR'
    },
    {
      id: 204,
      title: 'BookMyShow Play',
      category: 'Entertainment',
      partner: 'BookMyShow',
      description: 'Buy 1 Get 1 Free on movie tickets.',
      benefits: ['BOGO on Movies (up to ₹500)', '20% off on F&B', 'Priority Booking'],
      fee: '₹999/year',
      interest: '15% APR'
    },
    {
      id: 205,
      title: 'Uber Elite Card',
      category: 'Travel',
      partner: 'Uber',
      description: 'Ride in style with premium Uber benefits.',
      benefits: ['5% Uber Cash on rides', 'Priority Pickup', 'Free Uber One Membership'],
      fee: '₹999/year',
      interest: '15% APR'
    }
  ];

  const handleOpenModal = (card) => {
    setSelectedCardForApp(card);
    setApplicationForm({ nameOnCard: localStorage.getItem('fullname') || '', network: 'Visa', cardType: 'Debit' }); // Reset cardType
    setShowModal(true);
    setShowMarketplaceModal(false); // Close marketplace if open
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedCardForApp(null);
  };

  const handleOpenMarketplace = () => {
    setShowMarketplaceModal(true);
  };

  const handleCloseMarketplace = () => {
    setShowMarketplaceModal(false);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setApplicationForm(prev => ({ ...prev, [name]: value }));
  };

  const handleConfirmApplication = async (e) => {
    e.preventDefault();
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        alert("User ID not found. Please log in again.");
        return;
      }

      await applyForCard(userId, applicationForm.cardType, applicationForm.network);

      setAppliedCards((prev) => ({ ...prev, [selectedCardForApp.id]: true }));
      alert("Application submitted successfully!");
      handleCloseModal();
    } catch (error) {
      console.error("Application failed:", error);
      alert("Failed to submit application. Please try again.");
    }
  };

  return (
    <div className="cards-page-container">
      <div className="cards-page-header">
        <h2>My Cards</h2>
        <button className="add-card-btn" onClick={handleOpenMarketplace}>
          <span className="btn-icon">+</span> Apply For New Card
        </button>
      </div>

      <div className="card-display-area">
        {/* --- Flip Card Wrapper --- */}
        <div className={`debit-card-wrapper ${isFlipped ? 'flipped' : ''}`} onClick={toggleFlip}>
          {/* Controls - Moved outside visual for better positioning */}
          <div className="card-top-buttons">
            <button
              onClick={setPrimaryCard}
              className={`primary-btn ${currentCard.isPrimary ? 'is-primary' : ''}`}
            >
              {currentCard.isPrimary ? 'Primary' : 'Set Primary'}
            </button>
            <div className="nav-controls">
              <button onClick={handlePrevCard} className="nav-btn">◀</button>
              <button onClick={handleNextCard} className="nav-btn">▶</button>
            </div>
          </div>

          {/* FRONT */}
          <div className="debit-card-visual card-front">
            <div className="card-shine"></div>
            <div className="debit-card-visual__header">
              <span className="debit-card-visual__logo">FLUIT</span>
              <div className="debit-card-visual__chip"></div>
            </div>

            <div className="debit-card-visual__number">
              <span>{currentCard.number}</span>
            </div>

            <div className="debit-card-visual__footer">
              <div className="debit-card-visual__holder">
                <span className="label">Card Holder</span>
                <span>{currentCard.holder}</span>
              </div>
              <VisaLogoSVG />
            </div>
          </div>

          {/* BACK */}
          <div className="debit-card-visual card-back">
            <div className="card-stripe"></div>
            <div className="card-back-details">
              <div className="card-info-line">
                <span className="label">Expiry</span>
                <span>{currentCard.expiry}</span>
              </div>
              <div className="card-info-line">
                <span className="label">CVV</span>
                <span>{currentCard.cvv}</span>
              </div>
            </div>
          </div>
        </div>

        {/* --- Management Panel --- */}
        <div className="card-management-panel">
          <div className="management-tabs">
            <button className={activeTab === 'details' ? 'active' : ''} onClick={() => setActiveTab('details')}>Details</button>
            <button className={activeTab === 'pin' ? 'active' : ''} onClick={() => setActiveTab('pin')}>Set PIN</button>
            <button className={activeTab === 'limits' ? 'active' : ''} onClick={() => setActiveTab('limits')}>Limits</button>
            <button className={activeTab === 'insights' ? 'active' : ''} onClick={() => setActiveTab('insights')}>Insights</button>
          </div>

          <div className="management-content">
            {activeTab === 'details' && (
              <div className="details-tab fade-in">
                <h4>Card Information</h4>
                <div className="detail-row">
                  <span className="detail-label">Card Holder</span>
                  <span className="detail-value">{currentCard.holder}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Card Number</span>
                  <span className="detail-value">**** **** **** {currentCard.number.slice(-4)}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Status</span>
                  <span className={`status-badge ${currentCard.isPrimary ? 'primary' : 'secondary'}`}>
                    {currentCard.isPrimary ? 'Primary' : 'Secondary'}
                  </span>
                </div>
              </div>
            )}

            {activeTab === 'pin' && (
              <div className="pin-tab fade-in">
                <h4>Change or Set PIN</h4>
                <div className="input-group">
                  <input type="password" placeholder=" " maxLength="4" id="new-pin" />
                  <label htmlFor="new-pin">Enter new PIN</label>
                </div>
                <div className="input-group">
                  <input type="password" placeholder=" " maxLength="4" id="confirm-pin" />
                  <label htmlFor="confirm-pin">Confirm new PIN</label>
                </div>
                <button className="set-pin-btn">Update PIN</button>
              </div>
            )}

            {activeTab === 'limits' && (
              <div className="card-limit-info fade-in">
                <div className="limit-item">
                  <div className="limit-header">
                    <span className="limit-label">Daily Spending</span>
                    <span className="limit-value">₹25,000 / ₹50,000</span>
                  </div>
                  <div className="limit-bar-container">
                    <div className="limit-progress" style={{ width: '50%' }}></div>
                  </div>
                </div>
                <div className="limit-item">
                  <div className="limit-header">
                    <span className="limit-label">Online Transactions</span>
                    <span className="limit-value">₹10,000 / ₹20,000</span>
                  </div>
                  <div className="limit-bar-container">
                    <div className="limit-progress warning" style={{ width: '50%' }}></div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'insights' && (
              <div className="insights-tab fade-in">
                <h4>Monthly Overview</h4>
                <div className="insight-card">
                  <span className="insight-label">Total Spent</span>
                  <span className="insight-value">₹18,430</span>
                </div>
                <div className="insight-row">
                  <span>Most Used</span>
                  <strong>Online Shopping</strong>
                </div>
                <div className="insight-row">
                  <span>Top Merchant</span>
                  <strong>Amazon</strong>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* --- Apply Section (Featured) --- */}
      <section className="apply-for-cards-section">
        <h3>Featured Cards</h3>
        <div className="apply-cards-grid">
          {availableCards.slice(0, 3).map((card) => (
            <div className="apply-card-item" key={card.id}>
              <div className="card-item-header">
                <h4>{card.title}</h4>
                <span className="category-tag">{card.category}</span>
              </div>
              <p>{card.description}</p>
              {appliedCards[card.id] ? (
                <div className="application-status">
                  <span className="status-icon">✓</span> Application Sent
                </div>
              ) : (
                <button className="view-details-btn" onClick={() => handleOpenModal(card)}>
                  View Details & Apply
                </button>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* --- Marketplace Modal --- */}
      {showMarketplaceModal && (
        <div className="modal-overlay" onClick={handleCloseMarketplace}>
          <div className="modal-container marketplace-container" onClick={e => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={handleCloseMarketplace}>×</button>
            <div className="modal-header">
              <h3>Card Marketplace</h3>
              <p className="modal-subtitle">Discover cards tailored to your lifestyle</p>
            </div>

            <div className="marketplace-grid">
              {availableCards.map((card) => (
                <div className="marketplace-card-item" key={card.id}>
                  {card.partner && <span className="partner-badge">{card.partner}</span>}
                  <div className="marketplace-card-header">
                    <h4>{card.title}</h4>
                    <span className="card-category">{card.category}</span>
                  </div>
                  <p className="marketplace-desc">{card.description}</p>
                  <div className="marketplace-footer">
                    {appliedCards[card.id] ? (
                      <button className="applied-btn" disabled>Applied</button>
                    ) : (
                      <button className="apply-btn" onClick={() => handleOpenModal(card)}>Apply Now</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* --- Application Modal --- */}
      {showModal && selectedCardForApp && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-container application-container" onClick={e => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={handleCloseModal}>×</button>

            <div className="modal-header">
              <h3>Apply for {selectedCardForApp.title}</h3>
              <p className="modal-subtitle">{selectedCardForApp.description}</p>
            </div>

            <div className="modal-body">
              <div className="card-benefits">
                <h4>Key Benefits</h4>
                <ul>
                  {selectedCardForApp.benefits.map((benefit, idx) => (
                    <li key={idx}>{benefit}</li>
                  ))}
                </ul>
              </div>

              <div className="card-financials">
                <div className="financial-item">
                  <span className="label">Annual Fee</span>
                  <span className="value">{selectedCardForApp.fee}</span>
                </div>
                <div className="financial-divider"></div>
                <div className="financial-item">
                  <span className="label">Interest Rate</span>
                  <span className="value">{selectedCardForApp.interest}</span>
                </div>
              </div>

              <form className="application-form" onSubmit={handleConfirmApplication}>
                <h4>Customize Application</h4>

                <div className="form-group floating-label">
                  <input
                    type="text"
                    name="nameOnCard"
                    id="nameOnCard"
                    value={applicationForm.nameOnCard}
                    onChange={handleFormChange}
                    placeholder=" "
                    required
                  />
                  <label htmlFor="nameOnCard">Name on Card</label>
                </div>

                <div className="form-group">
                  <label className="static-label">Preferred Network</label>
                  <div className="network-options">
                    {['Visa', 'Mastercard', 'RuPay'].map(net => (
                      <label key={net} className={`network-option ${applicationForm.network === net ? 'selected' : ''}`}>
                        <input
                          type="radio"
                          name="network"
                          value={net}
                          checked={applicationForm.network === net}
                          onChange={handleFormChange}
                        />
                        <span className="network-name">{net}</span>
                      </label>
                    ))}
                  </div>
                </div>
                {/* Card Type selection (Debit/Credit) – shown only for non‑featured cards */}
                {!(availableCards.slice(0, 3).some(c => c.id === selectedCardForApp.id)) && (
                  <div className="form-group">
                    <label className="static-label">Card Type</label>
                    <div className="card-type-options">
                      {['Debit', 'Credit'].map(type => (
                        <label key={type} className={`card-type-option ${applicationForm.cardType === type ? 'selected' : ''}`}>
                          <input
                            type="radio"
                            name="cardType"
                            value={type}
                            checked={applicationForm.cardType === type}
                            onChange={handleFormChange}
                          />
                          <span className="card-type-name">{type}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                <button type="submit" className="confirm-application-btn">
                  Confirm Application
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default CardsPage;
