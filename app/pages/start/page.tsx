"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/app/components/Header";
import DiamondArrowButton from "@/app/components/DiamondButton";

export default function StartTestPage() {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [delayedName, setDelayedName] = useState("");
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const locationInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const submitToServer = async (submitName: string, submitLocation: string) => {
    try {
      setIsLoading(true);
      setHasSubmitted(false);

      const res = await fetch("/api/skinstric", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: submitName, location: submitLocation }),
      });

      if (!res.ok) throw new Error("Server API failed");

      const data = await res.json();

      console.log("Full API Response:", data);
      console.log(`SUCCESS: Added ${submitName} from ${submitLocation}`);

      sessionStorage.setItem("skinstricData", JSON.stringify(data));

      setHasSubmitted(true);
    } catch (error) {
      console.error("API call failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPressName = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && name.trim()) {
      const trimmedName = name.trim();
      setDelayedName(trimmedName);
      setTimeout(() => {
        locationInputRef.current?.focus();
      }, 50);
    }
  };

  const handleKeyPressLocation = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && location.trim()) {
      submitToServer(delayedName, location.trim());
    }
  };

  const handleNext = () => {
    if (hasSubmitted) router.push("/pages/picture");
  };

  return (
    <main className="relative min-h-screen bg-white overflow-hidden flex flex-col">
      <Header />

      <section className="flex-1 flex flex-col justify-center items-center px-6">
        <div className="text-center space-y-6">
          {/* NAME INPUT */}
          {!delayedName && (
            <div>
              <p className="text-sm text-gray-400 mb-2">CLICK TO TYPE</p>
              <input
                type="text"
                placeholder="Introduce Yourself"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={handleKeyPressName}
                className="border-b-2 border-gray-400 text-4xl md:text-6xl font-light text-gray-700 text-center focus:outline-none focus:border-black w-full max-w-xl placeholder-gray-400"
              />
            </div>
          )}

          {/* LOCATION INPUT */}
          {delayedName && !isLoading && !hasSubmitted && (
            <div>
              <p className="text-sm text-gray-400 mb-2">Where are you from?</p>
              <input
                ref={locationInputRef}
                type="text"
                placeholder="Enter City"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                onKeyDown={handleKeyPressLocation}
                className="border-b-2 border-gray-400 text-4xl md:text-6xl font-light text-gray-700 text-center focus:outline-none focus:border-black w-full max-w-xl placeholder-gray-400"
              />
            </div>
          )}

          {/* LOADING */}
          {isLoading && (
            <p
              className="
                text-4xl md:text-5xl font-medium
                text-transparent bg-clip-text
                bg-linear-to-r from-gray-300 via-gray-400 to-gray-300
                bg-size-[200%_100%]
                animate-pulse
              "
            >
              ... Processing submission
            </p>
          )}

          {/* SUCCESS */}
          {hasSubmitted && !isLoading && (
            <div className="space-y-4">
              <p className="text-4xl md:text-6xl font-light text-gray-700">
                Thank you, {delayedName}!
              </p>
              <p className="text-xl text-gray-500">Proceed to the next step</p>
            </div>
          )}
        </div>
      </section>

      {/* BACK */}
      <div className="absolute bottom-10 left-6">
        <DiamondArrowButton
          direction="left"
          label="BACK"
          onClick={() => router.back()}
        />
      </div>

      {/* PROCEED */}
      {hasSubmitted && (
        <div className="absolute bottom-10 right-6">
          <DiamondArrowButton
            direction="right"
            label="PROCEED"
            onClick={handleNext}
          />
        </div>
      )}
    </main>
  );
}
