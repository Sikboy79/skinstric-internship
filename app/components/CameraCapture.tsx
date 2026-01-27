"use client";
import React, { useState, useEffect } from "react";
import CameraPermissionModal from "./CameraPermissionModal";
import CameraLoading from "./CameraLoading";
import CameraFullscreen from "./CameraFullscreen";
import CameraPicker from "./CameraPicker";

interface Props {
  onCapture: (photo: string) => void;
}

const CameraCapture: React.FC<Props> = ({ onCapture }) => {
  const [photo, setPhoto] = useState<string | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [loadingCamera, setLoadingCamera] = useState(false);
  const [activeChoice, setActiveChoice] = useState<"camera" | "gallery" | null>(
    null,
  );

  const handleAllow = async () => {
    setShowModal(false);
    setLoadingCamera(true);

    const startTime = Date.now();
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
      });
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(1500 - elapsed, 0);
      setTimeout(() => {
        setStream(mediaStream);
        setFullscreen(true);
        setLoadingCamera(false);
      }, remaining);
    } catch (err) {
      console.error(err);
      alert("Cannot access camera. Make sure you allowed camera access.");
      setLoadingCamera(false);
    }
  };

  return (
    <>
      <CameraPermissionModal
        isOpen={showModal}
        onAllow={handleAllow}
        onDeny={() => setShowModal(false)}
      />
      {loadingCamera && <CameraLoading />}
      {fullscreen && stream && (
  <CameraFullscreen
    stream={stream}
    photo={photo}
    // onTakePhoto now just receives the photo string
    onTakePhoto={(photoBase64) => setPhoto(photoBase64)}
    onRetake={() => setPhoto(null)}
    onConfirm={() => {
      if (photo) onCapture(photo);
      setFullscreen(false);
    }}
    onClose={() => setFullscreen(false)}
  />
)}

{!fullscreen && !loadingCamera && (
  <CameraPicker
    activeChoice={activeChoice}
    onCameraClick={() => {
      setActiveChoice("camera");
      setShowModal(true);
    }}
    onGallerySelect={(base64) => onCapture(base64)}
  />
)}
    </>
  );
};

export default CameraCapture;


