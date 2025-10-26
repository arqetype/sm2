import { useCallback, type ReactNode } from 'react';
import * as TabsPrimitive from '@radix-ui/react-tabs';
import { useTabsContext } from '@/hooks/use-tabs';
import { TabErrorBoundary } from '@/components/navigation/tab-error-boundary';
import type { Tab, TabStore } from '@/types/tabs';

interface TabsPanelsProps {
  errorFallback?: ReactNode;
}

export function TabsPanels({ errorFallback }: TabsPanelsProps) {
  const { store, renderPanel } = useTabsContext();
  const tabs = store((state: TabStore) => state.tabs);

  const defaultRenderPanel = useCallback((tab: Tab) => {
    const Component = tab.component;
    return Component ? <Component tabId={tab.id} data={tab.data} /> : null;
  }, []);

  const render = renderPanel || defaultRenderPanel;

  return (
    <div className="w-full h-full overflow-y-scroll relative z-10 bg-background">
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
