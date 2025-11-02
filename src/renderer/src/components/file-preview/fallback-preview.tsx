import { memo } from 'react';
import type { FallbackPreviewProps } from './types';

export const FallbackPreview = memo(({ data }: FallbackPreviewProps) => {
  const { fileName, mimeType, fileSize, encoding } = data;
  const sizeInKB = (fileSize / 1024).toFixed(2);
  const sizeInMB = (fileSize / (1024 * 1024)).toFixed(2);
  const displaySize = fileSize > 1024 * 1024 ? `${sizeInMB} MB` : `${sizeInKB} KB`;

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between p-4 border-b">
        <h3 className="text-sm font-medium">{fileName}</h3>
        <span className="text-xs text-muted-foreground">{displaySize}</span>
      </div>

      <div className="flex-1 overflow-auto flex items-center justify-center p-8">
        <div className="text-center max-w-md">
          <div className="mb-4">
            <svg
              className="mx-auto h-12 w-12 text-muted-foreground"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>

          <h4 className="text-lg font-medium mb-2">Preview Not Available</h4>
          <p className="text-sm text-muted-foreground mb-4">
            Preview is not supported for this file type
          </p>

          <div className="text-left bg-secondary/50 rounded-md p-4 text-sm space-y-1">
            <div className="flex justify-between">
              <span className="text-muted-foreground">File name:</span>
              <span className="font-mono">{fileName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">MIME type:</span>
              <span className="font-mono text-xs">{mimeType}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Size:</span>
              <span className="font-mono">{displaySize}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Encoding:</span>
              <span className="font-mono">{encoding}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

FallbackPreview.displayName = 'FallbackPreview';
