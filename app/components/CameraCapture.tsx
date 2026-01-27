"use client";

import React, { useRef, useState, useEffect } from "react";
import { BsCamera } from "react-icons/bs";

interface CameraCaptureProps {
  onCapture?: (dataUrl: string) => void;
}

const CameraCapture: React.FC<CameraCaptureProps> = ({ onCapture }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const [loadingCamera, setLoadingCamera] = useState(false);

  // Start camera with loading screen
  const startCamera = async () => {
    setLoadingCamera(true);

    const minLoadingTime = 1500; // show loading for at least 1.5s
    const startTime = Date.now();

    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
      });
      setStream(mediaStream);

      // Ensure loading screen stays visible for minLoadingTime
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(minLoadingTime - elapsed, 0);
      setTimeout(() => {
        setLoadingCamera(false);
      }, remaining);
    } catch (err) {
      console.error("Camera error:", err);
      alert("Cannot access camera. Make sure you allowed camera access.");
      setLoadingCamera(false);
    }
  };

  // Attach stream to video element
  useEffect(() => {
    if (!videoRef.current || !stream) return;
    const video = videoRef.current;
    video.srcObject = stream;
    video.play().catch(console.error);

    return () => stream?.getTracks().forEach((track) => track.stop());
  }, [stream]);

  // Capture a square photo from video
  const takePhoto = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;

    // Square crop: center of video
    const size = Math.min(video.videoWidth, video.videoHeight);
    const canvas = document.createElement("canvas");
    canvas.width = 640;
    canvas.height = 640;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const sx = (video.videoWidth - size) / 2;
    const sy = (video.videoHeight - size) / 2;

    ctx.drawImage(video, sx, sy, size, size, 0, 0, canvas.width, canvas.height);

    const dataUrl = canvas.toDataURL("image/png");
    setPhoto(dataUrl);
    if (onCapture) onCapture(dataUrl);

    // Stop camera after capture
    stream?.getTracks().forEach((track) => track.stop());
    setStream(null);
  };

  const retake = () => {
    setPhoto(null);
    startCamera();
  };

  return (
    <div className="flex flex-col items-center gap-8 w-full relative">
      {/* Loading Overlay */}
      {loadingCamera && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white transition-opacity">
          <div className="w-24 h-24 flex items-center justify-center border-4 border-gray-300 rounded-full">
            <BsCamera className="text-2xl text-gray-900" />
          </div>
          <p className="mt-4 font-semibold">SETTING UP CAMERA...</p>
        </div>
      )}

      {/* Video or captured photo */}
      <div className="relative w-80 h-80 rounded-full overflow-hidden border-4 border-gray-300">
        {photo ? (
          <img
            src={photo}
            alt="Captured"
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className={`absolute inset-0 w-full h-full object-cover ${
              loadingCamera ? "hidden" : ""
            }`}
          />
        )}

        {/* Capture / Retake button */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
          {!photo && stream && !loadingCamera && (
            <button
              onClick={takePhoto}
              className="bg-[#1a1b1c] w-16 h-16 rounded-full border-4 border-white hover:scale-105 transition"
            >
              <BsCamera className="text-white text-2xl" />
            </button>
          )}
          {photo && (
            <button
              onClick={retake}
              className="bg-[#1a1b1c] px-4 py-2 rounded text-white hover:scale-105 transition"
            >
              Retake
            </button>
          )}
        </div>
      </div>

      {/* Start Camera button */}
      {!stream && !photo && !loadingCamera && (
        <button
          onClick={startCamera}
          className="bg-[#1a1b1c] text-white px-6 py-3 rounded-full hover:scale-105 transition"
        >
          START CAMERA
        </button>
      )}
    </div>
  );
};

export default CameraCapture;
