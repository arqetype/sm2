import { AppCommandMenu } from '@/components/command-menu/app-command-menu';
import { TabsRoot } from '@/components/navigation/tabs-root';
import { AppSidebar } from '@/components/sidebar/app-sidebar';
import { AppTitlebar } from '@/components/titlebar/app-titlebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { TabsPanels } from '@/components/navigation/tabs-panels';

import { Devtools } from '@/providers/devtools';
import { ErrorBoundaryProvider } from '@/providers/error';
import { QueryProvider } from '@/providers/query';
import { TabsProvider } from '@/providers/tabs-provider';
import { ToastProvider } from '@/providers/toast';
import { ThemeProvider } from '@/providers/theme-provider';
import { createTabStore } from '@/store/tabs';

export function App() {
  const useBrowserTabs = createTabStore();

  return (
    <ErrorBoundaryProvider>
      <ThemeProvider>
        <ToastProvider>
          <QueryProvider>
            <main>
              <SidebarProvider ignoreMobile={true}>
                <TabsProvider useStore={useBrowserTabs}>
                  <AppSidebar />
                  <TabsRoot>
                    <AppTitlebar />
                    <div className="w-full pt-10 h-full">
                      <TabsPanels />
                    </div>
                    <Devtools />
                  </TabsRoot>
                  <AppCommandMenu />
                </TabsProvider>
              </SidebarProvider>
            </main>
          </QueryProvider>
        </ToastProvider>
      </ThemeProvider>
    </ErrorBoundaryProvider>
  );
}
