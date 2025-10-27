import { createFileRoute } from '@tanstack/react-router';
import { TabsPanels } from '@/components/navigation/tabs-panels';

export const Route = createFileRoute('/')({
  component: HomePage
});

function HomePage() {
  return <TabsPanels />;
}
