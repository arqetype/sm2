import { createRootRoute, Outlet } from '@tanstack/react-router';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/sidebar/app-sidebar';
import { Devtools } from '@/providers/devtools';
import { AppTitlebar } from '@/components/titlebar/app-titlebar';
import { createTabStore, TabsProvider, TabsRoot } from '@/components/navigation/app-navigation';

export const Route = createRootRoute({
  component: RootComponent,
  notFoundComponent: NotFoundComponent
});

const TempComponent = () => {
  return <div>Temp Component</div>;
};

function RootComponent() {
  const useBrowserTabs = createTabStore({
    initialTabs: [
      { id: 'welcome', title: 'Welcome', component: TempComponent },
      { id: 'features', title: 'Features', component: TempComponent }
    ]
  });

  return (
    <main>
      <SidebarProvider ignoreMobile={true}>
        <TabsProvider useStore={useBrowserTabs}>
          <AppSidebar />
          <TabsRoot>
            <AppTitlebar />
            <div className="w-full bg-background mt-9 border-t border-border h-full">
              <Outlet />
            </div>
            <Devtools />
          </TabsRoot>
        </TabsProvider>
      </SidebarProvider>
    </main>
  );
}

function NotFoundComponent() {
  return <p>What are you even looking for</p>;
}
