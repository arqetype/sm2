import { create } from 'zustand';
import type { Tab, TabStore } from '@/types/tabs';
import { NewTabComponent } from '@/components/navigation/tab-new';

let tabIdCounter = 0;
const generateTabId = () => `tab-${Date.now()}-${++tabIdCounter}`;

interface CreateTabStoreOptions {
  initialTabs?: Tab[];
}

export const createTabStore = (options: CreateTabStoreOptions = {}) => {
  const { initialTabs = [] } = options;

  const tabs =
    initialTabs.length === 0
      ? [
          {
            id: generateTabId(),
            title: 'New tab',
            component: NewTabComponent,
            closable: true
          }
        ]
      : initialTabs;

  return create<TabStore>((set, get) => ({
    tabs,
    activeTab: tabs[0]?.id || null,
    defaultTabComponent: NewTabComponent,

    setActiveTab: (id: string) => {
      const { tabs } = get();
      if (tabs.some(t => t.id === id)) {
        set({ activeTab: id });
      }
    },

    addTab: tab => {
      const newId = tab.id || generateTabId();

      if (get().tabs.some(t => t.id === newId)) {
        console.error(`Tab with id "${newId}" already exists`);
        return '';
      }

      if (!tab.component) {
        console.error('Tab must have a component');
        return '';
      }

      const newTab = {
        id: newId,
        closable: true,
        ...tab
      } as Tab;

      set(state => ({
        tabs: [...state.tabs, newTab],
        activeTab: newId
      }));

      return newId;
    },

    removeTab: (id: string) => {
      const { tabs, activeTab } = get();
      const tab = tabs.find(t => t.id === id);

      if (!tab) return false;
      if (tab.closable === false) return false;
      if (tabs.length === 1) return false;

      const idx = tabs.findIndex(t => t.id === id);
      const newTabs = tabs.filter(t => t.id !== id);

      set({
        tabs: newTabs,
        activeTab: activeTab === id ? newTabs[Math.min(idx, newTabs.length - 1)].id : activeTab
      });

      return true;
    },

    updateTab: (id: string, updates) => {
      const { tabs } = get();
      if (!tabs.some(t => t.id === id)) return false;

      set(state => ({
        tabs: state.tabs.map(t => (t.id === id ? ({ ...t, ...updates } as Tab) : t))
      }));

      return true;
    },

    reorderTabs: (fromId: string, toId: string) => {
      const { tabs } = get();
      const fromIdx = tabs.findIndex(t => t.id === fromId);
      const toIdx = tabs.findIndex(t => t.id === toId);

      if (fromIdx === -1 || toIdx === -1) return false;

      const newTabs = [...tabs];
      const [moved] = newTabs.splice(fromIdx, 1);
      newTabs.splice(toIdx, 0, moved);

      set({ tabs: newTabs });
      return true;
    },

    nextTab: () => {
      const { tabs, activeTab } = get();
      if (tabs.length === 0) return;

      const idx = tabs.findIndex(t => t.id === activeTab);
      const nextIdx = (idx + 1) % tabs.length;
      set({ activeTab: tabs[nextIdx].id });
    },

    prevTab: () => {
      const { tabs, activeTab } = get();
      if (tabs.length === 0) return;

      const idx = tabs.findIndex(t => t.id === activeTab);
      const prevIdx = (idx - 1 + tabs.length) % tabs.length;
      set({ activeTab: tabs[prevIdx].id });
    },

    createNewTab: () => {
      const { defaultTabComponent: component, addTab } = get();

      return addTab({
        title: `New tab`,
        component: component
      });
    }
  }));
};
