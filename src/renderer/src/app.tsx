import { useState } from "react";

export function App() {
  const [count, setCount] = useState(0);

  const increment = () => setCount((p) => p + 1);

  return (
    <div>
      <button onClick={() => increment()}>Increment count</button>
      <p>Count: {count}</p>
    </div>
  );
}
