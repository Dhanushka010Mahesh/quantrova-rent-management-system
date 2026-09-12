import { useMemo, useState } from "react";
import { Plus, Search, Eye, Tag, Boxes } from "lucide-react";
import { assetSaleBalance, mockAssets, type Asset, type AssetStatus } from "../../../types/asset";
import { mockLiabilities, type Liability } from "../../../types/liability";
import type { Column } from "../../../components/ui/table/DataTable";
import Badge from "../../../components/ui/others/Badge";
import PageContainer from "../../../layout/PageContainer";
import Button from "../../../components/ui/button/Button";
import Input from "../../../components/ui/input/Input";
import DataTable from "../../../components/ui/table/DataTable";
import Select from "../../../components/ui/select/Select";
import AssetFormModal from "../../../components/asset/AssetFormModal";
import AssetSaleModal from "../../../components/asset/AssetSaleModal";
import AssetAddSalePaymentModal from "../../../components/asset/AssetAddSalePaymentModal";
import AssetViewModal from "../../../components/asset/AssetViewModal";
// import PageContainer from "../../layout/PageContainer";
// import Input from "../../components/ui/input/Input";
// import Select from "../../components/ui/select/Select";
// import Button from "../../components/ui/button/Button";
// import Badge from "../../components/ui/others/Badge";
// import DataTable, { type Column } from "../../components/ui/table/DataTable";
// import AssetFormModal from "../../components/asset/AssetFormModal";
// import AssetSaleModal from "../../components/asset/AssetSaleModal";
// import AssetAddSalePaymentModal from "../../components/asset/AssetAddSalePaymentModal";
// import AssetViewModal from "../../components/asset/AssetViewModal";
// import { mockAssets } from "../../data/mockAssets";
// import { mockLiabilities } from "../../data/mockLiabilities";
// import { assetSaleBalance } from "../../types/asset";
// import type { Asset, AssetStatus } from "../../types/asset";
// import type { Liability } from "../../types/liability";

const statusOptions: { label: string; value: AssetStatus | "ALL" }[] = [
  { label: "All Statuses", value: "ALL" },
  { label: "Owned", value: "OWNED" },
  { label: "Sold", value: "SOLD" },
];

const Assets = () => {
  const [assets, setAssets] = useState<Asset[]>(mockAssets);
  const [liabilities, setLiabilities] = useState<Liability[]>(mockLiabilities);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<AssetStatus | "ALL">("ALL");

  const [createOpen, setCreateOpen] = useState(false);
  const [saleTarget, setSaleTarget] = useState<Asset | null>(null);
  const [saleOpen, setSaleOpen] = useState(false);
  const [payTarget, setPayTarget] = useState<Asset | null>(null);
  const [payOpen, setPayOpen] = useState(false);
  const [viewTarget, setViewTarget] = useState<Asset | null>(null);
  const [viewOpen, setViewOpen] = useState(false);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return assets.filter((a) => {
      const matchesStatus = statusFilter === "ALL" || a.status === statusFilter;
      const matchesSearch = !q || a.name.toLowerCase().includes(q) || a.category.toLowerCase().includes(q);
      return matchesStatus && matchesSearch;
    });
  }, [assets, search, statusFilter]);

  const handleCreated = (asset: Asset, createdLiability: Liability | null) => {
    setAssets((prev) => [asset, ...prev]);
    if (createdLiability) setLiabilities((prev) => [createdLiability, ...prev]);
    // NOTE: liabilities state here is local to this page for demo purposes.
    // In production this should come from a shared store / API so the new
    // pending liability actually shows up on the Liabilities page.
  };

  const handleAssetUpdated = (updated: Asset) => {
    setAssets((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
  };

  const linkedLiabilityFor = (asset: Asset | null) => (asset?.liabilityId ? liabilities.find((l) => l.id === asset.liabilityId) ?? null : null);

  const columns: Column<Asset>[] = [
    { key: "name", header: "Name", sortable: true },
    { key: "category", header: "Category" },
    { key: "purchaseDate", header: "Purchase Date", sortable: true },
    { key: "purchaseAmount", header: "Purchase Amount", render: (row) => row.purchaseAmount.toLocaleString(undefined, { minimumFractionDigits: 2 }) },
    {
      key: "id",
      header: "Status",
      render: (row) => (
        <div className="flex flex-col gap-1">
          <Badge variant={row.status === "OWNED" ? "success" : "neutral"}>{row.status}</Badge>
          {row.liabilityId && <span className="text-[10px] text-warning">Has pending liability</span>}
        </div>
      ),
    },
    {
      key: "id",
      header: "Actions",
      render: (row) => (
        <div className="flex items-center gap-1.5">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setViewTarget(row);
              setViewOpen(true);
            }}
            className="rounded-lg p-1.5 text-text-muted hover:bg-background hover:text-secondary"
            aria-label="View"
          >
            <Eye className="h-4 w-4" />
          </button>
          {row.status === "OWNED" && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSaleTarget(row);
                setSaleOpen(true);
              }}
              className="rounded-lg p-1.5 text-text-muted hover:bg-primary/10 hover:text-primary-dark"
              aria-label="Sell"
            >
              <Tag className="h-4 w-4" />
            </button>
          )}
          {row.status === "SOLD" && assetSaleBalance(row) > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setPayTarget(row);
                setPayOpen(true);
              }}
              className="rounded-lg px-2 py-1 text-xs font-medium text-success hover:bg-success/10"
            >
              Receive Payment
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <PageContainer
      title="Assets"
      subtitle="Track owned assets, purchases, and sales"
      breadcrumbs={[{ label: "Accounts" }, { label: "Assets" }]}
      icon={<Boxes className="h-5 w-5" />}
      actions={
        <Button icon={<Plus className="h-4 w-4" />} onClick={() => setCreateOpen(true)}>
          Add Asset
        </Button>
      }
    >
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="max-w-xs flex-1">
          <Input placeholder="Search by name, category..." icon={<Search className="h-4 w-4" />} value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="w-48">
          <Select value={statusFilter} options={statusOptions} onChange={(e) => setStatusFilter(e.target.value as AssetStatus | "ALL")} />
        </div>
      </div>

      <DataTable columns={columns} data={filtered} rowKey="id" pageSize={10} loading={false} />

      <AssetFormModal open={createOpen} onClose={() => setCreateOpen(false)} onSaved={handleCreated} />
      <AssetSaleModal open={saleOpen} asset={saleTarget} onClose={() => setSaleOpen(false)} onSold={handleAssetUpdated} />
      <AssetAddSalePaymentModal open={payOpen} asset={payTarget} onClose={() => setPayOpen(false)} onPaid={handleAssetUpdated} />
      <AssetViewModal open={viewOpen} asset={viewTarget} linkedLiability={linkedLiabilityFor(viewTarget)} onClose={() => setViewOpen(false)} />
    </PageContainer>
  );
};

export default Assets;