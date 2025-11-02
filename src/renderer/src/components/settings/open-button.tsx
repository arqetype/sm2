import { ComponentProps } from 'react';
import { Button } from '../ui/button';
import { CogIcon } from 'lucide-react';
import { useTabs } from '@/hooks/use-tabs';
import { SettingsTab } from './settings-tab';

type OpenSettingsButtonProps = Omit<ComponentProps<typeof Button>, 'onClick'>;

export function OpenSettingsButton(props: OpenSettingsButtonProps) {
  const { addTab, setActiveTab } = useTabs();
  const handleOpenSettings = () => {
    addTab({
      id: 'settings',
      title: 'Settings',
      component: SettingsTab
    });
    setActiveTab('settings');
  };

  return (
    <Button onClick={handleOpenSettings} {...props}>
      <CogIcon />
    </Button>
  );
}
