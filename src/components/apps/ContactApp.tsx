import React from 'react';
import { PORTFOLIO_DATA } from '../../data/portfolioData';

export const ContactApp: React.FC = () => {
  return (
    <div style={{ textAlign: 'center' }}>
      <p style={{ fontSize: '24px', marginTop: 0 }}>Connection Established.</p>
      <img src="./contact-icon.svg" alt="Contact mail icon" className="contact-window-icon" />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {PORTFOLIO_DATA.socials.map((social, index) => (
          <a
            key={index}
            href={social.link}
            target="_blank"
            rel="noopener noreferrer"
            className="win-btn"
          >
            {social.label}
          </a>
        ))}
      </div>
    </div>
  );
};
