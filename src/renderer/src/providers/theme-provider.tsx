import { Button } from '@/components/ui/button';
import { MonitorIcon, MoonIcon, SunIcon } from 'lucide-react';
import { ThemeProvider as NextThemesProvider, useTheme } from 'next-themes';
import type { ComponentProps, ReactNode } from 'react';

type ThemeProviderProps = {
  children: ReactNode;
};

export function ThemeProvider({ children }: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  );
}

type ThemeButtonProps = Omit<ComponentProps<typeof Button>, 'onClick'>;

export function ThemeButton(props: ThemeButtonProps) {
  const { theme, setTheme } = useTheme();

  const handleThemeCycle = () => {
    const nextTheme = theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light';
    setTheme(nextTheme);
  };

  return (
    <Button onClick={handleThemeCycle} {...props}>
      {theme === 'light' && <MoonIcon />}
      {theme === 'dark' && <MonitorIcon />}
      {theme === 'system' && <SunIcon />}
    </Button>
  );
}
