import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { ErrorBoundaryProvider } from './providers/error';
import { RouterProvider } from './providers/router';
import { QueryProvider } from './providers/query';

import './assets/styles/globals.css';
import './assets/styles/base.css';

window.addEventListener('unhandledrejection', event => {
  console.error('Unhandled promise rejection:', event.reason);
  event.preventDefault();
});

window.addEventListener('error', event => {
  console.error('Uncaught error:', event.error);
});

const root = document.getElementById('root')!;

createRoot(root).render(
  <StrictMode>
    <ErrorBoundaryProvider>
      <QueryProvider>
        <RouterProvider />
      </QueryProvider>
    </ErrorBoundaryProvider>
  </StrictMode>
);
