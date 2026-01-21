interface DiamondButtonProps {
  label: string;
}

export default function DiamondButton({ label }: DiamondButtonProps) {
  return (
    <button className="group flex items-center gap-4 text-sm tracking-wide font-bold">
      {label}

      <span className="relative w-10 h-10 border border-black rotate-45 flex items-center justify-center transition group-hover:bg-black">
        <span className="-rotate-45 text-black group-hover:text-white transition">
          ▶
        </span>
      </span>
    </button>
  );
}