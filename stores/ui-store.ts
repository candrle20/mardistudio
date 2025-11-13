import { create } from 'zustand';

interface UIStore {
  // Sidebar state
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  sidebarTab: 'properties' | 'layers' | 'history';
  setSidebarTab: (tab: 'properties' | 'layers' | 'history') => void;
  
  // AI panel state
  aiPanelOpen: boolean;
  toggleAIPanel: () => void;
  
  // Modals
  showExportModal: boolean;
  openExportModal: () => void;
  closeExportModal: () => void;
  
  // Toast notifications
  toast: (message: string, type: 'success' | 'error' | 'info') => void;
}

export const useUIStore = create<UIStore>((set) => ({
  sidebarOpen: true,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  
  sidebarTab: 'properties',
  setSidebarTab: (tab) => set({ sidebarTab: tab }),
  
  aiPanelOpen: false,
  toggleAIPanel: () => set((state) => ({ aiPanelOpen: !state.aiPanelOpen })),
  
  showExportModal: false,
  openExportModal: () => set({ showExportModal: true }),
  closeExportModal: () => set({ showExportModal: false }),
  
  toast: (message, type) => {
    // TODO: Integrate with toast component
    console.log(`[${type.toUpperCase()}] ${message}`);
  },
}));

