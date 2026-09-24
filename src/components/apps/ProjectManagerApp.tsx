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
  const triggerShake = useOSStore(state => state.triggerShake);

  // Security Gate
  const adminPin = import.meta.env.VITE_ADMIN_PIN || '1337';
  const [isUnlocked, setIsUnlocked] = useState<boolean>(() => {
    return sessionStorage.getItem('adarsh_admin_unlocked') === 'true';
  });
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);

  // Editor State
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

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput.trim() === adminPin.trim()) {
      sessionStorage.setItem('adarsh_admin_unlocked', 'true');
      setIsUnlocked(true);
      setPinError(false);
      sfx.open();
    } else {
      setPinError(true);
      triggerShake();
      sfx.shake();
      setPinInput('');
    }
  };

  const handleLock = () => {
    sessionStorage.removeItem('adarsh_admin_unlocked');
    setIsUnlocked(false);
    resetForm();
    sfx.minimize();
  };

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
      setStatusMsg({ text: `[OK] Deleted "${title}" from database.` });
      setTimeout(() => setStatusMsg(null), 3000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Delete failed';
      setStatusMsg({ text: `[ERR] Delete failed: ${msg}`, isError: true });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setStatusMsg({ text: 'Project title cannot be empty!', isError: true });
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
        setStatusMsg({ text: `[OK] Updated "${formData.title}" successfully!` });
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
        setStatusMsg({ text: `[OK] Created "${formData.title}" in database!` });
      }

      sfx.click();
      resetForm();
      setTimeout(() => setStatusMsg(null), 4000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Save failed';
      setStatusMsg({ text: `[ERR] Error saving: ${msg}`, isError: true });
    } finally {
      setIsSaving(false);
    }
  };

  // 1. LOCKED VIEW (Security Gate for public visitors)
  if (!isUnlocked) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          padding: '20px',
          textAlign: 'center',
          gap: '15px'
        }}
      >
        <div
          style={{
            fontSize: '48px',
            filter: 'drop-shadow(0 0 10px rgba(255, 74, 168, 0.8))'
          }}
        >
          🔐
        </div>

        <div style={{ fontSize: '24px', color: 'var(--title-blue)', fontWeight: 'bold' }}>
          SECURITY CLEARANCE REQUIRED
        </div>

        <p style={{ fontSize: '20px', color: 'var(--ui-text-dim)', maxWidth: '420px', margin: 0 }}>
          This subsystem is restricted to the site owner. Public visitors have read-only access in QUEST.LOG.
        </p>

        <form
          onSubmit={handleUnlock}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            width: '280px',
            marginTop: '10px'
          }}
        >
          <input
            type="password"
            value={pinInput}
            onChange={e => {
              setPinInput(e.target.value);
              setPinError(false);
            }}
            placeholder="ENTER ADMIN PIN..."
            autoFocus
            style={{
              width: '100%',
              background: '#05050b',
              color: '#33ff33',
              border: pinError ? '2px solid #ff4444' : '2px solid rgba(125, 241, 255, 0.5)',
              padding: '8px 10px',
              fontFamily: "'VT323', monospace",
              fontSize: '24px',
              textAlign: 'center',
              letterSpacing: '4px',
              textShadow: '0 0 6px #33ff33',
              outline: 'none'
            }}
          />

          {pinError && (
            <div style={{ color: '#ff4444', fontSize: '18px', textShadow: '0 0 6px #ff4444' }}>
              ACCESS DENIED. INCORRECT PIN.
            </div>
          )}

          <button
            type="submit"
            className="win-btn"
            style={{
              padding: '6px 16px',
              fontSize: '22px',
              cursor: 'pointer'
            }}
          >
            Authenticate & Unlock
          </button>
        </form>

        <span style={{ fontSize: '16px', color: 'rgba(217, 197, 255, 0.5)', marginTop: '10px' }}>
          Tip: Set VITE_ADMIN_PIN in .env (Default: 1337)
        </span>
      </div>
    );
  }

  // 2. UNLOCKED VIEW (Full CRUD Management)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '10px' }}>
      {/* Top Header & DB Status */}
      <div
        style={{
          background: isSupabaseConfigured ? 'rgba(100, 245, 255, 0.08)' : 'rgba(255, 187, 111, 0.08)',
          border: `1px solid ${isSupabaseConfigured ? 'var(--neon-cyan)' : 'var(--retro-haze)'}`,
          padding: '6px 10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '20px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ color: isSupabaseConfigured ? 'var(--neon-cyan)' : 'var(--retro-haze)' }}>
            {isSupabaseConfigured ? '● SUPABASE CLOUD' : '○ LOCAL STORAGE'}
          </span>
          <span style={{ color: 'var(--ui-text-dim)', fontSize: '17px' }}>
            ({projects.length} Projects)
          </span>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            className="win-btn"
            style={{ padding: '2px 8px', fontSize: '16px', marginTop: 0 }}
            onClick={() => {
              sfx.click();
              loadProjects();
            }}
            disabled={isLoading}
          >
            {isLoading ? 'Syncing...' : '↻ Sync'}
          </button>
          <button
            className="win-btn"
            style={{ padding: '2px 8px', fontSize: '16px', marginTop: 0, color: '#ff7777' }}
            onClick={handleLock}
            title="Lock manager session"
          >
            🔒 Lock
          </button>
        </div>
      </div>

      {statusMsg && (
        <div
          style={{
            padding: '6px 10px',
            fontSize: '19px',
            background: statusMsg.isError ? 'rgba(255, 0, 0, 0.2)' : 'rgba(0, 255, 0, 0.15)',
            border: `1px solid ${statusMsg.isError ? '#ff4444' : '#33ff33'}`,
            color: statusMsg.isError ? '#ff7777' : '#33ff33',
            textShadow: statusMsg.isError ? '0 0 5px #ff4444' : '0 0 5px #33ff33'
          }}
        >
          {statusMsg.text}
        </div>
      )}

      {isEditing ? (
        /* Form View */
        <form
          onSubmit={handleSubmit}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            background: 'var(--ui-panel)',
            padding: '12px',
            border: '2px solid rgba(125, 241, 255, 0.35)',
            boxShadow: 'inset 0 0 0 1px rgba(8, 6, 15, 0.9)'
          }}
        >
          <div style={{ fontSize: '22px', color: 'var(--title-blue)', fontWeight: 'bold' }}>
            {editingId ? 'Edit Project Entry' : 'Create New Project Entry'}
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <div style={{ flex: 3 }}>
              <label style={{ fontSize: '18px', display: 'block', color: 'var(--ui-text-dim)', marginBottom: '3px' }}>
                PROJECT TITLE *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Vulkan Raytracer"
                style={{
                  width: '100%',
                  background: '#05050b',
                  color: '#33ff33',
                  border: '1px solid rgba(125, 241, 255, 0.45)',
                  padding: '5px 8px',
                  fontFamily: "'VT323', monospace",
                  fontSize: '20px',
                  textShadow: '0 0 4px #33ff33'
                }}
                required
              />
            </div>

            <div style={{ flex: 1 }}>
              <label style={{ fontSize: '18px', display: 'block', color: 'var(--ui-text-dim)', marginBottom: '3px' }}>
                BADGE (3-4 CHARS)
              </label>
              <input
                type="text"
                maxLength={4}
                value={formData.icon}
                onChange={e => setFormData({ ...formData, icon: e.target.value })}
                placeholder="VUK"
                style={{
                  width: '100%',
                  background: '#05050b',
                  color: '#33ff33',
                  border: '1px solid rgba(125, 241, 255, 0.45)',
                  padding: '5px 8px',
                  fontFamily: "'VT323', monospace",
                  fontSize: '20px',
                  textTransform: 'uppercase',
                  textAlign: 'center',
                  textShadow: '0 0 4px #33ff33'
                }}
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '18px', display: 'block', color: 'var(--ui-text-dim)', marginBottom: '3px' }}>
              TECH STACK (COMMA SEPARATED)
            </label>
            <input
              type="text"
              value={formData.tech}
              onChange={e => setFormData({ ...formData, tech: e.target.value })}
              placeholder="e.g. C++, Vulkan, GLSL, CMake"
              style={{
                width: '100%',
                background: '#05050b',
                color: '#33ff33',
                border: '1px solid rgba(125, 241, 255, 0.45)',
                padding: '5px 8px',
                fontFamily: "'VT323', monospace",
                fontSize: '20px',
                textShadow: '0 0 4px #33ff33'
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: '18px', display: 'block', color: 'var(--ui-text-dim)', marginBottom: '3px' }}>
              PROJECT / GITHUB URL *
            </label>
            <input
              type="url"
              value={formData.link}
              onChange={e => setFormData({ ...formData, link: e.target.value })}
              placeholder="https://github.com/Ads9115/..."
              style={{
                width: '100%',
                background: '#05050b',
                color: '#33ff33',
                border: '1px solid rgba(125, 241, 255, 0.45)',
                padding: '5px 8px',
                fontFamily: "'VT323', monospace",
                fontSize: '20px',
                textShadow: '0 0 4px #33ff33'
              }}
              required
            />
          </div>

          <div>
            <label style={{ fontSize: '18px', display: 'block', color: 'var(--ui-text-dim)', marginBottom: '3px' }}>
              BUTTON TEXT (DEFAULT: Open GitHub Repo)
            </label>
            <input
              type="text"
              value={formData.linkLabel}
              onChange={e => setFormData({ ...formData, linkLabel: e.target.value })}
              placeholder="Open GitHub Repo"
              style={{
                width: '100%',
                background: '#05050b',
                color: '#33ff33',
                border: '1px solid rgba(125, 241, 255, 0.45)',
                padding: '5px 8px',
                fontFamily: "'VT323', monospace",
                fontSize: '20px',
                textShadow: '0 0 4px #33ff33'
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: '18px', display: 'block', color: 'var(--ui-text-dim)', marginBottom: '3px' }}>
              DESCRIPTION
            </label>
            <textarea
              rows={3}
              value={formData.desc}
              onChange={e => setFormData({ ...formData, desc: e.target.value })}
              placeholder="Write a technical summary of your graphics pipeline or algorithms..."
              style={{
                width: '100%',
                background: '#05050b',
                color: '#33ff33',
                border: '1px solid rgba(125, 241, 255, 0.45)',
                padding: '5px 8px',
                fontFamily: "'VT323', monospace",
                fontSize: '20px',
                lineHeight: 1.3,
                textShadow: '0 0 4px #33ff33',
                resize: 'vertical'
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
            <button
              type="submit"
              className="win-btn"
              disabled={isSaving}
              style={{ padding: '6px 18px', fontSize: '20px', color: '#2d1423' }}
            >
              {isSaving ? 'Saving to Database...' : '💾 Save Project'}
            </button>
            <button
              type="button"
              className="win-btn"
              onClick={resetForm}
              disabled={isSaving}
              style={{ padding: '6px 18px', fontSize: '20px' }}
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        /* List View */
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: '21px', color: 'var(--ui-text)' }}>
              Projects Catalog ({projects.length})
            </div>
            <button
              className="win-btn"
              style={{
                padding: '4px 14px',
                fontSize: '20px',
                marginTop: 0,
                color: '#2d1423'
              }}
              onClick={handleStartAdd}
            >
              + Add New Project
            </button>
          </div>

          <div
            style={{
              flexGrow: 1,
              overflowY: 'auto',
              border: '2px solid rgba(125, 241, 255, 0.35)',
              background: 'rgba(10, 8, 20, 0.85)',
              padding: '6px'
            }}
          >
            {projects.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '30px', color: 'var(--ui-text-dim)', fontSize: '22px' }}>
                No projects in database. Click &ldquo;+ Add New Project&rdquo; above!
              </div>
            ) : (
              projects.map(proj => (
                <div
                  key={proj.id || proj.title}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '8px 10px',
                    borderBottom: '1px solid rgba(125, 241, 255, 0.15)',
                    background: 'linear-gradient(90deg, rgba(30, 24, 50, 0.7) 0%, rgba(20, 15, 35, 0.7) 100%)',
                    marginBottom: '4px'
                  }}
                >
                  <div
                    style={{
                      width: '52px',
                      height: '40px',
                      background: 'linear-gradient(135deg, #2b1f4a 0%, #150f28 100%)',
                      border: '2px solid rgba(125, 241, 255, 0.45)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '20px',
                      color: 'var(--neon-cyan)',
                      textShadow: '0 0 8px rgba(100, 245, 255, 0.7)',
                      flexShrink: 0
                    }}
                  >
                    {proj.icon || 'PRJ'}
                  </div>

                  <div style={{ flexGrow: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: '21px',
                        color: 'var(--ui-text)',
                        fontWeight: 'bold',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {proj.title}
                    </div>
                    <div
                      style={{
                        fontSize: '17px',
                        color: 'var(--ui-text-dim)',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {proj.tech}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                    <button
                      className="win-btn"
                      style={{ padding: '2px 10px', fontSize: '17px', marginTop: 0 }}
                      onClick={() => handleStartEdit(proj)}
                    >
                      Edit
                    </button>
                    <button
                      className="win-btn"
                      style={{ padding: '2px 10px', fontSize: '17px', marginTop: 0, color: '#ff5555' }}
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
