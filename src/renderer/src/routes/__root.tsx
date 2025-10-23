import { createRootRoute, Outlet } from '@tanstack/react-router';
import { SidebarProvider } from '../components/ui/sidebar';
import { AppSidebar } from '../components/sidebar/app-sidebar';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';

export const Route = createRootRoute({
  component: RootComponent,
  notFoundComponent: NotFoundComponent
});

function RootComponent() {
  return (
    <main>
      <SidebarProvider>
        <AppSidebar />
        <Outlet />
        <TanStackRouterDevtools />
      </SidebarProvider>
    </main>
  );
}

function NotFoundComponent() {
  return <p>What are you even looking for</p>;
}
