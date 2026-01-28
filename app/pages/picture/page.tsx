"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/app/components/Header";
import DiamondArrowButton from "@/app/components/DiamondButton";
import ImagePreviewBox from "@/app/components/ImagePreview";
import EnterCode from "@/app/components/EnterCode";
import CameraCapture from "@/app/components/CameraCapture";
import TripleDiamond from "@/app/components/TripleDiamond";
import { useResults } from "@/store/ResultsContext";

type Phase = "capture" | "analyzing" | "transitioning";

const PicturePage: React.FC = () => {
  const router = useRouter();
  const { setData } = useResults();

  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [phase, setPhase] = useState<Phase>("capture");

  const hasSentRef = useRef(false);

  useEffect(() => {
    if (!capturedPhoto || hasSentRef.current) return;
    hasSentRef.current = true;

    const runAnalysis = async () => {
      try {
        setPhase("analyzing");

        const res = await fetch("/api/phase-two", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ Image: capturedPhoto }),
        });

        const json = await res.json();
        setData(json.data);

        // allow animation to finish before routing
        setPhase("transitioning");
        setTimeout(() => {
          router.push("/pages/results");
        }, 600);
      } catch (err) {
        console.error("Network error:", err);
        setPhase("capture");
        hasSentRef.current = false;
      }
    };
    runAnalysis();
  }, [capturedPhoto, router, setData]);

  return (
    <main className="min-h-screen bg-white flex flex-col relative">
      <Header />
      <div className="hidden md:block">
        <EnterCode />
      </div>
      <section className="flex flex-col flex-1 px-8 py-8 relative gap-6">
        <p className="text-sm font-semibold">TO START ANALYSIS</p>
        <CameraCapture
          onCapture={(photo) => {
            hasSentRef.current = false;
            setCapturedPhoto(photo);
          }}
        />
        <div className="hidden lg:block absolute right-12 top-24">
          <p className="text-xs font-semibold mb-2">Preview</p>
          <ImagePreviewBox
            photo={
              capturedPhoto ? `data:image/jpeg;base64,${capturedPhoto}` : null
            }
          />
        </div>
        <div className="fixed bottom-8 left-8 z-50">
          <DiamondArrowButton
            direction="left"
            label="BACK"
            onClick={() => router.back()}
          />
        </div>
      </section>
      <div
        className={`
          fixed inset-0 z-50 flex items-center justify-center bg-white
          transition-all duration-500 ease-out
          ${
            phase === "analyzing" || phase === "transitioning"
              ? "opacity-100 scale-100"
              : "opacity-0 scale-95 pointer-events-none"
          }
        `}
      >
        <TripleDiamond size={400} gap={20} padding={60}>
          <p className="text-3xl font-semibold text-[#1a1b1c] flex items-center gap-1">
            ANALYZING PHOTO
            <span className="flex gap-0.5">
              <span className="animate-bounce">.</span>
              <span
                className="animate-bounce"
                style={{ animationDelay: "0.2s" }}
              >
                .
              </span>
              <span
                className="animate-bounce"
                style={{ animationDelay: "0.4s" }}
              >
                .
              </span>
            </span>
          </p>
        </TripleDiamond>
      </div>
    </main>
  );
};

export default PicturePage;
