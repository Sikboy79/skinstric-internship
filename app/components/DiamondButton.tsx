interface DiamondArrowButtonProps {
  label: string;
  direction?: "left" | "right"; // default: right
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

export default function DiamondArrowButton({
  label,
  direction = "right",
  onClick,
  disabled = false,
  className = "",
}: DiamondArrowButtonProps) {
  const arrow = direction === "right" ? "▶" : "◀";

  return (
    <button
      onClick={disabled ? undefined : onClick}
      className={`group flex items-center gap-4 text-sm tracking-wide font-bold cursor-pointer ${className}`}
    >
      {direction === "right" && label}

      <span
        className={`
          relative w-10 h-10 border rotate-45 flex items-center justify-center transition
          ${disabled ? "border-[#1a1b1c]" : "border-[#1a1b1c] group-hover:bg-[#1a1b1c]"}
        `}
      >
        {/* Normal arrow */}
        <span
          className={`absolute z-10 -rotate-45 transition ${disabled ? "text-current group-hover:opacity-0" : "text-current group-hover:text-white"}`}
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
