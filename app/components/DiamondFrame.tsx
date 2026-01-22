export default function DiamondFrame() {
  return (
    <div className="absolute inset-0 flex items-center justify-center xl:hidden pointer-events-none z-50">
      {/* Outer diamond */}
      <div className="absolute w-[90vw] max-w-130 aspect-square border border-gray-300 rotate-45" />

      {/* Inner diamond */}
      <div className="absolute w-[calc(81vw-20px)] max-w-md aspect-square border border-gray-300 rotate-45" />
    </div>
  );
}
