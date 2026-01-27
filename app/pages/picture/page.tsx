"use client";

import React, { useRef, useState, useEffect } from "react";
import Header from "@/app/components/Header";
import DiamondArrowButton from "@/app/components/DiamondButton";
import ImagePreviewBox from "@/app/components/ImagePreview";
import { useRouter } from "next/navigation";
import { BsCamera } from "react-icons/bs";
import { useResults } from "@/store/ResultsContext";
import TripleDiamond from "@/app/components/TripleDiamond";
import EnterCode from "@/app/components/EnterCode";

/* MODAL */
const CameraPermissionModal: React.FC<{
  isOpen: boolean;
  onAllow: () => void;
  onDeny: () => void;
}> = ({ isOpen, onAllow, onDeny }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-black/60 text-white pt-6 shadow-lg max-w-xs w-full text-center">
        <p className="mb-8 font-semibold">Allow A.I. to access your camera?</p>

        <hr className="border-white/40 border-t mx-4 mb-4" />

        <div className="flex justify-end gap-2 px-4">
          <button className="px-4 py-2 hover:text-white/70" onClick={onDeny}>
            Deny
          </button>
          <button className="px-4 py-2 hover:text-white/70" onClick={onAllow}>
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
  const [loadingCamera, setLoadingCamera] = useState(false);

  const handleAllow = () => {
    setShowModal(false);
    setLoadingCamera(true);

    const minLoadingTime = 1500;
    const startTime = Date.now();

    startCamera().then(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(minLoadingTime - elapsed, 0);

      setTimeout(() => {
        setLoadingCamera(false);
        setFullscreen(true);
        startCamera();
      }, remaining);
    });
  };

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
      });
      setStream(mediaStream);
    } catch (err) {
      console.error("Camera access denied or error:", err);
      alert("Cannot access camera. Make sure you allowed camera access.");
      setLoadingCamera(false);
    }
  };
  useEffect(() => {
    if (!videoRef.current || !stream) return;
    videoRef.current.srcObject = stream;
    videoRef.current.play().catch(console.error);

    return () => stream?.getTracks().forEach((t) => t.stop());
  }, [stream]);
  const takePhoto = () => {
    const video = videoRef.current;
    if (!video) return;

    const canvas = document.createElement("canvas");

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(video, 0, 0);
    const imageData = canvas.toDataURL("image/jpeg", 0.9);
    setPhoto(imageData.split(",")[1]);
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
        onAllow={handleAllow}
        onDeny={() => setShowModal(false)}
      />
      {loadingCamera && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white">
          <TripleDiamond size={250} gap={25} padding={60}>
            <div className="flex items-center justify-center w-24 h-24">
              <img
                src="https://skinstric-wandag.vercel.app/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fcamera-icon.14742046.png&w=384&q=75"
                alt="Camera"
              />
            </div>
          </TripleDiamond>
          <p className="mt-8 text-lg font-semibold">SETTING UP CAMERA ...</p>
          <div className="mt-4 text-xs text-center flex gap-2">
            <span>◇ NEUTRAL EXPRESSION</span>
            <span>◇ FRONTAL POSE</span>
            <span>◇ ADEQUATE LIGHTING</span>
          </div>
        </div>
      )}

      {fullscreen && stream && (
        <div className="fixed inset-0 z-50 bg-black">
          {/* Header */}
          <div className="absolute top-0 inset-x-0 z-50 bg-white">
            <Header />
          </div>

          {!photo ? (
            <>
              {/* Video */}
              <video
                ref={videoRef}
                className="absolute inset-0 w-full h-full object-cover"
                autoPlay
                playsInline
              />

              {/* Instructions */}
              <div
                className="
                  absolute z-50 text-white text-center px-6
                  bottom-28 left-1/2 -translate-x-1/2
                  md:top-96 md:bottom-auto
                "
              >
                <p className="text-base md:text-xl font-light mb-3">
                  TO GET BETTER RESULTS MAKE SURE TO HAVE
                </p>

                <div className="flex flex-col md:flex-row gap-3 md:gap-6 items-center justify-center">
                  {[
                    "◇ NEUTRAL EXPRESSION",
                    "◇ FRONTAL POSE",
                    "◇ ADEQUATE LIGHTING",
                  ].map((t) => (
                    <div key={t} className="flex items-center gap-2">
                      <span className="text-xs md:text-sm">{t}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Capture button */}
              <div
                className="
                  absolute z-50 flex items-center gap-3
                  bottom-6 left-1/2 -translate-x-1/2
                  md:right-4 md:top-1/2 md:-translate-y-1/2 md:left-auto md:translate-x-0
                "
              >
                <span className="hidden md:block text-white font-semibold">
                  TAKE PICTURE
                </span>

                <button
                  onClick={takePhoto}
                  className="
                    w-16 h-16 md:w-20 md:h-20
                    bg-white rounded-full border-4 border-gray-300
                    flex items-center justify-center
                    hover:scale-105 transition
                  "
                >
                  <BsCamera className="text-gray-300 text-2xl md:text-4xl" />
                </button>
              </div>
            </>
          ) : (
            <>
              {/* Photo preview */}
              <img
                src={`data:image/jpeg;base64,${photo}`}
                alt="Preview"
                className="absolute inset-0 w-full h-full object-cover"
              />

              {/* Confirm actions */}
              <div
                className="
                  absolute z-50 flex flex-col items-center gap-4
                  bottom-8 left-1/2 -translate-x-1/2
                  md:bottom-10
                "
              >
                <p className="text-white text-base md:text-lg font-medium md:mb-64">
                  GREAT SHOT!
                </p>

                <div className="flex gap-4 md:gap-6">
                  <button
                    onClick={retake}
                    className="px-6 md:px-8 py-3 bg-white border text-black"
                  >
                    Retake
                  </button>
                  <button
                    onClick={confirmPhoto}
                    className="px-6 md:px-8 py-3 bg-black text-white"
                  >
                    Use this photo
                  </button>
                </div>
              </div>
            </>
          )}

          {/* Back button */}
          <div className="absolute bottom-4 left-4 z-50 text-white">
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
          <TripleDiamond>
            <div className="relative flex items-center justify-center w-40 h-40">
              {/* Button */}
              <button
                onClick={() => setShowModal(true)}
                className="w-40 hover:scale-105 transition relative z-10"
              >
                <img
                  src="https://skinstric-wandag.vercel.app/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fcamera-icon.14742046.png&w=384&q=75"
                  alt="Camera"
                />
              </button>

              {/* Pointer line */}
              <span className="absolute top-8 -right-11 w-23 h-px bg-gray-400 rotate-[-29deg]" />

              {/* Dot */}
              <span className="absolute top-1 -right-11 w-2 h-2 border border-gray-500 rounded-full" />

              {/* Text */}
              <p className="absolute -top-6 -right-46 text-xs font-semibold leading-tight text-left">
                ALLOW A.I.
                <br />
                TO SCAN YOUR FACE
              </p>
            </div>
          </TripleDiamond>

          {/* Gallery */}
          <TripleDiamond>
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
                    onCapture(base64);
                  };
                  reader.readAsDataURL(file);
                }}
              />

              {/* Button */}
              <button
                onClick={() =>
                  (
                    document.getElementById("galleryInput") as HTMLInputElement
                  )?.click()
                }
                className="w-40 hover:scale-105 transition relative z-10"
              >
                <img
                  src="https://skinstric-wandag.vercel.app/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fgallery-icon.c9f2deef.png&w=256&q=75"
                  alt="Gallery"
                />
              </button>

              {/* Pointer line */}
              <span className="absolute bottom-8 -left-12 w-18 h-px bg-gray-400 -rotate-30" />

              {/* Dot */}
              <span className="absolute bottom-2 -left-13 w-2 h-2 border border-gray-500 rounded-full" />

              {/* Text */}
              <p className="absolute -bottom-7 -left-37.5 text-xs font-semibold leading-tight text-left">
                ALLOW A.I.
                <br />
                TO ACCESS YOUR GALLERY
              </p>
            </div>
          </TripleDiamond>
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
  const { setData } = useResults();

  useEffect(() => {
    if (!capturedPhoto || hasSentRef.current) return;
    hasSentRef.current = true;

    const runAnalysis = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/phase-two", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ Image: capturedPhoto }),
        });
        const data = await res.json();
        console.log("Phase Two result:", data);

        setData(data.data);
        router.push("/pages/results");
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
      <EnterCode />
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
        <div className="absolute left-10 bottom-10">
          <DiamondArrowButton
            direction="left"
            label="BACK"
            onClick={() => router.back()}
          />
        </div>
      </section>
    </main>
  );
};

export default PicturePage;
