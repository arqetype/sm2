import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Theme } from '../types/theme';

interface AppState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    set => ({
      theme: 'system',
      setTheme: theme => set({ theme })
    }),
    {
      name: 'shadcn-ui-theme'
    }
  )
);
