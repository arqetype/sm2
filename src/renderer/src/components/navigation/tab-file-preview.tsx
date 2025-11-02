import type { TabComponentProps } from '@/types/tabs';
import type { FilePreviewData } from './../../../../_shared/types/file-tree';
import { useIpcQuery } from '@/hooks/use-ipc-query';

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
    return <p>Loading state</p>;
  }

  if ('error' in file.data) {
    return <p>Error: {file.data.error}</p>;
  }

  return <pre>{JSON.stringify(file.data)}</pre>;
}
