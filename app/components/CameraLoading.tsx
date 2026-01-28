"use client";
import React from "react";
import TripleDiamond from "@/app/components/TripleDiamond";

const CameraLoading = () => (
  <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white">
    <TripleDiamond size={250} gap={25} padding={60}>
      <div className="flex items-center justify-center w-24 h-24">
        <img
          src="https://skinstric-wandag.vercel.app/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fcamera-icon.14742046.png&w=384&q=75"
          alt="Camera"
        />
      </div>
    </TripleDiamond>
    <p className="mt-8  text-lg font-semibold">SETTING UP CAMERA ...</p>
    <div className="mt-4  text-xs text-center flex gap-2">
      <span>◇ NEUTRAL EXPRESSION</span>
      <span>◇ FRONTAL POSE</span>
      <span>◇ ADEQUATE LIGHTING</span>
    </div>
  </div>
);

export default CameraLoading;
