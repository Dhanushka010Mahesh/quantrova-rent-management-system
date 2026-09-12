import { useEffect, useMemo, useState } from "react";
import { Plus, Search, ArrowLeftRight } from "lucide-react";
import type { ItemMovement, MovementType } from "../../../types/itemMovement";
import type { Column } from "../../../components/ui/table/DataTable";
import Badge from "../../../components/ui/others/Badge";
import PageContainer from "../../../layout/PageContainer";
import Button from "../../../components/ui/button/Button";
import Input from "../../../components/ui/input/Input";
import Select from "../../../components/ui/select/Select";
import DataTable from "../../../components/ui/table/DataTable";
import MovementFormModal from "../../../components/purchasing/MovementFormModal";
// import type { Column } from "../../components/ui/table/DataTable";
// import type { ItemMovement, MovementType } from "../../types/itemMovement";
// import Badge from "../../components/ui/others/Badge";
// import PageContainer from "../../layout/PageContainer";
// import Button from "../../components/ui/button/Button";
// import Input from "../../components/ui/input/Input";
// import Select from "../../components/ui/select/Select";
// import DataTable from "../../components/ui/table/DataTable";
// import MovementFormModal from "../../components/itemMovement/MovementFormModal";

const typeVariant: Record<MovementType, "success" | "danger" | "info"> = {
  IN: "success",
  OUT: "danger",
  RETURN: "info",
};

const typeLabel: Record<MovementType, string> = {
  IN: "Stock In",
  OUT: "Stock Out",
  RETURN: "Return",
};

const filterOptions: { label: string; value: MovementType | "ALL" }[] = [
  { label: "All Movements", value: "ALL" },
  { label: "Stock In", value: "IN" },
  { label: "Stock Out", value: "OUT" },
  { label: "Return", value: "RETURN" },
];

const ItemsMovement = () => {
  const [movements, setMovements] = useState<ItemMovement[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<MovementType | "ALL">("ALL");
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    // TODO: replace with real API call e.g. GET /api/item-movements
    setTimeout(() => {
      setMovements([
        {
          id: "M001",
          itemId: "I01",
          itemName: "Cement Bag (50kg)",
          unit: "bag",
          type: "IN",
          quantity: 100,
          reference: "PO-2026-041",
          remarks: "Bulk purchase from supplier",
          date: "2026-08-10",
          balanceAfter: 100,
          createdAt: "2026-08-10",
        },
        {
          id: "M002",
          itemId: "I01",
          itemName: "Cement Bag (50kg)",
          unit: "bag",
          type: "OUT",
          quantity: 30,
          reference: "Site A - Foundation",
          remarks: "",
          date: "2026-08-15",
          balanceAfter: 70,
          createdAt: "2026-08-15",
        },
        {
          id: "M003",
          itemId: "I02",
          itemName: "Steel Rod 12mm",
          unit: "pcs",
          type: "IN",
          quantity: 500,
          reference: "PO-2026-042",
          remarks: "",
          date: "2026-08-18",
          balanceAfter: 500,
          createdAt: "2026-08-18",
        },
        {
          id: "M004",
          itemId: "I02",
          itemName: "Steel Rod 12mm",
          unit: "pcs",
          type: "RETURN",
          quantity: 20,
          reference: "Excess material returned from Site B",
          remarks: "",
          date: "2026-08-22",
          balanceAfter: 480,
          createdAt: "2026-08-22",
        },
      ]);
      setLoading(false);
    }, 800);
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return movements.filter((m) => {
      const matchesType = typeFilter === "ALL" || m.type === typeFilter;
      const matchesSearch =
        !q || m.itemName.toLowerCase().includes(q) || m.reference.toLowerCase().includes(q);
      return matchesType && matchesSearch;
    });
  }, [movements, search, typeFilter]);

  const handleSaved = (saved: ItemMovement) => {
    setMovements((prev) => [saved, ...prev]);
  };

  const columns: Column<ItemMovement>[] = [
    { key: "date", header: "Date", sortable: true },
    { key: "itemName", header: "Item", sortable: true },
    {
      key: "type",
      header: "Movement",
      render: (row) => <Badge variant={typeVariant[row.type]}>{typeLabel[row.type]}</Badge>,
    },
    {
      key: "quantity",
      header: "Quantity",
      render: (row) => (
        <span className={row.type === "OUT" ? "text-danger" : "text-success"}>
          {row.type === "OUT" ? "−" : "+"}
          {row.quantity} {row.unit}
        </span>
      ),
    },
    { key: "reference", header: "Reference" },
    {
      key: "balanceAfter",
      header: "Balance After",
      render: (row) => (
        <span className="font-medium text-secondary">
          {row.balanceAfter} {row.unit}
        </span>
      ),
    },
  ];

  return (
    <PageContainer
      title="Items Movement"
      subtitle="Track stock in, stock out, and returns for all items"
      breadcrumbs={[{ label: "Inventory" }, { label: "Items Movement" }]}
      icon={<ArrowLeftRight className="h-5 w-5" />}
      actions={
        <Button icon={<Plus className="h-4 w-4" />} onClick={() => setModalOpen(true)}>
          Create Movement
        </Button>
      }
    >
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="max-w-xs flex-1">
          <Input
            placeholder="Search by item, reference..."
            icon={<Search className="h-4 w-4" />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="w-48">
          <Select
            value={typeFilter}
            options={filterOptions}
            onChange={(e) => setTypeFilter(e.target.value as MovementType | "ALL")}
          />
        </div>
      </div>

      <DataTable columns={columns} data={filtered} loading={loading} rowKey="id" pageSize={10} />

      <MovementFormModal open={modalOpen} onClose={() => setModalOpen(false)} onSaved={handleSaved} />
    </PageContainer>
  );
};

export default ItemsMovement;