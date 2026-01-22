"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/app/components/Header";
import { IoIosPlay } from "react-icons/io";
import DiamondButton from "@/app/components/DiamondButton";

export default function StartTestPage() {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [delayedName, setDelayedName] = useState("");
  const [delayedLocation, setDelayedLocation] = useState("");
  const [showThankYou, setShowThankYou] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const router = useRouter();

  const submitToServer = async (submitName: string, submitLocation: string) => {
    try {
      setHasSubmitted(true);
      const payload = { name: submitName, location: submitLocation };
      const res = await fetch("/api/skinstric", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Server API failed");

      const data = await res.json();

      // console logs
      console.log("Full API Response:", data);
      if (data.message) console.log("Success Message:", data.message);
      console.log(`SUCCESS: Added ${submitName} from ${submitLocation}`);

      // persist for next page
      sessionStorage.setItem("skinstricData", JSON.stringify(data));
    } catch (error) {
      console.error("API call failed:", error);
      setHasSubmitted(false);
    }
  };

  const handleNext = () => {
    if (hasSubmitted) router.push("/pages/picture");
  };

  // handle Enter key press
  const handleKeyPressName = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && name.trim() !== "") {
      const trimmedName = name.trim();
      setDelayedName(trimmedName);
    }
  };

  const handleKeyPressLocation = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && location.trim() !== "") {
      const trimmedLocation = location.trim();
      setDelayedLocation(trimmedLocation);
      setShowThankYou(true);
      submitToServer(delayedName, trimmedLocation);
    }
  };

  return (
    <main className="relative min-h-screen bg-white overflow-hidden flex flex-col">
  <Header />

  <section className="flex-1 flex flex-col justify-center items-center px-6">
    <div className="text-center space-y-6">
      {/* Name input */}
      {delayedName === "" && (
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

      {/* Location input */}
      {delayedName !== "" && delayedLocation === "" && (
        <div>
          <p className="text-sm text-gray-400 mb-2">Where are you from?</p>
          <input
            type="text"
            placeholder="Enter City"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            onKeyDown={handleKeyPressLocation}
            className="border-b-2 border-gray-400 text-4xl md:text-6xl font-light text-gray-700 text-center focus:outline-none focus:border-black w-full max-w-xl placeholder-gray-400"
          />
        </div>
      )}

      {/* Thank you message */}
      {showThankYou && (
        <div className="space-y-4">
          <p className="text-4xl md:text-6xl font-light text-gray-700">
            Thank you, {delayedName}!
          </p>
          <p className="text-xl text-gray-500">
            {hasSubmitted ? "Proceed to the next step" : "Submitting..."}
          </p>
        </div>
      )}
    </div>
  </section>
  <div
    className="absolute bottom-6 left-6 flex items-center cursor-pointer"
    onClick={() => router.back()}
  >
    <div className="w-10 h-10 border border-black rotate-45 flex items-center justify-center mr-2">
      <IoIosPlay className="rotate-13" />
    </div>
    <span className="text-sm font-semibold pl-4">BACK</span>
  </div>

  {/* Proceed button - only show after successful API submission */}
  {hasSubmitted && (
    <div className="absolute bottom-6 right-6">
      <div className="mt-8 xl:hidden">
        <DiamondButton label="PROCEED" onClick={handleNext} />
      </div>
    </div>
  )}
</main>
  );
}
