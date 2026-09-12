import { useMemo, useState } from "react";
import { Plus, UserPlus, PackagePlus } from "lucide-react";
import PageContainer from "../../../layout/PageContainer";
import Input from "../../../components/ui/input/Input";
import Select from "../../../components/ui/select/Select";
import Button from "../../../components/ui/button/Button";
import Badge from "../../../components/ui/others/Badge";
import PaymentSection from "../../../components/payment/PaymentSection";
import CustomerQuickCreateModal from "../../../components/rental/CustomerQuickCreateModal";
import ImageUploadGrid from "../../../components/rental/ImageUploadGrid";
import RentalLineItemsEditor from "../../../components/rental/RentalLineItemsEditor";
import { lineSubtotal, mockRentalCustomers } from "../../../types/rental";
import type { Customer, Guarantor, RentalOrderLine } from "../../../types/rental";
import type { PaymentData } from "../../../types/payment";
import GuarantorsPanel from "../../../components/rental/GuarantorPanel";

const WALKING_CUSTOMER_ID = "WALK_IN";

const RentalCreate = () => {
  const [customers, setCustomers] = useState<Customer[]>(mockRentalCustomers);
  const [customerId, setCustomerId] = useState(WALKING_CUSTOMER_ID);
  const [customerModalOpen, setCustomerModalOpen] = useState(false);

  const [billNumber, setBillNumber] = useState("");
  const [outDate, setOutDate] = useState(new Date().toISOString().slice(0, 10));
  const [expectedReturnDate, setExpectedReturnDate] = useState(new Date().toISOString().slice(0, 10));

  const [lines, setLines] = useState<RentalOrderLine[]>([]);
  const [orderImages, setOrderImages] = useState<string[]>([]);

  const [guarantors, setGuarantors] = useState<Guarantor[]>([]);

  const [advanceEnabled, setAdvanceEnabled] = useState(false);
  const [advancePayment, setAdvancePayment] = useState<PaymentData>({ method: "CASH", cash_id: "" });
  const [advanceAmount, setAdvanceAmount] = useState(0);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const selectedCustomer = customers.find((c) => c.id === customerId) ?? null;

  const days = useMemo(() => {
    const start = new Date(outDate);
    const end = new Date(expectedReturnDate);
    const diff = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    return Math.max(diff, 1);
  }, [outDate, expectedReturnDate]);

  const total = useMemo(() => lines.reduce((sum, l) => sum + lineSubtotal(l, days), 0), [lines, days]);
  const balanceDue = total - (advanceEnabled ? advanceAmount : 0);

  const handleCustomerCreated = (customer: Customer) => {
    setCustomers((prev) => [customer, ...prev]);
    setCustomerId(customer.id);
  };

  const validate = () => {
    const next: Record<string, string> = {};
    if (!billNumber.trim()) next.billNumber = "Bill number is required";
    if (lines.length === 0) next.lines = "Add at least one item";
    if (advanceEnabled) {
      if (!advanceAmount || advanceAmount <= 0) next.advanceAmount = "Enter a valid advance amount";
      if (advancePayment.method === "CASH" && !advancePayment.cash_id) next.cash_id = "Select a cash account";
      if (advancePayment.method === "BANK" && !advancePayment.bank_account_id) next.bank_account_id = "Select a bank account";
      if (advancePayment.method === "CHEQUE" && !advancePayment.bank_account_id) next.bank_account_id = "Select a bank account";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      // TODO: replace with real API call e.g. POST /api/rental-orders
      // Payload should include: billNumber, customerId (or null for walk-in), lines, outDate,
      // expectedReturnDate, guarantor, orderImages, advance { amount, payment }, total, balanceDue.
      await new Promise((r) => setTimeout(r, 900));
      alert("Rental order created (demo). Wire this up to your API.");

      // reset
      setBillNumber("");
      setLines([]);
      setOrderImages([]);
      setGuarantors([]);
      setAdvanceEnabled(false);
      setAdvanceAmount(0);
      setAdvancePayment({ method: "CASH", cash_id: "" });
      setErrors({});
    } finally {
      setSaving(false);
    }
  };

  return (
    <PageContainer
      title="Rent / Sale"
      subtitle="Issue rental items or sell items to a customer"
      breadcrumbs={[{ label: "Rental" }, { label: "New Order" }]}
      icon={<PackagePlus className="h-5 w-5" />}
      actions={
        <Button icon={<Plus className="h-4 w-4" />} loading={saving} onClick={handleSubmit}>
          Create Order
        </Button>
      }
    >
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {/* Left: customer + guarantor + images */}
        <div className="flex flex-col gap-4 lg:col-span-1">
          <div className="rounded-xl border border-border bg-surface p-4">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-sm font-semibold text-secondary">Customer</p>
              <button
                type="button"
                onClick={() => setCustomerModalOpen(true)}
                className="flex items-center gap-1 text-xs font-medium text-primary-dark hover:underline"
              >
                <UserPlus className="h-3.5 w-3.5" /> New Customer
              </button>
            </div>

            <Select
              value={customerId}
              options={[
                { label: "Walking Customer (no selection)", value: WALKING_CUSTOMER_ID },
                ...customers.map((c) => ({ label: `${c.name} — ${c.phone}`, value: c.id })),
              ]}
              onChange={(e) => setCustomerId(e.target.value)}
            />

            {selectedCustomer ? (
              <div className="mt-3 rounded-lg bg-background p-3 text-sm">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-secondary">{selectedCustomer.name}</p>
                  {selectedCustomer.creditBalance > 0 && (
                    <Badge variant="warning">
                      Credit Due: {selectedCustomer.creditBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </Badge>
                  )}
                </div>
                <p className="mt-1 text-xs text-text-muted">NIC: {selectedCustomer.nic || "—"}</p>
                <p className="text-xs text-text-muted">Phone: {selectedCustomer.phone}</p>
                {selectedCustomer.description && (
                  <p className="mt-1 text-xs text-text-muted">{selectedCustomer.description}</p>
                )}
              </div>
            ) : (
              <p className="mt-3 text-xs text-text-muted">
                No customer selected — this order will be recorded under Walking Customer.
              </p>
            )}
          </div>

          {/* <div className="rounded-xl border border-border bg-surface p-4">
            <GuarantorPanel enabled={guarantorEnabled} onToggle={setGuarantorEnabled} guarantor={guarantor} onChange={setGuarantor} />
          </div> */}
          {/* Bottom row: guarantors + images + payment + total */}
        <div className="xl:col-span-7">
          <GuarantorsPanel guarantors={guarantors} onChange={setGuarantors} />
        </div>

          <div className="rounded-xl border border-border bg-surface p-4">
            <p className="mb-2 text-sm font-semibold text-secondary">Order Photos</p>
            <ImageUploadGrid images={orderImages} onChange={setOrderImages} />
          </div>
        </div>

        {/* Right: order details + items + payment */}
        <div className="flex flex-col gap-4 lg:col-span-2">
          <div className="rounded-xl border border-border bg-surface p-4">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <Input
                label="Bill Number"
                value={billNumber}
                error={errors.billNumber}
                placeholder="e.g. BILL-2026-0088"
                onChange={(e) => setBillNumber(e.target.value)}
              />
              <Input label="Out Date" type="date" value={outDate} onChange={(e) => setOutDate(e.target.value)} />
              <Input
                label="Expected Return Date"
                type="date"
                value={expectedReturnDate}
                onChange={(e) => setExpectedReturnDate(e.target.value)}
              />
            </div>
            <p className="mt-2 text-xs text-text-muted">
              Estimated rental period: <span className="font-medium text-secondary">{days} day(s)</span> — final day
              count is confirmed when the items are actually returned.
            </p>
          </div>

          <RentalLineItemsEditor lines={lines} onChange={setLines} days={days} />
          {errors.lines && <p className="-mt-2 text-xs text-danger">{errors.lines}</p>}

          <div className="rounded-xl border border-border bg-surface p-4">
            <label className="flex w-fit cursor-pointer items-center gap-2 text-sm font-medium text-secondary">
              <input
                type="checkbox"
                checked={advanceEnabled}
                onChange={(e) => setAdvanceEnabled(e.target.checked)}
                className="h-4 w-4 rounded border-border-dark text-primary accent-primary"
              />
              Take Advance Payment
            </label>

            {advanceEnabled && (
              <div className="mt-3">
                <PaymentSection
                  allowedMethods={["CASH", "BANK", "CHEQUE"]}
                  value={advancePayment}
                  onChange={setAdvancePayment}
                  amount={advanceAmount}
                  onAmountChange={setAdvanceAmount}
                  errors={errors}
                />
              </div>
            )}
          </div>

          <div className="rounded-xl border border-border bg-secondary/5 p-4">
            <div className="flex justify-between text-sm text-text-muted">
              <span>Order Total (estimated)</span>
              <span>{total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
            </div>
            {advanceEnabled && (
              <div className="flex justify-between text-sm text-text-muted">
                <span>− Advance Paid</span>
                <span>{advanceAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </div>
            )}
            <div className="mt-1 flex justify-between border-t border-border pt-1.5 text-base font-semibold text-primary-dark">
              <span>Balance Due</span>
              <span>{balanceDue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
            </div>
          </div>
        </div>
      </div>

      <CustomerQuickCreateModal
        open={customerModalOpen}
        onClose={() => setCustomerModalOpen(false)}
        onCreated={handleCustomerCreated}
      />
    </PageContainer>
  );
};

export default RentalCreate;