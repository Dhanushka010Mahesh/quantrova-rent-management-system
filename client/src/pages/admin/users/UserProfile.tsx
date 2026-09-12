import { useState } from "react";
import { UserCircle2, Camera, Save } from "lucide-react";
import { mockCurrentUser } from "../../../types/userProfile";
import type { UserProfile as UserProfileType } from "../../../types/userProfile";
import PageContainer from "../../../layout/PageContainer";
import Badge from "../../../components/ui/others/Badge";
import Input from "../../../components/ui/input/Input";
import Button from "../../../components/ui/button/Button";
import ChangePasswordSection from "../../../components/users/ChangePasswordSection";

const UserProfile = () => {
  const [user, setUser] = useState<UserProfileType>(mockCurrentUser);
  const [form, setForm] = useState({ name: user.name, email: user.email, phone: user.phone });
  const [avatarPreview, setAvatarPreview] = useState<string | null>(user.avatarUrl);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleAvatarChange = (file: File | null) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setAvatarPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const validate = () => {
    const next: Record<string, string> = {};
    if (!form.name.trim()) next.name = "Name is required";
    if (!form.email.trim()) next.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = "Invalid email format";
    if (!form.phone.trim()) next.phone = "Phone is required";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSave = async () => {
    setSaved(false);
    if (!validate()) return;
    setSaving(true);
    try {
      // TODO: replace with real API call e.g. PATCH /api/auth/me
      await new Promise((r) => setTimeout(r, 700));
      setUser((prev) => ({ ...prev, ...form, avatarUrl: avatarPreview }));
      setSaved(true);
    } finally {
      setSaving(false);
    }
  };

  return (
    <PageContainer
      title="My Profile"
      subtitle="View and update your account information"
      breadcrumbs={[{ label: "Profile" }]}
      icon={<UserCircle2 className="h-5 w-5" />}
    >
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {/* Left: avatar + account info */}
        <div className="flex flex-col gap-4 lg:col-span-1">
          <div className="rounded-xl border border-border bg-surface p-4 text-center">
            <div className="relative mx-auto h-24 w-24">
              <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-primary/15 text-2xl font-semibold text-primary-dark">
                {avatarPreview ? (
                  <img src={avatarPreview} alt={user.name} className="h-full w-full object-cover" />
                ) : (
                  user.name
                    .split(" ")
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join("")
                )}
              </div>
              <label className="absolute bottom-0 right-0 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-primary text-white shadow-sm hover:bg-primary-dark">
                <Camera className="h-3.5 w-3.5" />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleAvatarChange(e.target.files?.[0] ?? null)}
                />
              </label>
            </div>

            <p className="mt-3 text-base font-semibold text-secondary">{user.name}</p>
            <p className="text-xs text-text-muted">{user.email}</p>
            <div className="mt-2 flex justify-center">
              <Badge variant="info">{user.role}</Badge>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-surface p-4">
            <p className="mb-3 text-sm font-semibold text-secondary">Account Info</p>
            <div className="flex flex-col gap-2.5 text-sm">
              <div className="flex justify-between">
                <span className="text-text-muted">User ID</span>
                <span className="text-text">{user.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Joined</span>
                <span className="text-text">{user.joinedDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Last Login</span>
                <span className="text-text">{new Date(user.lastLogin).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: edit form + password */}
        <div className="flex flex-col gap-4 lg:col-span-2">
          <div className="rounded-xl border border-border bg-surface p-4">
            <p className="mb-3 text-sm font-semibold text-secondary">Personal Information</p>

            <div className="flex flex-col gap-3.5">
              <Input
                label="Full Name"
                value={form.name}
                error={errors.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Email"
                  type="email"
                  value={form.email}
                  error={errors.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
                <Input
                  label="Phone"
                  value={form.phone}
                  error={errors.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
              </div>

              {saved && <p className="text-xs font-medium text-success">Profile updated successfully.</p>}

              <Button icon={<Save className="h-4 w-4" />} onClick={handleSave} loading={saving} className="w-fit">
                Save Changes
              </Button>
            </div>
          </div>

          <ChangePasswordSection />
        </div>
      </div>
    </PageContainer>
  );
};

export default UserProfile;