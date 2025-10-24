import { Sidebar, SidebarContent, SidebarFooter } from '../ui/sidebar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';

export function AppSidebar() {
  return (
    <Sidebar
      variant="sidebar"
      className="h-[calc(100svh-calc(var(--spacing)*9))] top-9 bg-vibrancy border-t"
    >
      <SidebarContent>
        <Tabs defaultValue="decks">
          <TabsList className="grid grid-cols-2 w-full bg-transparent p-2">
            <TabsTrigger value="decks">Decks</TabsTrigger>
            <TabsTrigger value="files">Courses</TabsTrigger>
          </TabsList>
          <TabsContent value="decks">Those are your decks</TabsContent>
          <TabsContent value="files">Those are your files</TabsContent>
        </Tabs>
      </SidebarContent>
      <SidebarFooter>This is a sidebar footer</SidebarFooter>
    </Sidebar>
  );
}
