"use client";

import React, { ReactNode } from "react";

interface TripleDiamondProps {
  children?: ReactNode;
  size?: number; // base size in px
  color?: string; // base border color
  gap?: number; // spacing between diamonds in px
  padding?: number; // padding inside diamonds
  mdSize?: number;
}

const TripleDiamond: React.FC<TripleDiamondProps> = ({
  children,
  size = 180,
  color = "#d1d5db",
  gap = 18,
  padding = 40,
  mdSize = 300
}) => {
  const diamonds = [0, 1, 2];

  const containerSize = size + (diamonds.length - 1) * gap * 2 + padding * 2;

  // Function to lighten color for outer diamonds
  const getDiamondColor = (i: number) => {
    const alpha = 1 - i * 0.3; // decrease opacity for outer diamonds
    return `rgba(209, 213, 219, ${alpha})`;
  };

  return (
    <div
      className="relative flex justify-center items-center"
      style={{ width: containerSize, height: containerSize, overflow: "visible" }}
    >
      {diamonds.map((i) => {
        const s = size + i * gap * 2;
        return (
          <div
            key={i}
            className="absolute flex justify-center items-center"
            style={{
              width: s,
              height: s,
              border: `3px dotted ${getDiamondColor(i)}`,
              transform: "rotate(45deg)", // initial rotation
              animation: `spin ${28 + i * 12}s linear infinite`, // rotate continuously
            }}
          />
        );
      })}
      <div className="absolute flex justify-center items-center px-4">
        {children}
      </div>

      {/* Add keyframes inside component */}
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(45deg); }
          100% { transform: rotate(405deg); } /* 360 + 45 initial */
        }
      `}</style>
    </div>
  );
};

export default TripleDiamond;