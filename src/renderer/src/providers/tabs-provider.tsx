import { createContext, useMemo, type ReactNode } from 'react';
import type { StoreApi, UseBoundStore } from 'zustand';
import type { Tab, TabStore } from '@/types/tabs';

export interface TabsContextValue {
  store: UseBoundStore<StoreApi<TabStore>>;
  renderTab?: (tab: Tab) => ReactNode;
  renderPanel?: (tab: Tab) => ReactNode;
  shortcuts?: boolean;
}

export const TabsContext = createContext<TabsContextValue | null>(null);

interface TabsProviderProps {
  children: ReactNode;
  useStore: UseBoundStore<StoreApi<TabStore>>;
  shortcuts?: boolean;
  renderTab?: (tab: Tab) => ReactNode;
  renderPanel?: (tab: Tab) => ReactNode;
}

export function TabsProvider({
  children,
  useStore,
  shortcuts = true,
  renderTab,
  renderPanel
}: TabsProviderProps) {
  const contextValue = useMemo(
    () => ({
      store: useStore,
      shortcuts,
      renderTab,
      renderPanel
    }),
    [useStore, shortcuts, renderTab, renderPanel]
  );

  return <TabsContext.Provider value={contextValue}>{children}</TabsContext.Provider>;
}
