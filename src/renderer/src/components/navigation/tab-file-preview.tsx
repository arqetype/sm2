import { FileIcon, FolderIcon } from 'lucide-react';
import type { TabComponentProps } from '@/types/tabs';

export interface FilePreviewData {
  path: string;
  name: string;
  type: 'file' | 'folder';
}

export function FilePreviewTab({ tabId, data }: TabComponentProps<FilePreviewData>) {
  if (!data) {
    return (
      <div className="flex items-center justify-center h-full p-8">
        <div className="text-center text-muted-foreground">
          <p>No file data available</p>
        </div>
      </div>
    );
  }

  const { path, name, type } = data;

  return (
    <div className="h-full overflow-auto p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          {type === 'file' ? (
            <FileIcon className="w-12 h-12 text-blue-500" />
          ) : (
            <FolderIcon className="w-12 h-12 text-amber-500" />
          )}
          <div>
            <h1 className="text-3xl font-bold text-foreground">{name}</h1>
            <p className="text-sm text-muted-foreground mt-1">{type}</p>
          </div>
        </div>

        <div className="bg-muted/50 rounded-lg p-6 space-y-4">
          <div>
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">
              Path
            </h2>
            <code className="block bg-background px-4 py-2 rounded border text-sm font-mono">
              {path}
            </code>
          </div>

          <div>
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">
              Details
            </h2>
            <div className="bg-background rounded border divide-y">
              <div className="px-4 py-3 flex justify-between">
                <span className="text-sm font-medium">Name</span>
                <span className="text-sm text-muted-foreground">{name}</span>
              </div>
              <div className="px-4 py-3 flex justify-between">
                <span className="text-sm font-medium">Type</span>
                <span className="text-sm text-muted-foreground capitalize">{type}</span>
              </div>
              <div className="px-4 py-3 flex justify-between">
                <span className="text-sm font-medium">Tab ID</span>
                <span className="text-sm text-muted-foreground font-mono">{tabId}</span>
              </div>
            </div>
          </div>

          <div className="pt-4">
            <p className="text-sm text-muted-foreground italic">
              File preview functionality is currently emulated. In a production environment, this
              would display the actual file contents, syntax highlighting, and editing capabilities.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
