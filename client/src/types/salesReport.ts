export type SaleItemType =
  | "RETURNABLE_UNIT"
  | "RETURNABLE_STOCK"
  | "CONSUMABLE"
  | "RENTAL_PLUS_CONSUMPTION"
  | "PACKAGE"
  | "SALE";

export interface SaleLineRecord {
  id: string;
  orderId: string;
  billNumber: string;
  date: string; // "YYYY-MM-DD"
  customerId: string | null; // null = walking customer
  customerName: string; // "Walking Customer" if no customer
  itemId: string;
  itemName: string;
  itemType: SaleItemType;
  quantity: number;
  unit: string;
  rate: number;
  discount: number;
  amount: number; // final line amount after discount
  createdBy: string; // user who created the order
}

const itemTypeLabels: Record<SaleItemType, string> = {
  RETURNABLE_UNIT: "Returnable",
  RETURNABLE_STOCK: "Returnable Stock",
  CONSUMABLE: "Consumable",
  RENTAL_PLUS_CONSUMPTION: "Rental + Consumption",
  PACKAGE: "Package",
  SALE: "Sale",
};

export function itemTypeLabel(type: SaleItemType): string {
  return itemTypeLabels[type];
}

// TODO: replace with real API call e.g. GET /api/reports/sales?from=&to=&customerId=&itemId=&createdBy=
export const mockSaleLines: SaleLineRecord[] = [
  { id: "SL001", orderId: "ORD101", billNumber: "BILL-2026-0801", date: "2026-08-01", customerId: "CUST01", customerName: "Ravindu Wickramasinghe", itemId: "R07", itemName: "Generator 10kVA + Fuel", itemType: "RENTAL_PLUS_CONSUMPTION", quantity: 1, unit: "unit", rate: 5500, discount: 0, amount: 16500, createdBy: "Kamal Fernando" },
  { id: "SL002", orderId: "ORD101", billNumber: "BILL-2026-0801", date: "2026-08-01", customerId: "CUST01", customerName: "Ravindu Wickramasinghe", itemId: "R05", itemName: "Water Bottle (500ml)", itemType: "CONSUMABLE", quantity: 20, unit: "pcs", rate: 40, discount: 0, amount: 800, createdBy: "Kamal Fernando" },
  { id: "SL003", orderId: "ORD102", billNumber: "BILL-2026-0802", date: "2026-08-03", customerId: null, customerName: "Walking Customer", itemId: "R10", itemName: "PVC Pipe 4in", itemType: "SALE", quantity: 15, unit: "pcs", rate: 850, discount: 500, amount: 12250, createdBy: "Sunil Perera" },
  { id: "SL004", orderId: "ORD103", billNumber: "BILL-2026-0803", date: "2026-08-05", customerId: "CUST02", customerName: "Chathurika Events (Pvt) Ltd", itemId: "R09", itemName: "Wedding Package - Standard", itemType: "PACKAGE", quantity: 1, unit: "event", rate: 85000, discount: 5000, amount: 80000, createdBy: "Kamal Fernando" },
  { id: "SL005", orderId: "ORD104", billNumber: "BILL-2026-0804", date: "2026-08-08", customerId: "CUST01", customerName: "Ravindu Wickramasinghe", itemId: "R03", itemName: "Cutting Disc 4in", itemType: "RETURNABLE_STOCK", quantity: 40, unit: "pcs", rate: 50, discount: 0, amount: 2000, createdBy: "Sunil Perera" },
  { id: "SL006", orderId: "ORD105", billNumber: "BILL-2026-0805", date: "2026-08-10", customerId: null, customerName: "Walking Customer", itemId: "R11", itemName: "Cement Bag (50kg)", itemType: "SALE", quantity: 30, unit: "bag", rate: 2100, discount: 0, amount: 63000, createdBy: "Nadeesha Silva" },
  { id: "SL007", orderId: "ORD106", billNumber: "BILL-2026-0806", date: "2026-08-12", customerId: "CUST02", customerName: "Chathurika Events (Pvt) Ltd", itemId: "R02", itemName: "Video Camera - Sony", itemType: "RETURNABLE_UNIT", quantity: 1, unit: "unit", rate: 4500, discount: 0, amount: 13500, createdBy: "Kamal Fernando" },
  { id: "SL008", orderId: "ORD107", billNumber: "BILL-2026-0807", date: "2026-08-15", customerId: "CUST01", customerName: "Ravindu Wickramasinghe", itemId: "R01", itemName: "Generator 5kVA", itemType: "RETURNABLE_UNIT", quantity: 1, unit: "unit", rate: 3500, discount: 0, amount: 10500, createdBy: "Sunil Perera" },
  { id: "SL009", orderId: "ORD108", billNumber: "BILL-2026-0808", date: "2026-08-18", customerId: null, customerName: "Walking Customer", itemId: "R06", itemName: "Milk Packet", itemType: "CONSUMABLE", quantity: 50, unit: "pcs", rate: 60, discount: 0, amount: 3000, createdBy: "Nadeesha Silva" },
  { id: "SL010", orderId: "ORD109", billNumber: "BILL-2026-0809", date: "2026-08-20", customerId: "CUST02", customerName: "Chathurika Events (Pvt) Ltd", itemId: "R04", itemName: "Plastic Chair", itemType: "RETURNABLE_STOCK", quantity: 200, unit: "pcs", rate: 25, discount: 1000, amount: 4000, createdBy: "Kamal Fernando" },
  { id: "SL011", orderId: "ORD110", billNumber: "BILL-2026-0810", date: "2026-08-22", customerId: "CUST01", customerName: "Ravindu Wickramasinghe", itemId: "R08", itemName: "Event Cable Set + Oil", itemType: "RENTAL_PLUS_CONSUMPTION", quantity: 2, unit: "set", rate: 1200, discount: 0, amount: 4150, createdBy: "Sunil Perera" },
  { id: "SL012", orderId: "ORD111", billNumber: "BILL-2026-0811", date: "2026-08-25", customerId: null, customerName: "Walking Customer", itemId: "R10", itemName: "PVC Pipe 4in", itemType: "SALE", quantity: 10, unit: "pcs", rate: 850, discount: 0, amount: 8500, createdBy: "Nadeesha Silva" },
  { id: "SL013", orderId: "ORD112", billNumber: "BILL-2026-0812", date: "2026-08-27", customerId: "CUST02", customerName: "Chathurika Events (Pvt) Ltd", itemId: "R09", itemName: "Wedding Package - Standard", itemType: "PACKAGE", quantity: 1, unit: "event", rate: 85000, discount: 0, amount: 85000, createdBy: "Kamal Fernando" },
];

export const mockCreatedByUsers = ["Sunil Perera", "Kamal Fernando", "Nadeesha Silva"];