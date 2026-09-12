// import { useEffect, useState } from "react";
// import Modal from "../ui/modal/Modal";
// import Button from "../ui/button/Button";
// import PaymentSection from "../payment/PaymentSection";
// import OrderLineItemsTable from "./OrderLineItemsTable";
// import { orderTotal, orderPaidTotal } from "../../types/rentalOrder";
// import type { RentalOrder, OrderLine } from "../../types/rentalOrder";
// import type { PaymentData } from "../../types/payment";

// interface ProcessOrderModalProps {
//   open: boolean;
//   onClose: () => void;
//   order: RentalOrder | null;
//   onProcessed: (order: RentalOrder) => void;
// }

// export default function ProcessOrderModal({ open, onClose, order, onProcessed }: ProcessOrderModalProps) {
//   const [lines, setLines] = useState<OrderLine[]>([]);
//   const [markPaid, setMarkPaid] = useState(false);
//   const [payment, setPayment] = useState<PaymentData>({ method: "CASH", cash_id: "" });
//   const [paymentAmount, setPaymentAmount] = useState(0);
//   const [saving, setSaving] = useState(false);
//   const [errors, setErrors] = useState<Record<string, string>>({});

//   useEffect(() => {
//     if (open && order) {
//       setLines(order.lines);
//       const alreadyPaid = orderPaidTotal(order);
//       const remaining = Math.max(orderTotal({ ...order, lines: order.lines }) - alreadyPaid, 0);
//       setPaymentAmount(remaining);
//       setMarkPaid(false);
//       setPayment({ method: "CASH", cash_id: "" });
//       setErrors({});
//     }
//   }, [open, order]);

//   if (!order) return null;

//   const total = lines.reduce((sum, l) => sum + (l as any), 0); // placeholder replaced below
//   const computedTotal = lines.reduce((sum, l) => sum + (orderTotal({ ...order, lines: [l] })), 0);
//   const alreadyPaid = orderPaidTotal(order);
//   const balance = computedTotal - alreadyPaid - (markPaid ? paymentAmount : 0);

//   const handleConfirm = async () => {
//     const next: Record<string, string> = {};
//     if (markPaid) {
//       if (!paymentAmount || paymentAmount <= 0) next.paymentAmount = "Enter a valid amount";
//       if (payment.method === "CASH" && !payment.cash_id) next.cash_id = "Select a cash account";
//       if (payment.method === "BANK" && !payment.bank_account_id) next.bank_account_id = "Select a bank account";
//       if (payment.method === "CHEQUE" && !payment.bank_account_id) next.bank_account_id = "Select a bank account";
//     }
//     setErrors(next);
//     if (Object.keys(next).length > 0) return;

//     setSaving(true);
//     try {
//       // TODO: replace with real API call e.g. PATCH /api/rental-orders/:id/process
//       await new Promise((r) => setTimeout(r, 800));

//       const updated: RentalOrder = {
//         ...order,
//         lines,
//         status: "PROCESSED",
//         processedAt: new Date().toISOString(),
//         processedBy: "Current User", // TODO: use logged-in user
//         finalPayment: markPaid ? { amount: paymentAmount, payment } : order.finalPayment,
//       };
//       onProcessed(updated);
//       onClose();
//     } finally {
//       setSaving(false);
//     }
//   };

//   return (
//     <Modal
//       open={open}
//       onClose={onClose}
//       title={`Process Order — ${order.billNumber}`}
//       size="xl"
//       scrollable
//       closeOnOverlayClick={false}
//       footer={
//         <>
//           <Button variant="outline" onClick={onClose}>
//             Cancel
//           </Button>
//           <Button onClick={handleConfirm} loading={saving}>
//             Confirm & Process
//           </Button>
//         </>
//       }
//     >
//       <div className="flex flex-col gap-4">
//         <p className="text-xs text-text-muted">
//           Adjust prices or add a final discount/deduction per line before confirming. Day counts are calculated
//           automatically from each item's out date.
//         </p>

//         <OrderLineItemsTable lines={lines} onChange={setLines} editable />

//         <div className="rounded-lg border border-border bg-secondary/5 p-3">
//           <div className="flex justify-between text-sm text-text-muted">
//             <span>Order Total</span>
//             <span>{computedTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
//           </div>
//           <div className="flex justify-between text-sm text-text-muted">
//             <span>Already Paid (advance)</span>
//             <span>{alreadyPaid.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
//           </div>
//         </div>

//         <div className="rounded-lg border border-border bg-background/60 p-3">
//           <label className="flex w-fit cursor-pointer items-center gap-2 text-sm font-medium text-secondary">
//             <input
//               type="checkbox"
//               checked={markPaid}
//               onChange={(e) => setMarkPaid(e.target.checked)}
//               className="h-4 w-4 rounded border-border-dark text-primary accent-primary"
//             />
//             Payment made now
//           </label>

//           {markPaid && (
//             <div className="mt-3">
//               <PaymentSection
//                 allowedMethods={["CASH", "BANK", "CHEQUE"]}
//                 value={payment}
//                 onChange={setPayment}
//                 amount={paymentAmount}
//                 onAmountChange={setPaymentAmount}
//                 errors={errors}
//               />
//             </div>
//           )}
//         </div>

