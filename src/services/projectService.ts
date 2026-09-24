import { supabase, isSupabaseConfigured } from './supabase';
import { ProjectData } from '../types/os';
import { PORTFOLIO_DATA } from '../data/portfolioData';

const LOCAL_STORAGE_KEY = 'adarsh_os_projects';

export interface ProjectItem extends ProjectData {
  id?: string;
  sort_order?: number;
}

export const projectService = {
  // Fetch all projects (from Supabase if configured, otherwise localStorage or default)
  async getProjects(): Promise<ProjectItem[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .order('sort_order', { ascending: true });

        if (error) {
          console.warn('Supabase fetch error, falling back to local:', error.message);
        } else if (data && data.length > 0) {
          return data.map(row => ({
            id: row.id,
            title: row.title,
            icon: row.icon || 'PRJ',
            tech: row.tech,
            desc: row.description || row.desc || '',
            link: row.link,
            linkLabel: row.link_label || row.linkLabel || 'Open GitHub Repo',
            sort_order: row.sort_order ?? 0
          }));
        }
      } catch (err) {
        console.warn('Network error reaching Supabase:', err);
      }
    }

    // LocalStorage Fallback
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // Ignore
    }

    // Default static projects
    return PORTFOLIO_DATA.projects.map((p, idx) => ({
      ...p,
      id: `local-${idx}`,
      sort_order: idx + 1
    }));
  },

  // Create a new project
  async addProject(project: Omit<ProjectItem, 'id'>): Promise<ProjectItem> {
    if (isSupabaseConfigured && supabase) {
      const row = {
        title: project.title,
        icon: project.icon || 'PRJ',
        tech: project.tech,
        description: project.desc,
        link: project.link,
        link_label: project.linkLabel || 'Open GitHub Repo',
        sort_order: project.sort_order ?? 99
      };

      const { data, error } = await supabase
        .from('projects')
        .insert([row])
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return {
        id: data.id,
        title: data.title,
        icon: data.icon,
        tech: data.tech,
        desc: data.description,
        link: data.link,
        linkLabel: data.link_label,
        sort_order: data.sort_order
      };
    }

    // Local fallback
    const newItem: ProjectItem = {
      ...project,
      id: `local-${Date.now()}`
    };
    const current = await this.getProjects();
    const updated = [...current, newItem];
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    return newItem;
  },

  // Update an existing project
  async updateProject(id: string, updates: Partial<ProjectItem>): Promise<ProjectItem> {
    if (isSupabaseConfigured && supabase && !id.startsWith('local-')) {
      const row: Record<string, unknown> = {};
      if (updates.title !== undefined) row.title = updates.title;
      if (updates.icon !== undefined) row.icon = updates.icon;
      if (updates.tech !== undefined) row.tech = updates.tech;
      if (updates.desc !== undefined) row.description = updates.desc;
      if (updates.link !== undefined) row.link = updates.link;
      if (updates.linkLabel !== undefined) row.link_label = updates.linkLabel;
      if (updates.sort_order !== undefined) row.sort_order = updates.sort_order;

      const { data, error } = await supabase
        .from('projects')
        .update(row)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return {
        id: data.id,
        title: data.title,
        icon: data.icon,
        tech: data.tech,
        desc: data.description,
        link: data.link,
        linkLabel: data.link_label,
        sort_order: data.sort_order
      };
    }

    // Local fallback
    const current = await this.getProjects();
    const index = current.findIndex(p => p.id === id);
    if (index === -1) throw new Error('Project not found');
    const updatedItem = { ...current[index], ...updates };
    current[index] = updatedItem;
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(current));
    return updatedItem;
  },

  // Delete a project
  async deleteProject(id: string): Promise<boolean> {
    if (isSupabaseConfigured && supabase && !id.startsWith('local-')) {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);

      if (error) {
        throw new Error(error.message);
      }
      return true;
    }

    // Local fallback
    const current = await this.getProjects();
    const filtered = current.filter(p => p.id !== id);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(filtered));
    return true;
  }
};
