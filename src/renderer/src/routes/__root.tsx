import { createRootRoute, Outlet } from '@tanstack/react-router';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/sidebar/app-sidebar';
import { Devtools } from '@/providers/devtools';
import { AppTitlebar } from '@/components/titlebar/app-titlebar';

export const Route = createRootRoute({
  component: RootComponent,
  notFoundComponent: NotFoundComponent
});

function RootComponent() {
  return (
    <main>
      <SidebarProvider ignoreMobile={true}>
        <AppTitlebar />
        <AppSidebar />
        <div className="w-full bg-background mt-9">
          <Outlet />
        </div>
        <Devtools />
      </SidebarProvider>
    </main>
  );
}

function NotFoundComponent() {
  return <p>What are you even looking for</p>;
}
