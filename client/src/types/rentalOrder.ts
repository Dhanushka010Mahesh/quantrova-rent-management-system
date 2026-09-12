// import type { CatalogItemType, PackageComponent, Guarantor } from "./rental";
// import type { PaymentData } from "./payment";

// export type RentalOrderStatus = "PENDING" | "PROCESSED" | "REJECTED";

// // Types where the amount is time-based (rate x days). Others are flat (qty x rate).
// const DAY_BASED_TYPES: CatalogItemType[] = ["RETURNABLE_UNIT", "RETURNABLE_STOCK", "RENTAL_PLUS_CONSUMPTION"];

// export interface OrderLine {
//   id: string;
//   itemId: string;
//   itemName: string;
//   itemType: CatalogItemType;
//   unit: string;
//   quantity: number;
//   rate: number;
//   consumableQty?: number;
//   consumableRate?: number;
//   discount: number;
//   packageComponents?: PackageComponent[];
//   outDate: string; // "YYYY-MM-DD" — date this specific item was actually given out
//   returnDate: string | null; // set when the item is returned; null = still out
// }

// export interface OrderNote {
//   id: string;
//   text: string;
//   author: string;
//   date: string; // ISO datetime
// }

// export interface RentalOrder {
//   id: string;
//   billNumber: string;
//   customerId: string | null;
//   customerName: string;
//   customerPhone: string;
//   orderDate: string; // "YYYY-MM-DD" — date the order was created
//   status: RentalOrderStatus;
//   lines: OrderLine[];
//   guarantors: Guarantor[];
//   orderImages: string[];
//   advance: { amount: number; payment: PaymentData } | null;
//   finalPayment: { amount: number; payment: PaymentData } | null; // set on processing if paid then
//   notes: OrderNote[];
//   processedAt: string | null;
//   processedBy: string | null;
//   rejectedReason: string | null;
// }

// // Day count for a line: from its outDate to its returnDate (if returned) or today (if still out)
// export function lineDayCount(line: OrderLine): number {
//   if (!DAY_BASED_TYPES.includes(line.itemType)) return 1;
//   const start = new Date(line.outDate);
//   const end = line.returnDate ? new Date(line.returnDate) : new Date();
//   const diff = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
//   return Math.max(diff, 1);
// }

// export function lineAmount(line: OrderLine): number {
//   const days = lineDayCount(line);
//   switch (line.itemType) {
//     case "SALE":
//     case "CONSUMABLE":
//     case "PACKAGE":
//       return line.quantity * line.rate - line.discount;
//     case "RETURNABLE_UNIT":
//     case "RETURNABLE_STOCK":
//       return line.quantity * line.rate * days - line.discount;
//     case "RENTAL_PLUS_CONSUMPTION":
//       return (
//         line.quantity * line.rate * days +
//         (line.consumableQty ?? 0) * (line.consumableRate ?? 0) -
//         line.discount
//       );
//   }
// }

// export function orderTotal(order: RentalOrder): number {
//   return order.lines.reduce((sum, l) => sum + lineAmount(l), 0);
// }

// export function orderPaidTotal(order: RentalOrder): number {
//   return (order.advance?.amount ?? 0) + (order.finalPayment?.amount ?? 0);
// }

// export function orderBalanceDue(order: RentalOrder): number {
//   return orderTotal(order) - orderPaidTotal(order);
// }
import type { CatalogItemType, PackageComponent, Guarantor } from "./rental";
import type { PaymentData } from "./payment";

export type RentalOrderStatus = "PENDING" | "PROCESSED" | "REJECTED";

const DAY_BASED_TYPES: CatalogItemType[] = [
  "RETURNABLE_UNIT",
  "RETURNABLE_STOCK",
  "RENTAL_PLUS_CONSUMPTION",
];

