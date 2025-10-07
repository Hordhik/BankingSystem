import React from 'react';
// Corrected import paths with file extensions for clarity
import { Header } from '../components/Header/Header.jsx';
import { CardsSection } from '../components/CardsSection/CardsSection.jsx';
import './Landingpage.css';

export const Landingpage = () => {
  return (
    // Use a Fragment to keep the structure clean
    <>
      <Header isLoggedIn={false} />

      {/* This <main> tag is the key correction.
        It wraps all the page content below the header, allowing for proper layout control.
      */}
      <main className="main-content">
        
        {/* Hero Section */}
        <section className="hero-content">
          <h1>Your Money, Your Control — Anytime, Anywhere</h1>
          <h2>Digital-first banking with bank-grade security and 24/7 support</h2>
          <div className="button-container">
            <button>Open Your Account</button>
            <button>Explore Features</button>
          </div>
        </section>

        {/* Cards Section */}
        <CardsSection />


      </main>
    </>
  );
};
