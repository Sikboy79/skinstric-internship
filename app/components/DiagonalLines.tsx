export default function DiagonalLines() {
  return (
    <div className="pointer-events-none absolute inset-0 hidden xl:block z-50">
      {/* LEFT > */}
      <div className="absolute inset-y-0 left-[14%] w-1/2">
        {/* upper line */}
        <div className="absolute top-1/2 left-[6%] w-[45vw] ">
          <div className="h-px border-t border-dashed border-gray-400 -rotate-135 origin-left" />
        </div>

        {/* lower line */}
        <div className="absolute top-1/2 left-[6%] w-[45vw] ">
          <div className="h-px border-t border-dashed border-gray-400 rotate-135 origin-left" />
        </div>
      </div>

      {/* RIGHT < */}
      <div className="absolute inset-y-0 right-[12%] w-1/2">
        {/* upper line */}
        <div className="absolute top-1/2 right-[6%] w-[45vw] ">
          <div className="h-px border-t border-dashed border-gray-400 rotate-135 origin-right" />
        </div>

        {/* lower line */}
        <div className="absolute top-1/2 right-[6%] w-[45vw]">
          <div className="h-px border-t border-dashed border-gray-400 -rotate-135 origin-right" />
        </div>
      </div>
    </div>
  );
}