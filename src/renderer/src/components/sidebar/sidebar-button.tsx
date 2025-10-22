import { Button } from '../ui/button';
import { useSidebar } from '../ui/sidebar';

export function SidebarButton() {
  const { toggleSidebar } = useSidebar();

  return <Button onClick={toggleSidebar}>Open sidebar</Button>;
}
