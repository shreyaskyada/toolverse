import React from 'react';
import { ImageConverterTool } from '@/modules/tools/image-converter/ImageConverterTool';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Image Converter | Toolverse',
  description: 'Convert images between JPEG, PNG, WebP, AVIF, GIF, BMP, and ICO formats client-side instantly with a live before-and-after preview.',
};

export default function ImageConverterPage() {
  return <ImageConverterTool />;
}
