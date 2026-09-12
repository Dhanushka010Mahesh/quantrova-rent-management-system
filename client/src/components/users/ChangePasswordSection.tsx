import { useState } from "react";
import { KeyRound } from "lucide-react";
import Input from "../ui/input/Input";
import Button from "../ui/button/Button";

export default function ChangePasswordSection() {
  const [form, setForm] = useState({ current: "", next: "", confirm: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const validate = () => {
    const next: Record<string, string> = {};
    if (!form.current) next.current = "Enter your current password";
    if (!form.next) next.next = "Enter a new password";
    else if (form.next.length < 8) next.next = "Password must be at least 8 characters";
    if (form.confirm !== form.next) next.confirm = "Passwords don't match";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async () => {
    setSuccess(false);
    if (!validate()) return;
    setSaving(true);
    try {
      // TODO: replace with real API call e.g. POST /api/auth/change-password
      await new Promise((r) => setTimeout(r, 700));
      setForm({ current: "", next: "", confirm: "" });
      setSuccess(true);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="rounded-xl border border-border bg-surface p-4">
      <div className="mb-3 flex items-center gap-1.5 text-sm font-semibold text-secondary">
        <KeyRound className="h-4 w-4" /> Change Password
      </div>

      <div className="flex flex-col gap-3.5">
        <Input
          label="Current Password"
          type="password"
          value={form.current}
          error={errors.current}
          onChange={(e) => setForm({ ...form, current: e.target.value })}
        />
        <Input
          label="New Password"
          type="password"
          value={form.next}
          error={errors.next}
          onChange={(e) => setForm({ ...form, next: e.target.value })}
        />
        <Input
          label="Confirm New Password"
          type="password"
          value={form.confirm}
          error={errors.confirm}
          onChange={(e) => setForm({ ...form, confirm: e.target.value })}
        />

        {success && <p className="text-xs font-medium text-success">Password updated successfully.</p>}

        <Button onClick={handleSubmit} loading={saving} className="w-fit">
          Update Password
        </Button>
      </div>
    </div>
  );
}