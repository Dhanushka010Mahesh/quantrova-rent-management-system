import { useEffect, useMemo, useState } from "react";
import { Plus, Eye, Pencil, Search, XCircle, TrendingUp, Tag } from "lucide-react";
import type { Income as IncomeType, IncomeCategory, IncomeStatus } from "../../../types/income";
import type { Column } from "../../../components/ui/table/DataTable";
import Badge from "../../../components/ui/others/Badge";
import PageContainer from "../../../layout/PageContainer";
import Button from "../../../components/ui/button/Button";
import Input from "../../../components/ui/input/Input";
import DataTable from "../../../components/ui/table/DataTable";
import IncomeFormModal from "../../../components/income/IncomeFormModal";
import IncomeCategoryFormModal from "../../../components/income/IncomeCategoryFormModal";

const statusVariant: Record<IncomeStatus, "success" | "warning" | "danger"> = {
  Approved: "success",
  Pending: "warning",
  Cancelled: "danger",
};

const methodLabel: Record<string, string> = {
  CASH: "Cash",
  BANK: "Bank",
  CHEQUE: "Cheque",
  EXISTING_CHEQUE: "Existing Cheque",
};

const Income = () => {
  const [categories, setCategories] = useState<IncomeCategory[]>([]);
  const [incomes, setIncomes] = useState<IncomeType[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [incomeModalOpen, setIncomeModalOpen] = useState(false);
  const [incomeModalMode, setIncomeModalMode] = useState<"create" | "edit" | "view">("create");
  const [activeIncome, setActiveIncome] = useState<IncomeType | null>(null);

  const [categoryModalOpen, setCategoryModalOpen] = useState(false);

  useEffect(() => {
    // TODO: replace with real API calls e.g. GET /api/income-categories, GET /api/incomes
    setTimeout(() => {
      setCategories([
        { id: "cat1", name: "Product Sales" },
        { id: "cat2", name: "Service Income" },
        { id: "cat3", name: "Other Income" },
      ]);

      setIncomes([
        {
          id: "IN001",
          categoryId: "cat1",
          categoryName: "Product Sales",
          description: "Bulk order - Retailer A",
          amount: 125000,
          date: "2026-08-18",
          status: "Approved",
          payment: { method: "BANK", bank_account_id: 1, payee_name: "", payer_name: "Retailer A" },
          createdAt: "2026-08-18",
        },
        {
          id: "IN002",
          categoryId: "cat2",
          categoryName: "Service Income",
          description: "Installation service fee",
          amount: 8500,
          date: "2026-08-24",
          status: "Pending",
          payment: null,
          createdAt: "2026-08-24",
        },
        {
          id: "IN003",
          categoryId: "cat1",
          categoryName: "Product Sales",
          description: "Walk-in counter sale",
          amount: 3200,
          date: "2026-08-26",
          status: "Approved",
          payment: { method: "CASH", cash_id: 1 },
          createdAt: "2026-08-26",
        },
      ]);
      setLoading(false);
    }, 800);
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return incomes;
    return incomes.filter(
      (i) => i.description.toLowerCase().includes(q) || i.categoryName.toLowerCase().includes(q)
    );
  }, [incomes, search]);

  const openCreate = () => {
    setActiveIncome(null);
    setIncomeModalMode("create");
    setIncomeModalOpen(true);
  };

  const openEdit = (income: IncomeType) => {
    if (income.status !== "Pending") return; // only Pending can be edited / approved
    setActiveIncome(income);
    setIncomeModalMode("edit");
    setIncomeModalOpen(true);
  };

  const openView = (income: IncomeType) => {
    setActiveIncome(income);
    setIncomeModalMode("view");
    setIncomeModalOpen(true);
  };

  const handleSaved = (saved: IncomeType) => {
    setIncomes((prev) => {
      const exists = prev.some((i) => i.id === saved.id);
      return exists ? prev.map((i) => (i.id === saved.id ? saved : i)) : [saved, ...prev];
    });
  };

  const handleCategorySaved = (category: IncomeCategory) => {
    setCategories((prev) => [...prev, category]);
  };

  const handleCancel = async (income: IncomeType) => {
    if (income.status === "Cancelled") return;
    if (!window.confirm(`Cancel income "${income.description}"? This can't be undone.`)) return;
    // TODO: replace with real API call e.g. PATCH /api/incomes/:id { status: "Cancelled" }
    setIncomes((prev) => prev.map((i) => (i.id === income.id ? { ...i, status: "Cancelled" } : i)));
  };

  const columns: Column<IncomeType>[] = [
    { key: "date", header: "Date", sortable: true },
    { key: "categoryName", header: "Category" },
    { key: "description", header: "Description" },
    {
      key: "amount",
      header: "Amount",
      render: (row) => (
        <span className="font-medium text-secondary">
          {row.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </span>
      ),
    },
    {
      key: "payment",
      header: "Payment",
      render: (row) => (row.payment ? <Badge variant="info">{methodLabel[row.payment.method]}</Badge> : <span className="text-text-muted">—</span>),
    },
    {
      key: "status",
      header: "Status",
      render: (row) => <Badge variant={statusVariant[row.status]}>{row.status}</Badge>,
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
            disabled={row.status !== "Pending"}
            className="rounded-lg p-1.5 text-text-muted hover:bg-background hover:text-secondary disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent"
            aria-label="Edit / Approve"
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleCancel(row);
            }}
            disabled={row.status === "Cancelled"}
            className="rounded-lg p-1.5 text-text-muted hover:bg-danger/10 hover:text-danger disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent"
            aria-label="Cancel"
          >
            <XCircle className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <PageContainer
      title="Income"
      subtitle="Track and manage all company income"
      breadcrumbs={[{ label: "Accounts" }, { label: "Income" }]}
      icon={<TrendingUp className="h-5 w-5" />}
      actions={
        <>
          <Button variant="outline" icon={<Tag className="h-4 w-4" />} onClick={() => setCategoryModalOpen(true)}>
            Add Category
          </Button>
          <Button icon={<Plus className="h-4 w-4" />} onClick={openCreate}>
            Create Income
          </Button>
        </>
      }
    >
      <div className="mb-4 max-w-xs">
        <Input
          placeholder="Search by description, category..."
          icon={<Search className="h-4 w-4" />}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <DataTable columns={columns} data={filtered} loading={loading} rowKey="id" pageSize={10} />

      <IncomeFormModal
        open={incomeModalOpen}
        mode={incomeModalMode}
        income={activeIncome}
        categories={categories}
        onClose={() => setIncomeModalOpen(false)}
        onSaved={handleSaved}
      />

      <IncomeCategoryFormModal
        open={categoryModalOpen}
        onClose={() => setCategoryModalOpen(false)}
        onSaved={handleCategorySaved}
      />
    </PageContainer>
  );
};

export default Income;