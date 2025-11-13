import { create } from 'zustand';
import { useCanvasStore } from './canvas-store';
import type { StationeryTemplateType } from '@/types/stationery';

export type ProjectTab = {
  id: string;
  name: string;
  type: StationeryTemplateType;
  canvasData: string; // JSON serialized canvas
  width: number;
  height: number;
  createdAt: Date;
  isDirty: boolean;
  metadataUrl?: string | null;
};

const STORAGE_PREFIX = 'artai-tabs-state';
const getStorageKey = (projectId: string) => `${STORAGE_PREFIX}:${projectId}`;

type StoredTab = Omit<ProjectTab, 'createdAt'> & { createdAt: string };
type StoredState = {
  tabs: StoredTab[];
  activeTabId: string | null;
};

const serializeTabs = (tabs: ProjectTab[]): StoredTab[] =>
  tabs.map((tab) => ({
    ...tab,
    createdAt: tab.createdAt.toISOString(),
  }));

const deserializeTabs = (tabs: StoredTab[]): ProjectTab[] =>
  tabs.map((tab) => ({
    ...tab,
    createdAt: new Date(tab.createdAt),
  }));

interface TabStore {
  tabs: ProjectTab[];
  activeTabId: string | null;
  currentProjectId: string | null;
  addTab: (tab: Omit<ProjectTab, 'id' | 'createdAt' | 'isDirty'>) => ProjectTab;
  removeTab: (tabId: string) => void;
  setActiveTab: (tabId: string | null) => void;
  updateTab: (tabId: string, updates: Partial<ProjectTab>) => void;
  getActiveTab: () => ProjectTab | null;
  createNewTemplate: (type?: StationeryTemplateType) => ProjectTab | null;
  createVariantFromActive: () => ProjectTab | null;
  loadTabs: (projectId: string) => void;
  persistState: () => void;
  setProjectContext: (projectId: string) => void;
}

export const useTabStore = create<TabStore>((set, get) => {
  const syncActiveCanvas = () => {
    const activeTab = get().getActiveTab();
    if (!activeTab) return;
    const canvasState = useCanvasStore.getState();
    const json = canvasState.exportToJSON ? canvasState.exportToJSON() : '';
    if (!json) return;
    set((state) => ({
      tabs: state.tabs.map((tab) =>
        tab.id === activeTab.id ? { ...tab, canvasData: json, isDirty: false } : tab
      ),
    }));
  };
  
  return {
    tabs: [],
    activeTabId: null,
    currentProjectId: null,

    addTab: (tab) => {
      const newTab: ProjectTab = {
        ...tab,
        id: `tab-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date(),
        isDirty: false,
      };

      set((state) => ({
        tabs: [...state.tabs, newTab],
        activeTabId: newTab.id,
      }));
      get().persistState();
      return newTab;
    },

    removeTab: (tabId) => {
      syncActiveCanvas();
      const { tabs, activeTabId } = get();
      const newTabs = tabs.filter((t) => t.id !== tabId);

      let newActiveId = activeTabId;
      if (activeTabId === tabId) {
        if (newTabs.length > 0) {
          const currentIndex = tabs.findIndex((t) => t.id === tabId);
          const newIndex = Math.max(0, currentIndex - 1);
          newActiveId = newTabs[newIndex]?.id || newTabs[0]?.id || null;
        } else {
          newActiveId = null;
        }
      }

      set({ tabs: newTabs, activeTabId: newActiveId });
      get().persistState();
    },

    setActiveTab: (tabId) => {
      syncActiveCanvas();
      set({ activeTabId: tabId });
      get().persistState();
    },

    updateTab: (tabId, updates) => {
      set((state) => ({
        tabs: state.tabs.map((tab) =>
          tab.id === tabId ? { ...tab, ...updates } : tab
        ),
      }));
      get().persistState();
    },

    getActiveTab: () => {
      const { tabs, activeTabId } = get();
      return tabs.find((t) => t.id === activeTabId) || null;
    },

    createNewTemplate: (type = 'blank') => {
      const sizes: Record<StationeryTemplateType, { width: number; height: number }> = {
        invitation: { width: 1500, height: 2100 },
        rsvp: { width: 1200, height: 1800 },
        menu: { width: 1500, height: 2100 },
        program: { width: 1200, height: 2700 },
        'thank-you': { width: 1200, height: 1800 },
        envelope: { width: 1050, height: 1500 },
        sign: { width: 2100, height: 1500 },
        blank: { width: 1500, height: 2100 },
      };

      const size = sizes[type];
      const tabNumber = get().tabs.length + 1;

      return get().addTab({
        name: `${type === 'blank' ? 'Untitled' : type.charAt(0).toUpperCase() + type.slice(1)} ${tabNumber}`,
        type,
        canvasData: '',
        width: size.width,
        height: size.height,
      });
    },

    createVariantFromActive: () => {
      syncActiveCanvas();
      const activeTab = get().getActiveTab();
      if (!activeTab) return null;

      const siblings = get().tabs.filter((tab) => tab.type === activeTab.type);
      const variantNumber = siblings.length + 1;
      const baseName = activeTab.name.replace(/\s+(Option|Variant)\s+\d+$/i, '').trim();
      const variantName = `${baseName} Option ${variantNumber}`;

      return get().addTab({
        name: variantName,
        type: activeTab.type,
        canvasData: '',
        width: activeTab.width,
        height: activeTab.height,
      });
    },

    loadTabs: (projectId) => {
      get().setProjectContext(projectId);

      const key = getStorageKey(projectId);

      if (typeof window === 'undefined') {
        set({ tabs: [], activeTabId: null });
        return;
      }

      try {
        const stored = window.localStorage.getItem(key);
        if (!stored) {
          set({ tabs: [], activeTabId: null });
          return;
        }

        const parsed = JSON.parse(stored) as StoredState;
        const loadedTabs = deserializeTabs(parsed.tabs || []);
        const activeTabId =
          parsed.activeTabId && loadedTabs.some((tab) => tab.id === parsed.activeTabId)
            ? parsed.activeTabId
            : loadedTabs[0]?.id || null;

        set({
          tabs: loadedTabs,
          activeTabId,
        });
      } catch (error) {
        console.error('Failed to load tabs from storage:', error);
        set({ tabs: [], activeTabId: null });
      }
    },

    persistState: () => {
      const { currentProjectId, tabs, activeTabId } = get();
      if (!currentProjectId || typeof window === 'undefined') {
        return;
      }

      try {
        const data: StoredState = {
          activeTabId,
          tabs: serializeTabs(tabs),
        };
        window.localStorage.setItem(getStorageKey(currentProjectId), JSON.stringify(data));
      } catch (error) {
        console.error('Failed to persist tabs to storage:', error);
      }
    },

    setProjectContext: (projectId) => {
      set({ currentProjectId: projectId });
    },
  };
});

