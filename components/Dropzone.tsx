'use client';

import React, { useRef, useState, useCallback, useEffect } from 'react';
import { UploadCloud, Image as ImageIcon, Sparkles, Plus, Clipboard } from 'lucide-react';

interface DropzoneProps {
  onFilesSelected: (files: File[]) => void;
  isCompressing?: boolean;
}

export function Dropzone({ onFilesSelected, isCompressing }: DropzoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const processFiles = useCallback((fileList: FileList | File[]) => {
    const validFiles: File[] = [];
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

    Array.from(fileList).forEach((file) => {
      if (validTypes.includes(file.type.toLowerCase()) || /\.(jpe?g|png|webp)$/i.test(file.name)) {
        validFiles.push(file);
      }
    });

    if (validFiles.length > 0) {
      onFilesSelected(validFiles);
    }
  }, [onFilesSelected]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  }, [processFiles]);

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
      e.target.value = '';
    }
  };

  // Clipboard paste listener
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      if (!e.clipboardData) return;
      const items = e.clipboardData.items;
      const pastedFiles: File[] = [];

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const file = items[i].getAsFile();
          if (file) {
            const renamedFile = new File([file], `pasted-image-${Date.now()}.jpg`, {
              type: file.type || 'image/jpeg',
            });
            pastedFiles.push(renamedFile);
          }
        }
      }

      if (pastedFiles.length > 0) {
        processFiles(pastedFiles);
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [processFiles]);

  return (
    <div className="w-full">
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/jpeg,image/jpg,image/png,image/webp"
        onChange={handleFileInputChange}
        className="hidden"
        id="file-upload-input"
      />

      <div
        id="dropzone-container"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative group cursor-pointer transition-all duration-150 rounded-xl border-2 border-dashed p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left ${
          isDragOver
            ? 'border-amber-500 bg-amber-50/80 scale-[1.004]'
            : 'border-zinc-300 hover:border-amber-400 bg-white hover:bg-amber-50/20 shadow-xs'
        }`}
      >
        <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-amber-100/90 text-amber-600 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
            <UploadCloud className="w-5 h-5 stroke-[2.2]" />
          </div>

          <div>
            <h2 className="text-sm sm:text-base font-bold text-zinc-900 leading-tight">
              Drop JPG / PNG pictures here
            </h2>
            <p className="text-xs text-zinc-500 mt-0.5">
              Select multiple pictures to compress instantly (or paste Ctrl+V)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            type="button"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-medium text-xs shadow-xs transition-colors active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Select Pictures</span>
          </button>
        </div>
      </div>
    </div>
  );
}
