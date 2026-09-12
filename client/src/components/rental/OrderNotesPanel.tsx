import { useState } from "react";
import { StickyNote, Plus } from "lucide-react";
import type { OrderNote } from "../../types/rentalOrder";

interface OrderNotesPanelProps {
  notes: OrderNote[];
  onAdd: (text: string) => void;
  readOnly?: boolean;
}

export default function OrderNotesPanel({ notes, onAdd, readOnly }: OrderNotesPanelProps) {
  const [text, setText] = useState("");

  const handleAdd = () => {
    if (!text.trim()) return;
    onAdd(text.trim());
    setText("");
  };

  return (
    <div className="rounded-xl border border-border bg-surface p-4">
      <div className="mb-3 flex items-center gap-1.5 text-sm font-semibold text-secondary">
        <StickyNote className="h-4 w-4" /> Notes
      </div>

      {!readOnly && (
        <div className="mb-3 flex gap-2">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Add a note..."
            className="flex-1 rounded-md border border-border bg-background px-2.5 py-1.5 text-sm outline-none focus:ring-1 focus:ring-primary"
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          />
          <button
            type="button"
            onClick={handleAdd}
            className="flex items-center gap-1 rounded-md bg-primary/15 px-2.5 py-1.5 text-xs font-medium text-primary-dark hover:bg-primary/25"
          >
            <Plus className="h-3.5 w-3.5" /> Add
          </button>
        </div>
      )}

      {notes.length === 0 ? (
        <p className="text-xs text-text-muted">No notes yet.</p>
      ) : (
        <div className="flex flex-col gap-2.5">
          {[...notes].reverse().map((n) => (
            <div key={n.id} className="rounded-lg bg-background px-3 py-2 text-sm">
              <p className="text-text">{n.text}</p>
              <p className="mt-0.5 text-[11px] text-text-muted">
                {n.author} · {new Date(n.date).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}