import { useEffect, useState } from 'react';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '../ui/command';
import { useCommandStore } from '@/store/command';
import { useFileSearch } from '@/hooks/use-file-search';
import { FileIcon, Loader2Icon } from 'lucide-react';
import { useTabs } from '@/hooks/use-tabs';
import { FilePreviewTab } from '../navigation/tab-file-preview';
import type { FilePreviewData } from '../../../../_shared/types/file-tree';

export function AppCommandMenu() {
  const { commandOpen, toggleCommand } = useCommandStore();
  const [searchQuery, setSearchQuery] = useState('');
  const { results, isSearching, error, search } = useFileSearch({
    debounceMs: 150,
    maxResults: 50,
    enabled: commandOpen
  });

  const { tabs, addTab, setActiveTab } = useTabs();

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

  // Réinitialiser la recherche quand le menu se ferme
  useEffect(() => {
    if (!commandOpen) {
      // Reset on close with a timeout to avoid setState in effect
      const timer = setTimeout(() => setSearchQuery(''), 0);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [commandOpen]);

  const handleFileSelect = (fileName: string, relativePath: string) => {
    const existingTab = tabs.find(
      tab => tab.data && (tab.data as FilePreviewData).path === relativePath
    );

    if (existingTab) {
      setActiveTab(existingTab.id);
    } else {
      // Créer un nouvel onglet
      const fileData: FilePreviewData = {
        path: relativePath,
        name: fileName,
        type: 'file'
      };

      addTab({
        title: fileName,
        component: FilePreviewTab,
        data: fileData
      });
    }

    // Fermer le command menu
    toggleCommand();
  };

  return (
    <CommandDialog open={commandOpen} onOpenChange={() => toggleCommand()}>
      <CommandInput
        placeholder="Rechercher un fichier..."
        value={searchQuery}
        onValueChange={value => {
          setSearchQuery(value);
          search(value);
        }}
      />
      <CommandList>
        {isSearching && (
          <div className="flex items-center justify-center py-6 text-sm text-muted-foreground">
            <Loader2Icon className="h-4 w-4 mr-2 animate-spin" />
            Recherche en cours...
          </div>
        )}

        {error && !isSearching && (
          <div className="py-6 px-4 text-center text-sm text-destructive">{error}</div>
        )}

        {!isSearching && !error && searchQuery && results.length === 0 && (
          <CommandEmpty>Aucun fichier trouvé.</CommandEmpty>
        )}

        {!isSearching && !error && results.length > 0 && (
          <CommandGroup heading="Fichiers">
            {results
              .filter(result => result.type === 'file')
              .map(result => (
                <CommandItem
                  key={result.path}
                  value={result.path}
                  onSelect={() => handleFileSelect(result.name, result.relativePath)}
                  className="cursor-pointer"
                >
                  <FileIcon className="mr-2 h-4 w-4" />
                  <div className="flex flex-col items-start overflow-hidden">
                    <span className="font-medium truncate w-full">{result.name}</span>
                    <span className="text-xs text-muted-foreground truncate w-full">
                      {result.relativePath}
                    </span>
                  </div>
                </CommandItem>
              ))}
          </CommandGroup>
        )}

        {!searchQuery && !isSearching && (
          <CommandEmpty>Commencez à taper pour rechercher des fichiers...</CommandEmpty>
        )}
      </CommandList>
    </CommandDialog>
  );
}
