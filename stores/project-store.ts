import { create } from 'zustand';
import { Project } from '@/types';

interface ProjectStore {
  // Current project
  project: Project | null;
  setProject: (project: Project) => void;
  
  // Project state
  isDirty: boolean;
  setIsDirty: (dirty: boolean) => void;
  
  // Auto-save
  lastSaved: Date | null;
  
  // Project operations
  loadProject: (id: string) => Promise<void>;
  saveProject: () => Promise<void>;
  createProject: (name: string) => Promise<Project>;
  deleteProject: (id: string) => Promise<void>;
}

export const useProjectStore = create<ProjectStore>((set, get) => ({
  project: null,
  setProject: (project) => set({ project }),
  
  isDirty: false,
  setIsDirty: (dirty) => set({ isDirty: dirty }),
  
  lastSaved: null,
  
  loadProject: async (id: string) => {
    try {
      // TODO: Replace with actual API call
      const response = await fetch(`/api/projects/${id}`);
      const project = await response.json();
      set({ project, isDirty: false, lastSaved: new Date() });
    } catch (error) {
      console.error('Failed to load project:', error);
    }
  },
  
  saveProject: async () => {
    const { project } = get();
    if (!project) return;
    
    try {
      // Get canvas JSON from canvas store
      const canvasStore = (await import('./canvas-store')).useCanvasStore.getState();
      const canvasJson = canvasStore.exportToJSON();
      
      const response = await fetch(`/api/projects/${project.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ canvas: canvasJson }),
      });
      
      if (response.ok) {
        set({ isDirty: false, lastSaved: new Date() });
      }
    } catch (error) {
      console.error('Failed to save project:', error);
    }
  },
  
  createProject: async (name: string) => {
    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });
      const project = await response.json();
      set({ project, isDirty: false, lastSaved: new Date() });
      return project;
    } catch (error) {
      console.error('Failed to create project:', error);
      throw error;
    }
  },
  
  deleteProject: async (id: string) => {
    try {
      await fetch(`/api/projects/${id}`, { method: 'DELETE' });
      set({ project: null, isDirty: false });
    } catch (error) {
      console.error('Failed to delete project:', error);
    }
  },
}));

