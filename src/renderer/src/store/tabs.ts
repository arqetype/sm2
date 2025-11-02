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
            closable: false
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

      const { tabs } = get();
      const newTab = {
        id: newId,
        closable: true,
        ...tab
      } as Tab;

      const updatedTabs = tabs.map(t => ({
        ...t,
        closable: true
      }));

      set(() => ({
        tabs: [...updatedTabs, newTab],
        activeTab: newId
      }));

      return newId;
    },

    removeTab: (id: string) => {
      const { tabs, activeTab, defaultTabComponent } = get();
      const tab = tabs.find(t => t.id === id);

      if (!tab) return false;
      if (tab.closable === false) return false;

      // Si c'est le dernier onglet et que c'est un NewTab, empêcher la fermeture
      if (tabs.length === 1 && tab.component === defaultTabComponent) {
        return false;
      }

      const idx = tabs.findIndex(t => t.id === id);
      const newTabs = tabs.filter(t => t.id !== id);

      // Si c'était le dernier onglet, créer un nouvel onglet
      if (newTabs.length === 0) {
        const newTabId = generateTabId();
        const newTab = {
          id: newTabId,
          title: 'New tab',
          component: defaultTabComponent,
          closable: false
        };

        set({
          tabs: [newTab],
          activeTab: newTabId
        });
      } else {
        // Mettre à jour la propriété closable des onglets restants
        const updatedTabs = newTabs.map(t => ({
          ...t,
          closable: newTabs.length > 1 || t.component !== defaultTabComponent
        }));

        set({
          tabs: updatedTabs,
          activeTab:
            activeTab === id ? updatedTabs[Math.min(idx, updatedTabs.length - 1)].id : activeTab
        });
      }

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
