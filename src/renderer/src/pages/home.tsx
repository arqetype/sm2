import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/store/app';

export function HomePage() {
  const [count, setCount] = useState(0);
  const { theme, setTheme } = useTheme();

  const increment = () => setCount(p => p + 1);
  const handlePing = () => window.api.ping();

  const cycleTheme = () => {
    if (theme === 'light') setTheme('dark');
    else if (theme === 'dark') setTheme('system');
    else setTheme('light');
  };

  return (
    <div className="p-8">
      <div className="space-y-4">
        <div>
          <Button onClick={cycleTheme} variant="outline">
            Theme: {theme}
          </Button>
        </div>
        <div>
          <Button onClick={() => increment()}>Increment count</Button>
          <p>Count: {count}</p>
        </div>
        <div>
          <Button onClick={handlePing} variant="outline">
            Send Ping to Main Process
          </Button>
          <p className="text-sm text-gray-500 mt-2">
            Check the terminal for &quot;pong&quot; message
          </p>
        </div>
      </div>
    </div>
  );
}
