import type { TabComponentProps } from '@/types/tabs';
import type { FilePreviewData } from './../../../../_shared/types/file-tree';
import { useIpcQuery } from '@/hooks/use-ipc-query';
import { FilePreviewController } from '@/components/file-preview/file-preview-controller';

export function FilePreviewTab({ data }: TabComponentProps<FilePreviewData>) {
  const file = useIpcQuery('file-tree:read-file', { path: data?.path || '' });

  if (!data) {
    return (
      <div className="flex items-center justify-center h-full p-8">
        <div className="text-center text-muted-foreground">
          <p>No file data available</p>
        </div>
      </div>
    );
  }

  if (!file.data) {
    return (
      <div className="flex items-center justify-center h-full p-8">
        <div className="text-center text-muted-foreground">
          <p>Loading file...</p>
        </div>
      </div>
    );
  }

  if ('error' in file.data) {
    return (
      <div className="flex items-center justify-center h-full p-8">
        <div className="text-center text-destructive">
          <p>Error: {file.data.error}</p>
        </div>
      </div>
    );
  }

  return <FilePreviewController data={file.data} />;
}
