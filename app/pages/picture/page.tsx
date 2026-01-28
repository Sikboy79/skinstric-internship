"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/app/components/Header";
import DiamondArrowButton from "@/app/components/DiamondButton";
import ImagePreviewBox from "@/app/components/ImagePreview";
import EnterCode from "@/app/components/EnterCode";
import { useResults } from "@/store/ResultsContext";
import CameraCapture from "@/app/components/CameraCapture";
import TripleDiamond from "@/app/components/TripleDiamond";

const PicturePage: React.FC = () => {
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
        setData(data.data);
        router.push("/pages/results");
      } catch (err) {
        console.error("Network error:", err);
      } finally {
        setLoading(false);
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

        {/* Loading overlay */}
        {loading && (
          <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white">
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
        )}
      </section>
    </main>
  );
};

export default PicturePage;
