"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/app/components/Header";
import DiamondArrowButton from "@/app/components/DiamondButton";
import TripleDiamond from "@/app/components/TripleDiamond";
import EnterCode from "@/app/components/EnterCode";

type Status = "name" | "location" | "loading" | "success";

export default function StartTestPage() {
  const router = useRouter();

  const [status, setStatus] = useState<Status>("name");
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");

  const locationInputRef = useRef<HTMLInputElement>(null);

  const sanitizeInput = (v: string) => v.replace(/[^a-zA-Z ]/g, "");

  /* SUBMIT */
  const submitToServer = async () => {
    try {
      setStatus("loading");

      // UX guarantee — loading always visible
      await new Promise((r) => setTimeout(r, 600));

      const res = await fetch("/api/skinstric", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), location: location.trim() }),
      });

      if (!res.ok) throw new Error("Server error");

      const data = await res.json();
      sessionStorage.setItem("skinstricData", JSON.stringify(data));

      setStatus("success");
    } catch (err) {
      console.error(err);
      setStatus("location");
    }
  };

  /* KEY HANDLERS */
  const handleNameEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && name.trim()) {
      setStatus("location");
      setTimeout(() => locationInputRef.current?.focus(), 50);
    }
  };

  const handleLocationEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && location.trim()) {
      submitToServer();
    }
  };

  return (
    <main className="relative min-h-screen bg-white flex flex-col">
      <Header />
      <div className="hidden md:block">
        <EnterCode />
      </div>
      <section className="flex-1 flex flex-col justify-center items-center px-6">
        <div className="text-center space-y-6 mt-28">
          {/* NAME */}
          {status === "name" && (
            <TripleDiamond size={300} gap={20} color="#d1d5db">
              <div>
                <p className="text-sm text-gray-400 mb-2">CLICK TO TYPE</p>
                <input
                  type="text"
                  placeholder="Introduce Yourself"
                  value={name}
                  onChange={(e) => setName(sanitizeInput(e.target.value))}
                  onKeyDown={handleNameEnter}
                  className="border-b-2 border-gray-400 text-4xl md:text-6xl font-light text-gray-700 text-center focus:outline-none focus:border-black max-w-xl placeholder-gray-400"
                />
              </div>
            </TripleDiamond>
          )}

          {/* LOCATION */}
          {status === "location" && (
            <TripleDiamond size={300} gap={20} color="#d1d5db">
              <div>
                <p className="text-sm text-gray-400 mb-2">
                  Where are you from?
                </p>
                <input
                  ref={locationInputRef}
                  type="text"
                  placeholder="Your city name"
                  value={location}
                  onChange={(e) => setLocation(sanitizeInput(e.target.value))}
                  onKeyDown={handleLocationEnter}
                  className="border-b-2 border-gray-400 text-4xl md:text-6xl font-light text-gray-700 text-center w-full max-w-xl focus:outline-none focus:border-black placeholder-gray-400"
                />
              </div>
            </TripleDiamond>
          )}
          {/* LOADING */}
          {status === "loading" && (
            <div className="mb-10 text-gray-700 flex items-end gap-1">
              <span className="text-4xl md:text-5xl font-medium text-gray-700">
                Processing submission
              </span>
              <span className="flex gap-1 ml-1">
                <span className="w-2 h-2 bg-[#1a1b1c] rounded-full animate-bounce [animation-delay:0ms]" />
                <span className="w-2 h-2 bg-[#1a1b1c] rounded-full animate-bounce [animation-delay:150ms]" />
                <span className="w-2 h-2 bg-[#1a1b1c] rounded-full animate-bounce [animation-delay:300ms]" />
              </span>
            </div>
          )}
          {/* SUCCESS */}
          {status === "success" && (
            <div className="relative flex w-96 h-96 justify-center -top-30">
              <TripleDiamond size={350} gap={25} padding={60}>
                <div className="space-y-4">
                  <p className="text-4xl md:text-6xl font-light text-gray-700">
                    Thank you, {name.trim()}!
                  </p>
                  <p className="text-xl text-gray-500">
                    Proceed to the next step
                  </p>
                </div>
              </TripleDiamond>
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
      {status === "success" && (
        <div className="absolute bottom-10 right-6">
          <DiamondArrowButton
            direction="right"
            label="PROCEED"
            onClick={() => router.push("/pages/picture")}
          />
        </div>
      )}
    </main>
  );
}
