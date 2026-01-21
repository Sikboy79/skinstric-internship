"use client";

import { IoIosPlay } from "react-icons/io";

interface SideNavProps {
  direction: "left" | "right";
  label: string;
}

export default function SideNav({ direction, label }: SideNavProps) {
  const isLeft = direction === "left";

  return (
    <div
      className={`absolute top-1/2 -translate-y-1/2 flex items-center gap-4 text-sm tracking-wide z-10 ${
        isLeft ? "left-8" : "right-8 flex-row-reverse"
      }`}
    >
      <div className="w-10 h-10 border border-black flex items-center justify-center rotate-45">
        {isLeft ? (
          <IoIosPlay className="rotate-13" />
        ) : (
          <IoIosPlay className="-rotate-45" />
        )}
      </div>

      <span>{label}</span>
    </div>
  );
}