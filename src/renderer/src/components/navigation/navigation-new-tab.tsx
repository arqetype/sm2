import { useTabsContext } from '@/components/navigation/app-navigation';
import type { TabComponentProps } from '@/types/tabs';

export function NewTabComponent({ tabId }: TabComponentProps) {
  const store = useTabsContext();

  return (
    <div className="p-8 bg-white h-full overflow-auto">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-4 text-gray-900">New Tab</h1>
        <p className="text-gray-600 mb-4">This is a default new tab. TODO: Make this cool</p>
        <button
          onClick={() => store.removeTab(tabId)}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        >
          Close This Tab
        </button>
      </div>
    </div>
  );
}
