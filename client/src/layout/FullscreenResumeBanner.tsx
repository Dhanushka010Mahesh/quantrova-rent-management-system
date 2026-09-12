import { Maximize2 } from "lucide-react";
import { useFullscreen } from "../hooks/useFullscreen";

export default function FullscreenResumeBanner() {
  const { needsResume, enter } = useFullscreen();

  if (!needsResume) return null;

  return (
    <button
      onClick={enter}
      className="fixed bottom-4 right-4 z-[200] flex items-center gap-2 rounded-full bg-secondary px-4 py-2.5 text-sm font-medium text-white shadow-lg transition-transform hover:scale-105"
    >
      <Maximize2 className="h-4 w-4" /> Resume Fullscreen
    </button>
  );
}