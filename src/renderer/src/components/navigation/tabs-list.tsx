import { useCallback, useEffect } from 'react';
import * as TabsPrimitive from '@radix-ui/react-tabs';
import { useTabsContext } from '@/hooks/use-tabs';
import { Tab } from '@/components/navigation/tab';
import type { TabStore } from '@/types/tabs';
import { NewTabButton } from './tab-new';

export function TabsList() {
  const { store, shortcuts } = useTabsContext();

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
    <TabsPrimitive.List aria-label="Tabs" className="flex items-center gap-1 h-8.5 mt-1.5 flex-1">
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
      <NewTabButton />
    </TabsPrimitive.List>
  );
}
