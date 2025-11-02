import { TanStackDevtools, type TanStackDevtoolsReactPlugin } from '@tanstack/react-devtools';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const plugins: TanStackDevtoolsReactPlugin[] = [
  {
    name: 'TanStack query',
    render: <ReactQueryDevtools />
  }
];

export function Devtools() {
  return (
    <TanStackDevtools
      plugins={plugins}
      eventBusConfig={{
        debug: false,
        connectToServerBus: true
      }}
    />
  );
}
