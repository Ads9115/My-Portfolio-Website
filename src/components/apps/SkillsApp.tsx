import React from 'react';
import { PORTFOLIO_DATA } from '../../data/portfolioData';

export const SkillsApp: React.FC = () => {
  return (
    <>
      {PORTFOLIO_DATA.skills.map((category, index) => (
        <div key={index} className="skill-category">
          <strong>{category.category}</strong>
          <ul className="skill-list">
            {category.items.map((item, itemIdx) => (
              <li key={itemIdx}>{item}</li>
            ))}
          </ul>
        </div>
      ))}
    </>
  );
};
