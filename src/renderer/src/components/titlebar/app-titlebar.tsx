import { TabsList } from '@/components/navigation/tabs-list';
import { TitlebarSidebarToggle } from './titlebar-sidebar-toggle';
import { SIDEBAR_WIDTH, useSidebar } from '../ui/sidebar';
import { cn } from '@/lib/utils';

const TRAFFIC_LIGHT_WIDTH = '5.2rem';

export function AppTitlebar() {
  const { open } = useSidebar();

  return (
    <div className="w-full h-10 bg-vibrancy fixed top-0 left-0 right-0 drag-window flex items-center justify-start border-b border-border z-0">
      <div
        className={cn(
          'flex items-center justify-start h-full transition-[margin-left,border-width] duration-135 ease-linear border-border flex-1 ',
          open ? 'delay-65 border-l' : 'delay-0'
        )}
        style={{ marginLeft: open ? `calc(${SIDEBAR_WIDTH} - 1px)` : TRAFFIC_LIGHT_WIDTH }}
      >
        <TitlebarSidebarToggle />
        <TabsList />
      </div>
    </div>
  );
}
