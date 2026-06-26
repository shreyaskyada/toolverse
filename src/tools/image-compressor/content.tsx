import React from "react";

export default function ImageCompressorContent() {
  return (
    <div className="flex flex-col gap-4 text-xs md:text-sm">
      <p>
        <strong>Image Compressor</strong> is a high-performance utility that reduces the file size of your photos, mockups, and graphics directly inside your browser. No files are uploaded to any external APIs.
      </p>

      <h4 className="font-semibold text-foreground mt-2">Adjustable Quality & Dimensions</h4>
      <p>
        Easily reduce the quality slider to find the perfect sweet spot between file size and visual clarity. You can also scale down the dimensions (e.g. 50% scale) or specify custom width/height values with locked aspect ratios to optimize images for the web.
      </p>

      <h4 className="font-semibold text-foreground mt-2">Format Conversion</h4>
      <p>
        Convert large images to high-density modern WebP or widely supported JPEG formats. WebP files can offer up to 30% more savings compared to standard JPEGs at similar quality levels.
      </p>

      <h4 className="font-semibold text-foreground mt-2">Side-by-Side Comparison</h4>
      <p>
        Visually compare the original high-resolution file and the compressed preview in real-time, showing live metrics for file size, dimensions, and the total space saved.
      </p>
    </div>
  );
}
