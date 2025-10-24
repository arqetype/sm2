import { useEffect } from 'react';
import { useAppStore } from '../store/app';

export const useTheme = () => {
  const theme = useAppStore(state => state.theme);
  const setTheme = useAppStore(state => state.setTheme);

  useEffect(() => {
    const root = window.document.documentElement;

    root.classList.remove('light', 'dark');

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';

      root.classList.add(systemTheme);
      return;
    }

    root.classList.add(theme);
  }, [theme]);

  return { theme, setTheme };
};
