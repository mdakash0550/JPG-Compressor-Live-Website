'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { X, Download, ArrowLeftRight, Check, ZoomIn } from 'lucide-react';
import { formatBytes, generateCompressedFileName } from '@/lib/formatters';
import { ImageItem } from '@/lib/types';

interface ImageComparisonModalProps {
  item: ImageItem | null;
  onClose: () => void;
  onDownloadSingle: (item: ImageItem) => void;
  namingSuffix?: string;
}

export function ImageComparisonModal({
  item,
  onClose,
  onDownloadSingle,
  namingSuffix = '-min',
}: ImageComparisonModalProps) {
  const [sliderPosition, setSliderPosition] = useState(50); // percentage 0 to 100
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const position = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(position);
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (e.touches.length > 0) {
      handleMove(e.touches[0].clientX);
    }
  }, [handleMove]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isDragging) {
      handleMove(e.clientX);
    }
  }, [isDragging, handleMove]);

  if (!item || !item.compressedUrl) return null;

  return (
    <div
      id="comparison-modal-backdrop"
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-zinc-900 border border-zinc-800 text-white rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-4 sm:px-6 border-b border-zinc-800 flex items-center justify-between">
          <div className="min-w-0 pr-4">
            <h3 className="font-semibold text-base sm:text-lg truncate text-zinc-100">
              {item.name}
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              Drag the slider to compare original with compressed picture
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onDownloadSingle(item)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-medium transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Download</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Stats Pill Bar */}
        <div className="bg-zinc-950/60 px-4 sm:px-6 py-2.5 border-b border-zinc-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-zinc-400" />
              <span className="text-zinc-400">Original:</span>
              <span className="font-mono font-medium text-zinc-200">
                {formatBytes(item.originalSize)}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span className="text-zinc-400">Compressed:</span>
              <span className="font-mono font-medium text-emerald-400">
                {item.compressedSize ? formatBytes(item.compressedSize) : '—'}
              </span>
            </div>
          </div>

          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-800/50 font-medium">
            <Check className="w-3 h-3 text-emerald-400" />
            <span>Saved {item.savingsPercent}% of file size</span>
          </div>
        </div>

        {/* Image Split Viewer */}
        <div className="relative flex-1 min-h-[300px] sm:min-h-[440px] max-h-[60vh] bg-zinc-950 flex items-center justify-center p-4 select-none overflow-hidden">
          <div
            ref={containerRef}
            onMouseDown={() => setIsDragging(true)}
            onMouseUp={() => setIsDragging(false)}
            onMouseMove={handleMouseMove}
            onTouchMove={handleTouchMove}
            onClick={(e) => handleMove(e.clientX)}
            className="relative max-w-full max-h-full rounded-xl overflow-hidden cursor-ew-resize border border-zinc-800 shadow-lg"
            style={{ touchAction: 'none' }}
          >
            {/* Compressed Image (Background Layer) */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={item.compressedUrl}
              alt="Compressed"
              className="max-w-full max-h-[52vh] object-contain block pointer-events-none"
              draggable={false}
            />

            {/* Original Image (Foreground Layer with clip path) */}
            <div
              className="absolute inset-0 overflow-hidden pointer-events-none"
              style={{
                clipPath: `inset(0 ${100 - sliderPosition}% 0 0)`,
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.originalUrl}
                alt="Original"
                className="max-w-full max-h-[52vh] object-contain block pointer-events-none"
                draggable={false}
              />
            </div>

            {/* Slider Divider Line */}
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-white shadow-[0_0_8px_rgba(0,0,0,0.8)] pointer-events-none z-20"
              style={{ left: `${sliderPosition}%` }}
            >
              {/* Center Handle Button */}
              <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white text-zinc-900 shadow-lg flex items-center justify-center border-2 border-amber-500">
                <ArrowLeftRight className="w-4 h-4 stroke-[2.5]" />
              </div>
            </div>

            {/* Floating Labels */}
            <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-md text-[11px] font-medium text-zinc-300 pointer-events-none z-10 border border-white/10">
              Original
            </div>
            <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-md text-[11px] font-medium text-emerald-300 pointer-events-none z-10 border border-white/10">
              TinyJPG Compressed
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="p-3 sm:px-6 bg-zinc-900 border-t border-zinc-800 text-center text-xs text-zinc-400">
          Tip: Move cursor or drag on mobile across the image to inspect high-frequency details.
        </div>
      </div>
    </div>
  );
}
