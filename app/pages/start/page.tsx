"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/app/components/Header";
import DiagonalLines from "@/app/components/DiagonalLines";
import { IoIosPlay } from "react-icons/io";

export default function StartTestPage() {
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [delayedName, setDelayedName] = useState("");
  const [delayedCity, setDelayedCity] = useState("");
  const [showThankYou, setShowThankYou] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handler = setTimeout(() => {
      setDelayedName(name.trim());
    }, 1000);

    return () => clearTimeout(handler);
  }, [name]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDelayedCity(city.trim());
    }, 1000);

    return () => clearTimeout(handler);
  }, [city]);

  const handleNext = () => {
    if (name.trim() !== "" && city.trim() !== "") {
      router.push("/pages/analysis"); 
    }
  };

  return (
    <main className="relative min-h-screen bg-white overflow-hidden flex flex-col">
      <Header />
      <DiagonalLines />

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
                className="border-b-2 border-gray-400 text-4xl md:text-6xl font-light text-gray-700 text-center focus:outline-none focus:border-black w-full max-w-xl placeholder-gray-400"
              />
            </div>
          )}

          {/* City input */}
          {delayedName !== "" && delayedCity === "" && (
            <div>
              <p className="text-sm text-gray-400 mb-2">WHERE ARE YOU FROM?</p>
              <input
                type="text"
                placeholder="Enter City"
                value={city}
                onChange={(e) => {
                  setCity(e.target.value);
                  setShowThankYou(true);
                }}
                className="border-b-2 border-gray-400 text-4xl md:text-6xl font-light text-gray-700 text-center focus:outline-none focus:border-black w-full max-w-xl placeholder-gray-400"
              />
            </div>
          )}

          {showThankYou && (
            <div className="space-y-4">
              <p className="text-4xl md:text-6xl font-light text-gray-700">
                Thank you, {delayedName}!
              </p>
              <p className="text-xl text-gray-500">Proceed to the next step</p>
            </div>
          )}
        </div>
      </section>

      {/* Bottom-left back button */}
      <div
        className="absolute bottom-6 left-6 flex items-center cursor-pointer"
        onClick={() => router.back()}
      >
        <div className="w-10 h-10 border border-black rotate-45 flex items-center justify-center mr-2">
          <IoIosPlay className="rotate-13" />
        </div>
        <span className="text-sm font-semibold pl-4">BACK</span>
      </div>

      {/* Bottom-right PROCEED button */}
      <div className="absolute bottom-6 right-6">
        <button
          onClick={handleNext}
          disabled={delayedName.trim() === "" || delayedCity.trim() === ""}
          className={`px-6 py-3 rounded font-semibold ${
            delayedName.trim() !== "" && delayedCity.trim() !== ""
              ? "bg-black text-white cursor-pointer"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          PROCEED
        </button>
      </div>
    </main>
  );
}
