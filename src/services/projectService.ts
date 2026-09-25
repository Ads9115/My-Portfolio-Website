import { ProjectData } from '../types/os';
import { PORTFOLIO_DATA } from '../data/portfolioData';

const LOCAL_STORAGE_KEY = 'adarsh_os_projects';

export interface ProjectItem extends ProjectData {
  id?: string;
  sort_order?: number;
}

export const projectService = {
  // Fetch all projects (from localStorage or default)
  async getProjects(): Promise<ProjectItem[]> {
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
    const current = await this.getProjects();
    const filtered = current.filter(p => p.id !== id);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(filtered));
    return true;
  }
};
