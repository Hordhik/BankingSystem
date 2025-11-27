import React, { useState, useEffect } from 'react';
import './CardsPage.css';
import { applyForCard, getCards, setCardAsPrimary, setCardPin } from '../../services/api';

const VisaLogoSVG = () => (
  <svg className="card-vendor-logo" viewBox="0 0 100 62" fill="none" xmlns="http://www.w3.org/2000/svg">
    <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fontFamily="Arial" fontSize="28" fill="white" fontStyle="italic" fontWeight="bold">VISA</text>
  </svg>
);

const MastercardLogoSVG = () => (
  <svg className="card-vendor-logo" viewBox="0 0 100 62" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="34" cy="31" r="22" fill="#EB001B" fillOpacity="0.9" />
    <circle cx="66" cy="31" r="22" fill="#F79E1B" fillOpacity="0.9" />
  </svg>
);

const RuPayLogoSVG = () => (
  <svg className="card-vendor-logo" viewBox="0 0 100 62" fill="none" xmlns="http://www.w3.org/2000/svg">
    <text x="10" y="40" fontFamily="Arial" fontSize="24" fill="white" fontWeight="bold">RuPay</text>
  </svg>
);

const CardsPage = () => {
  const [activeTab, setActiveTab] = useState('details');
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);

  const [appliedCards, setAppliedCards] = useState({});
  const [ownedCards, setOwnedCards] = useState({});

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
        console.log("Fetched cards:", data); // Debugging log
        const formattedCards = data.map((card, index) => ({
          id: card.id,
          number: card.cardNumber.replace(/(\d{4})(?=\d)/g, '$1 '),
          holder: card.ownerName,
          expiry: card.expiryDate ? new Date(card.expiryDate).toLocaleDateString('en-US', { month: '2-digit', year: '2-digit' }) : 'MM/YY',
          cvv: card.cvv,
          cvv: card.cvv,
          isPrimary: card.isPrimary,
          type: card.cardType,
          cardName: card.cardName || 'Fluit Debit Card',
          network: card.network || 'Visa'
        }));
        setCards(formattedCards);

        // Track owned cards by name
        const owned = {};
        formattedCards.forEach(c => {
          if (c.cardName) owned[c.cardName] = true;
        });
        setOwnedCards(owned);
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

  const setPrimaryCard = async (e) => {
    e.stopPropagation();
    try {
      await setCardAsPrimary(currentCard.id);

      // Refresh cards to get updated status
      const data = await getCards();
      const formattedCards = data.map((card, index) => ({
        id: card.id,
        number: card.cardNumber.replace(/(\d{4})(?=\d)/g, '$1 '),
        holder: card.ownerName,
        expiry: card.expiryDate ? new Date(card.expiryDate).toLocaleDateString('en-US', { month: '2-digit', year: '2-digit' }) : 'MM/YY',
        cvv: card.cvv,
        isPrimary: card.isPrimary,
        type: card.cardType,
        cardName: card.cardName || 'Fluit Debit Card',
        network: card.network || 'Visa'
      }));

      // Sort so primary is first? Or just update state
      // Let's keep the current index but update the list
      setCards(formattedCards);
      alert("Primary card updated successfully!");
    } catch (error) {
      console.error("Failed to set primary card", error);
      alert("Failed to set primary card");
    }
  };

  const handleSetPin = async () => {
    const newPin = document.getElementById('new-pin').value;
    const confirmPin = document.getElementById('confirm-pin').value;

    if (!newPin || newPin.length !== 4) {
      alert("Please enter a valid 4-digit PIN");
      return;
    }

    if (newPin !== confirmPin) {
      alert("PINs do not match");
      return;
    }

    try {
      await setCardPin(currentCard.id, newPin);
      alert("PIN set successfully!");
      // Clear inputs
      document.getElementById('new-pin').value = '';
      document.getElementById('confirm-pin').value = '';
    } catch (error) {
      console.error("Failed to set PIN", error);
      alert("Failed to set PIN. Please try again.");
    }
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

      await applyForCard(userId, applicationForm.cardType, applicationForm.network, selectedCardForApp.title);

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
              <span className="debit-card-visual__logo">{currentCard.cardName}</span>
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
              {currentCard.network === 'Mastercard' ? <MastercardLogoSVG /> :
                currentCard.network === 'RuPay' ? <RuPayLogoSVG /> :
                  currentCard.network === 'Visa' ? <VisaLogoSVG /> :
                    <span style={{ color: 'white', fontWeight: 'bold', fontSize: '18px', letterSpacing: '1px' }}>DEBIT</span>}
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
                <button className="set-pin-btn" onClick={handleSetPin}>Update PIN</button>
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
              ) : ownedCards[card.title] ? (
                <div className="application-status">
                  <span className="status-icon">✓</span> Owned
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
                    ) : ownedCards[card.title] ? (
                      <button className="applied-btn" disabled>Owned</button>
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
