import { useEffect, useMemo, useState } from "react";
import {
  Plus,
  Pencil,
  Eye,
  Search,
  Users as UsersIcon,
  UserCheck,
  UserX,
} from "lucide-react";

import type { Column } from "../../../components/ui/table/DataTable";
import type { AppUser } from "../../../types/user";

import Badge from "../../../components/ui/others/Badge";
import StatusToggle from "../../../components/ui/others/StatusToggle";
import PageContainer from "../../../layout/PageContainer";
import Button from "../../../components/ui/button/Button";
import Input from "../../../components/ui/input/Input";
import DetailsTable from "../../../components/ui/table/DetailsTable";
import UserFormModal from "../../../components/users/UserFormModal";

const roleVariant: Record<
  AppUser["role"],
  "info" | "success" | "neutral"
> = {
  Admin: "info",
  Manager: "success",
  Staff: "neutral",
};

export default function Users() {
  const [users, setUsers] = useState<AppUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit" | "view">(
    "create"
  );
  const [activeUser, setActiveUser] = useState<AppUser | null>(null);

  useEffect(() => {
    // TODO: Replace with real API call
    // GET /api/users

    const timer = setTimeout(() => {
      setUsers([
        {
          id: "1",
          name: "Sunil Perera",
          email: "sunil@company.lk",
          phone: "0771234567",
          role: "Admin",
          active: true,
          createdAt: "2026-01-12",
        },
        {
          id: "2",
          name: "Kamal Fernando",
          email: "kamal@company.lk",
          phone: "0719876543",
          role: "Manager",
          active: true,
          createdAt: "2026-02-03",
        },
        {
          id: "3",
          name: "Nadeesha Silva",
          email: "nadeesha@company.lk",
          phone: "0765554321",
          role: "Staff",
          active: false,
          createdAt: "2026-03-21",
        },
      ]);

      setLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return users;
    }

    return users.filter(
      (user) =>
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.phone.includes(query) ||
        user.role.toLowerCase().includes(query)
    );
  }, [users, search]);

  const activeUsers = useMemo(
    () => users.filter((user) => user.active).length,
    [users]
  );

  const inactiveUsers = useMemo(
    () => users.filter((user) => !user.active).length,
    [users]
  );

  const openCreate = () => {
    setActiveUser(null);
    setModalMode("create");
    setModalOpen(true);
  };

  const openEdit = (user: AppUser) => {
    setActiveUser(user);
    setModalMode("edit");
    setModalOpen(true);
  };

  const openView = (user: AppUser) => {
    setActiveUser(user);
    setModalMode("view");
    setModalOpen(true);
  };

  const handleSaved = (saved: AppUser) => {
    setUsers((prev) => {
      const exists = prev.some((user) => user.id === saved.id);

      return exists
        ? prev.map((user) => (user.id === saved.id ? saved : user))
        : [saved, ...prev];
    });

    setModalOpen(false);
  };

  const handleStatusChange = async (
    user: AppUser,
    nextStatus: boolean
  ) => {
    // Optimistic update
    setUsers((prev) =>
      prev.map((item) =>
        item.id === user.id
          ? { ...item, active: nextStatus }
          : item
      )
    );

    // TODO:
    // PATCH /api/users/:id
    // { active: nextStatus }
  };

  const columns = useMemo<Column<AppUser>[]>(
    () => [
      {
        key: "name",
        header: "User",
        sortable: true,
        render: (row) => (
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary-dark">
              {row.name.charAt(0).toUpperCase()}
            </div>

            <div className="min-w-0">
              <p className="truncate font-medium text-secondary">
                {row.name}
              </p>

              <p className="truncate text-xs text-text-muted">
                {row.email}
              </p>
            </div>
          </div>
        ),
      },

      {
        key: "phone",
        header: "Phone",
      },

      {
        key: "role",
        header: "Role",
        render: (row) => (
          <Badge variant={roleVariant[row.role]}>
            {row.role}
          </Badge>
        ),
      },

      {
        key: "active",
        header: "Status",
        render: (row) => (
          <StatusToggle
            active={row.active}
            onChange={(next) => handleStatusChange(row, next)}
          />
        ),
      },

      {
        key: "createdAt",
        header: "Joined",
        sortable: true,
        render: (row) => (
          <span className="text-sm text-text-muted">
            {row.createdAt}
          </span>
        ),
      },

      {
        key: "id",
        header: "Actions",
        render: (row) => (
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                openView(row);
              }}
              className="rounded-lg p-2 text-text-muted transition-colors hover:bg-background hover:text-secondary"
              aria-label={`View ${row.name}`}
              title="View user"
            >
              <Eye className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                openEdit(row);
              }}
              className="rounded-lg p-2 text-text-muted transition-colors hover:bg-primary/10 hover:text-primary-dark"
              aria-label={`Edit ${row.name}`}
              title="Edit user"
            >
              <Pencil className="h-4 w-4" />
            </button>
          </div>
        ),
      },
    ],
    []
  );

  return (
    <PageContainer
      title="Users"
      subtitle="Manage admin panel users, roles and access status"
      breadcrumbs={[{ label: "Users" }]}
      // icon={<UsersIcon className="h-5 w-5" />}
      actions={
        <Button
          icon={<Plus className="h-4 w-4" />}
          onClick={openCreate}
        >
          Add User
        </Button>
      }
    >
      {/* Summary Cards */}
      <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
        
        <div className="flex items-center gap-3 rounded-xl border border-border bg-surface px-4 py-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary-dark">
            <UsersIcon className="h-4 w-4" />
          </div>

          <div>
            <p className="text-xs font-medium text-text-muted">
              Total Users
            </p>
            <p className="text-lg font-semibold leading-tight text-secondary">
              {users.length}
            </p>
          </div>
        </div>

        
        <div className="flex items-center gap-3 rounded-xl border border-border bg-surface px-4 py-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-success/10 text-success">
            <UserCheck className="h-4 w-4" />
          </div>

          <div>
            <p className="text-xs font-medium text-text-muted">
              Active Users
            </p>
            <p className="text-lg font-semibold leading-tight text-secondary">
              {activeUsers}
            </p>
          </div>
        </div>

       
        <div className="flex items-center gap-3 rounded-xl border border-border bg-surface px-4 py-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-background text-text-muted">
            <UserX className="h-4 w-4" />
          </div>

          <div>
            <p className="text-xs font-medium text-text-muted">
              Inactive Users
            </p>
            <p className="text-lg font-semibold leading-tight text-secondary">
              {inactiveUsers}
            </p>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="overflow-hidden rounded-xl border border-border bg-surface">
        {/* Table Toolbar */}
        <div className="flex flex-col gap-3 border-b border-border px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-sm font-semibold text-secondary">
              User List
            </h2>

            <p className="mt-0.5 text-xs text-text-muted">
              {search
                ? `${filteredUsers.length} result${
                    filteredUsers.length !== 1 ? "s" : ""
                  } found`
                : `${users.length} user${
                    users.length !== 1 ? "s" : ""
                  }`}
            </p>
          </div>

          <div className="w-full sm:w-72">
            <Input
              placeholder="Search users..."
              icon={<Search className="h-4 w-4" />}
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
        </div>

        {/* Data Table */}
        <DetailsTable
          columns={columns}
          data={filteredUsers}
          rowKey="id"
          loading={loading}
          renderDetails={(row) => (
            <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-sm sm:grid-cols-4">
              <div>
                <p className="mb-0.5 text-[11px] font-medium uppercase tracking-wide text-text-muted">
                  User ID
                </p>
                <p className="text-text">{row.id}</p>
              </div>

              <div>
                <p className="mb-0.5 text-[11px] font-medium uppercase tracking-wide text-text-muted">
                  Email
                </p>
                <p className="truncate text-text">{row.email}</p>
              </div>

              <div>
                <p className="mb-0.5 text-[11px] font-medium uppercase tracking-wide text-text-muted">
                  Role
                </p>
                <p className="text-text">{row.role}</p>
              </div>

              <div>
                <p className="mb-0.5 text-[11px] font-medium uppercase tracking-wide text-text-muted">
                  Joined
                </p>
                <p className="text-text">{row.createdAt}</p>
              </div>
            </div>
          )}
        />
      </div>

      {/* User Modal */}
      <UserFormModal
        open={modalOpen}
        mode={modalMode}
        user={activeUser}
        onClose={() => setModalOpen(false)}
        onSaved={handleSaved}
      />
    </PageContainer>
  );
}