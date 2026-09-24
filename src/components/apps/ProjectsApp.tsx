import { useOSStore } from '../../stores/useOSStore';
import { sfx } from '../../hooks/useAudioSynth';

export const ProjectsApp: React.FC = () => {
  const projects = useOSStore(state => state.projects);
  const isLoadingProjects = useOSStore(state => state.isLoadingProjects);
  const openProjectDetails = useOSStore(state => state.openProjectDetails);

  const handleSelect = (index: number) => {
    sfx.open();
    openProjectDetails(index);
  };

  if (isLoadingProjects && projects.length === 0) {
    return <div style={{ padding: '10px' }}>Loading projects from database...</div>;
  }

  return (
    <>
      {projects.map((proj, index) => (
        <div
          key={index}
          className="project-item interactive"
          onClick={() => handleSelect(index)}
          title={`View ${proj.title}`}
        >
          <div className="proj-icon">{proj.icon}</div>
          <div className="proj-details">
            <strong>{proj.title}</strong>
            <p>{proj.desc.substring(0, 60)}...</p>
          </div>
        </div>
      ))}
    </>
  );
};
