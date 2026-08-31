'use client';

import React from 'react';
import { Heart, Globe, Shield, Zap } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-zinc-200 bg-white text-zinc-600 mt-auto py-6 px-3.5 sm:px-5">
      <div className="max-w-3xl mx-auto space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-zinc-900">JPG Compressor</span>
            <span className="text-zinc-300">•</span>
            <span className="text-zinc-500">Free Online Image Optimizer</span>
          </div>

          <div className="flex items-center gap-3 text-[11px] text-zinc-500">
            <span className="flex items-center gap-1">
              <Zap className="w-3 h-3 text-amber-500" /> Fast Batch
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Shield className="w-3 h-3 text-emerald-600" /> Private & Secure
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Globe className="w-3 h-3 text-blue-500" /> Global Tool
            </span>
          </div>
        </div>

        <div className="pt-3 border-t border-zinc-100 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-zinc-400">
          <p>
            © {currentYear} JPG Compressor. All rights reserved.
          </p>
          <p className="flex items-center gap-1 text-zinc-500">
            Crafted with <Heart className="w-3 h-3 text-rose-500 fill-rose-500" /> by{' '}
            <a
              href="https://wa.me/8801785422960"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-zinc-800 hover:text-amber-600 underline underline-offset-2 transition-colors"
            >
              Akash
            </a>{' '}
            (Bangladeshi Web Developer)
          </p>
        </div>
      </div>
    </footer>
  );
}
