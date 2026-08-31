import { CompressionSettings } from './types';

export function formatBytes(bytes: number, decimals = 1): string {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export function getImageDimensions(input: File | string): Promise<{ width: number; height: number }> {
  return new Promise((resolve) => {
    const img = new Image();
    const isFile = typeof input !== 'string';
    const url = isFile ? URL.createObjectURL(input) : input;
    img.onload = () => {
      if (isFile) URL.revokeObjectURL(url);
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
    };
    img.onerror = () => {
      if (isFile) URL.revokeObjectURL(url);
      resolve({ width: 0, height: 0 });
    };
    img.src = url;
  });
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function downloadDataUrl(dataUrl: string, filename: string) {
  const a = document.createElement('a');
  a.href = dataUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

export function generateCompressedFileName(originalName: string, suffix = '-min'): string {
  const lastDotIndex = originalName.lastIndexOf('.');
  if (lastDotIndex === -1) {
    return `${originalName}${suffix}.jpg`;
  }
  const baseName = originalName.substring(0, lastDotIndex);
  const ext = originalName.substring(lastDotIndex);
  return `${baseName}${suffix}${ext}`;
}

// Client-side canvas compression fallback
export function compressImageInBrowser(
  file: File,
  settings: CompressionSettings
): Promise<{
  dataUrl: string;
  compressedSize: number;
  width: number;
  height: number;
}> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);

      let targetWidth = img.naturalWidth;
      let targetHeight = img.naturalHeight;

      if (settings.resizeEnabled && (settings.resizeWidth || settings.resizeHeight)) {
        const maxWidth = settings.resizeWidth || img.naturalWidth;
        const maxHeight = settings.resizeHeight || img.naturalHeight;

        if (settings.resizeMethod === 'fit' || settings.resizeMethod === 'cover') {
          const ratio = Math.min(maxWidth / img.naturalWidth, maxHeight / img.naturalHeight, 1);
          targetWidth = Math.round(img.naturalWidth * ratio);
          targetHeight = Math.round(img.naturalHeight * ratio);
        } else if (settings.resizeMethod === 'scale') {
          targetWidth = maxWidth;
          targetHeight = maxHeight;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = targetWidth;
      canvas.height = targetHeight;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Canvas 2D context not available'));
        return;
      }

      // Smooth rendering
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      // For JPEG, ensure white background instead of transparent black
      const isPng = file.type === 'image/png';
      if (!isPng) {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, targetWidth, targetHeight);
      }

      ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

      const mimeType = isPng ? 'image/png' : 'image/jpeg';
      const quality = isPng ? 0.85 : 0.78;
      const dataUrl = canvas.toDataURL(mimeType, quality);

      // Estimate base64 byte length
      const base64Str = dataUrl.split(',')[1] || '';
      const compressedSize = Math.round((base64Str.length * 3) / 4);

      resolve({
        dataUrl,
        compressedSize,
        width: targetWidth,
        height: targetHeight,
      });
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('Failed to load image for browser compression'));
    };

    img.src = objectUrl;
  });
}
