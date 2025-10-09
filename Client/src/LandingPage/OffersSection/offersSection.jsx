import { Plane, UtensilsCrossed, ShoppingBag, ShoppingCart, Fuel, Dumbbell, Clapperboard, Lightbulb } from 'lucide-react';
import './offersSection.css';



export const OffersSection = () => {

const offerData = [
        { icon: Plane, title: "Travel Boost", description: "Earn 5x points on all all flight bookings." },
        { icon: UtensilsCrossed, title: "Dining Delights", description: "20% off at partner restaurants." },
        { icon: ShoppingBag, title: "Shopping Perks", description: "20% off at partner restatronics." },
        { icon: ShoppingCart, title: "Shopping Spree", description: "Flat ₹500 cashback on electronics." },
        { icon: Fuel, title: "Fuel Savings", description: "Track ₹300 back on monthly groceries." },
        { icon: Dumbbell, title: "Wellness Perks", description: "Discounts on gym memberships." },
        { icon: Clapperboard, title: "Entertainment Pass", description: "Buy one rates on online movie tickets." },
        { icon: Lightbulb, title: "Utility Bill Pay", description: "Flat ₹100 off on first on bill payment." },
    ];

    return (
        <div id="offers-section" className="offers-section">
            <div className="offers-container">
                <h2 className="section-title">
                    Exclusive Offers Just For You
                </h2>
                <p className="section-subtitle">
                    Unlock savings and rewards with your Fluit cards
                </p>

                <div className="offers-grid">
                    {offerData.map((offer, index) => {
                        const Icon = offer.icon;
                        return (
                            <div key={index} className="offer-card">
                                <div className="icon-wrapper">
                                    {Icon && <Icon className="offer-icon" />}
                                </div>
                                <h3 className="offer-title">{offer.title}</h3>
                                <p className="offer-description">{offer.description}</p>
                            </div>
                        );
                    })}
                </div>

                <div className="view-all-container">
                    <a href="#" className="view-all-button">
                        View All Offers
                    </a>
                </div>
            </div>
        </div>
    );
};
