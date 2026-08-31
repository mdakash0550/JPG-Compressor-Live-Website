'use client';

import React from 'react';
import { Download, RefreshCw, Eye, Trash2, Loader2, ArrowRight, AlertCircle } from 'lucide-react';
import { formatBytes, generateCompressedFileName } from '@/lib/formatters';
import { ImageItem } from '@/lib/types';

interface ImageItemCardProps {
  item: ImageItem;
  onCompressSingle: (id: string) => void;
  onDownloadSingle: (item: ImageItem) => void;
  onPreviewCompare: (item: ImageItem) => void;
  onRemove: (id: string) => void;
  namingSuffix?: string;
}

export function ImageItemCard({
  item,
  onCompressSingle,
  onDownloadSingle,
  onPreviewCompare,
  onRemove,
  namingSuffix = '-min',
}: ImageItemCardProps) {
  const isCompleted = item.status === 'completed';
  const isCompressing = item.status === 'compressing';
  const isError = item.status === 'error';
  const isIdle = item.status === 'idle';

  return (
    <div
      id={`image-item-${item.id}`}
      className={`group relative bg-white rounded-xl border p-2.5 sm:p-3 transition-all duration-150 shadow-xs ${
        isCompleted
          ? 'border-emerald-200/90 bg-emerald-50/15'
          : isError
          ? 'border-rose-200 bg-rose-50/20'
          : isCompressing
          ? 'border-amber-300 bg-amber-50/30'
          : 'border-zinc-200 hover:border-zinc-300'
      }`}
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 sm:gap-3">
        {/* Left: Thumbnail & Info */}
        <div className="flex items-center gap-2.5 w-full sm:w-auto min-w-0">
          {/* Thumbnail */}
          <div
            onClick={() => isCompleted && onPreviewCompare(item)}
            className={`relative w-11 h-11 sm:w-12 sm:h-12 rounded-lg overflow-hidden bg-zinc-100 flex-shrink-0 border border-zinc-200/80 ${
              isCompleted ? 'cursor-pointer group/thumb' : ''
            }`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={item.compressedUrl || item.originalUrl}
              alt={item.name}
              className="w-full h-full object-cover"
            />

            {isCompleted && (
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/thumb:opacity-100 transition-opacity flex items-center justify-center text-white">
                <Eye className="w-4 h-4" />
              </div>
            )}

            {isCompressing && (
              <div className="absolute inset-0 bg-black/30 backdrop-blur-[1px] flex items-center justify-center text-white">
                <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
              </div>
            )}
          </div>

          {/* Name & File details */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <h3 className="font-semibold text-zinc-900 text-xs sm:text-sm truncate" title={item.name}>
                {item.name}
              </h3>
              <span className="text-[9px] font-semibold uppercase px-1 py-0.2 rounded bg-zinc-100 text-zinc-600 border border-zinc-200 flex-shrink-0">
                {item.type.replace('image/', '') || 'JPG'}
              </span>
            </div>

            {/* Sizes & Resolution comparison */}
            <div className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5 mt-0.5 text-[11px]">
              <span className="text-zinc-500 font-mono">
                {formatBytes(item.originalSize)}
              </span>

              {isCompleted && item.compressedSize !== undefined && (
                <>
                  <ArrowRight className="w-2.5 h-2.5 text-zinc-400" />
                  <span className="font-mono font-semibold text-emerald-700">
                    {formatBytes(item.compressedSize)}
                  </span>
                  <span className="inline-flex items-center px-1 py-0.2 rounded font-semibold text-[10px] bg-emerald-100 text-emerald-800">
                    -{item.savingsPercent}%
                  </span>
                </>
              )}

              {isError && (
                <span className="text-rose-600 font-medium flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {item.errorMessage || 'Failed'}
                </span>
              )}

              {isCompressing && (
                <span className="text-amber-600 font-medium animate-pulse">
                  Compressing...
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center justify-end gap-1.5 w-full sm:w-auto border-t sm:border-t-0 pt-1.5 sm:pt-0 border-zinc-100">
          {isIdle && (
            <button
              onClick={() => onCompressSingle(item.id)}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-amber-500 hover:bg-amber-600 text-white font-medium text-xs shadow-xs transition-colors active:scale-95"
            >
              Compress
            </button>
          )}

          {isError && (
            <button
              onClick={() => onCompressSingle(item.id)}
              className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-rose-100 hover:bg-rose-200 text-rose-800 font-medium text-xs transition-colors"
              title="Retry compression"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Retry</span>
            </button>
          )}

          {isCompleted && (
            <>
              {/* Compare Button */}
              <button
                onClick={() => onPreviewCompare(item)}
                className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-xs font-medium transition-colors"
                title="Compare quality"
              >
                <Eye className="w-3 h-3" />
                <span className="hidden xs:inline">Compare</span>
              </button>

              {/* Single Picture Download Button */}
              <button
                id={`download-single-btn-${item.id}`}
                onClick={() => onDownloadSingle(item)}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium shadow-xs transition-colors active:scale-95"
                title={`Download ${generateCompressedFileName(item.name, namingSuffix)}`}
              >
                <Download className="w-3 h-3" />
                <span>Download</span>
              </button>
            </>
          )}

          {/* Remove item */}
          <button
            onClick={() => onRemove(item.id)}
            disabled={isCompressing}
            className="p-1 rounded-md text-zinc-400 hover:text-rose-600 hover:bg-rose-50 transition-colors disabled:opacity-40"
            title="Remove picture"
            aria-label="Remove picture"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
