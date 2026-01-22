"use client";

import React, { useRef, useState, useEffect } from "react";

interface CameraCaptureProps {
  onCapture?: (dataUrl: string) => void; // optional callback to pass photo
}

const CameraCapture: React.FC<CameraCaptureProps> = ({ onCapture }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [photo, setPhoto] = useState<string | null>(null);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
      setStream(mediaStream);
    } catch (err) {
      console.error("Camera error:", err);
    }
  };

  useEffect(() => {
    if (!videoRef.current || !stream) return;
    const videoEl = videoRef.current;
    videoEl.srcObject = stream;
    videoEl.play().catch(console.error);

    return () => {
      stream.getTracks().forEach((track) => track.stop());
    };
  }, [stream]);

  const takePhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
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
    <div className="flex flex-col items-center gap-8 w-full">
      <div className="relative w-80 h-80 rounded-full overflow-hidden border-4 border-gray-300">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className={`w-full h-full object-cover rounded-full ${photo ? "hidden" : ""}`}
        />
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
          {!photo ? (
            stream && (
              <button
                onClick={takePhoto}
                className="bg-black w-16 h-16 rounded-full border-4 border-white"
              />
            )
          ) : (
            <button
              onClick={retake}
              className="bg-black px-4 py-2 rounded text-white"
            >
              Retake
            </button>
          )}
        </div>
      </div>
      {!stream && !photo && (
        <button
          onClick={startCamera}
          className="bg-black text-white px-6 py-3 rounded-full"
        >
          START CAMERA
        </button>
      )}
    </div>
  );
};

export default CameraCapture;
