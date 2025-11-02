import { useState, memo } from 'react';
import type { FilePreviewResult } from '../../../../_shared/types/file-tree';
import type { PreviewMode } from './types';
import { getPreviewRenderer } from './preview-registry';

interface FilePreviewControllerProps {
  data: FilePreviewResult;
}

export const FilePreviewController = memo(({ data }: FilePreviewControllerProps) => {
  const [mode, setMode] = useState<PreviewMode>('rendered');

  const renderer = getPreviewRenderer(data);
  const PreviewComponent = renderer.component;

  const props = {
    data,
    ...(renderer.type === 'markdown' && {
      mode,
      onModeChange: setMode
    })
  };

  return <PreviewComponent {...props} />;
});

FilePreviewController.displayName = 'FilePreviewController';
