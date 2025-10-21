import { useState } from 'react';
import { Button } from './components/ui/button';

export function App() {
  const [count, setCount] = useState(0);

  const increment = () => setCount(p => p + 1);

  return (
    <div>
      <Button onClick={() => increment()}>Increment count</Button>
      <p>Count: {count}</p>
      <p>{window.api.getVersionInfo()}</p>
    </div>
  );
}
