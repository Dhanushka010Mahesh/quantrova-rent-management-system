import { useEffect, useMemo, useState } from "react";
import { ShieldCheck, Save, Check } from "lucide-react";
// import PageContainer from "../../layout/PageContainer";
// import Select from "../../components/ui/select/Select";
// import Button from "../../components/ui/button/Button";
// import Badge from "../../components/ui/others/Badge";
// import { availableRoles, mockPermissions, mockRolePermissions } from "../../data/mockPermissions";
import PageContainer from "../../../layout/PageContainer";
import Button from "../../../components/ui/button/Button";
import Select from "../../../components/ui/select/Select";
import Badge from "../../../components/ui/others/Badge";
import { availableRoles, mockPermissions, mockRolePermissions } from "../../../types/rolePermission";

const RolePermissions = () => {
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<string>("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    // TODO: replace with real API call e.g. GET /api/roles
    setTimeout(() => {
      setRole(availableRoles[0]);
      setLoading(false);
    }, 500);
  }, []);

  useEffect(() => {
    if (!role) return;
    // TODO: replace with real API call e.g. GET /api/roles/:role/permissions
    const map = mockRolePermissions.find((r) => r.role === role);
    setSelectedIds(new Set(map?.permissionIds ?? []));
    setSaved(false);
  }, [role]);

  const grouped = useMemo(() => {
    const groups: Record<string, typeof mockPermissions> = {};
    for (const perm of mockPermissions) {
      if (!groups[perm.category]) groups[perm.category] = [];
      groups[perm.category].push(perm);
    }
    return groups;
  }, []);

  const togglePermission = (id: string) => {
    setSaved(false);
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleCategory = (category: string, allSelected: boolean) => {
    setSaved(false);
    setSelectedIds((prev) => {
      const next = new Set(prev);
      const ids = grouped[category].map((p) => p.id);
      if (allSelected) {
        ids.forEach((id) => next.delete(id));
      } else {
        ids.forEach((id) => next.add(id));
      }
      return next;
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // TODO: replace with real API call e.g. PATCH /api/roles/:role/permissions { permissionIds }
      await new Promise((r) => setTimeout(r, 700));
      const existing = mockRolePermissions.find((r) => r.role === role);
      if (existing) existing.permissionIds = Array.from(selectedIds);
      setSaved(true);
    } finally {
      setSaving(false);
    }
  };

  return (
    <PageContainer
      title="Role Permissions"
      subtitle="Select a role to view and manage its permissions"
      breadcrumbs={[{ label: "System" }, { label: "Role Permissions" }]}
      icon={<ShieldCheck className="h-5 w-5" />}
      actions={
        <Button icon={<Save className="h-4 w-4" />} onClick={handleSave} loading={saving} disabled={!role || loading}>
          Save Changes
        </Button>
      }
    >
      <div className="mb-5 flex flex-wrap items-end gap-3">
        <div className="w-64">
          <Select
            label="Role"
            value={role}
            disabled={loading}
            options={availableRoles.map((r) => ({ label: r, value: r }))}
            onChange={(e) => setRole(e.target.value)}
          />
        </div>

        <div className="mb-0.5 flex items-center gap-2 text-sm text-text-muted">
          <span>{selectedIds.size} of {mockPermissions.length} permissions enabled</span>
        </div>

        {saved && (
          <div className="mb-0.5 flex items-center gap-1 text-sm font-medium text-success">
            <Check className="h-4 w-4" /> Saved
          </div>
        )}
      </div>

      {loading ? (
        <div className="rounded-xl border border-border bg-surface p-6 text-center text-sm text-text-muted">
          Loading roles...
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {Object.entries(grouped).map(([category, perms]) => {
            const allSelected = perms.every((p) => selectedIds.has(p.id));
            const someSelected = perms.some((p) => selectedIds.has(p.id));

            return (
              <div key={category} className="rounded-xl border border-border bg-surface p-4">
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-secondary">{category}</p>
                    {someSelected && (
                      <Badge variant={allSelected ? "success" : "neutral"}>
                        {allSelected ? "All enabled" : `${perms.filter((p) => selectedIds.has(p.id)).length}/${perms.length}`}
                      </Badge>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleCategory(category, allSelected)}
                    className="text-xs font-medium text-primary-dark hover:underline"
                  >
                    {allSelected ? "Deselect all" : "Select all"}
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {perms.map((perm) => {
                    const checked = selectedIds.has(perm.id);
                    return (
                      <label
                        key={perm.id}
                        className={`flex cursor-pointer items-center gap-2.5 rounded-lg border px-3 py-2 text-sm transition-colors ${
                          checked
                            ? "border-primary/40 bg-primary/10 text-secondary"
                            : "border-border bg-background text-text-muted hover:bg-border/30"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => togglePermission(perm.id)}
                          className="h-4 w-4 rounded border-border-dark text-primary accent-primary"
                        />
                        {perm.label}
                      </label>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </PageContainer>
  );
};

export default RolePermissions;