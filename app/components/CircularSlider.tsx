import React, { useRef, useState, useEffect } from "react";

interface RadialSliderProps {
  value: number;
  onChange?: (value: number) => void;
  size?: number;
  strokeWidth?: number;
}

const RadialSlider: React.FC<RadialSliderProps> = ({
  value,
  onChange,
  size = 300,
  strokeWidth = 2,
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [showBubble, setShowBubble] = useState(true);

  const percentage = Math.round(value * 100);
  const radius = size / 2 - strokeWidth - 1;
  const center = size / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - percentage / 100);

  const updateFromEvent = (e: React.MouseEvent | MouseEvent) => {
    if (!svgRef.current || !onChange) return;
    const rect = svgRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const x = e.clientX - cx;
    const y = e.clientY - cy;
    let angle = Math.atan2(y, x) * (180 / Math.PI) + 90;
    if (angle < 0) angle += 360;

    onChange(Math.min(1, Math.max(0, angle / 360)));
    setShowBubble(false); // hide bubble when user interacts
  };

  const startDrag = () => {
    if (!onChange) return;
    window.addEventListener("mousemove", updateFromEvent);
    window.addEventListener("mouseup", stopDrag);
    setShowBubble(false);
  };

  const stopDrag = () => {
    window.removeEventListener("mousemove", updateFromEvent);
    window.removeEventListener("mouseup", stopDrag);
  };

  // Optionally hide bubble after 3 seconds automatically
  useEffect(() => {
    const timer = setTimeout(() => setShowBubble(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex items-center justify-center select-none relative">
      {/* Scroll Bubble */}
      {showBubble && (
        <div className="absolute text-center top-50 left-1/2 transform -translate-x-1/2 bg-black text-white text-sm px-3 py-1 rounded-full pointer-events-none animate-pulse">
          Drag to adjust values.
        </div>
      )}

      <div className="relative cursor-pointer" onMouseDown={startDrag}>
        <svg
          ref={svgRef}
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
        >
          {/* Background Circle */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            stroke="#e5e7eb"
            strokeWidth={strokeWidth}
            fill="none"
          />
          {/* Progress Circle */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            stroke="black"
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            transform={`rotate(-90 ${center} ${center})`}
          />
        </svg>
        {/* Center Label */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="text-4xl font-semibold select-none">{percentage}%</span>
        </div>
      </div>
    </div>
  );
};

export default RadialSlider;
