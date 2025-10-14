import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Header.css';

export const Header = () => {
  const navigate = useNavigate();
  const [active, setActive] = useState('credit-card');
  const ratiosRef = useRef({});

  const menu = [
    { label: 'Accounts', id: 'accounts' },
    { label: 'Cards', id: 'credit-card' },
    { label: 'Features', id: 'features' },
    { label: 'Loans', id: 'loans' },
    { label: 'Offers', id: 'offers' },
  ];

  const handleScroll = (id) => {
    const section = document.getElementById(id);
    if (section) {
      const headerEl = document.querySelector('.header');
      const headerHeight = headerEl ? headerEl.offsetHeight : 90;
      const top = window.scrollY + section.getBoundingClientRect().top - headerHeight - 8;
      window.scrollTo({ top, behavior: 'smooth' });
      setActive(id);
    }
  };

  useEffect(() => {
    const ids = Array.from(new Set(menu.map((m) => m.id)));
    const headerEl = document.querySelector('.header');
    const headerHeight = headerEl ? headerEl.offsetHeight : 90;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          ratiosRef.current[entry.target.id] = entry.intersectionRatio;
        });
        const best = ids
          .map((id) => ({ id, ratio: ratiosRef.current[id] || 0 }))
          .sort((a, b) => b.ratio - a.ratio)[0];
        if (best && best.id) setActive(best.id);
      },
      { threshold: [0, 0.25, 0.5, 0.75, 1], rootMargin: `-${headerHeight + 8}px 0px 0px 0px` }
    );

    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const handleLogin = () => navigate('/login');
  const handleSignUp = () => navigate('/signup');

  return (
    <div className='header'>
      <button
        type="button"
        className='fluit_logo'
        aria-label="Go to top"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        FLUIT
      </button>

      <nav className="menu" aria-label="Primary">
        {menu.map((m) => (
          <button
            key={m.label}
            type="button"
            className={`menu-option ${active === m.id ? 'active' : ''}`}
            onClick={() => handleScroll(m.id)}
            aria-pressed={active === m.id}
          >
            {m.label}
          </button>
        ))}
      </nav>

      <div className="logout" role="region" aria-label="Auth">
        <button className="menu-option" type="button" onClick={handleSignUp}>Sign Up</button>
        <button className="menu-option logout" type="button" onClick={handleLogin}>Log In</button>
      </div>
    </div>
  );
};