export interface OrderLine {
  id: string;
  itemId: string;
  itemName: string;
  itemType: CatalogItemType;
  unit: string;
  quantity: number;
  rate: number;
  consumableQty?: number;
  consumableRate?: number;
  discount: number;
  packageComponents?: PackageComponent[];
  outDate: string; // "YYYY-MM-DD" — date this specific item was actually given out
  returnDate: string | null; // set when the item is returned; null = still out
  manualDays?: number; // set to override the auto-calculated day count (e.g. corrected during processing)
}

export interface OrderNote {
  id: string;
  text: string;
  author: string;
  date: string; // ISO datetime
}

// Extra charges applied at processing time — damage cost, cleaning cost, etc.
export interface ProcessDeduction {
  id: string;
  label: string;
  amount: number;
}

export interface RentalOrder {
  id: string;
  billNumber: string;
  customerId: string | null;
  customerName: string;
  customerPhone: string;
  orderDate: string;
  status: RentalOrderStatus;
  lines: OrderLine[];
  guarantors: Guarantor[];
  orderImages: string[];
  advance: { amount: number; payment: PaymentData } | null;
  finalPayment: { amount: number; payment: PaymentData } | null;
  notes: OrderNote[];
  processDeductions: ProcessDeduction[]; // damage/cleaning/other charges added when processed
  processedAt: string | null;
  processedBy: string | null;
  rejectedReason: string | null;
}

// Day count for a line: manual override if set, else outDate -> returnDate (or today if still out)
export function lineDayCount(line: OrderLine): number {
  if (!DAY_BASED_TYPES.includes(line.itemType)) return 1;
  if (line.manualDays && line.manualDays > 0) return line.manualDays;
  const start = new Date(line.outDate);
  const end = line.returnDate ? new Date(line.returnDate) : new Date();
  const diff = Math.round(
    (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24),
  );
  return Math.max(diff, 1);
}

export function lineAmount(line: OrderLine): number {
  const days = lineDayCount(line);
  switch (line.itemType) {
    case "SALE":
    case "CONSUMABLE":
    case "PACKAGE":
      return line.quantity * line.rate - line.discount;
    case "RETURNABLE_UNIT":
    case "RETURNABLE_STOCK":
      return line.quantity * line.rate * days - line.discount;
    case "RENTAL_PLUS_CONSUMPTION":
      return (
        line.quantity * line.rate * days +
        (line.consumableQty ?? 0) * (line.consumableRate ?? 0) -
        line.discount
      );
  }
}

export function lineItemsTotal(lines: OrderLine[]): number {
  return lines.reduce((sum, l) => sum + lineAmount(l), 0);
}

export function orderTotal(order: RentalOrder): number {
  const itemsTotal = lineItemsTotal(order.lines);
  const deductionsTotal = order.processDeductions.reduce(
    (s, d) => s + d.amount,
    0,
  );
  return itemsTotal + deductionsTotal;
}

export function orderPaidTotal(order: RentalOrder): number {
  return (order.advance?.amount ?? 0) + (order.finalPayment?.amount ?? 0);
}

export function orderBalanceDue(order: RentalOrder): number {
  return orderTotal(order) - orderPaidTotal(order);
}

