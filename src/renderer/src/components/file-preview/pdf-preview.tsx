import { useState, memo } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import type { PdfPreviewProps } from './types';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

if (typeof window !== 'undefined' && 'Worker' in window) {
  pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url
  ).href;
}

export const PdfPreview = memo(({ data }: PdfPreviewProps) => {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.0);

  const { mimeType, encoding, content: rawContent, fileName } = data;
  const fileUrl = `data:${mimeType};base64,${
    encoding === 'base64' ? rawContent : btoa(rawContent)
  }`;

  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages);
    setPageNumber(1);
  }

  function changePage(offset: number): void {
    setPageNumber(prevPageNumber => prevPageNumber + offset);
  }

  function previousPage(): void {
    changePage(-1);
  }

  function nextPage(): void {
    changePage(1);
  }

  function zoomIn(): void {
    setScale(prev => Math.min(prev + 0.25, 3));
  }

  function zoomOut(): void {
    setScale(prev => Math.max(prev - 0.25, 0.5));
  }

  function resetZoom(): void {
    setScale(1.0);
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between p-4 border-b">
        <h3 className="text-sm font-medium">{fileName}</h3>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={zoomOut}
              disabled={scale <= 0.5}
              className="px-2 py-1 text-sm rounded-md bg-secondary hover:bg-secondary/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              -
            </button>
            <button
              onClick={resetZoom}
              className="px-2 py-1 text-xs rounded-md bg-secondary hover:bg-secondary/80 transition-colors"
            >
              {Math.round(scale * 100)}%
            </button>
            <button
              onClick={zoomIn}
              disabled={scale >= 3}
              className="px-2 py-1 text-sm rounded-md bg-secondary hover:bg-secondary/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              +
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={previousPage}
              disabled={pageNumber <= 1}
              className="px-3 py-1 text-sm rounded-md bg-secondary hover:bg-secondary/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="text-sm text-muted-foreground">
              Page {pageNumber} of {numPages}
            </span>
            <button
              onClick={nextPage}
              disabled={pageNumber >= numPages}
              className="px-3 py-1 text-sm rounded-md bg-secondary hover:bg-secondary/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto bg-muted/30 flex items-start justify-center p-6">
        <Document
          file={fileUrl}
          onLoadSuccess={onDocumentLoadSuccess}
          loading={
            <div className="flex items-center justify-center p-8">
              <p className="text-sm text-muted-foreground">Loading PDF...</p>
            </div>
          }
          error={
            <div className="flex items-center justify-center p-8">
              <p className="text-sm text-destructive">Failed to load PDF</p>
            </div>
          }
        >
          <Page
            pageNumber={pageNumber}
            scale={scale}
            renderTextLayer={true}
            renderAnnotationLayer={true}
            className="shadow-lg"
          />
        </Document>
      </div>
    </div>
  );
});

PdfPreview.displayName = 'PdfPreview';
