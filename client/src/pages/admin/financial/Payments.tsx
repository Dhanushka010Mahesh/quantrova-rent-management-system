import { useState } from "react";
import { CreditCard, Search } from "lucide-react";
import { paymentCategoryConfig } from "../../../components/payment/paymentCategoryConfig";
import { mockPayables, type PaymentTransaction } from "../../../types/paymentTransaction";
import type { Column } from "../../../components/ui/table/DataTable";
import Badge from "../../../components/ui/others/Badge";
import PageContainer from "../../../layout/PageContainer";
import PaymentTypeForm from "../../../components/payment/PaymentTypeForm";
import Input from "../../../components/ui/input/Input";
import DataTable from "../../../components/ui/table/DataTable";
// import type { Column } from "../../components/ui/table/DataTable";
// import type { PaymentTransaction } from "../../types/paymentTransaction";
// import Badge from "../../components/ui/others/Badge";
// import PageContainer from "../../layout/PageContainer";
// import Input from "../../components/ui/input/Input";
// import DataTable from "../../components/ui/table/DataTable";
// import PaymentTypeForm from "../../components/payments/PaymentTypeForm";
// import { paymentCategoryConfig } from "../../config/paymentCategoryConfig";
// import { mockPayables } from "../../data/mockPayables";

const methodLabel: Record<string, string> = {
  CASH: "Cash",
  BANK: "Bank",
  CHEQUE: "Cheque",
  EXISTING_CHEQUE: "Existing Cheque",
};

const Payments = () => {
  const [activeKey, setActiveKey] = useState(paymentCategoryConfig[0].key);
  const [search, setSearch] = useState("");
  const [transactions, setTransactions] = useState<PaymentTransaction[]>([
    {
      id: "P001",
      category: "SUPPLIER",
      entityId: "S02",
      entityName: "Lanka Hardware Supplies",
      entitySubtitle: "Hardware",
      amount: 15000,
      date: "2026-08-20",
      payment: { method: "BANK", bank_account_id: 1, payee_name: "Lanka Hardware Supplies", payer_name: null },
      createdAt: "2026-08-20",
    },
  ]);

  const activeConfig = paymentCategoryConfig.find((c) => c.key === activeKey)!;

  const handlePaid = (transaction: PaymentTransaction) => {
    setTransactions((prev) => [transaction, ...prev]);
    // TODO: also update the source cash/bank account balance and the entity's remaining due amount
  };

  const categoryTransactions = transactions
    .filter((t) => t.category === activeKey)
    .filter((t) => {
      const q = search.trim().toLowerCase();
      return !q || t.entityName.toLowerCase().includes(q);
    });

  const columns: Column<PaymentTransaction>[] = [
    { key: "date", header: "Date", sortable: true },
    { key: "entityName", header: activeConfig.entityLabel },
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
      header: "Method",
      render: (row) => <Badge variant="info">{methodLabel[row.payment.method]}</Badge>,
    },
  ];

  return (
    <PageContainer
      title="Payments"
      subtitle="Make and track salary, supplier, and liability payments"
      breadcrumbs={[{ label: "Accounts" }, { label: "Payments" }]}
      icon={<CreditCard className="h-5 w-5" />}
    >
      {/* Tabs */}
      <div className="mb-5 flex flex-wrap items-center gap-1 rounded-lg border border-border bg-background p-1 w-fit">
        {paymentCategoryConfig.map((cfg) => {
          const Icon = cfg.icon;
          return (
            <button
              key={cfg.key}
              onClick={() => {
                setActiveKey(cfg.key);
                setSearch("");
              }}
              className={`flex items-center gap-1.5 rounded-md px-3.5 py-1.5 text-sm font-medium transition-colors ${
                activeKey === cfg.key ? "bg-surface text-secondary shadow-sm" : "text-text-muted hover:text-secondary"
              }`}
            >
              <Icon className="h-4 w-4" /> {cfg.label}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-5">
        {/* Left: payment form for the active category */}
        <div className="lg:col-span-2">
          <PaymentTypeForm config={activeConfig} entities={mockPayables[activeKey]} onPaid={handlePaid} />
        </div>

        {/* Right: payment history for the active category */}
        <div className="lg:col-span-3">
          <div className="rounded-xl border border-border bg-surface p-4">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-semibold text-secondary">{activeConfig.label} History</p>
              <div className="w-56">
                <Input
                  placeholder={`Search ${activeConfig.entityLabel.toLowerCase()}...`}
                  icon={<Search className="h-4 w-4" />}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
            <DataTable
              columns={columns}
              data={categoryTransactions}
              rowKey="id"
              pageSize={8}
              loading={false}
            />
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default Payments;