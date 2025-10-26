import { type ReactNode } from 'react';
import * as TabsPrimitive from '@radix-ui/react-tabs';
import { useTabsContext } from '@/hooks/use-tabs';
import { cn } from '@/lib/utils';
import type { TabStore } from '@/types/tabs';

interface TabsRootProps {
  children: ReactNode;
  className?: string;
}

export function TabsRoot({ children, className }: TabsRootProps) {
  const { store } = useTabsContext();

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
}
