import { useEffect, useState } from "react";
import Modal from "../ui/modal/Modal";
import Input from "../ui/input/Input";
import Select from "../ui/select/Select";
import Button from "../ui/button/Button";
import type { AppUser } from "../../types/user";

interface UserFormModalProps {
  open: boolean;
  onClose: () => void;
  onSaved: (user: AppUser) => void;
  user: AppUser | null; // null = create, otherwise = edit
  mode: "create" | "edit" | "view";
}

const emptyForm = { name: "", email: "", phone: "", role: "Staff" as AppUser["role"] };

export default function UserFormModal({ open, onClose, onSaved, user, mode }: UserFormModalProps) {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const readOnly = mode === "view";

  useEffect(() => {
    if (open) {
      setForm(user ? { name: user.name, email: user.email, phone: user.phone, role: user.role } : emptyForm);
      setErrors({});
    }
  }, [open, user]);

  const validate = () => {
    const next: Record<string, string> = {};
    if (!form.name.trim()) next.name = "Name is required";
    if (!form.email.trim()) next.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = "Invalid email format";
    if (!form.phone.trim()) next.phone = "Phone is required";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async () => {
    if (readOnly) return onClose();
    if (!validate()) return;

    setSaving(true);
    try {
      // TODO: replace with real API call (POST for create, PATCH for edit)
      await new Promise((r) => setTimeout(r, 700));

      const saved: AppUser = {
        id: user?.id ?? crypto.randomUUID(),
        ...form,
        active: user?.active ?? true,
        createdAt: user?.createdAt ?? new Date().toISOString(),
      };
      onSaved(saved);
      onClose();
    } finally {
      setSaving(false);
    }
  };

  const titleMap = { create: "Add User", edit: "Edit User", view: "User Details" };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={titleMap[mode]}
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            {readOnly ? "Close" : "Cancel"}
          </Button>
          {!readOnly && (
            <Button onClick={handleSubmit} loading={saving}>
              {mode === "create" ? "Create User" : "Save Changes"}
            </Button>
          )}
        </>
      }
    >
      <div className="flex flex-col gap-3.5">
        <Input
          label="Full Name"
          value={form.name}
          disabled={readOnly}
          error={errors.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <Input
          label="Email"
          type="email"
          value={form.email}
          disabled={readOnly}
          error={errors.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <Input
          label="Phone"
          value={form.phone}
          disabled={readOnly}
          error={errors.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />
        <Select
          label="Role"
          value={form.role}
          disabled={readOnly}
          options={[
            { label: "Admin", value: "Admin" },
            { label: "Manager", value: "Manager" },
            { label: "Staff", value: "Staff" },
          ]}
          onChange={(e) => setForm({ ...form, role: e.target.value as AppUser["role"] })}
        />
      </div>
    </Modal>
  );
}