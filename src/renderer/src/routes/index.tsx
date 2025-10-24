import { useState } from 'react';
import { Button } from '../components/ui/button';
import { useTheme } from '../hooks/use-theme';
import { usePing } from '../hooks/use-ping';
import { useCityTime } from '../hooks/use-city-time';
import { SidebarButton } from '../components/sidebar/sidebar-button';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  component: HomePage
});

function HomePage() {
  const [count, setCount] = useState(0);
  const [city, setCity] = useState('Tokyo');
  const { theme, setTheme } = useTheme();
  const ping = usePing();
  const cityTime = useCityTime();

  const increment = () => setCount(p => p + 1);

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
          <SidebarButton />
        </div>
        <div>
          <Button onClick={() => increment()}>Increment count</Button>
          <p>Count: {count}</p>
        </div>
        <div>
          <Button
            onClick={() => ping.mutate(undefined)}
            variant="outline"
            disabled={ping.isPending}
          >
            {ping.isPending ? 'Pinging...' : 'Ping Main Process'}
          </Button>
          {ping.isError && <p className="text-sm text-red-500 mt-2">Error: {ping.error.message}</p>}
          {ping.isSuccess && (
            <p className="text-sm text-green-600 mt-2">Response: {ping.data.response}</p>
          )}
        </div>
        <div>
          <div className="space-y-2">
            <div className="flex gap-2">
              <select
                value={city}
                onChange={e => setCity(e.target.value)}
                className="px-3 py-2 border rounded-md bg-background"
              >
                <option value="New York">New York</option>
                <option value="London">London</option>
                <option value="Paris">Paris</option>
                <option value="Tokyo">Tokyo</option>
                <option value="Sydney">Sydney</option>
                <option value="Los Angeles">Los Angeles</option>
                <option value="Berlin">Berlin</option>
                <option value="Dubai">Dubai</option>
                <option value="Singapore">Singapore</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Beijing">Beijing</option>
                <option value="Moscow">Moscow</option>
              </select>
              <Button
                onClick={() => cityTime.mutate({ city })}
                variant="outline"
                disabled={cityTime.isPending}
              >
                {cityTime.isPending ? 'Loading...' : 'Get City Time'}
              </Button>
            </div>
            {cityTime.isError && (
              <p className="text-sm text-red-500">Error: {cityTime.error.message}</p>
            )}
            {cityTime.isSuccess && (
              <div className="text-sm text-green-600">
                <p>City: {cityTime.data.city}</p>
                <p>Time: {cityTime.data.time}</p>
                <p>Timezone: {cityTime.data.timezone}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
