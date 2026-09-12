import { useCallback, useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import type { MenuItem } from "../../types/menu";
import ScrollArea from "../ui/scroll/ScrollArea";

interface FloatingSidebarMenuProps {
  items: MenuItem[];
  initialPosition?: { x: number; y: number };
  storageKey?: string; // localStorage key to remember button position
}

const BUTTON_SIZE = 52;
const DRAG_THRESHOLD = 6; // px movement before it's treated as a drag, not a click
const CLOSE_DELAY = 350; // ms grace period before auto-collapsing

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

/** Sidebar/panel layout icon shown when the menu is closed */
function SidebarIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="3" width="8" height="18" rx="2" fill="currentColor" />
      <rect x="13" y="3" width="8" height="8" rx="2" fill="currentColor" opacity="0.55" />
      <rect x="13" y="13" width="8" height="8" rx="2" fill="currentColor" />
    </svg>
  );
}

/** X icon shown when the menu is open */
function CloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path
        d="M6 6l12 12M18 6L6 18"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Swaps between SidebarIcon (closed) and CloseIcon (open) with a fade + scale transition */
function ToggleIcon({ open }: { open: boolean }) {
  return (
    <div className="relative w-5 h-5">
      <div
        className="absolute inset-0 flex items-center justify-center transition-all duration-200"
        style={{
          opacity: open ? 0 : 1,
          transform: open ? "scale(0.6) rotate(-45deg)" : "scale(1) rotate(0deg)",
        }}
      >
        <SidebarIcon />
      </div>
      <div
        className="absolute inset-0 flex items-center justify-center transition-all duration-200"
        style={{
          opacity: open ? 1 : 0,
          transform: open ? "scale(1) rotate(0deg)" : "scale(0.6) rotate(45deg)",
        }}
      >
        <CloseIcon />
      </div>
    </div>
  );
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      className="transition-transform duration-200 shrink-0"
      style={{ transform: open ? "rotate(90deg)" : "rotate(0deg)" }}
    >
      <path
        d="M9 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Renders a list of siblings and enforces "only one open at a time" (accordion) */
function MenuList({
  items,
  depth,
  onNavigate,
}: {
  items: MenuItem[];
  depth: number;
  onNavigate: () => void;
}) {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <div>
      {items.map((item) => (
        <MenuNode
          key={item.id}
          item={item}
          depth={depth}
          onNavigate={onNavigate}
          expanded={openId === item.id}
          onToggle={() =>
            setOpenId((prev) => (prev === item.id ? null : item.id))
          }
        />
      ))}
    </div>
  );
}

