import { Toaster } from '@/components/ui/sonner';
import type { ReactNode } from 'react';

type ToastProvider = {
  children: ReactNode;
};

export function ToastProvider({ children }: ToastProvider) {
  return (
    <>
      {children}
      <Toaster />
    </>
  );
}
