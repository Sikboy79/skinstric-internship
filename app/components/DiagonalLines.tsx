export default function DiagonalLines() {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 hidden xl:block">
      {/* LEFT > */}
      <div className="absolute -top-10 -left-16 w-1/2 h-screen">
        <div className="absolute top-0 left-0 w-106 ">
          <div className="absolute top-0 left-0 w-full h-px border-t border-dashed border-gray-300 rotate-45 origin-top-left" />
        </div>
        <div className="absolute bottom-0 left-0 w-106">
          <div className="absolute bottom-0 left-0 w-full h-px border-t border-dashed border-gray-300 -rotate-45 origin-bottom-left" />
        </div>
      </div>

      {/* RIGHT < */}
      <div className="absolute -top-10 -right-18 w-1/2 h-screen">
        <div className="absolute top-0 right-0 w-106">
          <div className="absolute top-0 right-0 w-full h-px border-t border-dashed border-gray-300 -rotate-45 origin-top-right" />
        </div>
        <div className="absolute bottom-0 right-0 w-106">
          <div className="absolute bottom-0 right-0 w-full h-px border-t border-dashed border-gray-300 rotate-45 origin-bottom-right" />
        </div>
      </div>
    </div>
  );
}