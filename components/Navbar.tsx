'use client';

import React from 'react';
import { ImageDown, Sliders } from 'lucide-react';

interface NavbarProps {
  apiStatus: {
    loading: boolean;
    valid: boolean;
    compressionCount?: number;
  };
  onOpenSettings: () => void;
}

export function Navbar({ apiStatus, onOpenSettings }: NavbarProps) {
  return (
    <header className="w-full bg-white/90 backdrop-blur-md border-b border-zinc-200 sticky top-0 z-30">
      <div className="max-w-4xl mx-auto px-3.5 sm:px-5 h-13 sm:h-14 flex items-center justify-between">
        {/* Logo and Brand */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center text-white shadow-xs">
            <ImageDown className="w-4 h-4 stroke-[2.4]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-zinc-900 text-sm sm:text-base tracking-tight">
                JPG Compressor
              </span>
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-amber-50 text-amber-800 border border-amber-200/60">
                TinyJPG
              </span>
            </div>
          </div>
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-2">
          {/* Engine Status Badge */}
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-zinc-100/90 text-[11px] text-zinc-600 border border-zinc-200/80">
            {apiStatus.loading ? (
              <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-pulse" />
            ) : apiStatus.valid ? (
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            ) : (
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            )}
            <span className="font-medium">
              {apiStatus.valid ? 'Ready' : 'Checking'}
            </span>
          </div>

          {/* Preferences Button */}
          <button
            id="settings-trigger-btn"
            onClick={onOpenSettings}
            className="flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium text-zinc-700 bg-zinc-100 hover:bg-zinc-200/80 transition-colors border border-zinc-200"
            title="Compression Preferences"
            aria-label="Settings"
          >
            <Sliders className="w-3.5 h-3.5 text-zinc-600" />
            <span className="hidden sm:inline">Options</span>
          </button>
        </div>
      </div>
    </header>
  );
}
