"use client";

import React, { useRef, useState } from "react";

const RadialSlider: React.FC = () => {
  const [percentage, setPercentage] = useState<number>(50);
  const svgRef = useRef<SVGSVGElement | null>(null);

  const radius = 110;
  const strokeWidth = 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - percentage / 100);

  const updatePercentageFromEvent = (e: React.MouseEvent | MouseEvent) => {
    if (!svgRef.current) return;

    const rect = svgRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    const x = e.clientX - cx;
    const y = e.clientY - cy;

    let angle = Math.atan2(y, x) * (180 / Math.PI) + 90;
    if (angle < 0) angle += 360;

    const newPercentage = Math.round((angle / 360) * 100);
    setPercentage(newPercentage);
  };

  const startDrag = () => {
    window.addEventListener("mousemove", updatePercentageFromEvent);
    window.addEventListener("mouseup", stopDrag);
  };

  const stopDrag = () => {
    window.removeEventListener("mousemove", updatePercentageFromEvent);
    window.removeEventListener("mouseup", stopDrag);
  };

  return (
    <div className="flex items-center justify-center">
      <div
        className="relative w-200 h-80 cursor-pointer"
        onMouseDown={startDrag}
      >
        <svg ref={svgRef} className="w-full h-full" viewBox="0 0 260 260">
          {/* Background */}
          <circle
            cx="130"
            cy="130"
            r={radius}
            stroke="#e5e7eb"
            strokeWidth={strokeWidth}
            fill="none"
          />

          {/* Progress */}
          <circle
            cx="130"
            cy="130"
            r={radius}
            stroke="black"
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            transform="rotate(-90 130 130)"
          />
        </svg>

        {/* Center label */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="text-3xl font-semibold">{percentage}%</span>
        </div>
      </div>
    </div>
  );
};

export default RadialSlider;
