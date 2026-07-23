export interface ConversionStats {
  name: string;
  sourceSize: number;
  targetSize: number;
  sourceType: string;
  targetType: string;
}

export interface ImageConverterState {
  targetFormat: string;
  isProcessing: boolean;
  sourceUrl: string;
  targetUrl: string;
  stats: ConversionStats | null;
}
