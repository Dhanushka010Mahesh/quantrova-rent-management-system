import { Plus, Trash2, CheckCircle2 } from "lucide-react";
import Input from "../ui/input/Input";
import ImageUploadGrid from "./ImageUploadGrid";
// import { findGuarantorByNic } from "../../data/mockGuarantors";
import { findGuarantorByNic, type Guarantor } from "../../types/rental";

interface GuarantorsPanelProps {
  guarantors: Guarantor[];
  onChange: (guarantors: Guarantor[]) => void;
}

function emptyGuarantor(): Guarantor {
  return { id: crypto.randomUUID(), name: "", nic: "", phone: "", address: "", imageDataUrl: null };
}

export default function GuarantorsPanel({ guarantors, onChange }: GuarantorsPanelProps) {
  const addGuarantor = () => onChange([...guarantors, emptyGuarantor()]);
  const removeGuarantor = (id: string) => onChange(guarantors.filter((g) => g.id !== id));
  const updateGuarantor = (id: string, patch: Partial<Guarantor>) =>
    onChange(guarantors.map((g) => (g.id === id ? { ...g, ...patch } : g)));

  const handleNicBlur = (id: string, nic: string) => {
    const match = findGuarantorByNic(nic);
    if (match) {
      updateGuarantor(id, { ...match, id });
    } else {
      // no match — clear any previously auto-filled link, keep the typed NIC
      updateGuarantor(id, { guarantorId: undefined });
    }
  };

  return (
    <div className="rounded-xl border border-border bg-surface p-4">
      <div className="mb-2 flex items-center justify-between">
        <p className="text-sm font-semibold text-secondary">Guarantors</p>
        <button
          type="button"
          onClick={addGuarantor}
          className="flex items-center gap-1 text-xs font-medium text-primary-dark hover:underline"
        >
          <Plus className="h-3.5 w-3.5" /> Add Guarantor
        </button>
      </div>

      {guarantors.length === 0 && <p className="text-xs text-text-muted">No guarantors added.</p>}

      <div className="flex flex-col gap-3">
        {guarantors.map((g, idx) => (
          <div key={g.id} className="rounded-lg border border-border bg-background/60 p-3">
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <p className="text-xs font-medium text-text-muted">Guarantor {idx + 1}</p>
                {g.guarantorId && (
                  <span className="flex items-center gap-1 text-[11px] font-medium text-success">
                    <CheckCircle2 className="h-3 w-3" /> Existing record found
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={() => removeGuarantor(g.id)}
                className="rounded-md p-1 text-text-muted hover:bg-danger/10 hover:text-danger"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Input
                label="NIC"
                value={g.nic}
                placeholder="Type NIC and tab out to auto-fill"
                onChange={(e) => updateGuarantor(g.id, { nic: e.target.value, guarantorId: undefined })}
                onBlur={() => handleNicBlur(g.id, g.nic)}
              />
              <Input
                label="Full Name"
                value={g.name}
                onChange={(e) => updateGuarantor(g.id, { name: e.target.value })}
              />
            </div>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <Input
                label="Phone"
                value={g.phone}
                onChange={(e) => updateGuarantor(g.id, { phone: e.target.value })}
              />
              <Input
                label="Address"
                value={g.address}
                onChange={(e) => updateGuarantor(g.id, { address: e.target.value })}
              />
            </div>

            <div className="mt-3">
              <p className="mb-1.5 text-xs font-medium text-text-muted">Photo / NIC Copy</p>
              <ImageUploadGrid
                images={g.imageDataUrl ? [g.imageDataUrl] : []}
                onChange={(imgs) => updateGuarantor(g.id, { imageDataUrl: imgs[0] ?? null })}
                max={1}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}