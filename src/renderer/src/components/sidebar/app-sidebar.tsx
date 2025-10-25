import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader } from '../ui/sidebar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { SidebarProfileInfo } from './sidebar-profile-info';
import { SidebarFileTree } from './sidebar-file-tree';
import { SidebarFileDrop } from './sidebar-file-drop';
import { SidebarSearchBox } from './sidebar-search-box';

export function AppSidebar() {
  return (
    <Sidebar
      variant="sidebar"
      className="h-[calc(100svh-calc(var(--spacing)*9))] top-9 bg-vibrancy border-t"
    >
      <SidebarHeader>
        <SidebarSearchBox />
      </SidebarHeader>
      <SidebarContent className="relative overflow-hidden">
        <Tabs defaultValue="decks" className="h-full">
          <TabsList className="grid grid-cols-2 w-full bg-transparent px-2 sticky top-0">
            <TabsTrigger value="decks">Decks</TabsTrigger>
            <TabsTrigger value="files">Courses</TabsTrigger>
          </TabsList>
          <TabsContent value="decks">Those are your decks</TabsContent>
          <TabsContent value="files" className="flex flex-col justify-between overflow-y-hidden">
            <SidebarFileTree />
            <SidebarFileDrop />
          </TabsContent>
        </Tabs>
      </SidebarContent>
      <SidebarFooter>
        <SidebarProfileInfo />
      </SidebarFooter>
    </Sidebar>
  );
}
