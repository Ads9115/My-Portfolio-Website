import React, { useState } from 'react';
import { useOSStore } from '../../stores/useOSStore';
import { isSupabaseConfigured } from '../../services/supabase';
import { ProjectItem } from '../../services/projectService';
import { sfx } from '../../hooks/useAudioSynth';

export const ProjectManagerApp: React.FC = () => {
  const projects = useOSStore(state => state.projects);
  const isLoading = useOSStore(state => state.isLoadingProjects);
  const loadProjects = useOSStore(state => state.loadProjects);
  const addProject = useOSStore(state => state.addProject);
  const updateProject = useOSStore(state => state.updateProject);
  const deleteProject = useOSStore(state => state.deleteProject);

  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ text: string; isError?: boolean } | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    icon: 'PRJ',
    tech: '',
    desc: '',
    link: '',
    linkLabel: 'Open GitHub Repo'
  });

  const resetForm = () => {
    setFormData({
      title: '',
      icon: 'PRJ',
      tech: '',
      desc: '',
      link: '',
      linkLabel: 'Open GitHub Repo'
    });
    setEditingId(null);
    setIsEditing(false);
  };

  const handleStartAdd = () => {
    sfx.open();
    resetForm();
    setIsEditing(true);
    setStatusMsg(null);
  };

  const handleStartEdit = (proj: ProjectItem) => {
    sfx.open();
    setFormData({
      title: proj.title,
      icon: proj.icon || 'PRJ',
      tech: proj.tech,
      desc: proj.desc,
      link: proj.link,
      linkLabel: proj.linkLabel || 'Open GitHub Repo'
    });
    setEditingId(proj.id || null);
    setIsEditing(true);
    setStatusMsg(null);
  };

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return;
    sfx.paintClear();
    try {
      await deleteProject(id);
      setStatusMsg({ text: `Deleted "${title}" successfully!` });
      setTimeout(() => setStatusMsg(null), 3000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Delete failed';
      setStatusMsg({ text: `Error deleting project: ${msg}`, isError: true });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setStatusMsg({ text: 'Title is required!', isError: true });
      return;
    }
    if (!formData.link.trim()) {
      setStatusMsg({ text: 'Project link is required!', isError: true });
      return;
    }

    setIsSaving(true);
    setStatusMsg(null);

    try {
      if (editingId) {
        await updateProject(editingId, {
          title: formData.title.trim(),
          icon: formData.icon.trim().toUpperCase() || 'PRJ',
          tech: formData.tech.trim(),
          desc: formData.desc.trim(),
          link: formData.link.trim(),
          linkLabel: formData.linkLabel.trim() || 'Open GitHub Repo'
        });
        setStatusMsg({ text: `Updated "${formData.title}" successfully!` });
      } else {
        await addProject({
          title: formData.title.trim(),
          icon: formData.icon.trim().toUpperCase() || 'PRJ',
          tech: formData.tech.trim(),
          desc: formData.desc.trim(),
          link: formData.link.trim(),
          linkLabel: formData.linkLabel.trim() || 'Open GitHub Repo',
          sort_order: projects.length + 1
        });
        setStatusMsg({ text: `Added "${formData.title}" successfully!` });
      }

      sfx.click();
      resetForm();
      setTimeout(() => setStatusMsg(null), 4000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Save failed';
      setStatusMsg({ text: `Error saving: ${msg}`, isError: true });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '10px' }}>
      {/* Database Status Banner */}
      <div
        style={{
          background: isSupabaseConfigured ? 'rgba(0, 255, 255, 0.1)' : 'rgba(255, 180, 0, 0.1)',
          border: `1px solid ${isSupabaseConfigured ? 'var(--neon-cyan)' : '#ffb400'}`,
          padding: '6px 10px',
          fontSize: '18px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          color: isSupabaseConfigured ? 'var(--neon-cyan)' : '#ffb400'
        }}
      >
        <span>
          {isSupabaseConfigured
            ? '● SUPABASE CLOUD ACTIVE: Connected to live database'
            : '○ LOCAL MODE: Add keys to .env to sync with Supabase'}
        </span>
        <button
          className="win-btn"
          style={{ padding: '2px 8px', fontSize: '15px' }}
          onClick={() => {
            sfx.click();
            loadProjects();
          }}
          disabled={isLoading}
        >
          {isLoading ? 'Syncing...' : '↻ Refresh'}
        </button>
      </div>

      {statusMsg && (
        <div
          style={{
            padding: '6px 10px',
            fontSize: '18px',
            background: statusMsg.isError ? 'rgba(255, 0, 0, 0.2)' : 'rgba(0, 255, 0, 0.2)',
            border: `1px solid ${statusMsg.isError ? '#ff4444' : '#44ff44'}`,
            color: statusMsg.isError ? '#ff8888' : '#88ff88'
          }}
        >
          {statusMsg.text}
        </div>
      )}

      {isEditing ? (
        /* Edit / Create Form */
        <form
          onSubmit={handleSubmit}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            background: 'var(--ui-panel)',
            padding: '12px',
            border: '2px inset var(--win-gray)'
          }}
        >
          <div style={{ fontSize: '20px', color: 'var(--title-blue)', marginBottom: '4px' }}>
            {editingId ? 'Edit Project' : 'Add New Project'}
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <div style={{ flex: 3 }}>
              <label style={{ fontSize: '16px', display: 'block', color: 'var(--ui-text-dim)' }}>
                PROJECT TITLE *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Vulkan Raytracer"
                style={{
                  width: '100%',
                  background: 'black',
                  color: '#33ff33',
                  border: '1px solid var(--win-gray)',
                  padding: '4px 6px',
                  fontFamily: "'VT323', monospace",
                  fontSize: '18px',
                  boxSizing: 'border-box'
                }}
                required
              />
            </div>

            <div style={{ flex: 1 }}>
              <label style={{ fontSize: '16px', display: 'block', color: 'var(--ui-text-dim)' }}>
                BADGE (3-4 Chars)
              </label>
              <input
                type="text"
                maxLength={4}
                value={formData.icon}
                onChange={e => setFormData({ ...formData, icon: e.target.value })}
                placeholder="VUL"
                style={{
                  width: '100%',
                  background: 'black',
                  color: '#33ff33',
                  border: '1px solid var(--win-gray)',
                  padding: '4px 6px',
                  fontFamily: "'VT323', monospace",
                  fontSize: '18px',
                  boxSizing: 'border-box',
                  textTransform: 'uppercase'
                }}
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '16px', display: 'block', color: 'var(--ui-text-dim)' }}>
              TECH STACK
            </label>
            <input
              type="text"
              value={formData.tech}
              onChange={e => setFormData({ ...formData, tech: e.target.value })}
              placeholder="e.g. C++, Vulkan, GLSL, CMake"
              style={{
                width: '100%',
                background: 'black',
                color: '#33ff33',
                border: '1px solid var(--win-gray)',
                padding: '4px 6px',
                fontFamily: "'VT323', monospace",
                fontSize: '18px',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: '16px', display: 'block', color: 'var(--ui-text-dim)' }}>
              PROJECT / GITHUB URL *
            </label>
            <input
              type="url"
              value={formData.link}
              onChange={e => setFormData({ ...formData, link: e.target.value })}
              placeholder="https://github.com/Ads9115/..."
              style={{
                width: '100%',
                background: 'black',
                color: '#33ff33',
                border: '1px solid var(--win-gray)',
                padding: '4px 6px',
                fontFamily: "'VT323', monospace",
                fontSize: '18px',
                boxSizing: 'border-box'
              }}
              required
            />
          </div>

          <div>
            <label style={{ fontSize: '16px', display: 'block', color: 'var(--ui-text-dim)' }}>
              BUTTON TEXT
            </label>
            <input
              type="text"
              value={formData.linkLabel}
              onChange={e => setFormData({ ...formData, linkLabel: e.target.value })}
              placeholder="Open GitHub Repo"
              style={{
                width: '100%',
                background: 'black',
                color: '#33ff33',
                border: '1px solid var(--win-gray)',
                padding: '4px 6px',
                fontFamily: "'VT323', monospace",
                fontSize: '18px',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: '16px', display: 'block', color: 'var(--ui-text-dim)' }}>
              DESCRIPTION
            </label>
            <textarea
              rows={3}
              value={formData.desc}
              onChange={e => setFormData({ ...formData, desc: e.target.value })}
              placeholder="Describe your graphics engine architecture, performance wins, or features..."
              style={{
                width: '100%',
                background: 'black',
                color: '#33ff33',
                border: '1px solid var(--win-gray)',
                padding: '4px 6px',
                fontFamily: "'VT323', monospace",
                fontSize: '18px',
                boxSizing: 'border-box',
                resize: 'vertical'
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
            <button
              type="submit"
              className="win-btn"
              disabled={isSaving}
              style={{ padding: '4px 14px', fontSize: '18px', color: 'var(--neon-cyan)' }}
            >
              {isSaving ? 'Saving...' : '💾 Save to Database'}
            </button>
            <button
              type="button"
              className="win-btn"
              onClick={resetForm}
              disabled={isSaving}
              style={{ padding: '4px 14px', fontSize: '18px' }}
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        /* Project Table View */
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '20px', color: 'var(--ui-text)' }}>
              Total Projects in DB: <strong>{projects.length}</strong>
            </span>
            <button
              className="win-btn"
              style={{ padding: '3px 12px', fontSize: '18px', color: 'var(--neon-pink)' }}
              onClick={handleStartAdd}
            >
              + Add New Project
            </button>
          </div>

          <div
            style={{
              flexGrow: 1,
              overflowY: 'auto',
              border: '2px inset var(--win-gray)',
              background: 'rgba(10, 8, 20, 0.8)',
              padding: '6px'
            }}
          >
            {projects.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '20px', color: 'var(--ui-text-dim)' }}>
                No projects found in database. Click &ldquo;+ Add New Project&rdquo; to create one!
              </div>
            ) : (
              projects.map(proj => (
                <div
                  key={proj.id || proj.title}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '8px',
                    borderBottom: '1px solid rgba(125, 241, 255, 0.15)',
                    background: 'rgba(30, 24, 50, 0.5)',
                    marginBottom: '4px'
                  }}
                >
                  <div
                    style={{
                      width: '42px',
                      height: '32px',
                      background: 'var(--ui-panel-soft)',
                      border: '1px solid var(--neon-cyan)',
                      color: 'var(--neon-cyan)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '16px',
                      fontWeight: 'bold',
                      flexShrink: 0
                    }}
                  >
                    {proj.icon || 'PRJ'}
                  </div>

                  <div style={{ flexGrow: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '20px', color: 'var(--ui-text)', fontWeight: 'bold' }}>
                      {proj.title}
                    </div>
                    <div style={{ fontSize: '16px', color: 'var(--ui-text-dim)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {proj.tech}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '5px', flexShrink: 0 }}>
                    <button
                      className="win-btn"
                      style={{ padding: '2px 8px', fontSize: '15px' }}
                      onClick={() => handleStartEdit(proj)}
                    >
                      Edit
                    </button>
                    <button
                      className="win-btn"
                      style={{ padding: '2px 8px', fontSize: '15px', color: '#ff6666' }}
                      onClick={() => proj.id && handleDelete(proj.id, proj.title)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
};
