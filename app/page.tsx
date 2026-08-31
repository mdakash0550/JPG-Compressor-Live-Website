'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import JSZip from 'jszip';
import { motion, AnimatePresence } from 'motion/react';
import {
  FileArchive,
  Download,
  Play,
  Trash2,
  Sparkles,
  Layers,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  Info,
} from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Dropzone } from '@/components/Dropzone';
import { StatsHeader } from '@/components/StatsHeader';
import { ImageItemCard } from '@/components/ImageItemCard';
import { ImageComparisonModal } from '@/components/ImageComparisonModal';
import { SettingsModal } from '@/components/SettingsModal';
import { FloatingContact } from '@/components/FloatingContact';
import { SeoSections } from '@/components/SeoSections';
import { Footer } from '@/components/Footer';
import { useLocalStorage } from '@/lib/hooks';
import { ImageItem, CompressionSettings, CompressApiResponse } from '@/lib/types';
import {
  formatBytes,
  getImageDimensions,
  downloadDataUrl,
  downloadBlob,
  generateCompressedFileName,
  compressImageInBrowser,
} from '@/lib/formatters';

const DEFAULT_SETTINGS: CompressionSettings = {
  resizeEnabled: false,
  resizeMethod: 'fit',
  resizeWidth: undefined,
  resizeHeight: undefined,
  autoCompressOnUpload: true,
  namingSuffix: '-min',
};