// TODO: replace with real API call e.g. GET /api/rental-orders
export const mockRentalOrders: RentalOrder[] = [
  {
    id: "ORD001",
    billNumber: "BILL-2026-0801",
    customerId: "CUST01",
    customerName: "Ravindu Wickramasinghe",
    customerPhone: "0771122334",
    orderDate: "2026-08-20",
    status: "PENDING",
    lines: [
      {
        id: "L1",
        itemId: "R01",
        itemName: "Generator 5kVA",
        itemType: "RETURNABLE_UNIT",
        unit: "unit",
        quantity: 1,
        rate: 3500,
        discount: 0,
        outDate: "2026-08-20",
        returnDate: null,
      },
      {
        id: "L2",
        itemId: "R05",
        itemName: "Water Bottle (500ml)",
        itemType: "CONSUMABLE",
        unit: "pcs",
        quantity: 20,
        rate: 40,
        discount: 0,
        outDate: "2026-08-20",
        returnDate: null,
      },
    ],
    guarantors: [],
    orderImages: [],
    advance: { amount: 5000, payment: { method: "CASH", cash_id: 1 } },
    finalPayment: null,
    notes: [
      {
        id: "N1",
        text: "Customer requested delivery to site.",
        author: "Kamal Fernando",
        date: "2026-08-20T10:15:00",
      },
    ],
    processDeductions: [],
    processedAt: null,
    processedBy: null,
    rejectedReason: null,
  },
  {
    id: "ORD002",
    billNumber: "BILL-2026-0802",
    customerId: null,
    customerName: "Walking Customer",
    customerPhone: "",
    orderDate: "2026-08-10",
    status: "PROCESSED",
    lines: [
      {
        id: "L3",
        itemId: "R10",
        itemName: "PVC Pipe 4in",
        itemType: "SALE",
        unit: "pcs",
        quantity: 15,
        rate: 850,
        discount: 500,
        outDate: "2026-08-10",
        returnDate: "2026-08-10",
      },
    ],
    guarantors: [],
    orderImages: [],
    advance: null,
    finalPayment: { amount: 12250, payment: { method: "CASH", cash_id: 1 } },
    notes: [],
    processDeductions: [],
    processedAt: "2026-08-10T14:20:00",
    processedBy: "Sunil Perera",
    rejectedReason: null,
  },
  {
    id: "ORD003",
    billNumber: "BILL-2026-0803",
    customerId: "CUST02",
    customerName: "Chathurika Events (Pvt) Ltd",
    customerPhone: "0112233445",
    orderDate: "2026-08-05",
    status: "PENDING",
    lines: [
      {
        id: "L4",
        itemId: "R02",
        itemName: "Video Camera - Sony",
        itemType: "RETURNABLE_UNIT",
        unit: "unit",
        quantity: 2,
        rate: 4500,
        discount: 1000,
        outDate: "2026-08-05",
        returnDate: null,
      },
      {
        id: "L5",
        itemId: "R03",
        itemName: "Cutting Disc 4in",
        itemType: "RETURNABLE_STOCK",
        unit: "pcs",
        quantity: 10,
        rate: 50,
        discount: 0,
        outDate: "2026-08-18", // added later than the camera line — independent day count
        returnDate: null,
      },
    ],
    guarantors: [
      {
        id: "G1",
        guarantorId: "G01",
        name: "Nimal Rathnayake",
        nic: "198812304567",
        phone: "0776543210",
        address: "Nugegoda",
        imageDataUrl: null,
      },
    ],
    orderImages: [],
    advance: null,
    finalPayment: null,
    notes: [],
    processDeductions: [],
    processedAt: null,
    processedBy: null,
    rejectedReason: null,
  },
  {
    id: "ORD004",
    billNumber: "BILL-2026-0794",
    customerId: "CUST01",
    customerName: "Ravindu Wickramasinghe",
    customerPhone: "0771122334",
    orderDate: "2026-07-28",
    status: "REJECTED",
    lines: [
      {
        id: "L6",
        itemId: "R09",
        itemName: "Wedding Package - Standard",
        itemType: "PACKAGE",
        unit: "event",
        quantity: 1,
        rate: 85000,
        discount: 0,
        outDate: "2026-07-28",
        returnDate: null,
        packageComponents: [
          { name: "Chairs", qty: 100 },
          { name: "Tables", qty: 10 },
        ],
      },
    ],
    guarantors: [],
    orderImages: [],
    advance: null,
    finalPayment: null,
    notes: [],
    processDeductions: [
      {
        id: "PD1",
        label: "DAMAGE",
        // description: "PVC pipe damaged during rental",
        amount: 1500,
      },
    ],
    processedAt: null,
    processedBy: null,
    rejectedReason: "Customer could not confirm event date.",
  },
];
