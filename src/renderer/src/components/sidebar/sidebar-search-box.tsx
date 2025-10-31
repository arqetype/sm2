import { SearchIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Kbd, KbdGroup } from '@/components/ui/kbd';
import { useCommandStore } from '@/store/command';

export function SidebarSearchBox() {
  const { commandOpen, toggleCommand } = useCommandStore();

  return (
    <Button
      variant={commandOpen === true ? 'default' : 'outline'}
      className="justify-between px-3"
      onClick={() => toggleCommand()}
    >
      <div className="flex items-center justify-start gap-2">
        <SearchIcon />
        Search something
      </div>
      <KbdGroup>
        <Kbd>⌘K</Kbd>
      </KbdGroup>
    </Button>
  );
}
