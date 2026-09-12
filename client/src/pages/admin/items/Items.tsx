import { useMemo, useState } from "react";
import {
  Plus,
  Search,
  Filter,
  Eye,
  Pencil,
  Package,
  Layers,
  CheckCircle2,
  XCircle,
  X,
} from "lucide-react";

import StatusToggle from "../../../components/ui/others/StatusToggle";
import PageContainer from "../../../layout/PageContainer";
import Button from "../../../components/ui/button/Button";
import Input from "../../../components/ui/input/Input";
import DetailsTable from "../../../components/ui/table/DetailsTable";
import type { Column } from "../../../components/ui/table/DataTable";

interface Item {
  id: string;
  code: string;
  name: string;
  category: string;
  unit: string;
  sellingPrice: number;
  costPrice: number;
  active: boolean;
  createdAt: string;
}

const initialItems: Item[] = [
  {
    id: "1",
    code: "ITM-001",
    name: "Cement 50kg",
    category: "Construction Materials",
    unit: "Bag",
    sellingPrice: 2850,
    costPrice: 2600,
    active: true,
    createdAt: "2026-01-10",
  },
  {
    id: "2",
    code: "ITM-002",
    name: "River Sand",
    category: "Construction Materials",
    unit: "Cube",
    sellingPrice: 18500,
    costPrice: 16500,
    active: true,
    createdAt: "2026-01-15",
  },
  {
    id: "3",
    code: "ITM-003",
    name: "Concrete Mixer",
    category: "Equipment",
    unit: "Unit",
    sellingPrice: 185000,
    costPrice: 165000,
    active: true,
    createdAt: "2026-02-05",
  },
  {
    id: "4",
    code: "ITM-004",
    name: "Safety Helmet",
    category: "Safety Equipment",
    unit: "Piece",
    sellingPrice: 1850,
    costPrice: 1400,
    active: false,
    createdAt: "2026-02-18",
  },
  {
    id: "5",
    code: "ITM-005",
    name: "PVC Pipe 1/2",
    category: "Plumbing",
    unit: "Length",
    sellingPrice: 950,
    costPrice: 780,
    active: true,
    createdAt: "2026-03-02",
  },
];

const categories = [
  "All Categories",
  "Construction Materials",
  "Equipment",
  "Safety Equipment",
  "Plumbing",
];

const statusOptions = ["All Status", "Active", "Inactive"];

