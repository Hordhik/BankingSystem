import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Header.css';

export const Header = () => {
  const navigate = useNavigate();
  const [active, setActive] = useState('cards-section');
  const ratiosRef = useRef({});

  // map menu labels to section ids present on the landing page
  const menu = [
    { label: 'Accounts', id: 'accounts-section' },
    { label: 'Credit Card', id: 'cards-section' },
    { label: 'Features', id: 'features-section' },
    { label: 'Loans', id: 'loans-section' },
    { label: 'Offers', id: 'offers-section' },
  ];

  const handleScroll = (id) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActive(id);
    }
  };

  useEffect(() => {
    // Observe the unique section ids
    const ids = Array.from(new Set(menu.map((m) => m.id)));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          ratiosRef.current[entry.target.id] = entry.intersectionRatio;
        });
        // pick highest intersection ratio as active
        const best = ids
          .map((id) => ({ id, ratio: ratiosRef.current[id] || 0 }))
          .sort((a, b) => b.ratio - a.ratio)[0];
        if (best && best.id) setActive(best.id);
      },
      { threshold: [0, 0.25, 0.5, 0.75, 1] }
    );

    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogin = () => navigate('/login');
  const handleSignUp = () => navigate('/signup');

  return (
    <div className='header'>
      <div className='fluit_logo'>FLUIT</div>
      <div className="menu">
        {menu.map((m) => (
          <div
            key={m.label}
            className={`menu-option ${active === m.id ? 'active' : ''}`}
            onClick={() => handleScroll(m.id)}
          >
            {m.label}
          </div>
        ))}
      </div>
      <div className="logout">
        <div className="menu-option" onClick={handleSignUp}>Sign Up</div>
        <div className="menu-option logout" onClick={handleLogin}>Log In</div>
      </div>
    </div>
  );
};
