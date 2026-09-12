import { useRef, useState, useEffect, useCallback } from "react";

interface ScrollAreaProps {
  children: React.ReactNode;
  maxHeight?: string; // e.g. "70vh"
  className?: string;
}

const THUMB_MIN_HEIGHT = 24;

export default function ScrollArea({
  children,
  maxHeight = "70vh",
  className = "",
}: ScrollAreaProps) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const dragInfo = useRef<{ startY: number; startScrollTop: number } | null>(null);

  const [thumb, setThumb] = useState({ height: 0, top: 0 });
  const [visible, setVisible] = useState(false); // has overflow at all
  const [dragging, setDragging] = useState(false);
  const [hovering, setHovering] = useState(false);

  const updateThumb = useCallback(() => {
    const el = viewportRef.current;
    if (!el) return;

    const { scrollTop, scrollHeight, clientHeight } = el;
    const hasOverflow = scrollHeight > clientHeight + 1;
    setVisible(hasOverflow);

    if (!hasOverflow) return;

    const trackHeight = clientHeight;
    const ratio = clientHeight / scrollHeight;
    const thumbHeight = Math.max(ratio * trackHeight, THUMB_MIN_HEIGHT);
    const maxThumbTop = trackHeight - thumbHeight;
    const scrollRatio = scrollTop / (scrollHeight - clientHeight);
    const thumbTop = scrollRatio * maxThumbTop;

    setThumb({ height: thumbHeight, top: thumbTop });
  }, []);

  useEffect(() => {
    updateThumb();
    const el = viewportRef.current;
    if (!el) return;

    const resizeObserver = new ResizeObserver(updateThumb);
    resizeObserver.observe(el);
    // content size වෙනස් වුනාම (menu expand/collapse) recalc කරන්න
    const mutationObserver = new MutationObserver(updateThumb);
    mutationObserver.observe(el, { childList: true, subtree: true, attributes: true });

    return () => {
      resizeObserver.disconnect();
      mutationObserver.disconnect();
    };
  }, [updateThumb]);

  const handleThumbPointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    (e.target as Element).setPointerCapture(e.pointerId);
    dragInfo.current = {
      startY: e.clientY,
      startScrollTop: viewportRef.current?.scrollTop ?? 0,
    };
    setDragging(true);
  };

  const handleThumbPointerMove = (e: React.PointerEvent) => {
    if (!dragInfo.current || !viewportRef.current) return;
    const el = viewportRef.current;
    const { scrollHeight, clientHeight } = el;
    const trackHeight = clientHeight;
    const thumbHeight = Math.max((clientHeight / scrollHeight) * trackHeight, THUMB_MIN_HEIGHT);
    const maxThumbTop = trackHeight - thumbHeight;
    const maxScrollTop = scrollHeight - clientHeight;

    const dy = e.clientY - dragInfo.current.startY;
    const thumbDelta = (dy / maxThumbTop) * maxScrollTop;

    el.scrollTop = clamp(dragInfo.current.startScrollTop + thumbDelta, 0, maxScrollTop);
  };

  const handleThumbPointerUp = () => {
    setDragging(false);
    dragInfo.current = null;
  };

  const showTrack = visible && (hovering || dragging);

  return (
    <div
      className={`relative ${className}`}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      <div
        ref={viewportRef}
        onScroll={updateThumb}
        className="overflow-y-auto pr-3 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        style={{ maxHeight }}
      >
        {children}
      </div>

      {/* Custom track + thumb */}
      {visible && (
        <div
          ref={trackRef}
          className={`absolute top-0 right-0.5 w-1.5 rounded-full bg-border/60 transition-opacity duration-150 ${
            showTrack ? "opacity-100" : "opacity-0"
          }`}
          style={{ height: "100%" }}
        >
          <div
            onPointerDown={handleThumbPointerDown}
            onPointerMove={handleThumbPointerMove}
            onPointerUp={handleThumbPointerUp}
            className={`absolute left-0 w-full rounded-full bg-secondary/70 hover:bg-secondary transition-colors cursor-pointer ${
              dragging ? "bg-secondary" : ""
            }`}
            style={{ height: thumb.height, top: thumb.top, touchAction: "none" }}
          />
        </div>
      )}
    </div>
  );
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}