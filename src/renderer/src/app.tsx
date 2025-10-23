import { SidebarProvider } from './components/ui/sidebar';
import { AppSidebar } from './components/sidebar/app-sidebar';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { Router } from './router';

export function App() {
  return <Router />;
}
