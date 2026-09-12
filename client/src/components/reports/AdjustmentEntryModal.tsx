import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import Modal from "../ui/modal/Modal";
import Input from "../ui/input/Input";
import Select from "../ui/select/Select";
import Button from "../ui/button/Button";
import type { LedgerAccount, JournalEntry } from "../../types/generalLedger";

interface AdjustmentEntryModalProps {
  open: boolean;
  onClose: () => void;
  onSaved: (entry: JournalEntry) => void;
  accounts: LedgerAccount[];
  defaultAccountId?: number | null; // pre-selects the account the user clicked "Adjust" from
}

interface DraftLine {
  id: string;
  accountId: number | "";
  debit: number;
  credit: number;
}

function emptyLine(): DraftLine {
  return { id: crypto.randomUUID(), accountId: "", debit: 0, credit: 0 };
}

export default function AdjustmentEntryModal({ open, onClose, onSaved, accounts, defaultAccountId }: AdjustmentEntryModalProps) {
  const [journalDate, setJournalDate] = useState(new Date().toISOString().slice(0, 10));
  const [description, setDescription] = useState("");
  const [lines, setLines] = useState<DraftLine[]>([emptyLine(), emptyLine()]);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setJournalDate(new Date().toISOString().slice(0, 10));
      setDescription("");
      const first = emptyLine();
      if (defaultAccountId) first.accountId = defaultAccountId;
      setLines([first, emptyLine()]);
      setError("");
    }
  }, [open, defaultAccountId]);

  const addLine = () => setLines([...lines, emptyLine()]);
  const removeLine = (id: string) => setLines(lines.filter((l) => l.id !== id));
  const updateLine = (id: string, patch: Partial<DraftLine>) =>
    setLines(lines.map((l) => (l.id === id ? { ...l, ...patch } : l)));

  const totalDebit = lines.reduce((s, l) => s + (Number(l.debit) || 0), 0);
  const totalCredit = lines.reduce((s, l) => s + (Number(l.credit) || 0), 0);
  const balanced = Math.abs(totalDebit - totalCredit) < 0.01 && totalDebit > 0;

  const handleSubmit = async () => {
    if (lines.some((l) => !l.accountId)) {
      setError("Select an account for every line");
      return;
    }
    if (lines.some((l) => l.debit > 0 && l.credit > 0)) {
      setError("A line can't have both a debit and a credit amount");
      return;
    }
    if (!balanced) {
      setError("Total debit must equal total credit before saving");
      return;
    }
    setError("");
    setSaving(true);
    try {
      // TODO: replace with real API call e.g. POST /api/accounting/journal-entries
      // { journal_date, description, source_module: "Manual", lines: [{ account_id, debit, credit }] }
      await new Promise((r) => setTimeout(r, 700));

      const entryId = Date.now();
      const newEntry: JournalEntry = {
        id: entryId,
        financial_year_id: null,
        journal_no: `ADJ-${entryId}`,
        journal_date: journalDate,
        reference_type: "ADJUSTMENT",
        reference_id: null,
        source_module: "Manual",
        description: description || "Manual adjustment entry",
        total_debit: totalDebit,
        total_credit: totalCredit,
        status: "POSTED",
        lines: lines.map((l, idx) => ({
          id: entryId * 10 + idx,
          journal_entry_id: entryId,
          account_id: Number(l.accountId),
          description: description || null,
          debit: Number(l.debit) || 0,
          credit: Number(l.credit) || 0,
        })),
      };

      onSaved(newEntry);
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="New Adjustment Entry"
      size="lg"
      scrollable
      closeOnOverlayClick={false}
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} loading={saving} disabled={!balanced}>
            Post Adjustment
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-3">
          <Input label="Journal Date" type="date" value={journalDate} onChange={(e) => setJournalDate(e.target.value)} />
          <Input label="Description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="e.g. Stock write-off adjustment" />
        </div>

        <div className="rounded-lg border border-border bg-background/60 p-3">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm font-medium text-secondary">Lines</p>
            <button type="button" onClick={addLine} className="flex items-center gap-1 text-xs font-medium text-primary-dark hover:underline">
              <Plus className="h-3.5 w-3.5" /> Add Line
            </button>
          </div>

          <div className="flex flex-col gap-2">
            {lines.map((line) => (
              <div key={line.id} className="grid grid-cols-[1fr_100px_100px_auto] items-end gap-2">
                <Select
                  value={line.accountId}
                  options={accounts.map((a) => ({ label: `${a.account_code} — ${a.account_name}`, value: a.id.toString() }))}
                  onChange={(e) => updateLine(line.id, { accountId: Number(e.target.value) })}
                />
                <input
                  type="number"
                  placeholder="Debit"
                  value={line.debit || ""}
                  onChange={(e) => updateLine(line.id, { debit: Number(e.target.value), credit: 0 })}
                  className="rounded-md border border-border bg-surface px-2 py-1.5 text-right text-sm outline-none focus:ring-1 focus:ring-primary"
                />
                <input
                  type="number"
                  placeholder="Credit"
                  value={line.credit || ""}
                  onChange={(e) => updateLine(line.id, { credit: Number(e.target.value), debit: 0 })}
                  className="rounded-md border border-border bg-surface px-2 py-1.5 text-right text-sm outline-none focus:ring-1 focus:ring-primary"
                />
                <button
                  type="button"
                  onClick={() => removeLine(line.id)}
                  disabled={lines.length <= 2}
                  className="rounded-md p-1.5 text-text-muted hover:bg-danger/10 hover:text-danger disabled:cursor-not-allowed disabled:opacity-30"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className={`rounded-lg border p-3 text-sm ${balanced ? "border-success/30 bg-success/5" : "border-danger/30 bg-danger/5"}`}>
          <div className="flex justify-between text-text-muted">
            <span>Total Debit</span>
            <span>{totalDebit.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
          </div>
          <div className="flex justify-between text-text-muted">
            <span>Total Credit</span>
            <span>{totalCredit.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
          </div>
          <div className={`mt-1 flex justify-between border-t pt-1 font-semibold ${balanced ? "border-success/30 text-success" : "border-danger/30 text-danger"}`}>
            <span>{balanced ? "Balanced" : "Not Balanced"}</span>
            <span>{Math.abs(totalDebit - totalCredit).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
          </div>
        </div>

        {error && <p className="text-xs text-danger">{error}</p>}
      </div>
    </Modal>
  );
}