//         <div className="flex justify-between border-t border-border pt-2 text-base font-semibold text-primary-dark">
//           <span>Balance Due After Processing</span>
//           <span>{balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
//         </div>
//       </div>
//     </Modal>
//   );
// }
import { useEffect, useState } from "react";
import Modal from "../ui/modal/Modal";
import Button from "../ui/button/Button";
import PaymentSection from "../payment/PaymentSection";
import OrderLineItemsTable from "./OrderLineItemsTable";
import ProcessDeductionsEditor from "./ProcessDeductionsEditor";
import { orderTotal, orderPaidTotal, lineItemsTotal } from "../../types/rentalOrder";
import type { RentalOrder, OrderLine, ProcessDeduction } from "../../types/rentalOrder";
import type { PaymentData } from "../../types/payment";

interface ProcessOrderModalProps {
  open: boolean;
  onClose: () => void;
  order: RentalOrder | null;
  onProcessed: (order: RentalOrder) => void;
}

export default function ProcessOrderModal({ open, onClose, order, onProcessed }: ProcessOrderModalProps) {
  const [lines, setLines] = useState<OrderLine[]>([]);
  const [deductions, setDeductions] = useState<ProcessDeduction[]>([]);
  const [markPaid, setMarkPaid] = useState(false);
  const [payment, setPayment] = useState<PaymentData>({ method: "CASH", cash_id: "" });
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (open && order) {
      setLines(order.lines);
      setDeductions(order.processDeductions ?? []);
      const alreadyPaid = orderPaidTotal(order);
      const itemsTotal = lineItemsTotal(order.lines);
      const remaining = Math.max(itemsTotal - alreadyPaid, 0);
      setPaymentAmount(remaining);
      setMarkPaid(false);
      setPayment({ method: "CASH", cash_id: "" });
      setErrors({});
    }
  }, [open, order]);

  if (!order) return null;

  const computedTotal = orderTotal({ ...order, lines, processDeductions: deductions });
  const alreadyPaid = orderPaidTotal(order);
  const balance = computedTotal - alreadyPaid - (markPaid ? paymentAmount : 0);

  const handleConfirm = async () => {
    const next: Record<string, string> = {};
    if (markPaid) {
      if (!paymentAmount || paymentAmount <= 0) next.paymentAmount = "Enter a valid amount";
      if (payment.method === "CASH" && !payment.cash_id) next.cash_id = "Select a cash account";
      if (payment.method === "BANK" && !payment.bank_account_id) next.bank_account_id = "Select a bank account";
      if (payment.method === "CHEQUE" && !payment.bank_account_id) next.bank_account_id = "Select a bank account";
    }
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setSaving(true);
    try {
      // TODO: replace with real API call e.g. PATCH /api/rental-orders/:id/process
      // { lines, processDeductions, finalPayment: markPaid ? { amount, payment } : null }
      await new Promise((r) => setTimeout(r, 800));

      const updated: RentalOrder = {
        ...order,
        lines,
        processDeductions: deductions,
        status: "PROCESSED",
        processedAt: new Date().toISOString(),
        processedBy: "Current User", // TODO: use logged-in user
        finalPayment: markPaid ? { amount: paymentAmount, payment } : order.finalPayment,
      };
      onProcessed(updated);
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`Process Order — ${order.billNumber}`}
      size="xl"
      scrollable
      closeOnOverlayClick={false}
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} loading={saving}>
            Confirm & Process
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        <p className="text-xs text-text-muted">
          Adjust prices, discounts, or correct the day count per line if needed. Add any extra charges (damage,
          cleaning, etc.) below before confirming.
        </p>

        <OrderLineItemsTable lines={lines} onChange={setLines} editable editableDays />

        <ProcessDeductionsEditor items={deductions} onChange={setDeductions} />

        <div className="rounded-lg border border-border bg-secondary/5 p-3">
          <div className="flex justify-between text-sm text-text-muted">
            <span>Items Total</span>
            <span>{lineItemsTotal(lines).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
          </div>
          <div className="flex justify-between text-sm text-text-muted">
            <span>+ Additional Charges</span>
            <span>{deductions.reduce((s, d) => s + d.amount, 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
          </div>
          <div className="flex justify-between border-t border-border/70 pt-1 text-sm font-medium text-secondary">
            <span>Order Total</span>
            <span>{computedTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
          </div>
          <div className="flex justify-between text-sm text-text-muted">
            <span>Already Paid (advance)</span>
            <span>{alreadyPaid.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
          </div>
        </div>

        <div className="rounded-lg border border-border bg-background/60 p-3">
          <label className="flex w-fit cursor-pointer items-center gap-2 text-sm font-medium text-secondary">
            <input
              type="checkbox"
              checked={markPaid}
              onChange={(e) => setMarkPaid(e.target.checked)}
              className="h-4 w-4 rounded border-border-dark text-primary accent-primary"
            />
            Payment made now
          </label>

          {markPaid && (
            <div className="mt-3">
              <PaymentSection
                allowedMethods={["CASH", "BANK", "CHEQUE"]}
                value={payment}
                onChange={setPayment}
                amount={paymentAmount}
                onAmountChange={setPaymentAmount}
                errors={errors}
              />
            </div>
          )}
        </div>

        <div className="flex justify-between border-t border-border pt-2 text-base font-semibold text-primary-dark">
          <span>Balance Due After Processing</span>
          <span>{balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
        </div>
      </div>
    </Modal>
  );
}