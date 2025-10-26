import { PlusIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTabsContext } from '@/hooks/use-tabs';
import { TabStore } from '@/types/tabs';

export function NewTabComponent() {
  return (
    <div className="p-8 h-full overflow-auto">
      <h1 className="text-3xl font-bold mb-4 text-gray-900">New Tab</h1>
    </div>
  );
}

export function NewTabButton() {
  const { store } = useTabsContext();

  const createNewTab = store((state: TabStore) => state.createNewTab);

  return (
    <Button onClick={createNewTab} size="icon-sm" className="not-drag-window mb-1" variant="ghost">
      <span className="sr-only">Open a new tab</span>
      <PlusIcon />
    </Button>
  );
}
