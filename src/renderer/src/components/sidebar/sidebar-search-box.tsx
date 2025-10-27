import { SearchIcon } from 'lucide-react';
import { Button } from '../ui/button';
import { Kbd, KbdGroup } from '@/components/ui/kbd';

export function SidebarSearchBox() {
  return (
    <Button variant="outline" className="justify-between px-3">
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
