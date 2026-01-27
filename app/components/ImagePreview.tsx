"use client";

import React, { useEffect, useState } from "react";

interface ImagePreviewBoxProps {
  className?: string;
  photo?: string | null;
}

const ImagePreviewBox: React.FC<ImagePreviewBoxProps> = ({
  className,
  photo,
}) => {
  const [image, setImage] = useState<string | null>(null);

  // Update internal image state when photo prop changes
  useEffect(() => {
    setImage(photo || null);
  }, [photo]);

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <p className="font-normal">Preview</p>
      <div className="w-32 h-32 border border-gray-300 rounded flex items-center justify-center">
        {image ? (
          <img
            src={image}
            alt="Preview"
            className="max-w-full max-h-full object-contain"
          />
        ) : (
          <p className="text-gray-300 text-center">No image captured</p>
        )}
      </div>
    </div>
  );
};

export default ImagePreviewBox;
