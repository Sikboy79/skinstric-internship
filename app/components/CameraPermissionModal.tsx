"use client";
import React from "react";

interface Props {
  isOpen: boolean;
  onAllow: () => void;
  onDeny: () => void;
}

const CameraPermissionModal: React.FC<Props> = ({ isOpen, onAllow, onDeny }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-55">
      <div className="bg-black/40 text-white pt-6 shadow-lg max-w-xs w-full text-center">
        <p className="mb-8 font-semibold">Allow A.I. to access your camera?</p>
        <hr className="border-white/40 border-t mx-4 mb-4" />
        <div className="flex justify-end gap-2 px-4">
          <button className="px-4 py-2 hover:text-white/70" onClick={onDeny}>Deny</button>
          <button className="px-4 py-2 hover:text-white/70" onClick={onAllow}>Allow</button>
        </div>
      </div>
    </div>
  );
};

export default CameraPermissionModal;
