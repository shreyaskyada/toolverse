export interface ImageStats {
  name: string;
  originalSize: number;
  compressedSize: number;
  originalWidth: number;
  originalHeight: number;
  compressedWidth: number;
  compressedHeight: number;
  mimeType: string;
}

export interface ImageCompressorState {
  quality: number;
  width: number;
  height: number;
  lockAspectRatio: boolean;
  isProcessing: boolean;
  originalUrl: string;
  compressedUrl: string;
  stats: ImageStats | null;
}