export default function HomePage() {
  const [items, setItems] = useState<ImageItem[]>([]);
  const [settings, setSettings] = useLocalStorage<CompressionSettings>(
    'jpg_compressor_settings',
    DEFAULT_SETTINGS
  );
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [activeModalItem, setActiveModalItem] = useState<ImageItem | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);
  const [isZipping, setIsZipping] = useState(false);
  const [filter, setFilter] = useState<'all' | 'completed' | 'pending'>('all');
  const [toastMessage, setToastMessage] = useState<{
    text: string;
    type: 'success' | 'error' | 'info';
  } | null>(null);

  const [apiStatus, setApiStatus] = useState<{
    loading: boolean;
    valid: boolean;
    compressionCount?: number;
    error?: string;
  }>({
    loading: true,
    valid: true,
    compressionCount: undefined,
  });

  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const showToast = useCallback((text: string, type: 'success' | 'error' | 'info' = 'success') => {
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    setToastMessage({ text, type });
    toastTimeoutRef.current = setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  }, []);

  useEffect(() => {
    let ignore = false;

    async function loadStatus() {
      try {
        const res = await fetch('/api/compress/status');
        const data = await res.json();
        if (!ignore) {
          if (res.ok && data.valid) {
            setApiStatus({
              loading: false,
              valid: true,
              compressionCount: data.compressionCount,
            });
          } else {
            setApiStatus({
              loading: false,
              valid: false,
              error: data.error || 'Failed to authenticate with TinyJPG',
              compressionCount: data.compressionCount,
            });
          }
        }
      } catch {
        if (!ignore) {
          setApiStatus({
            loading: false,
            valid: false,
            error: 'Network connection issue',
          });
        }
      }
    }

    loadStatus();
    return () => {
      ignore = true;
    };
  }, []);

  const handleSaveSettings = (newSettings: CompressionSettings) => {
    setSettings(newSettings);
    showToast('Preferences saved successfully');
  };

  // Compress a single image item
  const compressItem = useCallback(
    async (item: ImageItem, currentSettings: CompressionSettings): Promise<ImageItem> => {
      const formData = new FormData();
      formData.append('file', item.file);
      if (currentSettings.resizeEnabled) {
        formData.append('resizeEnabled', 'true');
        formData.append('resizeMethod', currentSettings.resizeMethod);
        if (currentSettings.resizeWidth) formData.append('resizeWidth', currentSettings.resizeWidth.toString());
        if (currentSettings.resizeHeight) formData.append('resizeHeight', currentSettings.resizeHeight.toString());
      }

      try {
        const response = await fetch('/api/compress', {
          method: 'POST',
          body: formData,
        });

        const data: CompressApiResponse = await response.json();

        if (response.ok && data.success && data.dataUrl) {
          if (data.compressionCount !== undefined) {
            setApiStatus((prev) => ({
              ...prev,
              valid: true,
              compressionCount: data.compressionCount,
            }));
          }

          return {
            ...item,
            status: 'completed',
            compressedUrl: data.dataUrl,
            compressedSize: data.compressedSize,
            savingsPercent: data.savingsPercent,
            compressedDimensions:
              data.width && data.height ? { width: data.width, height: data.height } : undefined,
          };
        } else {
          // Attempt client-side canvas compression fallback
          const fallback = await compressImageInBrowser(item.file, currentSettings);
          const savings =
            item.originalSize > 0
              ? Math.max(
                  0,
                  Math.round(
                    ((item.originalSize - fallback.compressedSize) / item.originalSize) * 1000
                  ) / 10
                )
              : 0;

          return {
            ...item,
            status: 'completed',
            compressedUrl: fallback.dataUrl,
            compressedSize: fallback.compressedSize,
            savingsPercent: savings,
            compressedDimensions: { width: fallback.width, height: fallback.height },
          };
        }
      } catch {
        try {
          // Client-side fallback on network disconnection
          const fallback = await compressImageInBrowser(item.file, currentSettings);
          const savings =
            item.originalSize > 0
              ? Math.max(
                  0,
                  Math.round(
                    ((item.originalSize - fallback.compressedSize) / item.originalSize) * 1000
                  ) / 10
                )
              : 0;

          return {
            ...item,
            status: 'completed',
            compressedUrl: fallback.dataUrl,
            compressedSize: fallback.compressedSize,
            savingsPercent: savings,
            compressedDimensions: { width: fallback.width, height: fallback.height },
          };
        } catch (err: unknown) {
          const msg = err instanceof Error ? err.message : 'Compression error';
          return {
            ...item,
            status: 'error',
            errorMessage: msg,
          };
        }
      }
    },
    []
  );

  // Compress all or pending items with concurrency of 2
  const runCompressionQueue = useCallback(
    async (itemsToProcess: ImageItem[]) => {
      if (itemsToProcess.length === 0) return;
      setIsCompressing(true);

      const targetIds = new Set(itemsToProcess.map((i) => i.id));
      setItems((prev) =>
        prev.map((it) => (targetIds.has(it.id) ? { ...it, status: 'compressing' } : it))
      );

      const concurrency = 2;
      const results: ImageItem[] = [];
      const queue = [...itemsToProcess];

      const worker = async () => {
        while (queue.length > 0) {
          const item = queue.shift();
          if (!item) break;

          const compressed = await compressItem(item, settings);
          results.push(compressed);

          // Update item state immediately
          setItems((prev) => prev.map((it) => (it.id === compressed.id ? compressed : it)));
        }
      };

      const workers = Array.from({ length: Math.min(concurrency, itemsToProcess.length) }, () =>
        worker()
      );

      await Promise.all(workers);
      setIsCompressing(false);

      const successCount = results.filter((r) => r.status === 'completed').length;
      if (successCount > 0) {
        showToast(
          `Compressed ${successCount} picture${successCount > 1 ? 's' : ''} successfully!`
        );
      }
    },
    [compressItem, settings, showToast]
  );

  // Handle files selected via dropzone or file picker
  const handleFilesSelected = async (newFiles: File[]) => {
    if (newFiles.length === 0) return;

    const newItems: ImageItem[] = [];

    for (const file of newFiles) {
      const id = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      const originalUrl = URL.createObjectURL(file);

      let dimensions;
      try {
        dimensions = await getImageDimensions(originalUrl);
      } catch {
        dimensions = undefined;
      }

      newItems.push({
        id,
        file,
        name: file.name,
        originalSize: file.size,
        type: file.type || 'image/jpeg',
        status: 'idle',
        originalUrl,
        originalDimensions: dimensions,
        createdAt: Date.now(),
      });
    }

    setItems((prev) => [...prev, ...newItems]);
    showToast(`Added ${newItems.length} picture${newItems.length > 1 ? 's' : ''}`);

    if (settings.autoCompressOnUpload) {
      runCompressionQueue(newItems);
    }
  };

  // Compress single image
  const handleCompressSingle = (id: string) => {
    const target = items.find((i) => i.id === id);
    if (target) {
      runCompressionQueue([target]);
    }
  };

  // Download single image
  const handleDownloadSingle = (item: ImageItem) => {
    if (!item.compressedUrl) return;
    const downloadName = generateCompressedFileName(item.name, settings.namingSuffix);
    downloadDataUrl(item.compressedUrl, downloadName);
    showToast(`Downloading ${downloadName}`);
  };

  // Download all completed images as ZIP
  const handleDownloadAllZip = async () => {
    const completedItems = items.filter((i) => i.status === 'completed' && i.compressedUrl);
    if (completedItems.length === 0) {
      showToast('No compressed pictures available to download', 'info');
      return;
    }

    setIsZipping(true);
    showToast(`Packaging ${completedItems.length} pictures into ZIP...`, 'info');

    try {
      const zip = new JSZip();
      const usedNames = new Set<string>();

      for (let i = 0; i < completedItems.length; i++) {
        const item = completedItems[i];
        if (!item.compressedUrl) continue;

        let baseName = generateCompressedFileName(item.name, settings.namingSuffix);
        let finalName = baseName;
        let count = 1;
        while (usedNames.has(finalName)) {
          const dotIdx = baseName.lastIndexOf('.');
          if (dotIdx !== -1) {
            finalName = `${baseName.substring(0, dotIdx)} (${count})${baseName.substring(dotIdx)}`;
          } else {
            finalName = `${baseName} (${count})`;
          }
          count++;
        }
        usedNames.add(finalName);

        const base64Data = item.compressedUrl.split(',')[1];
        zip.file(finalName, base64Data, { base64: true });
      }

      const zipBlob = await zip.generateAsync({
        type: 'blob',
        compression: 'DEFLATE',
        compressionOptions: { level: 6 },
      });

      const zipName = `compressed_jpg_images_${new Date().toISOString().slice(0, 10)}.zip`;
      downloadBlob(zipBlob, zipName);
      showToast(`Downloaded ${completedItems.length} pictures in ZIP archive!`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to create ZIP';
      showToast(msg, 'error');
    } finally {
      setIsZipping(false);
    }
  };

  // Clear all images
  const handleClearAll = () => {
    items.forEach((item) => {
      if (item.originalUrl) URL.revokeObjectURL(item.originalUrl);
    });
    setItems([]);
    showToast('Cleared all pictures', 'info');
  };

  // Remove single image
  const handleRemove = (id: string) => {
    const item = items.find((i) => i.id === id);
    if (item?.originalUrl) URL.revokeObjectURL(item.originalUrl);
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  // Filtered items
  const filteredItems = items.filter((item) => {
    if (filter === 'completed') return item.status === 'completed';
    if (filter === 'pending') return item.status === 'idle' || item.status === 'error';
    return true;
  });

  return (
    <div className="min-h-screen bg-zinc-50/70 text-zinc-900 flex flex-col font-sans selection:bg-amber-100 selection:text-amber-900">
      {/* Top Navigation */}
      <Navbar
        apiStatus={apiStatus}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Main Content Area - Compact container */}
      <main className="flex-1 max-w-3xl w-full mx-auto px-3.5 sm:px-5 py-4 sm:py-6">
        {/* Compact Title banner */}
        <div className="mb-3.5">
          <h1 className="text-xl sm:text-2xl font-bold text-zinc-900 tracking-tight">
            JPG Compressor
          </h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            Free online batch image compressor by <span className="font-semibold text-zinc-700">Akash (Bangladeshi Web Developer)</span>. Reduce JPG, JPEG, PNG, and WebP file size up to 80% without losing quality.
          </p>
        </div>

        {/* Dropzone Upload Box */}
        <div className="mb-4">
          <Dropzone
            onFilesSelected={handleFilesSelected}
            isCompressing={isCompressing}
          />
        </div>

        {/* Active Items Section */}
        {items.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.15 }}
          >
            {/* Stats & Batch Controls Header */}
            <StatsHeader
              items={items}
              isCompressing={isCompressing}
              onCompressAll={() =>
                runCompressionQueue(
                  items.filter((i) => i.status === 'idle' || i.status === 'error')
                )
              }
              onDownloadAllZip={handleDownloadAllZip}
              isZipping={isZipping}
              onClearAll={handleClearAll}
              onAddMore={() => {
                const input = document.getElementById('file-upload-input') as HTMLInputElement;
                input?.click();
              }}
            />

            {/* Filter Tabs */}
            <div className="flex items-center justify-between gap-2 mb-2.5 px-0.5">
              <div className="flex items-center gap-1 bg-zinc-200/70 p-0.5 rounded-lg text-xs font-medium text-zinc-600">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-2.5 py-1 rounded-md transition-all ${
                    filter === 'all'
                      ? 'bg-white text-zinc-900 shadow-xs font-semibold'
                      : 'hover:text-zinc-900'
                  }`}
                >
                  All ({items.length})
                </button>
                <button
                  onClick={() => setFilter('completed')}
                  className={`px-2.5 py-1 rounded-md transition-all ${
                    filter === 'completed'
                      ? 'bg-white text-zinc-900 shadow-xs font-semibold'
                      : 'hover:text-zinc-900'
                  }`}
                >
                  Compressed ({items.filter((i) => i.status === 'completed').length})
                </button>
                <button
                  onClick={() => setFilter('pending')}
                  className={`px-2.5 py-1 rounded-md transition-all ${
                    filter === 'pending'
                      ? 'bg-white text-zinc-900 shadow-xs font-semibold'
                      : 'hover:text-zinc-900'
                  }`}
                >
                  Pending ({items.filter((i) => i.status === 'idle' || i.status === 'error').length})
                </button>
              </div>

              <span className="text-[11px] text-zinc-400 font-mono hidden sm:inline">
                {filteredItems.length} file{filteredItems.length === 1 ? '' : 's'}
              </span>
            </div>

            {/* List of Image Cards */}
            <div className="space-y-2">
              <AnimatePresence mode="popLayout">
                {filteredItems.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                  >
                    <ImageItemCard
                      item={item}
                      onCompressSingle={handleCompressSingle}
                      onDownloadSingle={handleDownloadSingle}
                      onPreviewCompare={(it) => setActiveModalItem(it)}
                      onRemove={handleRemove}
                      namingSuffix={settings.namingSuffix}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>
        )}

        {/* Compact Features row (when no items) */}
        {items.length === 0 && (
          <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <div className="p-3 rounded-xl bg-white border border-zinc-200 shadow-xs">
              <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center mb-2">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <h3 className="text-xs font-bold text-zinc-900 mb-0.5">TinyJPG Engine</h3>
              <p className="text-[11px] text-zinc-500 leading-relaxed">
                Smart selective color quantization cuts size by 60–80% without visible quality loss.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-white border border-zinc-200 shadow-xs">
              <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center mb-2">
                <FileArchive className="w-3.5 h-3.5" />
              </div>
              <h3 className="text-xs font-bold text-zinc-900 mb-0.5">Batch & ZIP Download</h3>
              <p className="text-[11px] text-zinc-500 leading-relaxed">
                Download pictures individually or package everything into a single zip archive.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-white border border-zinc-200 shadow-xs">
              <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center mb-2">
                <Layers className="w-3.5 h-3.5" />
              </div>
              <h3 className="text-xs font-bold text-zinc-900 mb-0.5">Quality Inspector</h3>
              <p className="text-[11px] text-zinc-500 leading-relaxed">
                Split-slider preview tool to inspect compressed details against the original.
              </p>
            </div>
          </div>
        )}

        {/* Comprehensive SEO Content, How-To, FAQ & Developer Bio */}
        <SeoSections />
      </main>

      {/* Semantic Footer with Author & SEO Attribution */}
      <Footer />

      {/* Before / After Visual Comparison Modal */}
      <ImageComparisonModal
        item={activeModalItem}
        onClose={() => setActiveModalItem(null)}
        onDownloadSingle={handleDownloadSingle}
        namingSuffix={settings.namingSuffix}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSaveSettings={handleSaveSettings}
      />

      {/* Floating WhatsApp & Telegram Contact at bottom-left */}
      <FloatingContact />

      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="fixed bottom-4 right-4 z-50 max-w-sm pointer-events-auto"
          >
            <div
              className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl shadow-md border text-xs font-medium ${
                toastMessage.type === 'error'
                  ? 'bg-rose-900 text-white border-rose-800'
                  : toastMessage.type === 'info'
                  ? 'bg-zinc-900 text-white border-zinc-800'
                  : 'bg-emerald-900 text-white border-emerald-800'
              }`}
            >
              {toastMessage.type === 'error' ? (
                <AlertCircle className="w-3.5 h-3.5 text-rose-300 flex-shrink-0" />
              ) : toastMessage.type === 'info' ? (
                <Info className="w-3.5 h-3.5 text-zinc-300 flex-shrink-0" />
              ) : (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300 flex-shrink-0" />
              )}
              <span>{toastMessage.text}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
