import { useEffect, useRef, useState } from "react";
import { ChevronDown, Search, Check, X } from "lucide-react";

interface Option {
  label: string;
  value: string;
}

interface SearchSelectProps {
  label?: string;
  options: Option[];
  value: string | null;
  onChange: (value: string | null) => void;
  placeholder?: string;
  error?: string;
  clearable?: boolean;
}

export default function SearchSelect({
  label,
  options,
  value,
  onChange,
  placeholder = "Search...",
  error,
  clearable = true,
}: SearchSelectProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const selected = options.find((o) => o.value === value) ?? null;
  const filtered = options.filter((o) => o.label.toLowerCase().includes(query.toLowerCase()));

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setQuery("");
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const handleSelect = (opt: Option) => {
    onChange(opt.value);
    setOpen(false);
    setQuery("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && filtered[activeIndex]) {
      e.preventDefault();
      handleSelect(filtered[activeIndex]);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <div ref={containerRef} className="relative w-full">
      {label && <label className="mb-1.5 block text-sm font-medium text-text">{label}</label>}

      <button
        type="button"
        onClick={() => {
          setOpen((v) => !v);
          setTimeout(() => inputRef.current?.focus(), 0);
        }}
        className={`flex w-full items-center justify-between rounded-lg border bg-surface py-2.5 px-3 text-sm text-left
          transition-colors focus:outline-none focus:ring-2
          ${error ? "border-danger focus:ring-danger/20" : "border-border focus:border-primary focus:ring-primary/25"}`}
      >
        <span className={selected ? "text-text" : "text-text-muted/70"}>
          {selected ? selected.label : placeholder}
        </span>
        <span className="flex items-center gap-1">
          {clearable && selected && (
            <X
              className="h-4 w-4 text-text-muted hover:text-danger"
              onClick={(e) => {
                e.stopPropagation();
                onChange(null);
              }}
            />
          )}
          <ChevronDown className="h-4.5 w-4.5 text-text-muted" />
        </span>
      </button>

      {open && (
        <div className="absolute z-20 mt-1.5 w-full overflow-hidden rounded-lg border border-border bg-surface shadow-lg">
          <div className="flex items-center gap-2 border-b border-border px-3 py-2">
            <Search className="h-4 w-4 shrink-0 text-text-muted" />
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setActiveIndex(0);
              }}
              onKeyDown={handleKeyDown}
              placeholder="Type to search..."
              className="w-full bg-transparent text-sm text-text placeholder:text-text-muted/70 focus:outline-none"
            />
          </div>

          <div className="max-h-56 overflow-y-auto py-1">
            {filtered.length === 0 ? (
              <p className="px-3 py-4 text-center text-xs text-text-muted">No results found</p>
            ) : (
              filtered.map((opt, i) => (
                <div
                  key={opt.value}
                  onMouseEnter={() => setActiveIndex(i)}
                  onClick={() => handleSelect(opt)}
                  className={`flex cursor-pointer items-center justify-between px-3 py-2 text-sm transition-colors
                    ${i === activeIndex ? "bg-background text-secondary" : "text-text"}`}
                >
                  {opt.label}
                  {opt.value === value && <Check className="h-4 w-4 text-primary-dark" />}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {error && <p className="mt-1.5 text-xs text-danger">{error}</p>}
    </div>
  );
}