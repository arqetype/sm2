import { useEffect } from 'react';
import { CommandDialog, CommandEmpty, CommandInput, CommandList } from '../ui/command';
import { useCommandStore } from '@/store/command';

export function AppCommandMenu() {
  const { commandOpen, toggleCommand } = useCommandStore();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        toggleCommand();
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [toggleCommand]);

  return (
    <CommandDialog open={commandOpen} onOpenChange={() => toggleCommand()}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
      </CommandList>
    </CommandDialog>
  );
}
