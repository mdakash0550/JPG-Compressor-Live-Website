'use client';

import React, { useState } from 'react';
import { X, Sliders, Check, Sparkles, Image as ImageIcon } from 'lucide-react';
import { CompressionSettings } from '@/lib/types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: CompressionSettings;
  onSaveSettings: (settings: CompressionSettings) => void;
}

export function SettingsModal({
  isOpen,
  onClose,
  settings,
  onSaveSettings,
}: SettingsModalProps) {
  const [localSettings, setLocalSettings] = useState<CompressionSettings>(settings);

  if (!isOpen) return null;

  const handleSave = () => {
    onSaveSettings(localSettings);
    onClose();
  };

  const handleResetDefaults = () => {
    setLocalSettings({
      resizeEnabled: false,
      resizeMethod: 'fit',
      resizeWidth: undefined,
      resizeHeight: undefined,
      autoCompressOnUpload: true,
      namingSuffix: '-min',
    });
  };

  return (
    <div
      id="settings-modal-backdrop"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white text-zinc-900 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl border border-zinc-200">
        {/* Header */}
        <div className="p-3.5 sm:px-5 border-b border-zinc-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
              <Sliders className="w-3.5 h-3.5" />
            </div>
            <div>
              <h3 className="font-semibold text-sm sm:text-base text-zinc-900">Compression Preferences</h3>
              <p className="text-[11px] text-zinc-500">Configure batch output and optimization rules</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-3.5 sm:p-5 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
          {/* Auto Compress Toggle */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-50 border border-zinc-200/80">
            <div>
              <p className="text-xs font-semibold text-zinc-900">Auto-compress upon upload</p>
              <p className="text-[11px] text-zinc-500">Automatically optimize pictures as soon as you drop or select them</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={localSettings.autoCompressOnUpload}
                onChange={(e) =>
                  setLocalSettings({ ...localSettings, autoCompressOnUpload: e.target.checked })
                }
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-zinc-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-500"></div>
            </label>
          </div>

          {/* File Naming Suffix */}
          <div>
            <label className="text-[11px] font-semibold text-zinc-700 uppercase tracking-wider block mb-1.5">
              Downloaded File Suffix
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {['-min', '-compressed', ''].map((suffix) => (
                <button
                  key={suffix}
                  type="button"
                  onClick={() => setLocalSettings({ ...localSettings, namingSuffix: suffix })}
                  className={`py-1.5 px-2 rounded-lg text-xs font-medium border transition-all ${
                    localSettings.namingSuffix === suffix
                      ? 'border-amber-500 bg-amber-50 text-amber-900 font-semibold ring-1 ring-amber-400'
                      : 'border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50'
                  }`}
                >
                  {suffix === '' ? 'Original Name' : `photo${suffix}.jpg`}
                </button>
              ))}
            </div>
          </div>

          {/* Optional Resize */}
          <div className="pt-2 border-t border-zinc-100">
            <div className="flex items-center justify-between mb-2.5">
              <div>
                <p className="text-xs font-semibold text-zinc-900">Optional Image Resizing</p>
                <p className="text-[11px] text-zinc-500">Scale picture resolution during compression</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={localSettings.resizeEnabled}
                  onChange={(e) =>
                    setLocalSettings({ ...localSettings, resizeEnabled: e.target.checked })
                  }
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-zinc-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-500"></div>
              </label>
            </div>

            {localSettings.resizeEnabled && (
              <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200 space-y-2.5 animate-in fade-in duration-150">
                <div>
                  <label className="text-[11px] font-medium text-zinc-700 block mb-1">Resize Method</label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {(['fit', 'scale', 'cover'] as const).map((method) => (
                      <button
                        key={method}
                        type="button"
                        onClick={() =>
                          setLocalSettings({ ...localSettings, resizeMethod: method })
                        }
                        className={`py-1 px-2 rounded-md text-[11px] capitalize border ${
                          localSettings.resizeMethod === method
                            ? 'border-amber-500 bg-white text-amber-900 font-semibold shadow-xs'
                            : 'border-zinc-200 bg-zinc-100/70 text-zinc-600'
                        }`}
                      >
                        {method}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] text-zinc-600 block mb-0.5">Max Width (px)</label>
                    <input
                      type="number"
                      placeholder="e.g. 1920"
                      value={localSettings.resizeWidth || ''}
                      onChange={(e) =>
                        setLocalSettings({
                          ...localSettings,
                          resizeWidth: e.target.value ? parseInt(e.target.value, 10) : undefined,
                        })
                      }
                      className="w-full px-2.5 py-1 text-xs rounded-lg border border-zinc-300 focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-zinc-600 block mb-0.5">Max Height (px)</label>
                    <input
                      type="number"
                      placeholder="e.g. 1080"
                      value={localSettings.resizeHeight || ''}
                      onChange={(e) =>
                        setLocalSettings({
                          ...localSettings,
                          resizeHeight: e.target.value ? parseInt(e.target.value, 10) : undefined,
                        })
                      }
                      className="w-full px-2.5 py-1 text-xs rounded-lg border border-zinc-300 focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 sm:px-5 bg-zinc-50 border-t border-zinc-200 flex items-center justify-between">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="text-[11px] text-zinc-500 hover:text-zinc-800 transition-colors"
          >
            Reset Defaults
          </button>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg text-xs font-medium text-zinc-700 hover:bg-zinc-200/80 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-4 py-1.5 rounded-lg text-xs font-medium bg-amber-500 hover:bg-amber-600 text-white shadow-xs transition-colors"
            >
              Save Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
