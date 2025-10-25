import { createFileRoute } from '@tanstack/react-router';
import { TabsPanels } from '@/components/navigation/app-navigation';

export const Route = createFileRoute('/')({
  component: HomePage
});

function HomePage() {
  return <TabsPanels />;
}
