import { createRootRoute, Outlet } from '@tanstack/react-router';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/sidebar/app-sidebar';
import { Devtools } from '@/providers/devtools';
import { AppTitlebar } from '@/components/titlebar/app-titlebar';
import { createTabStore } from '@/store/tabs';
import { TabsProvider } from '@/providers/tabs-provider';
import { TabsRoot } from '@/components/navigation/tabs-root';
import { AppCommandMenu } from '@/components/command-menu/app-command-menu';

export const Route = createRootRoute({
  component: RootComponent,
  notFoundComponent: NotFoundComponent
});

function RootComponent() {
  const useBrowserTabs = createTabStore();

  return (
    <main>
      <SidebarProvider ignoreMobile={true}>
        <TabsProvider useStore={useBrowserTabs}>
          <AppSidebar />
          <TabsRoot>
            <AppTitlebar />
            <div className="w-full pt-10 h-full">
              <Outlet />
            </div>
            <Devtools />
          </TabsRoot>
          <AppCommandMenu />
        </TabsProvider>
      </SidebarProvider>
    </main>
  );
}

function NotFoundComponent() {
  return <p>What are you even looking for</p>;
}