/** Recursive menu node - handles both leaf (path) and parent (children) items */
function MenuNode({
  item,
  depth,
  onNavigate,
  expanded,
  onToggle,
}: {
  item: MenuItem;
  depth: number;
  onNavigate: () => void;
  expanded: boolean;
  onToggle: () => void;
}) {
  const hasChildren = !!item.children?.length;

  if (!hasChildren) {
    return (
      <NavLink
        to={item.path ?? "#"}
        onClick={onNavigate}
        className={({ isActive }) =>
          `flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors ${
            isActive
              ? "bg-primary/15 text-primary font-medium"
              : "text-text hover:bg-background hover:text-secondary"
          }`
        }
        style={{ paddingLeft: `${12 + depth * 14}px` }}
      >
        {item.icon}
        <span className="truncate">{item.label}</span>
      </NavLink>
    );
  }

  return (
    <div>
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-2 rounded-md px-3 py-2 text-sm text-text hover:bg-background transition-colors"
        style={{ paddingLeft: `${12 + depth * 14}px` }}
      >
        <span className="flex items-center gap-2 truncate">
          {item.icon}
          {item.label}
        </span>
        <ChevronIcon open={expanded} />
      </button>

      <div
        className="grid transition-[grid-template-rows] duration-200 ease-in-out"
        style={{ gridTemplateRows: expanded ? "1fr" : "0fr" }}
      >
        <div className="overflow-hidden">
          <div className="py-0.5">
            {/* sub-menu ලාත් accordion විදිහටම වැඩ කරන්න MenuList එකම call කරනවා */}
            <MenuList
              items={item.children!}
              depth={depth + 1}
              onNavigate={onNavigate}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function FloatingSidebarMenu({
  items,
  initialPosition,
  storageKey = "floating-menu-pos",
}: FloatingSidebarMenuProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dragInfo = useRef<{
    startX: number;
    startY: number;
    origX: number;
    origY: number;
    moved: boolean;
  } | null>(null);

  const [open, setOpen] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [position, setPosition] = useState(() => {
    if (typeof window === "undefined")
      return initialPosition ?? { x: 24, y: 24 };
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) return JSON.parse(saved) as { x: number; y: number };
    } catch {
      /* ignore corrupt storage */
    }
    return (
      initialPosition ?? {
        x: window.innerWidth - BUTTON_SIZE - 24,
        y: window.innerHeight - BUTTON_SIZE - 24,
      }
    );
  });

  const clearCloseTimer = useCallback(() => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  }, []);

  const scheduleClose = useCallback(() => {
    clearCloseTimer();
    closeTimer.current = setTimeout(() => setOpen(false), CLOSE_DELAY);
  }, [clearCloseTimer]);

  // Close on outside click, Escape key
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  // Keep button on-screen when window resizes
  useEffect(() => {
    function handleResize() {
      setPosition((p) => ({
        x: clamp(p.x, 8, window.innerWidth - BUTTON_SIZE - 8),
        y: clamp(p.y, 8, window.innerHeight - BUTTON_SIZE - 8),
      }));
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handlePointerDown = (e: React.PointerEvent) => {
    (e.target as Element).setPointerCapture(e.pointerId);
    dragInfo.current = {
      startX: e.clientX,
      startY: e.clientY,
      origX: position.x,
      origY: position.y,
      moved: false,
    };
    setDragging(true);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!dragInfo.current) return;
    const dx = e.clientX - dragInfo.current.startX;
    const dy = e.clientY - dragInfo.current.startY;

    if (Math.abs(dx) > DRAG_THRESHOLD || Math.abs(dy) > DRAG_THRESHOLD) {
      dragInfo.current.moved = true;
    }

    if (dragInfo.current.moved) {
      const nextX = clamp(
        dragInfo.current.origX + dx,
        8,
        window.innerWidth - BUTTON_SIZE - 8,
      );
      const nextY = clamp(
        dragInfo.current.origY + dy,
        8,
        window.innerHeight - BUTTON_SIZE - 8,
      );
      setPosition({ x: nextX, y: nextY });
    }
  };

  const handlePointerUp = () => {
    setDragging(false);
    if (dragInfo.current && !dragInfo.current.moved) {
      // it was a click, not a drag
      setOpen((v) => !v);
    } else {
      try {
        localStorage.setItem(storageKey, JSON.stringify(position));
      } catch {
        /* storage may be unavailable, ignore */
      }
    }
    dragInfo.current = null;
  };

  // Decide which side the panel opens on, so it never overflows the viewport
  const opensUp = position.y > window.innerHeight / 2;
  const opensLeft = position.x > window.innerWidth / 2;

  return (
    <div
      ref={containerRef}
      className="fixed z-50 select-none"
      style={{ left: position.x, top: position.y }}
      onMouseEnter={clearCloseTimer}
      onMouseLeave={scheduleClose}
    >
      {/* Menu panel */}
      <div
        className={`absolute w-64 rounded-xl border border-border bg-surface shadow-xl transition-all duration-200 origin-top ${
          open
            ? "opacity-100 scale-100 pointer-events-auto"
            : "opacity-0 scale-95 pointer-events-none"
        }`}
        style={{
          [opensUp ? "bottom" : "top"]: BUTTON_SIZE + 10,
          [opensLeft ? "right" : "left"]: 0,
        }}
      >
        <ScrollArea maxHeight="70vh" className="p-2">
          <MenuList items={items} depth={0} onNavigate={() => setOpen(false)} />
        </ScrollArea>
      </div>

      {/* Floating button */}
      <button
        type="button"
        aria-label="Toggle menu"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        className={`flex items-center justify-center rounded-full bg-secondary text-primary shadow-lg transition-transform ${
          dragging ? "scale-105 cursor-grabbing" : "cursor-grab hover:scale-105"
        }`}
        style={{ width: BUTTON_SIZE, height: BUTTON_SIZE, touchAction: "none" }}
      >
        <ToggleIcon open={open} />
      </button>
    </div>
  );
}
