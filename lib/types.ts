export interface ImageItem {
  id: string;
  file: File;
  name: string;
  type: string;
  originalSize: number;
  originalUrl: string;
  compressedUrl?: string;
  compressedBlob?: Blob;
  compressedSize?: number;
  savingsPercent?: number;
  status: 'idle' | 'compressing' | 'completed' | 'error';
  errorMessage?: string;
  originalDimensions?: { width: number; height: number };
  compressedDimensions?: { width: number; height: number };
  progress?: number;
  createdAt?: number;
}

export interface CompressionSettings {
  resizeEnabled: boolean;
  resizeMethod: 'fit' | 'scale' | 'cover';
  resizeWidth?: number;
  resizeHeight?: number;
  autoCompressOnUpload: boolean;
  namingSuffix: string; // e.g. "-min" or "-compressed"
}

export interface CompressApiResponse {
  success: boolean;
  dataUrl?: string;
  originalSize?: number;
  compressedSize?: number;
  ratio?: number;
  savingsPercent?: number;
  width?: number;
  height?: number;
  mimeType?: string;
  compressionCount?: number;
  error?: string;
}
