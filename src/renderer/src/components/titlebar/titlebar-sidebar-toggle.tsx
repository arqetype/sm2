import { SidebarCloseIcon, SidebarOpenIcon } from 'lucide-react';
import { Button } from '../ui/button';
import { useSidebar } from '../ui/sidebar';

export function TitlebarSidebarToggle() {
  const { open, toggleSidebar } = useSidebar();

  const handleClick = () => toggleSidebar();

  return (
    <Button onClick={handleClick} size="icon-sm" className="not-drag-window" variant="ghost">
      {open ? <SidebarCloseIcon /> : <SidebarOpenIcon />}
    </Button>
  );
}
