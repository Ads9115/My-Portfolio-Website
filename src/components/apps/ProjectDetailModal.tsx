import React from 'react';
import { PORTFOLIO_DATA } from '../../data/portfolioData';
import { useOSStore } from '../../stores/useOSStore';

export const ProjectDetailModal: React.FC = () => {
  const selectedIndex = useOSStore(state => state.selectedProjectIndex);
  const projects = useOSStore(state => state.projects);
  const project = selectedIndex !== null && selectedIndex < projects.length ? projects[selectedIndex] : null;

  if (!project) {
    return <div>Select a project from the Quest Log.</div>;
  }

  return (
    <>
      <h2 style={{ marginTop: 0, color: 'var(--title-blue)' }}>{project.title}</h2>
      <p style={{ borderBottom: '2px solid var(--win-gray)', paddingBottom: '10px' }}>
        <strong>Tech Stack:</strong> <span>{project.tech || 'Various'}</span>
      </p>
      {project.imageUrl && (
        <div style={{ margin: '15px 0', border: '2px solid var(--win-gray)', padding: '4px', background: '#000' }}>
          <img src={project.imageUrl} alt={project.title} style={{ width: '100%', display: 'block', imageRendering: 'pixelated' }} />
        </div>
      )}
      <div style={{ fontSize: '22px', lineHeight: 1.4, marginTop: '15px' }}>{project.desc}</div>
      <a
        href={project.link}
        target="_blank"
        rel="noopener noreferrer"
        className="win-btn"
        style={{
          display: 'inline-block',
          marginTop: '20px',
          textDecoration: 'none',
          color: 'black'
        }}
      >
        {project.linkLabel || 'Open GitHub Repo'}
      </a>
    </>
  );
};
