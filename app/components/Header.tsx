"use client";

export default function Header() {
  return (
    <header className="absolute top-0 left-0 w-full px-8 py-6 flex items-center justify-between text-sm tracking-wide z-10">
      {/* Left */}
      <div className="flex items-center gap-3">
        <span className="font-semibold">SKINSTRIC</span>
        <span className="text-gray-400">[ INTRO ]</span>
      </div>

      {/* Right */}
      <button className="border border-black bg-black text-white px-4 py-2 text-xs font-medium hover:bg-white hover:text-black transition">
        ENTER CODE
      </button>
    </header>
  );
}