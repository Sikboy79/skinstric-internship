export default function DiagonalLines() {
  return (
    <div className="pointer-events-none absolute inset-0 hidden xl:block z-55">
      {/* LEFT > */}
      <div className="absolute top-10 w-1/2 h-screen">
        <div className="absolute top-58 left-0 w-100">
          <div className="absolute -top-6 left-0 w-full h-px border-t border-dashed border-gray-300 rotate-45 origin-top-left" />
        </div>
        <div className="absolute bottom-30 left-0 w-100">
          <div className="absolute -bottom-6 left-0 w-full h-px border-t border-dashed border-gray-300 -rotate-45 origin-bottom-left" />
        </div>
      </div>

      {/* RIGHT < */}
      <div className="absolute top-10 -right-5 w-1/2 h-screen">
        <div className="absolute top-58 right-0 w-100">
          <div className="absolute -top-6 right-0 w-full h-px border-t border-dashed border-gray-300 -rotate-45 origin-top-right" />
        </div>
        <div className="absolute bottom-30 right-0 w-100">
          <div className="absolute -bottom-6 right-0 w-full h-px border-t border-dashed border-gray-300 rotate-45 origin-bottom-right" />
        </div>
      </div>
    </div>
  );
}