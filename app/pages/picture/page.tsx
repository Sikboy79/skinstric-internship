"use client";

import React, { useRef, useState, useEffect } from "react";
import Header from "@/app/components/Header";
import DiamondArrowButton from "@/app/components/DiamondButton";
import ImagePreviewBox from "@/app/components/ImagePreview";
import { useRouter } from "next/navigation";
import { BsCamera } from "react-icons/bs";

// Modal Component
const CameraPermissionModal: React.FC<{
  isOpen: boolean;
  onAllow: () => void;
  onDeny: () => void;
}> = ({ isOpen, onAllow, onDeny }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-black bg-opacity-50 text-white pt-6 shadow-lg max-w-xs w-full text-center">
        <p className="mb-8 font-semibold">Allow A.I. to access your camera?</p>

        {/* Divider */}
        <hr className="border-gray-400 border-t mx-4 mb-4" />

        <div className="flex justify-end gap-2 px-4">
          <button
            className="px-4 py-2 text-white rounded hover:text-gray-400"
            onClick={onDeny}
          >
            Deny
          </button>
          <button
            className="px-4 py-2 text-white rounded hover:text-gray-400"
            onClick={onAllow}
          >
            Allow
          </button>
        </div>
      </div>
    </div>
  );
};

const CameraCapture: React.FC<{ onCapture?: (photo: string) => void }> = ({
  onCapture,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
      });
      setStream(mediaStream);
      setFullscreen(true);
    } catch (err: any) {
      console.error("Camera access denied or error:", err);
      alert(
        "Cannot access camera. Make sure your site is served over HTTPS and that you allowed camera access.",
      );
    }
  };

  useEffect(() => {
    if (!videoRef.current || !stream) return;
    videoRef.current.srcObject = stream;
    videoRef.current.play().catch(console.error);

    return () => {
      stream?.getTracks().forEach((track) => track.stop());
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
    const imageData = canvas.toDataURL("image/png");
    setPhoto(imageData);
    onCapture?.(imageData);
  };

  const retake = () => {
    setPhoto(null);
    startCamera();
  };
  return (
    <div className="flex items-center justify-around gap-20 relative w-full h-100">
      {/* Permission Modal */}
      <CameraPermissionModal
        isOpen={showModal}
        onAllow={() => {
          setShowModal(false);
          startCamera();
        }}
        onDeny={() => setShowModal(false)}
      />
      {/* Fullscreen Camera */}
      {fullscreen && stream && (
        <div className="fixed inset-0 z-50 bg-black">
          {/* Header */}
          <div className="absolute top-0 left-0 right-0 z-50 bg-white">
            <Header />
          </div>
          {/* -------- CAMERA OR PREVIEW -------- */}
          {!photo ? (
            <>
              {/* Live Camera */}
              <video
                ref={videoRef}
                className="absolute inset-0 w-full h-full object-cover"
                autoPlay
                playsInline
              />
              {/* Instructions */}
              <div className="absolute top-96 left-1/2 -translate-x-1/2 z-50 text-white text-center px-6">
                <p className="text-xl font-light tracking-wide mb-3">
                  TO GET BETTER RESULTS MAKE SURE TO HAVE
                </p>
                <div className="flex items-center justify-center gap-6 text-s font-light tracking-wide">
                  {[
                    "NEUTRAL EXPRESSION",
                    "FRONTAL POSE",
                    "ADEQUATE LIGHTING",
                  ].map((t) => (
                    <div key={t} className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-white rotate-45 inline-block" />
                      <span>{t}</span>
                    </div>
                  ))}
                </div>
              </div>
              {/* Capture Button */}
              <div className="absolute right-4 top-1/2 -translate-y-1/2 z-50 flex items-center gap-3">
                <span className="text-md text-white font-semibold">
                  TAKE PICTURE
                </span>

                <button
                  onClick={takePhoto}
                  className="w-20 h-20 bg-white rounded-full border-4 border-gray-300 flex items-center justify-center hover:scale-105 transition"
                >
                  <BsCamera className="text-gray-300 text-4xl" />
                </button>
              </div>
            </>
          ) : (
            <>
              {/* -------- PHOTO PREVIEW -------- */}
              <img
                src={photo}
                alt="Preview"
                className="absolute inset-0 w-full h-full object-cover"
              />

              {/* Bottom actions */}
              <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-3">
                <p className="text-white text-lg font-medium mb-64">
                  GREAT SHOT!
                </p>

                <div className="flex gap-6">
                  <button
                    onClick={retake}
                    className="px-8 py-3 border bg-white text-black font-medium hover:bg-white hover:text-black transition"
                  >
                    Retake
                  </button>

                  <button
                    onClick={() => setFullscreen(false)}
                    className="px-8 py-3 bg-black text-white font-medium hover:opacity-80 transition"
                  >
                    Use this photo
                  </button>
                </div>
              </div>
            </>
          )}
          {/* Back */}
          <div className="absolute bottom-4 left-4 z-50">
            <DiamondArrowButton
              className="text-white [&>span]:border-white [&>span]:group-hover:bg-white [&_span]:group-hover:text-black"
              direction="left"
              label="BACK"
              onClick={() => {
                setPhoto(null);
                setFullscreen(false);
                stream?.getTracks().forEach((track) => track.stop());
              }}
            />
          </div>
        </div>
      )}

      {/* Camera Circle on page */}
      {!stream && !fullscreen && (
        <div className="relative flex flex-col items-center">
          <div className="w-48 h-48 flex items-center justify-center">
            {photo ? (
              <button
                onClick={retake}
                className="w-20 h-20 bg-black text-white rounded-full flex items-center justify-center"
              >
                Retake
              </button>
            ) : (
              <button
                onClick={() => setShowModal(true)}
                className="w-40 bg-white rounded-full flex hover:scale-105 transition"
              >
                <img
                  src="https://skinstric-wandag.vercel.app/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fcamera-icon.14742046.png&w=384&q=75"
                  alt="Camera Icon"
                  className="w-80"
                />
              </button>
            )}
          </div>
          <p className="absolute -top-8 text-center text-xs font-semibold">
            ALLOW A.I. <br /> TO SCAN YOUR FACE
          </p>
        </div>
      )}
      {/* Gallery Circle */}
      <div className="relative flex flex-col items-center">
        <div className="w-48 h-48 flex items-center justify-center">
          {/* Hidden file input */}
          <input
            type="file"
            accept="image/*"
            id="galleryInput"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              const reader = new FileReader();
              reader.onload = () => {
                const imageData = reader.result as string;
                console.log("Selected image:", imageData);
                onCapture?.(imageData);
              };
              reader.readAsDataURL(file);
            }}
          />
          {/* Gallery Button */}
          <button
            onClick={() => {
              const input = document.getElementById(
                "galleryInput",
              ) as HTMLInputElement;
              input?.click();
            }}
            className="w-40 bg-white rounded-full flex hover:scale-105 transition"
          >
            <img
              src="https://skinstric-wandag.vercel.app/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fgallery-icon.c9f2deef.png&w=256&q=75"
              alt="Gallery Icon"
              className="w-80"
            />
          </button>
        </div>
        <p className="absolute -top-8 text-center text-xs font-semibold">
          ALLOW A.I. <br /> ACCESS GALLERY
        </p>
      </div>
    </div>
  );
};

const PicturePage = () => {
  const router = useRouter();
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  return (
    <main className="min-h-screen bg-white flex flex-col">
      <Header />
      <section className="flex flex-col items-start justify-between flex-1 px-8 py-8 relative gap-6">
        <p className="text-sm font-semibold mb-6 pt-15">TO START ANALYSIS</p>
        <CameraCapture onCapture={setCapturedPhoto} />
        <div className="absolute right-10 top-25">
          <ImagePreviewBox photo={capturedPhoto} />
        </div>
        <DiamondArrowButton
          direction="left"
          label="BACK"
          onClick={() => router.back()}
        />
      </section>
    </main>
  );
};

export default PicturePage;
