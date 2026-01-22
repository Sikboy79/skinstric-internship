

interface DiamondArrowButtonProps {
  label: string;
  direction?: "left" | "right"; // default: right
  onClick?: () => void;
  disabled?: boolean;
}

export default function DiamondArrowButton({
  label,
  direction = "right",
  onClick,
  disabled = false,
}: DiamondArrowButtonProps) {
  // Choose arrow character based on direction
  const arrow = direction === "right" ? "▶" : "◀";

  return (
  <button
    onClick={disabled ? undefined : onClick}
    className="group flex items-center gap-4 text-sm tracking-wide font-bold cursor-pointer"
  >
    {direction === "right" && label}

    <span className="relative w-10 h-10 border border-black rotate-45 flex items-center justify-center transition group-hover:bg-black">
      {/* Normal arrow */}
      <span
        className={`
          absolute z-10 -rotate-45 transition
          ${
            disabled
              ? "text-black group-hover:opacity-0"
              : "text-black group-hover:text-white"
          }
        `}
      >
        {arrow}
      </span>

      {/* Disabled icon (hover only) */}
      {disabled && (
        <span className="absolute z-20 -rotate-45 opacity-0 group-hover:opacity-100 transition text-white">
          ✕
        </span>
      )}
    </span>

    {direction === "left" && label}
  </button>
);

}



// interface DiamondButtonProps {
//   label: string;
//   onClick?: () => void;
// }

// export default function DiamondButton({ label, onClick }: DiamondButtonProps) {
//   return (
//     <button onClick={onClick} className="group flex items-center gap-4 text-sm tracking-wide font-bold">
//       {label}

//       <span className="relative w-10 h-10 border border-black rotate-45 flex items-center justify-center transition group-hover:bg-black">
//         <span className="-rotate-45 text-black group-hover:text-white transition">
//           ▶
//         </span>
//       </span>
//     </button>
//   );
// }