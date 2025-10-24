import { TanStackDevtools, type TanStackDevtoolsReactPlugin } from '@tanstack/react-devtools';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';

const plugins: TanStackDevtoolsReactPlugin[] = [
  {
    name: 'TanStack query',
    render: <ReactQueryDevtools />
  },
  {
    name: 'TanStack Router',
    render: <TanStackRouterDevtools position="bottom-right" />
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
