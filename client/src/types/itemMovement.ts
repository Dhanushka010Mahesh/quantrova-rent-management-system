export type MovementType = "IN" | "OUT" | "RETURN";

export interface Item {
  id: string;
  name: string;
  unit: string; // e.g. "pcs", "kg", "box"
  currentStock: number;
}

export interface ItemMovement {
  id: string;
  itemId: string;
  itemName: string;
  unit: string;
  type: MovementType;
  quantity: number;
  reference: string; // e.g. PO number, job/usage reference, return reason
  remarks: string;
  date: string; // "YYYY-MM-DD"
  balanceAfter: number; // stock balance after this movement
  createdAt: string;
}

// TODO: replace with real API call e.g. GET /api/items
export const mockItems: Item[] = [
  { id: "I01", name: "Cement Bag (50kg)", unit: "bag", currentStock: 120 },
  { id: "I02", name: "Steel Rod 12mm", unit: "pcs", currentStock: 480 },
  { id: "I03", name: "PVC Pipe 4in", unit: "pcs", currentStock: 65 },
  { id: "I04", name: "Paint - White Emulsion", unit: "ltr", currentStock: 40 },
];