export default function Items() {
  const [items, setItems] = useState<Item[]>(initialItems);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All Categories");
  const [status, setStatus] = useState("All Status");

  const [showFilters, setShowFilters] = useState(false);

  const [modalMode, setModalMode] = useState<
    "create" | "edit" | "view" | "category"
  >("create");

  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase();

    return items.filter((item) => {
      const matchesSearch =
        !query ||
        item.name.toLowerCase().includes(query) ||
        item.code.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query);

      const matchesCategory =
        category === "All Categories" ||
        item.category === category;

      const matchesStatus =
        status === "All Status" ||
        (status === "Active" && item.active) ||
        (status === "Inactive" && !item.active);

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [items, search, category, status]);

  const activeCount = items.filter((item) => item.active).length;
  const inactiveCount = items.filter((item) => !item.active).length;

  const openCreate = () => {
    setSelectedItem(null);
    setModalMode("create");
    setModalOpen(true);
  };

  const openEdit = (item: Item) => {
    setSelectedItem(item);
    setModalMode("edit");
    setModalOpen(true);
  };

  const openView = (item: Item) => {
    setSelectedItem(item);
    setModalMode("view");
    setModalOpen(true);
  };

  const openCategory = () => {
    setSelectedItem(null);
    setModalMode("category");
    setModalOpen(true);
  };

  const handleStatusChange = async (
    item: Item,
    nextStatus: boolean
  ) => {
    setItems((prev) =>
      prev.map((current) =>
        current.id === item.id
          ? { ...current, active: nextStatus }
          : current
      )
    );

    // TODO:
    // PATCH /api/items/:id
    // { active: nextStatus }
  };

  const columns = useMemo<Column<Item>[]>(
    () => [
      {
        key: "name",
        header: "Item",
        sortable: true,
        render: (row) => (
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary-dark">
              <Package className="h-4 w-4" />
            </div>

            <div className="min-w-0">
              <p className="truncate font-medium text-secondary">
                {row.name}
              </p>

              <p className="text-xs text-text-muted">
                {row.code}
              </p>
            </div>
          </div>
        ),
      },

      {
        key: "category",
        header: "Category",
        sortable: true,
        render: (row) => (
          <span className="text-sm text-text">
            {row.category}
          </span>
        ),
      },

      {
        key: "unit",
        header: "Unit",
        render: (row) => (
          <span className="text-sm text-text-muted">
            {row.unit}
          </span>
        ),
      },

      {
        key: "sellingPrice",
        header: "Selling Price",
        sortable: true,
        render: (row) => (
          <span className="font-medium text-secondary">
            Rs. {row.sellingPrice.toLocaleString()}
          </span>
        ),
      },

      {
        key: "active",
        header: "Status",
        render: (row) => (
          <StatusToggle
            active={row.active}
            onChange={(next) =>
              handleStatusChange(row, next)
            }
          />
        ),
      },

      {
        key: "id",
        header: "Actions",
        render: (row) => (
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                openView(row);
              }}
              className="rounded-lg p-2 text-text-muted transition-colors hover:bg-background hover:text-secondary"
              title="View details"
            >
              <Eye className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                openEdit(row);
              }}
              className="rounded-lg p-2 text-text-muted transition-colors hover:bg-primary/10 hover:text-primary-dark"
              title="Edit item"
            >
              <Pencil className="h-4 w-4" />
            </button>
          </div>
        ),
      },
    ],
    []
  );

  return (
    <PageContainer
      title="Items"
      subtitle="Manage items, categories, pricing and availability"
      breadcrumbs={[
        { label: "Inventory", path: "/admin/inventory" },
        { label: "Items" },
      ]}
    //   icon={<Package className="h-5 w-5" />}
      actions={
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            icon={<Layers className="h-4 w-4" />}
            onClick={openCategory}
          >
            New Category
          </Button>

          <Button
            icon={<Plus className="h-4 w-4" />}
            onClick={openCreate}
          >
            New Item
          </Button>
        </div>
      }
    >
      {/* Summary */}
      <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
        {/* Total */}
        <div className="flex items-center gap-3 rounded-xl border border-border bg-surface px-4 py-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary-dark">
            <Package className="h-4 w-4" />
          </div>

          <div>
            <p className="text-xs font-medium text-text-muted">
              Total Items
            </p>

            <p className="text-lg font-semibold text-secondary">
              {items.length}
            </p>
          </div>
        </div>

        {/* Active */}
        <div className="flex items-center gap-3 rounded-xl border border-border bg-surface px-4 py-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-success/10 text-success">
            <CheckCircle2 className="h-4 w-4" />
          </div>

          <div>
            <p className="text-xs font-medium text-text-muted">
              Active Items
            </p>

            <p className="text-lg font-semibold text-secondary">
              {activeCount}
            </p>
          </div>
        </div>

        {/* Inactive */}
        <div className="flex items-center gap-3 rounded-xl border border-border bg-surface px-4 py-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-background text-text-muted">
            <XCircle className="h-4 w-4" />
          </div>

          <div>
            <p className="text-xs font-medium text-text-muted">
              Inactive Items
            </p>

            <p className="text-lg font-semibold text-secondary">
              {inactiveCount}
            </p>
          </div>
        </div>
      </div>

      {/* Items Table */}
      <div className="overflow-hidden rounded-xl border border-border bg-surface shadow-sm">
        {/* Toolbar */}
        <div className="border-b border-border">
          <div className="flex flex-col gap-3 px-4 py-3.5 lg:flex-row lg:items-center lg:justify-between">
            {/* Heading */}
            <div className="flex items-center gap-3">
              {/* <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary-dark">
                <Package className="h-4 w-4" />
              </div> */}

              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-semibold text-secondary">
                    Item List
                  </h2>

                  <span className="rounded-full bg-background px-2 py-0.5 text-[10px] font-medium text-text-muted">
                    {filteredItems.length}
                  </span>
                </div>

                <p className="mt-0.5 text-xs text-text-muted">
                  {search || category !== "All Categories" || status !== "All Status"
                    ? `Showing ${filteredItems.length} matching items`
                    : `Manage ${items.length} items`}
                </p>
              </div>
            </div>

            {/* Search + Filter */}
            <div className="flex flex-col gap-2 sm:flex-row">
              <div className="w-full sm:w-72">
                <Input
                  placeholder="Search items..."
                  icon={<Search className="h-4 w-4" />}
                  value={search}
                  onChange={(event) =>
                    setSearch(event.target.value)
                  }
                />
              </div>

              <button
                type="button"
                onClick={() =>
                  setShowFilters((prev) => !prev)
                }
                className={`flex h-10 items-center justify-center gap-2 rounded-lg border px-3 text-sm font-medium transition-colors ${
                  showFilters
                    ? "border-primary/30 bg-primary/10 text-primary-dark"
                    : "border-border text-text-muted hover:bg-background hover:text-secondary"
                }`}
              >
                <Filter className="h-4 w-4" />
                Filters
              </button>
            </div>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="flex flex-col gap-3 border-t border-border bg-background/50 px-4 py-3 sm:flex-row sm:items-end">
              {/* Category */}
              <div className="w-full sm:w-60">
                <label className="mb-1.5 block text-xs font-medium text-text-muted">
                  Category
                </label>

                <select
                  value={category}
                  onChange={(event) =>
                    setCategory(event.target.value)
                  }
                  className="h-10 w-full rounded-lg border border-border bg-surface px-3 text-sm text-secondary outline-none transition-colors focus:border-primary"
                >
                  {categories.map((itemCategory) => (
                    <option
                      key={itemCategory}
                      value={itemCategory}
                    >
                      {itemCategory}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status */}
              <div className="w-full sm:w-44">
                <label className="mb-1.5 block text-xs font-medium text-text-muted">
                  Status
                </label>

                <select
                  value={status}
                  onChange={(event) =>
                    setStatus(event.target.value)
                  }
                  className="h-10 w-full rounded-lg border border-border bg-surface px-3 text-sm text-secondary outline-none transition-colors focus:border-primary"
                >
                  {statusOptions.map((statusItem) => (
                    <option
                      key={statusItem}
                      value={statusItem}
                    >
                      {statusItem}
                    </option>
                  ))}
                </select>
              </div>

              {/* Clear */}
              {(category !== "All Categories" ||
                status !== "All Status" ||
                search) && (
                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setCategory("All Categories");
                    setStatus("All Status");
                  }}
                  className="flex h-10 items-center justify-center gap-1.5 px-3 text-xs font-medium text-text-muted hover:text-secondary"
                >
                  <X className="h-3.5 w-3.5" />
                  Clear Filters
                </button>
              )}
            </div>
          )}
        </div>

        {/* Table */}
        <div className="min-h-[280px]">
          <DetailsTable
            columns={columns}
            data={filteredItems}
            rowKey="id"
            loading={false}
            renderDetails={(row) => (
              <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-sm sm:grid-cols-4">
                <div>
                  <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-text-muted">
                    Item Code
                  </p>

                  <p className="font-medium text-secondary">
                    {row.code}
                  </p>
                </div>

                <div>
                  <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-text-muted">
                    Cost Price
                  </p>

                  <p className="text-text">
                    Rs. {row.costPrice.toLocaleString()}
                  </p>
                </div>

                <div>
                  <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-text-muted">
                    Selling Price
                  </p>

                  <p className="text-text">
                    Rs. {row.sellingPrice.toLocaleString()}
                  </p>
                </div>

                <div>
                  <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-text-muted">
                    Created
                  </p>

                  <p className="text-text">
                    {row.createdAt}
                  </p>
                </div>
              </div>
            )}
          />
        </div>

        {/* Empty State */}
        {filteredItems.length === 0 && (
          <div className="border-t border-border px-4 py-10 text-center">
            <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-background text-text-muted">
              <Search className="h-5 w-5" />
            </div>

            <p className="text-sm font-medium text-secondary">
              No items found
            </p>

            <p className="mt-1 text-xs text-text-muted">
              Try changing your search or filter criteria.
            </p>

            <button
              type="button"
              onClick={() => {
                setSearch("");
                setCategory("All Categories");
                setStatus("All Status");
              }}
              className="mt-3 text-xs font-medium text-primary-dark hover:underline"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>

      {/* TODO:
          Replace this with ItemFormModal / CategoryFormModal
          when those components are created.
      */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-xl border border-border bg-surface p-5 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-secondary">
                  {modalMode === "create" && "Create New Item"}
                  {modalMode === "edit" && "Edit Item"}
                  {modalMode === "view" && "Item Details"}
                  {modalMode === "category" && "Create New Category"}
                </h3>

                <p className="mt-0.5 text-xs text-text-muted">
                  {modalMode === "category"
                    ? "Create a new item category."
                    : "Item management form will be connected here."}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="rounded-lg p-2 text-text-muted hover:bg-background hover:text-secondary"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {modalMode === "view" && selectedItem ? (
              <div className="space-y-3 text-sm">
                <div className="rounded-lg bg-background p-3">
                  <p className="text-xs text-text-muted">
                    Item Name
                  </p>
                  <p className="font-medium text-secondary">
                    {selectedItem.name}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg bg-background p-3">
                    <p className="text-xs text-text-muted">
                      Item Code
                    </p>
                    <p className="font-medium text-secondary">
                      {selectedItem.code}
                    </p>
                  </div>

                  <div className="rounded-lg bg-background p-3">
                    <p className="text-xs text-text-muted">
                      Category
                    </p>
                    <p className="font-medium text-secondary">
                      {selectedItem.category}
                    </p>
                  </div>

                  <div className="rounded-lg bg-background p-3">
                    <p className="text-xs text-text-muted">
                      Cost Price
                    </p>
                    <p className="font-medium text-secondary">
                      Rs. {selectedItem.costPrice.toLocaleString()}
                    </p>
                  </div>

                  <div className="rounded-lg bg-background p-3">
                    <p className="text-xs text-text-muted">
                      Selling Price
                    </p>
                    <p className="font-medium text-secondary">
                      Rs. {selectedItem.sellingPrice.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-lg border border-dashed border-border bg-background px-4 py-8 text-center">
                <Package className="mx-auto h-7 w-7 text-text-muted" />

                <p className="mt-2 text-sm font-medium text-secondary">
                  {modalMode === "category"
                    ? "Category form"
                    : "Item form"}
                </p>

                <p className="mt-1 text-xs text-text-muted">
                  Connect your form component here.
                </p>
              </div>
            )}

            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-text-muted hover:bg-background"
              >
                Close
              </button>

              {modalMode !== "view" && (
                <Button>
                  {modalMode === "category"
                    ? "Create Category"
                    : modalMode === "edit"
                    ? "Save Changes"
                    : "Create Item"}
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </PageContainer>
  );
}