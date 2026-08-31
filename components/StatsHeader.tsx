'use client';

import React from 'react';
import { Download, Play, RefreshCw, Trash2, Loader2, Sparkles, FileArchive } from 'lucide-react';
import { formatBytes } from '@/lib/formatters';
import { ImageItem } from '@/lib/types';

interface StatsHeaderProps {
  items: ImageItem[];
  isCompressing: boolean;
  onCompressAll: () => void;
  onDownloadAllZip: () => void;
  isZipping: boolean;
  onClearAll: () => void;
  onAddMore: () => void;
}

export function StatsHeader({
  items,
  isCompressing,
  onCompressAll,
  onDownloadAllZip,
  isZipping,
  onClearAll,
  onAddMore,
}: StatsHeaderProps) {
  const totalCount = items.length;
  const completedItems = items.filter((i) => i.status === 'completed');
  const completedCount = completedItems.length;
  const idleOrErrorCount = items.filter((i) => i.status === 'idle' || i.status === 'error').length;

  const totalOriginalSize = items.reduce((acc, curr) => acc + curr.originalSize, 0);
  const totalCompressedSize = items.reduce((acc, curr) => {
    if (curr.status === 'completed' && curr.compressedSize) {
      return acc + curr.compressedSize;
    }
    return acc + curr.originalSize;
  }, 0);

  const completedOriginalSize = completedItems.reduce((acc, curr) => acc + curr.originalSize, 0);
  const completedCompressedSize = completedItems.reduce((acc, curr) => acc + (curr.compressedSize || 0), 0);
  const totalSavedBytes = Math.max(0, completedOriginalSize - completedCompressedSize);
  const totalSavedPercent =
    completedOriginalSize > 0
      ? Math.round(((completedOriginalSize - completedCompressedSize) / completedOriginalSize) * 1000) / 10
      : 0;

  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="w-full bg-white rounded-xl border border-zinc-200 p-2 sm:p-2.5 shadow-xs mb-2.5">
      {/* Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 pb-2 border-b border-zinc-100">
        <div className="bg-zinc-50 rounded-lg p-1.5 px-2 border border-zinc-100/80 flex flex-col justify-center">
          <span className="text-[10px] font-medium text-zinc-500 block leading-tight">Pictures</span>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-xs sm:text-sm font-bold text-zinc-900 leading-none">{totalCount}</span>
            <span className="text-[9px] text-zinc-500 font-normal">
              ({completedCount} done)
            </span>
          </div>
        </div>

        <div className="bg-zinc-50 rounded-lg p-1.5 px-2 border border-zinc-100/80 flex flex-col justify-center">
          <span className="text-[10px] font-medium text-zinc-500 block leading-tight">Original</span>
          <span className="text-xs sm:text-sm font-bold text-zinc-900 mt-0.5 leading-none">{formatBytes(totalOriginalSize)}</span>
        </div>

        <div className="bg-zinc-50 rounded-lg p-1.5 px-2 border border-zinc-100/80 flex flex-col justify-center">
          <span className="text-[10px] font-medium text-zinc-500 block leading-tight">Compressed</span>
          <span className="text-xs sm:text-sm font-bold text-zinc-900 mt-0.5 leading-none">
            {completedCount > 0 ? formatBytes(totalCompressedSize) : '—'}
          </span>
        </div>

        <div className="bg-emerald-50/70 rounded-lg p-1.5 px-2 border border-emerald-200/50 flex flex-col justify-center">
          <span className="text-[10px] font-medium text-emerald-800 block leading-tight">Saved</span>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-xs sm:text-sm font-bold text-emerald-700 leading-none">
              {completedCount > 0 ? `-${totalSavedPercent}%` : '0%'}
            </span>
            {totalSavedBytes > 0 && (
              <span className="text-[9px] text-emerald-600 font-medium hidden xs:inline">
                ({formatBytes(totalSavedBytes)})
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Progress line if compressing */}
      {isCompressing && (
        <div className="mt-2">
          <div className="flex justify-between text-[10px] text-zinc-600 mb-0.5">
            <span className="flex items-center gap-1 font-medium">
              <Loader2 className="w-2.5 h-2.5 animate-spin text-amber-500" />
              Compressing pictures... ({completedCount}/{totalCount})
            </span>
            <span className="font-mono">{progressPercent}%</span>
          </div>
          <div className="w-full h-1 bg-zinc-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-amber-500 transition-all duration-300 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      )}

      {/* Action Buttons Row */}
      <div className="mt-2 flex flex-wrap items-center justify-between gap-1.5">
        <div className="flex items-center gap-1.5">
          {idleOrErrorCount > 0 && (
            <button
              id="compress-all-btn"
              onClick={onCompressAll}
              disabled={isCompressing}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white font-medium text-xs shadow-xs transition-colors active:scale-95"
            >
              {isCompressing ? (
                <>
                  <Loader2 className="w-3 h-3 animate-spin" />
                  <span>Compressing...</span>
                </>
              ) : (
                <>
                  <Play className="w-3 h-3 fill-white" />
                  <span>Compress All ({idleOrErrorCount})</span>
                </>
              )}
            </button>
          )}

          {completedCount > 0 && (
            <button
              id="download-all-zip-btn"
              onClick={onDownloadAllZip}
              disabled={isZipping || completedCount === 0}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-zinc-900 hover:bg-zinc-800 disabled:opacity-50 text-white font-medium text-xs shadow-xs transition-colors active:scale-95"
            >
              {isZipping ? (
                <>
                  <Loader2 className="w-3 h-3 animate-spin" />
                  <span>Creating ZIP...</span>
                </>
              ) : (
                <>
                  <FileArchive className="w-3 h-3" />
                  <span>Download ZIP ({completedCount})</span>
                </>
              )}
            </button>
          )}
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={onAddMore}
            className="px-2 py-1 rounded-md text-xs font-medium text-zinc-700 bg-zinc-100 hover:bg-zinc-200 transition-colors"
          >
            + Add More
          </button>
          <button
            onClick={onClearAll}
            disabled={isCompressing}
            className="p-1 rounded-md text-zinc-400 hover:text-rose-600 hover:bg-rose-50 transition-colors disabled:opacity-40"
            title="Clear all pictures"
            aria-label="Clear all"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
