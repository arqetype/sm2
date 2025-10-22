import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader } from '../ui/sidebar';

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader>This is sidebar header</SidebarHeader>
      <SidebarContent>This is sidebar content</SidebarContent>
      <SidebarFooter>This is a sidebar footer</SidebarFooter>
    </Sidebar>
  );
}
