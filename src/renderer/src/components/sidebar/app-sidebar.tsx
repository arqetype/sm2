import { Sidebar, SidebarContent, SidebarFooter } from '../ui/sidebar';

export function AppSidebar() {
  return (
    <Sidebar
      variant="sidebar"
      className="h-[calc(100svh-calc(var(--spacing)*9))] top-9 bg-vibrancy border-t"
    >
      <SidebarContent>This is sidebar content</SidebarContent>
      <SidebarFooter>This is a sidebar footer</SidebarFooter>
    </Sidebar>
  );
}
