"use client";

import * as React from "react";
import { ZoomIn, ZoomOut, X, Maximize2, Minimize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface ImagePreviewProps {
  src: string;
  alt: string;
  className?: string;
  enableZoom?: boolean;
  enableLightbox?: boolean;
}

export function ImagePreview({
  src,
  alt,
  className,
  enableZoom = true,
  enableLightbox = true,
}: ImagePreviewProps) {
  const [scale, setScale] = React.useState<number>(1.0);
  const [position, setPosition] = React.useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = React.useState(false);
  const [dragStart, setDragStart] = React.useState({ x: 0, y: 0 });
  const [showLightbox, setShowLightbox] = React.useState(false);
  const [error, setError] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const imageRef = React.useRef<HTMLImageElement>(null);

  const zoomIn = () => {
    setScale((prev) => Math.min(prev + 0.2, 3.0));
  };

  const zoomOut = () => {
    setScale((prev) => {
      const newScale = Math.max(prev - 0.2, 1.0);
      if (newScale === 1.0) {
        setPosition({ x: 0, y: 0 });
      }
      return newScale;
    });
  };

  const resetZoom = () => {
    setScale(1.0);
    setPosition({ x: 0, y: 0 });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (scale > 1.0) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && scale > 1.0) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleImageLoad = () => {
    setLoading(false);
    setError(false);
  };

  const handleImageError = () => {
    setLoading(false);
    setError(true);
  };

  const handleImageClick = () => {
    if (enableLightbox && !isDragging && scale === 1.0) {
      setShowLightbox(true);
    }
  };

  return (
    <>
      <div className={cn("relative inline-block group", className)}>
        {/* Image */}
        <div
          className={cn(
            "relative overflow-hidden rounded-lg border bg-muted",
            enableLightbox && scale === 1.0 && "cursor-pointer",
            scale > 1.0 && "cursor-move"
          )}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {loading && (
            <div className="flex items-center justify-center min-h-[200px]">
              <div className="text-muted-foreground">Loading image...</div>
            </div>
          )}

          {error && (
            <div className="flex items-center justify-center min-h-[200px] p-8">
              <div className="text-destructive text-center">
                <p className="font-medium">Failed to load image</p>
                <p className="text-sm mt-1">{src}</p>
              </div>
            </div>
          )}

          <img
            ref={imageRef}
            src={src}
            alt={alt}
            className={cn(
              "max-w-full h-auto select-none transition-transform",
              loading && "hidden",
              error && "hidden"
            )}
            style={{
              transform: `scale(${scale}) translate(${position.x / scale}px, ${position.y / scale}px)`,
              transformOrigin: "center center",
            }}
            onLoad={handleImageLoad}
            onError={handleImageError}
            onClick={handleImageClick}
            draggable={false}
          />
        </div>

        {/* Zoom Controls */}
        {enableZoom && !loading && !error && (
          <div className="absolute bottom-2 right-2 flex items-center gap-1 bg-background/90 backdrop-blur-sm rounded-lg border p-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="sm"
              onClick={zoomOut}
              disabled={scale <= 1.0}
              className="h-7 w-7 p-0"
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <span className="text-xs font-medium px-2">
              {Math.round(scale * 100)}%
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={zoomIn}
              disabled={scale >= 3.0}
              className="h-7 w-7 p-0"
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
            {scale > 1.0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={resetZoom}
                className="h-7 w-7 p-0"
              >
                <Minimize2 className="h-4 w-4" />
              </Button>
            )}
            {enableLightbox && scale === 1.0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowLightbox(true)}
                className="h-7 w-7 p-0"
              >
                <Maximize2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Lightbox Dialog */}
      {enableLightbox && (
        <Dialog open={showLightbox} onOpenChange={setShowLightbox}>
          <DialogContent className="max-w-7xl w-full h-[90vh] p-0">
            <div className="relative w-full h-full flex items-center justify-center bg-background">
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 z-10"
                onClick={() => setShowLightbox(false)}
              >
                <X className="h-5 w-5" />
              </Button>
              <img
                src={src}
                alt={alt}
                className="max-w-full max-h-full object-contain"
              />
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
