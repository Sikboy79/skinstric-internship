"use client";

import React, { useRef, useState, useEffect } from "react";
import Header from "@/app/components/Header";
import DiamondArrowButton from "@/app/components/DiamondButton";
import ImagePreviewBox from "@/app/components/ImagePreview";
import { useRouter } from "next/navigation";
import { BsCamera } from "react-icons/bs";

/* MODAL */
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
        <hr className="border-gray-400 border-t mx-4 mb-4" />
        <div className="flex justify-end gap-2 px-4">
          <button className="px-4 py-2 hover:text-gray-400" onClick={onDeny}>
            Deny
          </button>
          <button className="px-4 py-2 hover:text-gray-400" onClick={onAllow}>
            Allow
          </button>
        </div>
      </div>
    </div>
  );
};

/* CAMERA */
const CameraCapture: React.FC<{ onCapture: (photo: string) => void }> = ({
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
    } catch (err) {
      console.error("Camera access denied or error:", err);
      alert("Cannot access camera. Make sure you allowed camera access.");
    }
  };

  useEffect(() => {
    if (!videoRef.current || !stream) return;
    videoRef.current.srcObject = stream;
    videoRef.current.play().catch(console.error);

    return () => stream?.getTracks().forEach((t) => t.stop());
  }, [stream]);

  const takePhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement("canvas");
    canvas.width = 640;
    canvas.height = 640;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const imageData = canvas.toDataURL("image/jpeg", 0.7); // keep full Data URL
    setPhoto(imageData.split(",")[1]); // store only raw Base64 internally
  };

  const confirmPhoto = () => {
    if (!photo) return;
    onCapture(photo); // trigger analysis page
    setFullscreen(false);
  };

  const retake = () => {
    setPhoto(null);
    startCamera();
  };

  return (
    <div className="flex items-center justify-around gap-20 relative w-full h-100">
      <CameraPermissionModal
        isOpen={showModal}
        onAllow={() => {
          setShowModal(false);
          startCamera();
        }}
        onDeny={() => setShowModal(false)}
      />
      {fullscreen && stream && (
        <div className="fixed inset-0 z-50 bg-black">
          <div className="absolute top-0 inset-x-0 z-50 bg-white">
            <Header />
          </div>
          {!photo ? (
            <>
              <video
                ref={videoRef}
                className="absolute inset-0 w-full h-full object-cover"
                autoPlay
                playsInline
              />
              <div className="absolute top-96 left-1/2 -translate-x-1/2 z-50 text-white text-center px-6">
                <p className="text-xl font-light mb-3">
                  TO GET BETTER RESULTS MAKE SURE TO HAVE
                </p>
                <div className="flex gap-6">
                  {[
                    "NEUTRAL EXPRESSION",
                    "FRONTAL POSE",
                    "ADEQUATE LIGHTING",
                  ].map((t) => (
                    <div key={t} className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-white rotate-45" />
                      <span>{t}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 z-50 flex items-center gap-3">
                <span className="text-white font-semibold">TAKE PICTURE</span>
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
              <img
                src={`data:image/jpeg;base64,${photo}`}
                alt="Preview"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-3">
                <p className="text-white text-lg font-medium mb-64">
                  GREAT SHOT!
                </p>
                <div className="flex gap-6">
                  <button
                    onClick={retake}
                    className="px-8 py-3 bg-white border text-black"
                  >
                    Retake
                  </button>
                  <button
                    onClick={confirmPhoto}
                    className="px-8 py-3 bg-black text-white"
                  >
                    Use this photo
                  </button>
                </div>
              </div>
            </>
          )}
          <div className="absolute bottom-4 left-4 z-50">
            <DiamondArrowButton
              direction="left"
              label="BACK"
              onClick={() => setFullscreen(false)}
            />
          </div>
        </div>
      )}

      {!fullscreen && (
        <>
          {/* Camera */}
          <div className="relative flex flex-col items-center">
            <button
              onClick={() => setShowModal(true)}
              className="w-40 hover:scale-105 transition"
            >
              <img
                src="https://skinstric-wandag.vercel.app/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fcamera-icon.14742046.png&w=384&q=75"
                alt="Camera"
              />
            </button>
            <p className="absolute -top-8 text-xs font-semibold text-center">
              ALLOW A.I. <br /> TO SCAN YOUR FACE
            </p>
          </div>

          {/* Gallery */}
          <div className="relative flex flex-col items-center">
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
                  onCapture(base64);
                };
                reader.readAsDataURL(file);
              }}
            />
            <button
              onClick={() =>
                (
                  document.getElementById("galleryInput") as HTMLInputElement
                )?.click()
              }
              className="w-40 hover:scale-105 transition"
            >
              <img
                src="https://skinstric-wandag.vercel.app/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fgallery-icon.c9f2deef.png&w=256&q=75"
                alt="Gallery"
              />
            </button>
            <p className="absolute -top-8 text-xs font-semibold text-center">
              ALLOW A.I. <br /> ACCESS GALLERY
            </p>
          </div>
        </>
      )}
    </div>
  );
};

const PicturePage = () => {
  const router = useRouter();
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const hasSentRef = useRef(false);

  useEffect(() => {
    if (!capturedPhoto || hasSentRef.current) return;
    hasSentRef.current = true;

    const runAnalysis = async () => {
      try {
        setLoading(true);
        // Send only raw Base64 string (no prefix)
        const payload = capturedPhoto;
        const res = await fetch("/api/phase-two", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ Image: payload }),
        });
        const data = await res.json();
        console.log("Phase Two result:", data);
      } catch (err) {
        console.error("Network error:", err);
      } finally {
        setLoading(false);
      }
    };
    runAnalysis();
  }, [capturedPhoto]);

  return (
    <main className="min-h-screen bg-white flex flex-col">
      <Header />
      <section className="flex flex-col flex-1 px-8 py-8 relative gap-6">
        <p className="text-sm font-semibold">TO START ANALYSIS</p>
        <CameraCapture
          onCapture={(photo) => {
            hasSentRef.current = false;
            setCapturedPhoto(photo);
          }}
        />
        <div className="absolute right-15 top-25">
          <ImagePreviewBox
            photo={
              capturedPhoto ? `data:image/jpeg;base64,${capturedPhoto}` : null
            }
          />
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
