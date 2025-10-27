import { useContext } from 'react';
import { TabsContext } from '@/providers/tabs-provider';

export function useTabs() {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error('useTabs must be used within TabsProvider');
  }
  return context.store();
}

export function useTabsContext() {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error('useTabsContext must be used within TabsProvider');
  }
  return context;
}
