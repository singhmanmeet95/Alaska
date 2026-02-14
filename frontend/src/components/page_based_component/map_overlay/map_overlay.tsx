import { useState, useEffect, useRef } from "react";

interface MapOverlayProps {
  customPath: string[]; // List of station names
  onSubmit: () => void;
}

export default function MapOverlay({ customPath, onSubmit }: MapOverlayProps) {
  const [width, setWidth] = useState(320); // Initial width in pixels
  const isResizingRef = useRef(false);

  // Handle resizing logic
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizingRef.current) return;
      // Limit min/max width
      const newWidth = Math.max(
        250,
        Math.min(window.innerWidth * 0.8, e.clientX),
      );
      setWidth(newWidth);
    };

    const handleMouseUp = () => {
      isResizingRef.current = false;
      document.body.style.cursor = "default";
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  const startResize = () => {
    isResizingRef.current = true;
    document.body.style.cursor = "col-resize";
  };

  const startStation = customPath.length > 0 ? customPath[0] : "";
  const endStation =
    customPath.length > 1 ? customPath[customPath.length - 1] : "";

  return (
    <div
      className="absolute top-0 bottom-0 left-0 bg-zinc-950 border-r border-zinc-800 flex flex-col z-[1000] shadow-xl"
      style={{ width: `${width}px` }}
    >
      {/* Top Controls Section */}
      <div className="flex flex-col p-4 gap-4 shrink-0 border-b border-zinc-800">
        <h2 className="text-zinc-100 font-semibold text-lg">Route Settings</h2>

        {/* Stations Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1">
            <span className="text-xs text-zinc-500 uppercase tracking-wider font-medium">
              Start
            </span>
            <div
              className="bg-zinc-900 border border-zinc-700/50 p-3 rounded text-sm text-zinc-300 font-mono truncate"
              title={startStation}
            >
              {startStation}
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs text-zinc-500 uppercase tracking-wider font-medium">
              End
            </span>
            <div
              className="bg-zinc-900 border border-zinc-700/50 p-3 rounded text-sm text-zinc-300 font-mono truncate"
              title={endStation}
            >
              {endStation}
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={onSubmit}
          disabled={customPath.length < 2}
          className={`w-full py-2.5 rounded font-medium text-sm transition-colors ${
            customPath.length >= 2
              ? "bg-white text-black hover:bg-zinc-200"
              : "bg-zinc-800 text-zinc-500 cursor-not-allowed"
          }`}
        >
          {customPath.length < 2
            ? "SELECT"
            : "SUBMIT"}
        </button>
      </div>

      <div className="flex-1 w-full bg-zinc-900/30 p-4 overflow-y-auto">
        {/* This area will contain API results later */}
        <div className="border border-dashed border-zinc-700 rounded-lg h-full flex items-center justify-center text-zinc-500 text-sm">
          Analysis Results Area
        </div>
      </div>

      {/* Resize Handle */}
      <div
        className="absolute top-0 right-0 bottom-0 w-1 cursor-col-resize hover:bg-blue-500/50 transition-colors group z-50"
        onMouseDown={startResize}
      />
    </div>
  );
}
