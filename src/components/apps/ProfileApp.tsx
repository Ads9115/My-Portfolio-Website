import React from 'react';
import { PORTFOLIO_DATA } from '../../data/portfolioData';

export const ProfileApp: React.FC = () => {
  const { profile } = PORTFOLIO_DATA;

  return (
    <>
      <div className="status-layout">
        <div className="avatar-box">
          <img src="https://api.dicebear.com/7.x/pixel-art/svg?seed=Adarsh" alt="Avatar" />
        </div>
        <div className="status-text">
          <p>
            <strong>NAME:</strong> {profile.name}
          </p>
          <p>
            <strong>CLASS:</strong> {profile.level}
          </p>
          <p>
            <strong>BASE:</strong> {profile.location}
          </p>
        </div>
      </div>
      <hr />
      <p style={{ fontSize: '20px', lineHeight: 1.4, margin: '10px 0 0 0' }}>{profile.bio}</p>
    </>
  );
};
