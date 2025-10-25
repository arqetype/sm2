import { TabsList } from '../navigation/app-navigation';
import { TitlebarSidebarToggle } from './titlebar-sidebar-toggle';
import { TitlebarSpace } from './titlebar-space';

export function AppTitlebar() {
  return (
    <div className="w-full h-9 bg-vibrancy fixed top-0 left-0 right-0 drag-window flex items-center justify-start">
      <TitlebarSpace />
      <div className="flex items-center justify-start">
        <TitlebarSidebarToggle />
        <TabsList />
      </div>
    </div>
  );
}
