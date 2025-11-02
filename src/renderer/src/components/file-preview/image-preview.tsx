import { memo } from 'react';
import type { ImagePreviewProps } from './types';

export const ImagePreview = memo(({ data }: ImagePreviewProps) => {
  const { mimeType, encoding, content: rawContent, fileName, fileSize } = data;
  const imageUrl = `data:${mimeType};base64,${
    encoding === 'base64' ? rawContent : btoa(rawContent)
  }`;

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between p-4 border-b">
        <h3 className="text-sm font-medium">{fileName}</h3>
        <span className="text-xs text-muted-foreground">{(fileSize / 1024).toFixed(2)} KB</span>
      </div>

      <div className="flex-1 overflow-auto bg-muted/30 flex items-center justify-center p-6">
        <img src={imageUrl} alt={fileName} className="max-w-full max-h-full object-contain" />
      </div>
    </div>
  );
});

ImagePreview.displayName = 'ImagePreview';
