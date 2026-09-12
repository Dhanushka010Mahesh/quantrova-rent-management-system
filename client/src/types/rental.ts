export type CatalogItemType =
  | "RETURNABLE_UNIT" // machine, generator, camera — unique/serialized
  | "RETURNABLE_STOCK" // bulk items — cutting discs etc.
  | "CONSUMABLE" // non-returnable package — milk packet, water bottle
  | "RENTAL_PLUS_CONSUMPTION" // returnable part + consumable part — generator + fuel
  | "PACKAGE" // bundle of multiple items — wedding package
  | "SALE"; // outright sale, no return, no customer required

export interface PackageComponent {
  name: string;
  qty: number;
}

export interface CatalogItem {
  id: string;
  name: string;
  type: CatalogItemType;
  unit: string; // "pcs", "day", "ltr", "set" etc.
  rentalRatePerDay?: number; // RETURNABLE_UNIT / RETURNABLE_STOCK / RENTAL_PLUS_CONSUMPTION (returnable part)
  consumableRate?: number; // CONSUMABLE / RENTAL_PLUS_CONSUMPTION (consumable part) — price per unit
  salePrice?: number; // SALE
  packagePrice?: number; // PACKAGE — default price per event
  availableStock?: number; // RETURNABLE_STOCK / CONSUMABLE / SALE
  packageComponents?: PackageComponent[]; // PACKAGE — what's inside
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  nic: string;
  address: string;
  description: string;
  creditBalance: number; // positive = customer owes us from before
}

export const mockRentalCustomers: Customer[] = [
  {
    id: "CUST01",
    name: "Ravindu Wickramasinghe",
    phone: "0771122334",
    nic: "199534501234",
    address: "No. 45, Galle Road, Colombo 06",
    description: "Regular customer — event decorations",
    creditBalance: 5000
  },
  {
    id: "CUST02",
    name: "Chathurika Events (Pvt) Ltd",
    phone: "0112233445",
    nic: "PV-00123456",
    address: "Kandy Road, Kadawatha",
    description: "Corporate account — wedding & event packages",
    creditBalance: 0
  },
];

export interface Guarantor {
  id: string; // local row id (for the form list)
  guarantorId?: string; // set when matched/selected from existing guarantors
  name: string;
  nic: string;
  phone: string;
  address: string;
  imageDataUrl: string | null;
}

export interface RentalOrderLine {
  id: string;
  itemId: string;
  itemName: string;
  itemType: CatalogItemType;
  unit: string;
  quantity: number;
  rate: number; // rental rate/day OR sale price OR package price — editable
  consumableQty?: number; // RENTAL_PLUS_CONSUMPTION
  consumableRate?: number; // RENTAL_PLUS_CONSUMPTION — editable
  discount: number; // flat amount off this line
  packageComponents?: PackageComponent[]; // snapshot for PACKAGE display
}

export function lineSubtotal(line: RentalOrderLine, days: number): number {
  switch (line.itemType) {
    case "SALE":
    case "CONSUMABLE":
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
    case "PACKAGE":
      return line.quantity * line.rate - line.discount;
  }
}

// TODO: replace with real API call e.g. GET /api/rental-items
export const mockCatalogItems: CatalogItem[] = [
  { id: "R01", name: "Generator 5kVA", type: "RETURNABLE_UNIT", unit: "unit", rentalRatePerDay: 3500 },
  { id: "R02", name: "Video Camera - Sony", type: "RETURNABLE_UNIT", unit: "unit", rentalRatePerDay: 4500 },
  { id: "R03", name: "Cutting Disc 4in", type: "RETURNABLE_STOCK", unit: "pcs", rentalRatePerDay: 50, availableStock: 200 },
  { id: "R04", name: "Plastic Chair", type: "RETURNABLE_STOCK", unit: "pcs", rentalRatePerDay: 25, availableStock: 500 },
  { id: "R05", name: "Water Bottle (500ml)", type: "CONSUMABLE", unit: "pcs", consumableRate: 40, availableStock: 1000 },
  { id: "R06", name: "Milk Packet", type: "CONSUMABLE", unit: "pcs", consumableRate: 60, availableStock: 300 },
  {
    id: "R07",
    name: "Generator 10kVA + Fuel",
    type: "RENTAL_PLUS_CONSUMPTION",
    unit: "unit",
    rentalRatePerDay: 5500,
    consumableRate: 320, // per litre
  },
  {
    id: "R08",
    name: "Event Cable Set + Oil",
    type: "RENTAL_PLUS_CONSUMPTION",
    unit: "set",
    rentalRatePerDay: 1200,
    consumableRate: 850, // per litre of oil
  },
  {
    id: "R09",
    name: "Wedding Package - Standard",
    type: "PACKAGE",
    unit: "event",
    packagePrice: 85000,
    packageComponents: [
      { name: "Chairs", qty: 100 },
      { name: "Tables", qty: 10 },
      { name: "Decorations", qty: 5 },
      { name: "Water Bottles", qty: 50 },
    ],
  },
  { id: "R10", name: "PVC Pipe 4in", type: "SALE", unit: "pcs", salePrice: 850, availableStock: 65 },
  { id: "R11", name: "Cement Bag (50kg)", type: "SALE", unit: "bag", salePrice: 2100, availableStock: 120 },
];

export const mockExistingGuarantors: Omit<Guarantor, "id">[] = [
  {
    guarantorId: "G01",
    name: "Nimal Rathnayake",
    nic: "198812304567",
    phone: "0776543210",
    address: "No. 12, Temple Road, Nugegoda",
    imageDataUrl: null,
  },
  {
    guarantorId: "G02",
    name: "Priyanka Jayasinghe",
    nic: "199245678901",
    phone: "0714567890",
    address: "23/4, Lake Road, Kandy",
    imageDataUrl: null,
  },
];

export function findGuarantorByNic(nic: string): Omit<Guarantor, "id"> | null {
  const trimmed = nic.trim();
  if (!trimmed) return null;
  return mockExistingGuarantors.find((g) => g.nic === trimmed) ?? null;
}