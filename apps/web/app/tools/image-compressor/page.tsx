import React from 'react';
import { ImageCompressorTool } from '@/modules/tools/image-compressor/ImageCompressorTool';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Image Compressor | Toolverse',
  description: 'Reduce image file size by customizing quality, scaling dimensions, and converting formats client-side instantly.',
};

export default function ImageCompressorPage() {
  return <ImageCompressorTool />;
}
