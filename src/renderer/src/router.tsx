import { createRouter, RouterProvider } from '@tanstack/react-router';
import { routeTree } from './routeTree.gen';

const router = createRouter({
  routeTree: routeTree,
  defaultPreload: 'intent',
  scrollRestoration: true,
  defaultErrorComponent: ({ error }) => (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h1>
      <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded overflow-auto">{error.message}</pre>
    </div>
  ),
  defaultPendingComponent: () => (
    <div className="p-8 flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-gray-100"></div>
    </div>
  )
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export const Router = () => <RouterProvider router={router} />;
