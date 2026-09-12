import { useEffect, useMemo, useState } from "react";
import { Plus, Eye, Pencil, Search, XCircle, Receipt, Tag } from "lucide-react";
import type { Expense, ExpenseCategory, ExpenseStatus } from "../../../types/expense";
import Badge from "../../../components/ui/others/Badge";
import PageContainer from "../../../layout/PageContainer";
import Button from "../../../components/ui/button/Button";
import Input from "../../../components/ui/input/Input";
import DataTable, { type Column } from "../../../components/ui/table/DataTable";
import ExpenseFormModal from "../../../components/expenses/ExpenseFormModal";
import CategoryFormModal from "../../../components/expenses/CategoryFormModal";
// import type { Column } from "../../components/ui/table/DataTable";
// import type { Expense, ExpenseCategory, ExpenseStatus } from "../../types/expense";
// import Badge from "../../components/ui/others/Badge";
// import PageContainer from "../../layout/PageContainer";
// import Button from "../../components/ui/button/Button";
// import Input from "../../components/ui/input/Input";
// import DataTable from "../../components/ui/table/DataTable";
// import ExpenseFormModal from "../../components/expenses/ExpenseFormModal";
// import CategoryFormModal from "../../components/expenses/CategoryFormModal";

const statusVariant: Record<ExpenseStatus, "success" | "warning" | "danger"> = {
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

const Expenses = () => {
  const [categories, setCategories] = useState<ExpenseCategory[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [expenseModalOpen, setExpenseModalOpen] = useState(false);
  const [expenseModalMode, setExpenseModalMode] = useState<"create" | "edit" | "view">("create");
  const [activeExpense, setActiveExpense] = useState<Expense | null>(null);

  const [categoryModalOpen, setCategoryModalOpen] = useState(false);

  useEffect(() => {
    // TODO: replace with real API calls e.g. GET /api/expense-categories, GET /api/expenses
    setTimeout(() => {
      setCategories([
        { id: "cat1", name: "Utilities" },
        { id: "cat2", name: "Office Supplies" },
        { id: "cat3", name: "Transport" },
      ]);

      setExpenses([
        {
          id: "EX001",
          categoryId: "cat1",
          categoryName: "Utilities",
          description: "Electricity bill - August",
          amount: 18500,
          date: "2026-08-20",
          status: "Approved",
          payment: { method: "BANK", bank_account_id: 1, payee_name: "CEB", payer_name: null },
          createdAt: "2026-08-20",
        },
        {
          id: "EX002",
          categoryId: "cat2",
          categoryName: "Office Supplies",
          description: "Printer paper & stationery",
          amount: 4200,
          date: "2026-08-25",
          status: "Pending",
          payment: null,
          createdAt: "2026-08-25",
        },
        {
          id: "EX003",
          categoryId: "cat3",
          categoryName: "Transport",
          description: "Fuel - delivery vehicle",
          amount: 6500,
          date: "2026-08-22",
          status: "Approved",
          payment: { method: "CASH", cash_id: 2 },
          createdAt: "2026-08-22",
        },
      ]);
      setLoading(false);
    }, 800);
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return expenses;
    return expenses.filter(
      (e) => e.description.toLowerCase().includes(q) || e.categoryName.toLowerCase().includes(q)
    );
  }, [expenses, search]);

  const openCreate = () => {
    setActiveExpense(null);
    setExpenseModalMode("create");
    setExpenseModalOpen(true);
  };

  const openEdit = (expense: Expense) => {
    if (expense.status === "Cancelled") return;
    setActiveExpense(expense);
    setExpenseModalMode("edit");
    setExpenseModalOpen(true);
  };

  const openView = (expense: Expense) => {
    setActiveExpense(expense);
    setExpenseModalMode("view");
    setExpenseModalOpen(true);
  };

  const handleSaved = (saved: Expense) => {
    setExpenses((prev) => {
      const exists = prev.some((e) => e.id === saved.id);
      return exists ? prev.map((e) => (e.id === saved.id ? saved : e)) : [saved, ...prev];
    });
  };

  const handleCategorySaved = (category: ExpenseCategory) => {
    setCategories((prev) => [...prev, category]);
  };

  const handleCancel = async (expense: Expense) => {
    if (expense.status === "Cancelled") return;
    if (!window.confirm(`Cancel expense "${expense.description}"? This can't be undone.`)) return;
    // TODO: replace with real API call e.g. PATCH /api/expenses/:id { status: "Cancelled" }
    setExpenses((prev) => prev.map((e) => (e.id === expense.id ? { ...e, status: "Cancelled" } : e)));
  };

  const columns: Column<Expense>[] = [
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
            disabled={row.status === "Cancelled"}
            className="rounded-lg p-1.5 text-text-muted hover:bg-background hover:text-secondary disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent"
            aria-label="Edit"
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
      title="Expenses"
      subtitle="Track and manage all company expenses"
      breadcrumbs={[{ label: "Accounts" }, { label: "Expenses" }]}
      icon={<Receipt className="h-5 w-5" />}
      actions={
        <>
          <Button variant="outline" icon={<Tag className="h-4 w-4" />} onClick={() => setCategoryModalOpen(true)}>
            Add Category
          </Button>
          <Button icon={<Plus className="h-4 w-4" />} onClick={openCreate}>
            Create Expense
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

      <ExpenseFormModal
        open={expenseModalOpen}
        mode={expenseModalMode}
        expense={activeExpense}
        categories={categories}
        onClose={() => setExpenseModalOpen(false)}
        onSaved={handleSaved}
      />

      <CategoryFormModal
        open={categoryModalOpen}
        onClose={() => setCategoryModalOpen(false)}
        onSaved={handleCategorySaved}
      />
    </PageContainer>
  );
};

export default Expenses;