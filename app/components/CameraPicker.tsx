"use client";
import React from "react";
import TripleDiamond from "@/app/components/TripleDiamond";

interface Props {
  onCameraClick: () => void;
  onGalleryChange: (base64: string) => void;
  activeChoice: "camera" | "gallery" | null;
}

const CameraPicker: React.FC<{
  onCameraClick: () => void;
  onGallerySelect: (file: string) => void;
  activeChoice: "camera" | "gallery" | null;
}> = ({ onCameraClick, onGallerySelect, activeChoice }) => {
  return (
    <div className="flex flex-1 items-center justify-center overflow-visible z-10 lg:pt-30 md:pt-20">
      <div className="flex flex-col lg:flex-row items-center gap-16 md:gap-10 z-50 -translate-y-16 md:-translate-y-24 lg:-translate-y-28">
        {/* Camera */}
        <div className="scale-90 md:scale-100">
          <TripleDiamond size={300} gap={20} padding={60}>
            <div className="relative flex items-center justify-center w-40 h-40">
              <button
                onClick={onCameraClick}
                disabled={activeChoice === "gallery"}
                className={`w-40 relative z-10 transition ${
                  activeChoice === "gallery"
                    ? "opacity-30 cursor-not-allowed pointer-events-none"
                    : "hover:scale-105"
                }`}
              >
                <img
                  src="https://skinstric-wandag.vercel.app/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fcamera-icon.14742046.png&w=384&q=75"
                  alt="Camera"
                />
              </button>
              <span className="absolute top-8 -right-11 w-24 h-px bg-gray-400 rotate-[-29deg]" />
              <span className="absolute top-1 -right-11 w-2 h-2 border border-gray-500 rounded-full" />
              <p className="absolute -top-6 -right-46 text-xs font-semibold leading-tight text-left">
                ALLOW A.I. <br /> TO SCAN YOUR FACE
              </p>
            </div>
          </TripleDiamond>
        </div>

        {/* Gallery */}
        <div className="scale-90 md:scale-100">
          <TripleDiamond size={300} gap={20} padding={60}>
            <div className="relative flex items-center justify-center w-40 h-40">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                id="galleryInput"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const reader = new FileReader();
                  reader.onload = () => {
                    const base64 = (reader.result as string).split(",")[1];
                    onGallerySelect(base64);
                  };
                  reader.readAsDataURL(file);
                }}
              />
              <button
                onClick={() =>
                  activeChoice !== "camera" &&
                  (
                    document.getElementById("galleryInput") as HTMLInputElement
                  )?.click()
                }
                disabled={activeChoice === "camera"}
                className={`w-40 relative z-10 transition ${
                  activeChoice === "camera"
                    ? "opacity-30 cursor-not-allowed pointer-events-none"
                    : "hover:scale-105"
                }`}
              >
                <img
                  src="https://skinstric-wandag.vercel.app/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fgallery-icon.c9f2deef.png&w=256&q=75"
                  alt="Gallery"
                />
              </button>
              <span className="absolute bottom-8 -left-12 w-20 h-px bg-gray-400 -rotate-30" />
              <span className="absolute bottom-2 -left-12 w-2 h-2 border border-gray-500 rounded-full" />
              <p className="absolute -bottom-7 -left-37.5 text-xs font-semibold leading-tight text-left">
                ALLOW A.I. <br /> TO ACCESS YOUR GALLERY
              </p>
            </div>
          </TripleDiamond>
        </div>
      </div>
    </div>
  );
};

export default CameraPicker;
