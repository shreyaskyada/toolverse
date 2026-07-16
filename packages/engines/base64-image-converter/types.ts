export interface MimeExtensionMap {
  mime: string;
  ext: string;
}

export interface Base64ImageConverterState {
  // Encode Tab States
  encFile: File | null;
  encBase64: string;
  encDataUri: string;
  encLoading: boolean;
  encCopiedType: string | null;
  encDimensions: { width: number; height: number } | null;
  encDuration: number | null;

  // Decode Tab States
  hasDecInput: boolean;
  decError: string | null;
  decPreviewUrl: string | null;
  decMimeType: string;
  decExtension: string;
  decFileSize: number;
  decBlob: Blob | null;
  decManualType: string | null;
  decDimensions: { width: number; height: number } | null;
  decDuration: number | null;
}
