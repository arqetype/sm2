import { PlusIcon, XIcon } from 'lucide-react';
import {
  Component,
  createContext,
  ErrorInfo,
  memo,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  type ReactNode
} from 'react';
import * as TabsPrimitive from '@radix-ui/react-tabs';
import type { Tab as TabType, TabComponentProps, TabStore } from '@/types/tabs';
import { type StoreApi, type UseBoundStore, create } from 'zustand';

import { NewTabComponent } from '@/components/navigation/navigation-new-tab';
import { Button, buttonVariants } from '../ui/button';
import { cn } from '@/lib/utils';

let tabIdCounter = 0;
const generateTabId = () => `tab-${Date.now()}-${++tabIdCounter}`;

interface CreateTabStoreOptions {
  initialTabs?: TabType[];
  defaultTabComponent?: React.ComponentType<TabComponentProps>;
}

export const createTabStore = (options: CreateTabStoreOptions = {}) => {
  const { initialTabs = [], defaultTabComponent = NewTabComponent } = options;

  return create<TabStore>((set, get) => ({
    tabs: initialTabs,
    activeTab: initialTabs[0]?.id || null,
    defaultTabComponent,

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

      const newTab: TabType = {
        id: newId,
        closable: true,
        ...tab
      };

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
        tabs: state.tabs.map(t => (t.id === id ? { ...t, ...updates } : t))
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
      const { tabs, defaultTabComponent: component, addTab } = get();

      if (!component) {
        console.error('No default tab component configured');
        return '';
      }

      return addTab({
        title: `Tab ${tabs.length + 1}`,
        component: component
      });
    }
  }));
};

export interface TabsContextValue {
  store: UseBoundStore<StoreApi<TabStore>>;
  renderTab?: (tab: TabType) => ReactNode;
  renderPanel?: (tab: TabType) => ReactNode;
  shortcuts?: boolean;
}

export const TabsContext = createContext<TabsContextValue | null>(null);

export const useTabsContext = () => {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error('useTabsContext must be used within TabsProvider');
  }
  return context.store();
};

interface TabErrorBoundaryProps {
  children: ReactNode;
  tabId: string;
  fallback?: ReactNode;
}

interface TabErrorBoundaryStates {
  hasError: boolean;
  error?: Error;
}

class TabErrorBoundary extends Component<TabErrorBoundaryProps, TabErrorBoundaryStates> {
  constructor(props: TabErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(`Error in tab ${this.props.tabId}:`, error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || <div>Error in the navigation: {this.state.error?.message}</div>;
    }

    return this.props.children;
  }
}

interface TabProps {
  id: string;
  active: boolean;
  closable: boolean;
  onClose?: (id: string) => void;
  title: string;
  children?: React.ReactNode;
}

const Tab = memo<TabProps>(({ id, active, closable, onClose, title, children }) => {
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  return (
    <TabsPrimitive.Trigger
      value={id}
      draggable
      className={cn(`not-drag-window`, buttonVariants({ variant: 'outline', size: 'sm' }))}
      aria-label={`${title}${active ? ' (active)' : ''}`}
    >
      <span>
        {children} {active ? 'Active' : 'Inactive'}
      </span>
      {closable && (
        <button
          ref={closeButtonRef}
          onClick={e => {
            e.stopPropagation();
            onClose?.(id);
          }}
          aria-label={`Close ${title}`}
          tabIndex={0}
        >
          <XIcon />
        </button>
      )}
    </TabsPrimitive.Trigger>
  );
});

Tab.displayName = 'Tab';

interface TabsRootProps {
  children: ReactNode;
  className?: string;
}

interface TabsProviderProps {
  children: ReactNode;
  useStore: UseBoundStore<StoreApi<TabStore>>;
  shortcuts?: boolean;
}

export const TabsProvider = ({ children, useStore, shortcuts = true }: TabsProviderProps) => {
  const contextValue = useMemo(
    () => ({
      store: useStore,
      shortcuts
    }),
    [useStore, shortcuts]
  );

  return <TabsContext.Provider value={contextValue}>{children}</TabsContext.Provider>;
};

export const TabsRoot = ({ children, className }: TabsRootProps) => {
  const context = useContext(TabsContext);

  if (!context) throw new Error('TabsRoot must be used within TabsProvider');

  const { store } = context;

  const activeTab = store((state: TabStore) => state.activeTab);
  const setActiveTab = store((state: TabStore) => state.setActiveTab);

  return (
    <TabsPrimitive.Root
      value={activeTab || undefined}
      onValueChange={setActiveTab}
      className={cn('h-full w-full', className)}
    >
      {children}
    </TabsPrimitive.Root>
  );
};

interface TabsListProps {
  showNewButton?: boolean;
  className?: string;
}

export function TabsList({ showNewButton = true }: TabsListProps) {
  const context = useContext(TabsContext);

  if (!context) throw new Error('TabsList must be used within TabsProvider');

  const { store, shortcuts } = context;
  const tabs = store((state: TabStore) => state.tabs);
  const activeTab = store((state: TabStore) => state.activeTab);

  const removeTab = store((state: TabStore) => state.removeTab);
  const nextTab = store((state: TabStore) => state.nextTab);
  const prevTab = store((state: TabStore) => state.prevTab);
  const createNewTab = store((state: TabStore) => state.createNewTab);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const modKey = isMac ? e.metaKey : e.ctrlKey;

      if (modKey && e.key === 'w') {
        e.preventDefault();
        if (activeTab) removeTab(activeTab);
      }
      if (modKey && e.key === 't') {
        e.preventDefault();
        createNewTab();
      }
      if (modKey && !e.shiftKey && e.key === 'Tab') {
        e.preventDefault();
        nextTab();
      }
      if (modKey && e.shiftKey && e.key === 'Tab') {
        e.preventDefault();
        prevTab();
      }
    },
    [activeTab, removeTab, nextTab, prevTab, createNewTab]
  );

  useEffect(() => {
    if (!shortcuts) return;
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts, handleKeyDown]);

  return (
    <div className="flex items-center">
      <TabsPrimitive.List aria-label="Tabs" className="flex items-center">
        {tabs.map(tab => (
          <Tab
            key={tab.id}
            id={tab.id}
            active={activeTab === tab.id}
            closable={tab.closable !== false}
            title={tab.title}
            onClose={removeTab}
          >
            {tab.title}
          </Tab>
        ))}
      </TabsPrimitive.List>
      {showNewButton && (
        <Button
          onClick={createNewTab}
          aria-label="New tab"
          variant="ghost"
          size="icon-sm"
          className="not-drag-window"
        >
          <PlusIcon size={16} />
        </Button>
      )}
    </div>
  );
}

interface TabsPanelsProps {
  errorFallback?: ReactNode;
}

export function TabsPanels({ errorFallback }: TabsPanelsProps) {
  const context = useContext(TabsContext);
  if (!context) throw new Error('TabsPanels must be used within TabsProvider');

  const { store, renderPanel } = context;
  const tabs = store((state: TabStore) => state.tabs);

  const defaultRenderPanel = useCallback((tab: TabType) => {
    const Component = tab.component;
    return Component ? <Component tabId={tab.id} /> : null;
  }, []);

  const render = renderPanel || defaultRenderPanel;

  return (
    <div className="w-full h-hull">
      {tabs.map(tab => (
        <TabsPrimitive.Content key={tab.id} value={tab.id}>
          <TabErrorBoundary tabId={tab.id} fallback={errorFallback}>
            {render(tab)}
          </TabErrorBoundary>
        </TabsPrimitive.Content>
      ))}
    </div>
  );
}
