"use client";

import * as React from "react";
import * as pdfjsLib from "pdfjs-dist";
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Set up PDF.js worker
if (typeof window !== "undefined") {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.js`;
}

interface PDFPreviewProps {
  file: string | File | Blob;
  className?: string;
}

export function PDFPreview({ file, className }: PDFPreviewProps) {
  const [numPages, setNumPages] = React.useState<number>(0);
  const [pageNumber, setPageNumber] = React.useState<number>(1);
  const [scale, setScale] = React.useState<number>(1.0);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const pdfDocRef = React.useRef<pdfjsLib.PDFDocumentProxy | null>(null);

  // Load PDF document
  React.useEffect(() => {
    let isMounted = true;
    const loadPDF = async () => {
      try {
        setLoading(true);
        setError(null);

        let fileUrl: string;
        if (typeof file === "string") {
          fileUrl = file;
        } else {
          fileUrl = URL.createObjectURL(file);
        }

        const loadingTask = pdfjsLib.getDocument(fileUrl);
        const pdf = await loadingTask.promise;

        if (isMounted) {
          pdfDocRef.current = pdf;
          setNumPages(pdf.numPages);
          setLoading(false);
        }

        // Clean up blob URL if created
        if (typeof file !== "string") {
          URL.revokeObjectURL(fileUrl);
        }
      } catch (err) {
        console.error("Error loading PDF:", err);
        if (isMounted) {
          setError(err instanceof Error ? err.message : "Failed to load PDF");
          setLoading(false);
        }
      }
    };

    loadPDF();

    return () => {
      isMounted = false;
    };
  }, [file]);

  // Render current page
  React.useEffect(() => {
    const renderPage = async () => {
      if (!pdfDocRef.current || !canvasRef.current) return;

      try {
        const page = await pdfDocRef.current.getPage(pageNumber);
        const viewport = page.getViewport({ scale });
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");

        if (!context) return;

        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const renderContext = {
          canvasContext: context,
          viewport: viewport,
        };

        await page.render(renderContext).promise;
      } catch (err) {
        console.error("Error rendering page:", err);
      }
    };

    if (!loading && !error) {
      renderPage();
    }
  }, [pageNumber, scale, loading, error]);

  const goToPrevPage = () => {
    setPageNumber((prev) => Math.max(prev - 1, 1));
  };

  const goToNextPage = () => {
    setPageNumber((prev) => Math.min(prev + 1, numPages));
  };

  const zoomIn = () => {
    setScale((prev) => Math.min(prev + 0.2, 3.0));
  };

  const zoomOut = () => {
    setScale((prev) => Math.max(prev - 0.2, 0.5));
  };

  return (
    <div className={cn("flex flex-col items-center gap-4", className)}>
      {/* Controls */}
      <div className="flex items-center gap-4 p-2 bg-muted rounded-lg border">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={goToPrevPage}
            disabled={pageNumber <= 1 || loading || !!error}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium">
            {loading ? "..." : `${pageNumber} / ${numPages}`}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={goToNextPage}
            disabled={pageNumber >= numPages || loading || !!error}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="h-4 w-px bg-border" />

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={zoomOut}
            disabled={scale <= 0.5 || loading || !!error}
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium w-12 text-center">
            {Math.round(scale * 100)}%
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={zoomIn}
            disabled={scale >= 3.0 || loading || !!error}
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* PDF Document */}
      <div className="border rounded-lg overflow-auto max-h-[800px] bg-muted/30 p-4">
        {loading && (
          <div className="flex items-center justify-center p-12">
            <div className="text-muted-foreground">Loading PDF...</div>
          </div>
        )}

        {error && (
          <div className="flex items-center justify-center p-12">
            <div className="text-destructive">{error}</div>
          </div>
        )}

        {!loading && !error && (
          <canvas ref={canvasRef} className="mx-auto shadow-lg" />
        )}
      </div>
    </div>
  );
}
