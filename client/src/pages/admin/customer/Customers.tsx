import { useEffect, useMemo, useState } from "react";
import { Plus, Pencil, Eye, Search } from "lucide-react";
import DataTable, { type Column } from "../../../components/ui/table/DataTable";
import CustomerFormModal from "../../../components/customers/CustomerFormModal";
import type { Customer } from "../../../types/customer";
import StatusToggle from "../../../components/ui/others/StatusToggle";
import PageContainer from "../../../layout/PageContainer";
import Button from "../../../components/ui/button/Button";
import Input from "../../../components/ui/input/Input";
import PageTitle from "../../../components/ui/others/PageTitle";

export default function Customers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit" | "view">("create");
  const [activeCustomer, setActiveCustomer] = useState<Customer | null>(null);

  useEffect(() => {
    // TODO: replace with real API call e.g. GET /api/customers
    setTimeout(() => {
      setCustomers([
        { id: "1", name: "Ruwan Jayasuriya", email: "ruwan@mail.com", phone: "0771112233", address: "No. 12, Galle Road, Colombo", active: true, createdAt: "2026-01-05", creditBalance: 5000 },
        { id: "2", name: "Chathurika Perera", email: "chathu@mail.com", phone: "0752223344", address: "45/2, Kandy Road, Kurunegala", active: true, createdAt: "2026-02-18", creditBalance: 0 },
        { id: "3", name: "Dinesh Bandara", email: "dinesh@mail.com", phone: "0783334455", address: "78, Main Street, Kalmunai", active: false, createdAt: "2026-03-09", creditBalance: 0 },
      ]);
      setLoading(false);
    }, 800);
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return customers;
    return customers.filter(
      (c) => c.name.toLowerCase().includes(q) || (c.email?.toLowerCase().includes(q) ?? false) || c.phone.includes(q)
    );
  }, [customers, search]);

  const openCreate = () => {
    setActiveCustomer(null);
    setModalMode("create");
    setModalOpen(true);
  };

  const openEdit = (customer: Customer) => {
    setActiveCustomer(customer);
    setModalMode("edit");
    setModalOpen(true);
  };

  const openView = (customer: Customer) => {
    setActiveCustomer(customer);
    setModalMode("view");
    setModalOpen(true);
  };

  const handleSaved = (saved: Customer) => {
    setCustomers((prev) => {
      const exists = prev.some((c) => c.id === saved.id);
      return exists ? prev.map((c) => (c.id === saved.id ? saved : c)) : [saved, ...prev];
    });
  };

  const handleStatusChange = async (customer: Customer, next: boolean) => {
    setCustomers((prev) => prev.map((c) => (c.id === customer.id ? { ...c, active: next } : c)));
    // TODO: replace with real API call e.g. PATCH /api/customers/:id { active: next }
  };

  const columns: Column<Customer>[] = [
    { key: "name", header: "Name", sortable: true },
    { key: "email", header: "Email" },
    { key: "phone", header: "Phone" },
    { key: "address", header: "Address" },
    {
      key: "active",
      header: "Status",
      render: (row) => <StatusToggle active={row.active ?? true} onChange={(next) => handleStatusChange(row, next)} />,
    },
    {
      key: "id",
      header: "Actions",
      render: (row) => (
        <div className="flex items-center gap-1.5">
          <button
            onClick={(e) => {
              e.stopPropagation();
              openView(row);
            }}
            className="rounded-lg p-1.5 text-text-muted hover:bg-background hover:text-secondary"
            aria-label="View"
          >
            <Eye className="h-4 w-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              openEdit(row);
            }}
            className="rounded-lg p-1.5 text-text-muted hover:bg-background hover:text-secondary"
            aria-label="Edit"
          >
            <Pencil className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <PageContainer
      title="Customers"
      subtitle="Manage your customer records"
      breadcrumbs={[{ label: "Customers" }]}
      actions={
        <Button icon={<Plus className="h-4 w-4" />} onClick={openCreate}>
          Add Customer
        </Button>
      }
    >
      <div className="mb-4 max-w-xs">
        <Input
          placeholder="Search by name, email, phone..."
          icon={<Search className="h-4 w-4" />}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <DataTable columns={columns} data={filtered} rowKey="id" loading={loading} pageSize={10} />

      <CustomerFormModal
        open={modalOpen}
        mode={modalMode}
        customer={activeCustomer}
        onClose={() => setModalOpen(false)}
        onSaved={handleSaved}
      />

      <PageTitle title="Customers" />
    </PageContainer>
  );
}