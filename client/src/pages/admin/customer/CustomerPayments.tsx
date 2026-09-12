import { useMemo, useState } from "react";
import {
  CreditCard,
  User,
  Wallet,
  Receipt,
  Search,
  Users,
  CircleDollarSign,
} from "lucide-react";

import PageContainer from "../../../layout/PageContainer";
import Button from "../../../components/ui/button/Button";
import Input from "../../../components/ui/input/Input";
import Select from "../../../components/ui/select/Select";
import Badge from "../../../components/ui/others/Badge";
import DataTable from "../../../components/ui/table/DataTable";

import type { Column } from "../../../components/ui/table/DataTable";
import PaymentSection from "../../../components/payment/PaymentSection";

import type { PaymentData } from "../../../types/payment";

type PaymentMethod = "CASH" | "BANK" | "CHEQUE" | "EXISTING_CHEQUE";

interface Customer {
  id: string;
  name: string;
  phone: string;
  nic: string;
  address: string;
  currentBalance: number;
}

interface CustomerPayment {
  id: string;
  customerId: string;
  date: string;
  reference: string;
  amount: number;
  method: PaymentMethod;
  description: string;
}

const CustomerPayments = () => {
  const [customers] = useState<Customer[]>([
    {
      id: "CUST01",
      name: "Ravindu Wickramasinghe",
      phone: "0771122334",
      nic: "199512345678",
      address: "Maharagama",
      currentBalance: 28500,
    },
    {
      id: "CUST02",
      name: "Chathurika Events (Pvt) Ltd",
      phone: "0112233445",
      nic: "200012345678",
      address: "Nugegoda",
      currentBalance: 67500,
    },
    {
      id: "CUST03",
      name: "Kasun Perera",
      phone: "0715566778",
      nic: "199845612345",
      address: "Kaduwela",
      currentBalance: 12500,
    },
  ]);

  const [payments, setPayments] = useState<CustomerPayment[]>([
    {
      id: "CP001",
      customerId: "CUST01",
      date: "2026-08-20",
      reference: "CP-2026-0012",
      amount: 5000,
      method: "CASH",
      description: "Advance payment",
    },
    {
      id: "CP002",
      customerId: "CUST01",
      date: "2026-08-15",
      reference: "CP-2026-0009",
      amount: 10000,
      method: "BANK",
      description: "Rental balance payment",
    },
    {
      id: "CP003",
      customerId: "CUST02",
      date: "2026-08-12",
      reference: "CP-2026-0007",
      amount: 25000,
      method: "CASH",
      description: "Rental payment",
    },
    {
      id: "CP004",
      customerId: "CUST01",
      date: "2026-08-05",
      reference: "CP-2026-0004",
      amount: 7500,
      method: "CASH",
      description: "Previous rental payment",
    },
  ]);

  const [customerId, setCustomerId] = useState("");

  const [payment, setPayment] = useState<PaymentData>({
    method: "CASH",
    cash_id: "",
  });

  const [amount, setAmount] = useState(0);
  const [paymentDate, setPaymentDate] = useState(
    new Date().toISOString().slice(0, 10)
  );

  const [reference, setReference] = useState("");
  const [description, setDescription] = useState("");

  const [search, setSearch] = useState("");
  const [saving, setSaving] = useState(false);

  const selectedCustomer = useMemo(
    () => customers.find((customer) => customer.id === customerId) ?? null,
    [customers, customerId]
  );

  const customerPayments = useMemo(() => {
    if (!customerId) return [];

    return payments.filter(
      (payment) => payment.customerId === customerId
    );
  }, [payments, customerId]);

  const filteredPayments = useMemo(() => {
    const q = search.trim().toLowerCase();

    if (!q) return customerPayments;

    return customerPayments.filter(
      (payment) =>
        payment.reference.toLowerCase().includes(q) ||
        payment.description.toLowerCase().includes(q) ||
        payment.method.toLowerCase().includes(q)
    );
  }, [customerPayments, search]);

  const totalPaid = useMemo(
    () =>
      customerPayments.reduce(
        (sum, payment) => sum + payment.amount,
        0
      ),
    [customerPayments]
  );

  const remainingBalance = selectedCustomer
    ? Math.max(selectedCustomer.currentBalance - amount, 0)
    : 0;

  const handleCustomerChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setCustomerId(event.target.value);
    setAmount(0);
    setPayment({
      method: "CASH",
      cash_id: "",
    });
    setSearch("");
  };

  const handleRecordPayment = async () => {
    if (!selectedCustomer) {
      alert("Please select a customer.");
      return;
    }

    if (!amount || amount <= 0) {
      alert("Please enter a valid payment amount.");
      return;
    }

    if (amount > selectedCustomer.currentBalance) {
      alert("Payment amount cannot exceed the customer balance.");
      return;
    }

    if (
      payment.method === "CASH" &&
      !payment.cash_id
    ) {
      alert("Please select a cash account.");
      return;
    }

    if (
      payment.method === "BANK" &&
      !payment.bank_account_id
    ) {
      alert("Please select a bank account.");
      return;
    }

    if (
      payment.method === "CHEQUE" &&
      !payment.bank_account_id
    ) {
      alert("Please select a bank account.");
      return;
    }

    setSaving(true);

    try {
      // TODO:
      // POST /api/customer-payments
      //
      // {
      //   customerId,
      //   amount,
      //   paymentDate,
      //   reference,
      //   description,
      //   payment
      // }

      await new Promise((resolve) =>
        setTimeout(resolve, 700)
      );

      const newPayment: CustomerPayment = {
        id: `CP${Date.now()}`,
        customerId: selectedCustomer.id,
        date: paymentDate,
        reference:
          reference || `CP-${Date.now()}`,
        amount,
        method: payment.method,
        description:
          description || "Customer payment",
      };

      setPayments((prev) => [newPayment, ...prev]);

      alert("Customer payment recorded successfully.");

      setAmount(0);
      setReference("");
      setDescription("");
      setPayment({
        method: "CASH",
        cash_id: "",
      });
    } finally {
      setSaving(false);
    }
  };

  const methodLabel: Record<string, string> = {
    CASH: "Cash",
    BANK: "Bank",
    CHEQUE: "Cheque",
  };

  const columns: Column<CustomerPayment>[] = [
    {
      key: "date",
      header: "Date",
      sortable: true,
    },
    {
      key: "reference",
      header: "Reference",
    },
    {
      key: "method",
      header: "Payment",
      render: (row) => (
        <Badge variant="info">
          {methodLabel[row.method] ?? row.method}
        </Badge>
      ),
    },
    {
      key: "description",
      header: "Description",
    },
    {
      key: "amount",
      header: "Amount",
      render: (row) => (
        <span className="font-medium text-secondary">
          {row.amount.toLocaleString(undefined, {
            minimumFractionDigits: 2,
          })}
        </span>
      ),
    },
  ];

  return (
    <PageContainer
      title="Customer Payments"
      subtitle="Receive and manage customer payments"
      breadcrumbs={[
        { label: "Accounts" },
        { label: "Customer Payments" },
      ]}
      icon={<CreditCard className="h-5 w-5" />}
      actions={
        <Button
          icon={<CircleDollarSign className="h-4 w-4" />}
          loading={saving}
          disabled={!selectedCustomer}
          onClick={handleRecordPayment}
        >
          Record Payment
        </Button>
      }
    >
      <div className="space-y-4">
        {/* Customer Selection */}
        <div className="rounded-xl border border-border bg-surface p-4">
          <div className="mb-3 flex items-center gap-2">
            <Users className="h-4 w-4 text-primary-dark" />

            <div>
              <p className="text-sm font-semibold text-secondary">
                Customer
              </p>

              <p className="text-xs text-text-muted">
                Select the customer to receive a payment from.
              </p>
            </div>
          </div>

          <div className="max-w-xl">
            <Select
              value={customerId}
              options={[
                {
                  label: "Select customer...",
                  value: "",
                },
                ...customers.map((customer) => ({
                  label: `${customer.name} — ${customer.phone}`,
                  value: customer.id,
                })),
              ]}
              onChange={handleCustomerChange}
            />
          </div>
        </div>

        {!selectedCustomer ? (
          <div className="rounded-xl border border-dashed border-border bg-surface p-12 text-center">
            <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-background">
              <User className="h-5 w-5 text-text-muted" />
            </div>

            <p className="mt-3 text-sm font-medium text-secondary">
              Select a customer
            </p>

            <p className="mt-1 text-xs text-text-muted">
              Customer balance, payment history and payment options
              will appear here.
            </p>
          </div>
        ) : (
          <>
            {/* Customer Summary */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-xl border border-border bg-surface p-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-text-muted">
                    Customer
                  </span>

                  <User className="h-4 w-4 text-text-muted" />
                </div>

                <p className="mt-2 text-sm font-semibold text-secondary">
                  {selectedCustomer.name}
                </p>

                <p className="mt-1 text-xs text-text-muted">
                  {selectedCustomer.phone}
                </p>
              </div>

              <div className="rounded-xl border border-border bg-surface p-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-text-muted">
                    Current Balance
                  </span>

                  <Wallet className="h-4 w-4 text-danger" />
                </div>

                <p className="mt-2 text-xl font-bold text-danger">
                  {selectedCustomer.currentBalance.toLocaleString(
                    undefined,
                    {
                      minimumFractionDigits: 2,
                    }
                  )}
                </p>
              </div>

              <div className="rounded-xl border border-border bg-surface p-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-text-muted">
                    Total Paid
                  </span>

                  <CircleDollarSign className="h-4 w-4 text-primary-dark" />
                </div>

                <p className="mt-2 text-xl font-bold text-primary-dark">
                  {totalPaid.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                  })}
                </p>
              </div>

              <div className="rounded-xl border border-border bg-surface p-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-text-muted">
                    Payments
                  </span>

                  <Receipt className="h-4 w-4 text-text-muted" />
                </div>

                <p className="mt-2 text-xl font-bold text-secondary">
                  {customerPayments.length}
                </p>
              </div>
            </div>

            {/* Customer Details */}
            <div className="rounded-xl border border-border bg-surface p-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <p className="text-xs text-text-muted">
                    Customer Name
                  </p>

                  <p className="mt-1 text-sm font-medium text-secondary">
                    {selectedCustomer.name}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-text-muted">
                    NIC
                  </p>

                  <p className="mt-1 text-sm font-medium text-secondary">
                    {selectedCustomer.nic || "—"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-text-muted">
                    Address
                  </p>

                  <p className="mt-1 text-sm font-medium text-secondary">
                    {selectedCustomer.address || "—"}
                  </p>
                </div>
              </div>
            </div>

            {/* Payment + Preview */}
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
              {/* Payment Section */}
              <div className="xl:col-span-7">
                <div className="rounded-xl border border-border bg-surface p-4">
                  <div className="mb-4">
                    <p className="text-sm font-semibold text-secondary">
                      Receive Payment
                    </p>

                    <p className="mt-1 text-xs text-text-muted">
                      Record a payment against the selected customer.
                    </p>
                  </div>

                  <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <Input
                      label="Payment Amount"
                      type="number"
                      value={amount || ""}
                      placeholder="0.00"
                      onChange={(e) =>
                        setAmount(Number(e.target.value) || 0)
                      }
                    />

                    <Input
                      label="Payment Date"
                      type="date"
                      value={paymentDate}
                      onChange={(e) =>
                        setPaymentDate(e.target.value)
                      }
                    />

                    <Input
                      label="Reference Number"
                      value={reference}
                      placeholder="e.g. CP-2026-0015"
                      onChange={(e) =>
                        setReference(e.target.value)
                      }
                    />

                    <Input
                      label="Description"
                      value={description}
                      placeholder="Payment description"
                      onChange={(e) =>
                        setDescription(e.target.value)
                      }
                    />
                  </div>

                  <PaymentSection
                    allowedMethods={["CASH", "BANK", "CHEQUE"]}
                    value={payment}
                    onChange={setPayment}
                    amount={amount}
                    onAmountChange={setAmount}
                    errors={{}}
                  />
                </div>
              </div>

              {/* Payment Summary */}
              <div className="xl:col-span-5">
                <div className="h-full rounded-xl border border-border bg-surface p-4">
                  <p className="text-sm font-semibold text-secondary">
                    Payment Summary
                  </p>

                  <div className="mt-4 space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-text-muted">
                        Current Balance
                      </span>

                      <span className="font-medium text-secondary">
                        {selectedCustomer.currentBalance.toLocaleString(
                          undefined,
                          {
                            minimumFractionDigits: 2,
                          }
                        )}
                      </span>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span className="text-text-muted">
                        Payment
                      </span>

                      <span className="font-medium text-primary-dark">
                        −{" "}
                        {amount.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                        })}
                      </span>
                    </div>

                    <div className="rounded-lg bg-background p-3">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium text-secondary">
                          Remaining Balance
                        </span>

                        <span className="text-base font-bold text-danger">
                          {remainingBalance.toLocaleString(
                            undefined,
                            {
                              minimumFractionDigits: 2,
                            }
                          )}
                        </span>
                      </div>
                    </div>

                    <div className="border-t border-border pt-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-text-muted">
                          Payment Method
                        </span>

                        <Badge variant="info">
                          {methodLabel[payment.method]}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <Button
                    className="mt-5 w-full"
                    loading={saving}
                    disabled={!amount || amount <= 0}
                    onClick={handleRecordPayment}
                  >
                    Receive Payment
                  </Button>
                </div>
              </div>
            </div>

            {/* Payment History */}
            <div className="rounded-xl border border-border bg-surface p-4">
              <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-semibold text-secondary">
                    Payment History
                  </p>

                  <p className="mt-1 text-xs text-text-muted">
                    Previous payments made by this customer.
                  </p>
                </div>

                <div className="w-full sm:max-w-xs">
                  <Input
                    placeholder="Search payments..."
                    icon={<Search className="h-4 w-4" />}
                    value={search}
                    onChange={(e) =>
                      setSearch(e.target.value)
                    }
                  />
                </div>
              </div>

              <DataTable
                columns={columns}
                data={filteredPayments}
                loading={false}
                rowKey="id"
                pageSize={10}
              />
            </div>
          </>
        )}
      </div>
    </PageContainer>
  );
};

export default CustomerPayments;