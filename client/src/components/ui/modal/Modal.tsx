import { useEffect } from "react";
import { X } from "lucide-react";

type Size = "sm" | "md" | "lg" | "xl";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  size?: Size;
  scrollable?: boolean; // long content -> scrolls inside modal body, header/footer stay fixed
  closeOnOverlayClick?: boolean;
  footer?: React.ReactNode;
  children: React.ReactNode;
}

const sizeMap: Record<Size, string> = {
  sm: "max-w-sm",
  md: "max-w-lg",
  lg: "max-w-2xl",
  xl: "max-w-4xl",
};

export default function Modal({ open, onClose, title, size = "md", scrollable = false, footer, children }: ModalProps) {
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const onEscape = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onEscape);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onEscape);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-secondary-dark/50 backdrop-blur-[2px]" onClick={onClose} />

      {/* Panel */}
      <div
        className={`relative flex w-full ${sizeMap[size]} flex-col rounded-xl bg-surface shadow-2xl
          ${scrollable ? "max-h-[85vh]" : ""}`}
      >
        {title && (
          <div className="flex shrink-0 items-center justify-between border-b border-border px-5 py-4">
            <h3 className="text-base font-semibold text-secondary">{title}</h3>
            <button onClick={onClose} className="text-text-muted hover:text-secondary" aria-label="Close">
              <X className="h-5 w-5" />
            </button>
          </div>
        )}

        <div className={`px-5 py-4 ${scrollable ? "overflow-y-auto" : ""}`}>{children}</div>

        {footer && (
          <div className="flex shrink-0 items-center justify-end gap-2 border-t border-border px-5 py-4">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

// // Normal modal
// <Modal open={open} onClose={() => setOpen(false)} title="Confirm Delete" footer={<>
//   <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
//   <Button variant="danger">Delete</Button>
// </>}>
//   <p className="text-sm text-text-muted">Are you sure? This can't be undone.</p>
// </Modal>

// // Scrollable modal (long forms / long content)
// <Modal open={open} onClose={() => setOpen(false)} title="Item Details" scrollable size="lg">
//   {/* long content */}
// </Modal>