import { Plus, SparklesIcon, XIcon } from 'lucide-react';
import { useSelectedFiles, MAX_SELECTED_FILES } from '@/store/selected-files';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { CreateCardWithAiDialog } from '@/components/cards/create-card-with-ai-dialog';
import { CreateCardManuallyDialog } from '@/components/cards/create-card-manually-dialog';

export function SidebarDropZone() {
  const { selectedFiles, removeFile, clearFiles, isLimitReached } = useSelectedFiles();
  const [isDragOver, setIsDragOver] = useState(false);
  const [showAll, setShowAll] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleGenerateCards = () => {
    console.log('Generate cards for:', selectedFiles);
  };

  const handleCreateCardsManually = () => {
    console.log('Create cards manually:');
  };

  const visibleFiles = showAll ? selectedFiles : selectedFiles.slice(-2);
  const hiddenCount = selectedFiles.length - visibleFiles.length;

  if (selectedFiles.length === 0) {
    return (
      <div className="flex flex-col gap-2 border-y p-2">
        <div
          className={cn(
            'border-2 border-dashed rounded-lg p-4 transition-colors',
            isDragOver ? 'border-primary bg-primary/15' : 'border-border bg-muted/10'
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="text-center text-sm text-muted-foreground">
            <p className="font-medium mb-1">Create new cards</p>
            <p className="text-xs">Drag files here to generate cards from their content</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Separator className="flex-1" />
          <p className="text-foreground text-xs">OR</p>
          <Separator className="flex-1" />
        </div>
        <Dialog>
          <DialogTrigger asChild={true}>
            <Button className="w-full" onClick={handleCreateCardsManually} variant="outline">
              Manually create cards
            </Button>
          </DialogTrigger>
          <CreateCardManuallyDialog />
        </Dialog>
      </div>
    );
  }

  return (
    <div className="border-y p-2 space-y-2">
      <div
        className={cn(
          'border-2 border-dashed rounded-lg p-2 transition-colors',
          isDragOver ? 'border-primary bg-primary/15' : 'border-border bg-muted/10'
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Selected files</span>
            <Badge variant={isLimitReached() ? 'destructive' : 'secondary'}>
              {selectedFiles.length}/{MAX_SELECTED_FILES}
            </Badge>
          </div>
          <Button size="icon-sm" variant="ghost" onClick={clearFiles}>
            <XIcon />
            <span className="sr-only">Tout effacer</span>
          </Button>
        </div>

        {isLimitReached() && (
          <div className="mb-2 p-2 rounded bg-destructive/10 border border-destructive/20">
            <p className="text-xs text-destructive font-medium text-center">
              Maximum file limit reached
            </p>
          </div>
        )}

        <div className="flex flex-col gap-1">
          {visibleFiles.map(file => (
            <div
              key={file.path}
              className="flex items-center justify-between gap-2 p-2 rounded bg-muted/50 hover:bg-muted transition-colors"
            >
              <span className="text-xs truncate flex-1" title={file.path}>
                {file.name}
              </span>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => removeFile(file.path)}
                className="h-5 w-5 shrink-0"
              >
                <XIcon />
                <span className="sr-only">Retirer</span>
              </Button>
            </div>
          ))}
          {!showAll && hiddenCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="w-full h-7 text-xs justify-start"
              onClick={() => setShowAll(true)}
            >
              <Plus />
              {hiddenCount} more file{hiddenCount > 1 ? 's' : ''}
            </Button>
          )}

          {showAll && (
            <Button
              variant="ghost"
              size="sm"
              className="w-full h-7 text-xs"
              onClick={() => setShowAll(false)}
            >
              Voir moins
            </Button>
          )}
        </div>
      </div>

      <Dialog>
        <DialogTrigger asChild={true}>
          <Button
            className="w-full"
            onClick={handleGenerateCards}
            disabled={selectedFiles.length === 0}
          >
            <SparklesIcon />
            Create new cards
          </Button>
        </DialogTrigger>
        <CreateCardWithAiDialog />
      </Dialog>
    </div>
  );
}
