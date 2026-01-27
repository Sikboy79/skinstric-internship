"use client";

import React, { useRef, useEffect } from "react";
import Header from "@/app/components/Header";
import { BsCamera } from "react-icons/bs";

interface Props {
  stream: MediaStream;
  photo: string | null;
  onTakePhoto: (photoBase64: string) => void; // returns photo directly
  onRetake: () => void;
  onConfirm: () => void;
  onClose: () => void;
}

const CameraFullscreen: React.FC<Props> = ({
  stream,
  photo,
  onTakePhoto,
  onRetake,
  onConfirm,
  onClose,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  // Start the video stream
  useEffect(() => {
    if (!videoRef.current) return;
    videoRef.current.srcObject = stream;
    videoRef.current.play().catch(console.error);
  }, [stream]);

  const handleTakePhoto = () => {
    if (!videoRef.current) return;

    const video = videoRef.current;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const photoBase64 = canvas.toDataURL("image/jpeg").split(",")[1];

    onTakePhoto(photoBase64);
  };

  const handleRetake = () => {
    onRetake();
    if (videoRef.current) videoRef.current.play().catch(console.error);
  };

  return (
    <div className="fixed inset-0 z-40 bg-black">
      <div className="absolute top-0 inset-x-0 z-50 bg-white">
        <Header />
      </div>
      {/* Camera Video */}
      <video
        ref={videoRef}
        className={`absolute inset-0 w-full h-full object-cover ${photo ? "hidden" : ""}`}
        autoPlay
        playsInline
      />
      {!photo && (
        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center z-50">
          <div className="mb-6 text-white">
            <p className="text-lg md:text-xl font-light mb-3">
              TO GET BETTER RESULTS, MAKE SURE TO HAVE:
            </p>
            <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
              {["NEUTRAL EXPRESSION", "FRONTAL POSE", "ADEQUATE LIGHTING"].map((t) => (
                <div key={t} className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-white rotate-45" />
                  <span className="text-sm md:text-base">{t}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      {!photo && (
        <div className="absolute right-4 top-1/2 -translate-y-1/2 z-50">
          <button
            onClick={handleTakePhoto}
            className="w-16 h-16 md:w-20 md:h-20 bg-white rounded-full border-4 border-gray-300 flex items-center justify-center hover:scale-105 transition"
          >
            <BsCamera className="text-gray-300 text-2xl md:text-4xl" />
          </button>
        </div>
      )}
      {/* Photo Preview & Action Buttons */}
      {photo && (
        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 z-50">
          <img
            src={`data:image/jpeg;base64,${photo}`}
            alt="Preview"
            className="w-full h-full object-cover absolute inset-0"
          />
          <div className="relative flex flex-col items-center gap-4 z-50">
            <p className="text-white text-lg md:text-xl font-medium">GREAT SHOT!</p>
            <div className="flex gap-4 md:gap-6 flex-wrap justify-center">
              <button
                onClick={handleRetake}
                className="px-6 md:px-8 py-3 bg-white border text-black rounded-md"
              >
                Retake
              </button>
              <button
                onClick={onConfirm}
                className="px-6 md:px-8 py-3 bg-black text-white rounded-md"
              >
                Use this photo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CameraFullscreen;