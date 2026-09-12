import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Pencil,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import PageContainer from "../../layout/PageContainer";

type GRNStatus =
  | "Draft"
  | "Pending Approval"
  | "Approved"
  | "Rejected";

interface GRNItem {
  item: string;
  qty: number;
  purchasePrice: number;
  sellingPrice: number;
}

interface GRN {
  id: string;
  grnNumber: string;
  supplier: string;
  invoiceNumber: string;
  invoiceDate: string;
  receivedDate: string;
  status: GRNStatus;
  createdBy: string;
  advance: number;
  items: GRNItem[];
}

export default function GRNView() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [grn, setGrn] = useState<GRN | null>(null);

  useEffect(() => {
    // TODO:
    // GET /api/grns/:id

    setTimeout(() => {
      setGrn({
        id: id ?? "",
        grnNumber: "GRN-2026-0003",
        supplier: "ABC Construction Supplies",
        invoiceNumber: "INV-10245",
        invoiceDate: "2026-08-27",
        receivedDate: "2026-08-27",
        status: "Pending Approval",
        createdBy: "Sunil Perera",
        advance: 30000,
        items: [
          {
            item: "Cement 50kg",
            qty: 20,
            purchasePrice: 2500,
            sellingPrice: 2900,
          },
          {
            item: "Sand - Cubic",
            qty: 5,
            purchasePrice: 8500,
            sellingPrice: 10000,
          },
          {
            item: "Metal 3/4",
            qty: 10,
            purchasePrice: 4500,
            sellingPrice: 5500,
          },
        ],
      });

      setLoading(false);
    }, 400);
  }, [id]);

  if (loading || !grn) {
    return (
      <PageContainer
        title="GRN Details"
        breadcrumbs={[
          { label: "Purchasing" },
          {
            label: "GRN",
            path: "/admin/purchasing/grn",
          },
          { label: "View" },
        ]}
      >
        <div className="rounded-xl border border-border bg-surface p-8 text-center text-sm text-text-muted">
          Loading GRN...
        </div>
      </PageContainer>
    );
  }

  const total = grn.items.reduce(
    (sum, item) =>
      sum + item.qty * item.purchasePrice,
    0
  );

  const balance = total - grn.advance;

  const canEdit = grn.status === "Draft";

  const canApprove =
    grn.status === "Pending Approval";

  const changeStatus = (
    status: "Approved" | "Rejected"
  ) => {
    // TODO:
    // PATCH /api/grns/:id/status

    setGrn((prev) =>
      prev
        ? {
            ...prev,
            status,
          }
        : prev
    );
  };

  return (
    <PageContainer
      title={grn.grnNumber}
      subtitle="Goods Received Note details"
      breadcrumbs={[
        { label: "Purchasing" },
        {
          label: "GRN",
          path: "/admin/purchasing/grn",
        },
        {
          label: grn.grnNumber,
        },
      ]}
      actions={
        <div className="flex items-center gap-2">
          <button
            onClick={() =>
              navigate("/admin/purchasing/grn")
            }
            className="flex h-9 items-center gap-1.5 rounded-lg border border-border px-3 text-xs font-medium text-secondary hover:bg-background"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>

          {canEdit && (
            <button
              onClick={() =>
                navigate(
                  `/admin/purchasing/grn/${grn.id}/edit`
                )
              }
              className="flex h-9 items-center gap-1.5 rounded-lg bg-primary px-3 text-xs font-semibold text-secondary"
            >
              <Pencil className="h-4 w-4" />
              Edit
            </button>
          )}
        </div>
      }
    >
      <div className="space-y-3">
        {/* Header Information */}
        <div className="rounded-xl border border-border bg-surface">
          <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
            <div>
              <h2 className="text-sm font-semibold text-secondary">
                GRN Information
              </h2>
            </div>

            <StatusBadge status={grn.status} />
          </div>

          <div className="grid grid-cols-2 gap-4 p-4 sm:grid-cols-3 lg:grid-cols-6">
            <Info
              label="GRN Number"
              value={grn.grnNumber}
            />

            <Info
              label="Supplier"
              value={grn.supplier}
            />

            <Info
              label="Invoice Number"
              value={grn.invoiceNumber}
            />

            <Info
              label="Invoice Date"
              value={grn.invoiceDate}
            />

            <Info
              label="Received Date"
              value={grn.receivedDate}
            />

            <Info
              label="Created By"
              value={grn.createdBy}
            />
          </div>
        </div>

        {/* Items */}
        <div className="overflow-hidden rounded-xl border border-border bg-surface">
          <div className="border-b border-border px-4 py-2.5">
            <h2 className="text-sm font-semibold text-secondary">
              Received Items
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead>
                <tr className="border-b border-border bg-background/50">
                  <th className="px-4 py-2 text-left text-[10px] font-semibold text-text-muted">
                    #
                  </th>

                  <th className="px-3 py-2 text-left text-[10px] font-semibold text-text-muted">
                    ITEM
                  </th>

                  <th className="px-3 py-2 text-right text-[10px] font-semibold text-text-muted">
                    QTY
                  </th>

                  <th className="px-3 py-2 text-right text-[10px] font-semibold text-text-muted">
                    PURCHASE PRICE
                  </th>

                  <th className="px-3 py-2 text-right text-[10px] font-semibold text-text-muted">
                    SELLING PRICE
                  </th>

                  <th className="px-4 py-2 text-right text-[10px] font-semibold text-text-muted">
                    TOTAL
                  </th>
                </tr>
              </thead>

              <tbody>
                {grn.items.map((item, index) => (
                  <tr
                    key={index}
                    className="border-b border-border last:border-0"
                  >
                    <td className="px-4 py-2.5 text-xs text-text-muted">
                      {index + 1}
                    </td>

                    <td className="px-3 py-2.5 text-xs font-medium text-secondary">
                      {item.item}
                    </td>

                    <td className="px-3 py-2.5 text-right text-xs">
                      {item.qty}
                    </td>

                    <td className="px-3 py-2.5 text-right text-xs">
                      Rs.{" "}
                      {item.purchasePrice.toLocaleString()}
                    </td>

                    <td className="px-3 py-2.5 text-right text-xs">
                      Rs.{" "}
                      {item.sellingPrice.toLocaleString()}
                    </td>

                    <td className="px-4 py-2.5 text-right text-xs font-semibold">
                      Rs.{" "}
                      {(
                        item.qty *
                        item.purchasePrice
                      ).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Summary */}
        <div className="flex justify-end">
          <div className="w-full rounded-xl border border-border bg-surface p-4 sm:w-80">
            <SummaryRow
              label="GRN Total"
              value={total}
            />

            <SummaryRow
              label="Advance"
              value={grn.advance}
            />

            <div className="my-2 border-t border-border" />

            <SummaryRow
              label="Balance"
              value={balance}
              strong
            />
          </div>
        </div>

        {/* Approval */}
        {canApprove && (
          <div className="flex items-center justify-between rounded-xl border border-primary/20 bg-primary/5 px-4 py-3">
            <div>
              <p className="text-xs font-semibold text-secondary">
                Approval Required
              </p>

              <p className="mt-0.5 text-[11px] text-text-muted">
                Review this GRN before approving or
                rejecting it.
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() =>
                  changeStatus("Rejected")
                }
                className="flex items-center gap-1.5 rounded-lg border border-danger/30 px-3 py-2 text-xs font-semibold text-danger hover:bg-danger/10"
              >
                <XCircle className="h-4 w-4" />
                Reject
              </button>

              <button
                onClick={() =>
                  changeStatus("Approved")
                }
                className="flex items-center gap-1.5 rounded-lg bg-success px-3 py-2 text-xs font-semibold text-white"
              >
                <CheckCircle2 className="h-4 w-4" />
                Approve
              </button>
            </div>
          </div>
        )}

        {/* Locked message */}
        {!canEdit && !canApprove && (
          <div className="rounded-lg border border-border bg-background px-4 py-3">
            <p className="text-xs font-medium text-secondary">
              This GRN is locked.
            </p>

            <p className="mt-0.5 text-[11px] text-text-muted">
              Approved or rejected GRNs cannot be edited.
            </p>
          </div>
        )}
      </div>
    </PageContainer>
  );
}

function Info({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="mb-0.5 text-[10px] font-medium uppercase tracking-wide text-text-muted">
        {label}
      </p>

      <p className="truncate text-xs font-medium text-secondary">
        {value}
      </p>
    </div>
  );
}

function SummaryRow({
  label,
  value,
  strong = false,
}: {
  label: string;
  value: number;
  strong?: boolean;
}) {
  return (
    <div className="flex items-center justify-between py-1">
      <span
        className={`text-xs ${
          strong
            ? "font-semibold text-secondary"
            : "text-text-muted"
        }`}
      >
        {label}
      </span>

      <span
        className={`text-xs ${
          strong
            ? "font-bold text-secondary"
            : "font-medium text-secondary"
        }`}
      >
        Rs. {value.toLocaleString()}
      </span>
    </div>
  );
}

function StatusBadge({
  status,
}: {
  status: GRNStatus;
}) {
  const styles = {
    Draft: "bg-background text-text-muted",
    "Pending Approval":
      "bg-primary/10 text-primary-dark",
    Approved: "bg-success/10 text-success",
    Rejected: "bg-danger/10 text-danger",
  };

  return (
    <span
      className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${styles[status]}`}
    >
      {status}
    </span>
  );
}