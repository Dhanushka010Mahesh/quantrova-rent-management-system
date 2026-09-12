export type CustomerStatus = "ACTIVE" | "INACTIVE";

export type RentalStatus =
  | "ACTIVE"
  | "RETURNED"
  | "OVERDUE"
  | "CANCELLED";

export type PaymentMethod = "CASH" | "BANK" | "CHEQUE";

export interface CustomerProfileData {
  id: string;
  name: string;
  nic: string;
  phone: string;
  email: string;
  address: string;
  description?: string;
  status: CustomerStatus;
  creditLimit: number;
  creditBalance: number;
  createdAt: string;
}

export interface RentalItem {
  id: string;
  name: string;
  quantity: number;
  rate: number;
  days: number;
  subtotal: number;
}

export interface CustomerRental {
  id: string;
  customerId: string;
  billNumber: string;
  outDate: string;
  expectedReturnDate: string;
  actualReturnDate?: string;
  status: RentalStatus;
  items: RentalItem[];
  total: number;
  paid: number;
  balance: number;
}

export interface CustomerPayment {
  id: string;
  customerId: string;
  receiptNumber: string;
  date: string;
  billNumber: string;
  amount: number;
  method: PaymentMethod;
  reference?: string;
  status: "COMPLETED" | "PENDING" | "CANCELLED";
}

export interface CustomerGuarantor {
  id: string;
  customerId: string;
  name: string;
  nic: string;
  phone: string;
  address: string;
  description?: string;
}

export interface CustomerOrderPhoto {
  id: string;
  customerId: string;
  billNumber: string;
  imageUrl: string;
  caption?: string;
  type?: "BEFORE" | "AFTER" | "DOCUMENT" | "OTHER";
}

/* =========================================================
   CUSTOMERS
   ========================================================= */

export const customerProfiles: CustomerProfileData[] = [
  {
    id: "CUS-001",
    name: "Kasun Perera",
    nic: "199812345678",
    phone: "0771234567",
    email: "kasun@example.com",
    address: "Colombo 05",
    description: "Regular rental customer",
    status: "ACTIVE",
    creditLimit: 100000,
    creditBalance: 18500,
    createdAt: "2026-01-15",
  },
  {
    id: "CUS-002",
    name: "Nimal Fernando",
    nic: "198945678901",
    phone: "0712345678",
    email: "nimal@example.com",
    address: "Nugegoda",
    description: "Construction contractor",
    status: "ACTIVE",
    creditLimit: 75000,
    creditBalance: 0,
    createdAt: "2026-02-10",
  },
  {
    id: "CUS-003",
    name: "Chamari Silva",
    nic: "199567890123",
    phone: "0769876543",
    email: "chamari@example.com",
    address: "Maharagama",
    description: "Event equipment customer",
    status: "ACTIVE",
    creditLimit: 50000,
    creditBalance: 12500,
    createdAt: "2026-03-05",
  },
  {
    id: "CUS-004",
    name: "Ravindu Construction",
    nic: "200012345678",
    phone: "0784567890",
    email: "ravindu@example.com",
    address: "Kaduwela",
    description: "Construction company",
    status: "ACTIVE",
    creditLimit: 150000,
    creditBalance: 42000,
    createdAt: "2026-04-18",
  },
];

/* =========================================================
   RENTAL ORDERS
   ========================================================= */

export const customerRentals: CustomerRental[] = [
  {
    id: "RENT-001",
    customerId: "CUS-001",
    billNumber: "BILL-2026-0088",
    outDate: "2026-08-20",
    expectedReturnDate: "2026-08-25",
    actualReturnDate: "2026-08-25",
    status: "RETURNED",
    items: [
      {
        id: "ITEM-001",
        name: "Concrete Mixer",
        quantity: 1,
        rate: 3500,
        days: 5,
        subtotal: 17500,
      },
      {
        id: "ITEM-002",
        name: "Power Drill",
        quantity: 1,
        rate: 1500,
        days: 5,
        subtotal: 7500,
      },
    ],
    total: 25000,
    paid: 20000,
    balance: 5000,
  },

  {
    id: "RENT-002",
    customerId: "CUS-001",
    billNumber: "BILL-2026-0071",
    outDate: "2026-07-10",
    expectedReturnDate: "2026-07-15",
    actualReturnDate: "2026-07-16",
    status: "RETURNED",
    items: [
      {
        id: "ITEM-003",
        name: "Jack Hammer",
        quantity: 1,
        rate: 2500,
        days: 6,
        subtotal: 15000,
      },
    ],
    total: 15000,
    paid: 15000,
    balance: 0,
  },

  {
    id: "RENT-003",
    customerId: "CUS-001",
    billNumber: "BILL-2026-0095",
    outDate: "2026-08-27",
    expectedReturnDate: "2026-09-02",
    status: "ACTIVE",
    items: [
      {
        id: "ITEM-004",
        name: "Tower Light",
        quantity: 2,
        rate: 4000,
        days: 6,
        subtotal: 48000,
      },
    ],
    total: 48000,
    paid: 34500,
    balance: 13500,
  },

  {
    id: "RENT-004",
    customerId: "CUS-001",
    billNumber: "BILL-2026-0060",
    outDate: "2026-06-05",
    expectedReturnDate: "2026-06-10",
    actualReturnDate: "2026-06-10",
    status: "RETURNED",
    items: [
      {
        id: "ITEM-005",
        name: "Cutting Machine",
        quantity: 1,
        rate: 1800,
        days: 5,
        subtotal: 9000,
      },
    ],
    total: 9000,
    paid: 9000,
    balance: 0,
  },

  {
    id: "RENT-005",
    customerId: "CUS-001",
    billNumber: "BILL-2026-0049",
    outDate: "2026-05-15",
    expectedReturnDate: "2026-05-20",
    actualReturnDate: "2026-05-20",
    status: "RETURNED",
    items: [
      {
        id: "ITEM-006",
        name: "Generator 5KVA",
        quantity: 1,
        rate: 4500,
        days: 5,
        subtotal: 22500,
      },
    ],
    total: 22500,
    paid: 22500,
    balance: 0,
  },

  {
    id: "RENT-006",
    customerId: "CUS-001",
    billNumber: "BILL-2026-0034",
    outDate: "2026-04-02",
    expectedReturnDate: "2026-04-05",
    actualReturnDate: "2026-04-05",
    status: "RETURNED",
    items: [
      {
        id: "ITEM-007",
        name: "Angle Grinder",
        quantity: 2,
        rate: 1200,
        days: 3,
        subtotal: 7200,
      },
    ],
    total: 7200,
    paid: 7200,
    balance: 0,
  },

  {
    id: "RENT-007",
    customerId: "CUS-001",
    billNumber: "BILL-2026-0021",
    outDate: "2026-03-12",
    expectedReturnDate: "2026-03-15",
    actualReturnDate: "2026-03-15",
    status: "RETURNED",
    items: [
      {
        id: "ITEM-008",
        name: "Water Pump",
        quantity: 1,
        rate: 2000,
        days: 3,
        subtotal: 6000,
      },
    ],
    total: 6000,
    paid: 6000,
    balance: 0,
  },
];

/* =========================================================
   PAYMENTS
   ========================================================= */

export const customerPayments: CustomerPayment[] = [
  {
    id: "PAY-001",
    customerId: "CUS-001",
    receiptNumber: "REC-2026-0045",
    date: "2026-08-20",
    billNumber: "BILL-2026-0088",
    amount: 10000,
    method: "CASH",
    status: "COMPLETED",
  },
  {
    id: "PAY-002",
    customerId: "CUS-001",
    receiptNumber: "REC-2026-0048",
    date: "2026-08-22",
    billNumber: "BILL-2026-0088",
    amount: 10000,
    method: "BANK",
    reference: "BNK-784512",
    status: "COMPLETED",
  },
  {
    id: "PAY-003",
    customerId: "CUS-001",
    receiptNumber: "REC-2026-0055",
    date: "2026-08-27",
    billNumber: "BILL-2026-0095",
    amount: 34500,
    method: "CASH",
    status: "COMPLETED",
  },
  {
    id: "PAY-004",
    customerId: "CUS-001",
    receiptNumber: "REC-2026-0031",
    date: "2026-07-10",
    billNumber: "BILL-2026-0071",
    amount: 15000,
    method: "BANK",
    reference: "BNK-664521",
    status: "COMPLETED",
  },
  {
    id: "PAY-005",
    customerId: "CUS-001",
    receiptNumber: "REC-2026-0022",
    date: "2026-06-05",
    billNumber: "BILL-2026-0060",
    amount: 9000,
    method: "CASH",
    status: "COMPLETED",
  },
  {
    id: "PAY-006",
    customerId: "CUS-001",
    receiptNumber: "REC-2026-0014",
    date: "2026-05-15",
    billNumber: "BILL-2026-0049",
    amount: 22500,
    method: "CHEQUE",
    reference: "CHQ-001245",
    status: "COMPLETED",
  },
  {
    id: "PAY-007",
    customerId: "CUS-001",
    receiptNumber: "REC-2026-0008",
    date: "2026-04-02",
    billNumber: "BILL-2026-0034",
    amount: 7200,
    method: "CASH",
    status: "COMPLETED",
  },
  {
    id: "PAY-008",
    customerId: "CUS-001",
    receiptNumber: "REC-2026-0004",
    date: "2026-03-12",
    billNumber: "BILL-2026-0021",
    amount: 6000,
    method: "BANK",
    reference: "BNK-331245",
    status: "COMPLETED",
  },
];

/* =========================================================
   GUARANTORS
   ========================================================= */

export const customerGuarantors: CustomerGuarantor[] = [
  {
    id: "G-001",
    customerId: "CUS-001",
    name: "Ruwan Perera",
    nic: "198765432109",
    phone: "0777654321",
    address: "Rajagiriya",
    description: "Customer's brother",
  },
];

/* =========================================================
   RENTAL PHOTOS
   ========================================================= */

export const customerOrderPhotos: CustomerOrderPhoto[] = [
  {
    id: "PHOTO-001",
    customerId: "CUS-001",
    billNumber: "BILL-2026-0095",
    imageUrl:
      "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80",
    caption: "Tower light before handover",
    type: "BEFORE",
  },
  {
    id: "PHOTO-002",
    customerId: "CUS-001",
    billNumber: "BILL-2026-0095",
    imageUrl:
      "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80",
    caption: "Equipment condition",
    type: "DOCUMENT",
  },
  {
    id: "PHOTO-003",
    customerId: "CUS-001",
    billNumber: "BILL-2026-0088",
    imageUrl:
      "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80",
    caption: "Returned equipment",
    type: "AFTER",
  },
];

/* =========================================================
   CHART DATA
   ========================================================= */

export const customerRentalTrend = [
  {
    month: "Mar",
    rentalValue: 6000,
    paid: 6000,
  },
  {
    month: "Apr",
    rentalValue: 7200,
    paid: 7200,
  },
  {
    month: "May",
    rentalValue: 22500,
    paid: 22500,
  },
  {
    month: "Jun",
    rentalValue: 9000,
    paid: 9000,
  },
  {
    month: "Jul",
    rentalValue: 15000,
    paid: 15000,
  },
  {
    month: "Aug",
    rentalValue: 73000,
    paid: 54500,
  },
];

export const customerRentalStatus = [
  {
    status: "Returned",
    count: 5,
  },
  {
    status: "Active",
    count: 1,
  },
  {
    status: "Overdue",
    count: 0,
  },
  {
    status: "Cancelled",
    count: 0,
  },
];

// src/data/reportData.ts

export type ItemStatus = "AVAILABLE" | "RENTED" | "MAINTENANCE" | "RETIRED";

export interface ReportItem {
  id: string;
  code: string;
  name: string;
  category: string;
  brand: string;
  model: string;
  serialNumber: string;
  status: ItemStatus;
  purchaseDate: string;
  purchasePrice: number;
  currentValue: number;
  rentalRateDaily: number;
  rentalRateWeekly: number;
  rentalRateMonthly: number;
  totalRentals: number;
  totalRentalDays: number;
  utilizationRate: number;
  totalRentalIncome: number;
  totalMaintenanceExpense: number;
  totalOtherExpense: number;
  netIncome: number;
  lastRentedDate: string;
  lastMaintenanceDate: string;
  nextMaintenanceDate: string;
  description: string;
}

export interface PriceHistory {
  id: string;
  itemId: string;
  date: string;
  type: "RENTAL_RATE" | "PURCHASE_PRICE" | "SELLING_PRICE";
  label: string;
  oldPrice: number;
  newPrice: number;
  reason: string;
}

export interface RentalHistory {
  id: string;
  itemId: string;
  rentalNumber: string;
  customer: string;
  startDate: string;
  returnDate: string;
  days: number;
  rate: number;
  income: number;
  status: "COMPLETED" | "ACTIVE" | "OVERDUE";
}

export interface MaintenanceHistory {
  id: string;
  itemId: string;
  date: string;
  type: "SERVICE" | "REPAIR" | "INSPECTION";
  description: string;
  cost: number;
  technician: string;
  status: "COMPLETED" | "PENDING";
}

export interface OtherExpense {
  id: string;
  itemId: string;
  date: string;
  category: string;
  description: string;
  amount: number;
}

export interface MonthlyPerformance {
  month: string;
  rentalIncome: number;
  maintenanceExpense: number;
  otherExpense: number;
  rentalDays: number;
  rentalCount: number;
}

export const reportItems: ReportItem[] = [
  {
    id: "ITEM-001",
    code: "EXC-001",
    name: "CAT 320 Excavator",
    category: "Heavy Machinery",
    brand: "Caterpillar",
    model: "320 GC",
    serialNumber: "CAT320GC-2024-001",
    status: "RENTED",
    purchaseDate: "2024-02-15",
    purchasePrice: 28500000,
    currentValue: 24800000,
    rentalRateDaily: 85000,
    rentalRateWeekly: 500000,
    rentalRateMonthly: 1750000,
    totalRentals: 48,
    totalRentalDays: 296,
    utilizationRate: 81,
    totalRentalIncome: 25160000,
    totalMaintenanceExpense: 3250000,
    totalOtherExpense: 840000,
    netIncome: 21470000,
    lastRentedDate: "2026-08-20",
    lastMaintenanceDate: "2026-07-18",
    nextMaintenanceDate: "2026-09-15",
    description:
      "20 ton crawler excavator used for construction, excavation and earth-moving projects.",
  },

  {
    id: "ITEM-002",
    code: "GEN-002",
    name: "Diesel Generator 100KVA",
    category: "Power Equipment",
    brand: "Cummins",
    model: "C100D5",
    serialNumber: "CUM-100KVA-2025-002",
    status: "AVAILABLE",
    purchaseDate: "2025-01-10",
    purchasePrice: 6800000,
    currentValue: 5900000,
    rentalRateDaily: 28000,
    rentalRateWeekly: 165000,
    rentalRateMonthly: 580000,
    totalRentals: 34,
    totalRentalDays: 185,
    utilizationRate: 63,
    totalRentalIncome: 5180000,
    totalMaintenanceExpense: 620000,
    totalOtherExpense: 185000,
    netIncome: 4375000,
    lastRentedDate: "2026-08-11",
    lastMaintenanceDate: "2026-08-05",
    nextMaintenanceDate: "2026-09-05",
    description:
      "100KVA diesel generator suitable for construction sites and temporary power requirements.",
  },

  {
    id: "ITEM-003",
    code: "SCAF-003",
    name: "Adjustable Scaffolding Set",
    category: "Construction Equipment",
    brand: "SafeBuild",
    model: "AS-500",
    serialNumber: "SB-AS500-003",
    status: "MAINTENANCE",
    purchaseDate: "2023-08-20",
    purchasePrice: 1450000,
    currentValue: 980000,
    rentalRateDaily: 8500,
    rentalRateWeekly: 48000,
    rentalRateMonthly: 165000,
    totalRentals: 67,
    totalRentalDays: 420,
    utilizationRate: 74,
    totalRentalIncome: 3570000,
    totalMaintenanceExpense: 485000,
    totalOtherExpense: 95000,
    netIncome: 2990000,
    lastRentedDate: "2026-07-28",
    lastMaintenanceDate: "2026-08-19",
    nextMaintenanceDate: "2026-08-30",
    description:
      "Adjustable scaffolding system for residential and commercial construction projects.",
  },
];

export const priceHistory: PriceHistory[] = [
  {
    id: "PH-001",
    itemId: "ITEM-001",
    date: "2024-02-15",
    type: "PURCHASE_PRICE",
    label: "Purchase Price",
    oldPrice: 0,
    newPrice: 28500000,
    reason: "Initial purchase",
  },
  {
    id: "PH-002",
    itemId: "ITEM-001",
    date: "2024-02-15",
    type: "RENTAL_RATE",
    label: "Daily Rental Rate",
    oldPrice: 0,
    newPrice: 75000,
    reason: "Initial rental rate",
  },
  {
    id: "PH-003",
    itemId: "ITEM-001",
    date: "2025-01-01",
    type: "RENTAL_RATE",
    label: "Daily Rental Rate",
    oldPrice: 75000,
    newPrice: 80000,
    reason: "Annual rate revision",
  },
  {
    id: "PH-004",
    itemId: "ITEM-001",
    date: "2026-01-01",
    type: "RENTAL_RATE",
    label: "Daily Rental Rate",
    oldPrice: 80000,
    newPrice: 85000,
    reason: "Market price adjustment",
  },

  {
    id: "PH-005",
    itemId: "ITEM-002",
    date: "2025-01-10",
    type: "PURCHASE_PRICE",
    label: "Purchase Price",
    oldPrice: 0,
    newPrice: 6800000,
    reason: "Initial purchase",
  },
  {
    id: "PH-006",
    itemId: "ITEM-002",
    date: "2025-01-10",
    type: "RENTAL_RATE",
    label: "Daily Rental Rate",
    oldPrice: 0,
    newPrice: 25000,
    reason: "Initial rental rate",
  },
  {
    id: "PH-007",
    itemId: "ITEM-002",
    date: "2026-01-01",
    type: "RENTAL_RATE",
    label: "Daily Rental Rate",
    oldPrice: 25000,
    newPrice: 28000,
    reason: "Annual rate revision",
  },

  {
    id: "PH-008",
    itemId: "ITEM-003",
    date: "2023-08-20",
    type: "PURCHASE_PRICE",
    label: "Purchase Price",
    oldPrice: 0,
    newPrice: 1450000,
    reason: "Initial purchase",
  },
  {
    id: "PH-009",
    itemId: "ITEM-003",
    date: "2024-06-01",
    type: "RENTAL_RATE",
    label: "Daily Rental Rate",
    oldPrice: 7500,
    newPrice: 8000,
    reason: "Rate revision",
  },
  {
    id: "PH-010",
    itemId: "ITEM-003",
    date: "2026-01-01",
    type: "RENTAL_RATE",
    label: "Daily Rental Rate",
    oldPrice: 8000,
    newPrice: 8500,
    reason: "Annual rate revision",
  },
];

export const rentalHistory: RentalHistory[] = [
  {
    id: "RH-001",
    itemId: "ITEM-001",
    rentalNumber: "RENT-2026-0088",
    customer: "ABC Construction (Pvt) Ltd",
    startDate: "2026-08-20",
    returnDate: "2026-08-27",
    days: 7,
    rate: 85000,
    income: 595000,
    status: "COMPLETED",
  },
  {
    id: "RH-002",
    itemId: "ITEM-001",
    rentalNumber: "RENT-2026-0074",
    customer: "BuildPro Engineering",
    startDate: "2026-07-28",
    returnDate: "2026-08-04",
    days: 7,
    rate: 85000,
    income: 595000,
    status: "COMPLETED",
  },
  {
    id: "RH-003",
    itemId: "ITEM-001",
    rentalNumber: "RENT-2026-0061",
    customer: "Lanka Road Works",
    startDate: "2026-06-15",
    returnDate: "2026-06-25",
    days: 10,
    rate: 85000,
    income: 850000,
    status: "COMPLETED",
  },
  {
    id: "RH-004",
    itemId: "ITEM-001",
    rentalNumber: "RENT-2026-0095",
    customer: "Metro Builders",
    startDate: "2026-08-20",
    returnDate: "2026-09-02",
    days: 13,
    rate: 85000,
    income: 1105000,
    status: "ACTIVE",
  },

  {
    id: "RH-005",
    itemId: "ITEM-002",
    rentalNumber: "RENT-2026-0081",
    customer: "PowerTech Solutions",
    startDate: "2026-08-11",
    returnDate: "2026-08-15",
    days: 4,
    rate: 28000,
    income: 112000,
    status: "COMPLETED",
  },
  {
    id: "RH-006",
    itemId: "ITEM-002",
    rentalNumber: "RENT-2026-0068",
    customer: "Event Masters",
    startDate: "2026-07-05",
    returnDate: "2026-07-12",
    days: 7,
    rate: 28000,
    income: 196000,
    status: "COMPLETED",
  },

  {
    id: "RH-007",
    itemId: "ITEM-003",
    rentalNumber: "RENT-2026-0072",
    customer: "Prime Construction",
    startDate: "2026-07-20",
    returnDate: "2026-07-28",
    days: 8,
    rate: 8500,
    income: 68000,
    status: "COMPLETED",
  },
  {
    id: "RH-008",
    itemId: "ITEM-003",
    rentalNumber: "RENT-2026-0059",
    customer: "Urban Developers",
    startDate: "2026-06-10",
    returnDate: "2026-06-22",
    days: 12,
    rate: 8500,
    income: 102000,
    status: "COMPLETED",
  },
];

export const maintenanceHistory: MaintenanceHistory[] = [
  {
    id: "MH-001",
    itemId: "ITEM-001",
    date: "2026-07-18",
    type: "SERVICE",
    description: "Engine oil, hydraulic oil and filter replacement",
    cost: 185000,
    technician: "Heavy Machinery Service Centre",
    status: "COMPLETED",
  },
  {
    id: "MH-002",
    itemId: "ITEM-001",
    date: "2026-05-12",
    type: "INSPECTION",
    description: "Full machine inspection",
    cost: 45000,
    technician: "Internal Maintenance Team",
    status: "COMPLETED",
  },
  {
    id: "MH-003",
    itemId: "ITEM-002",
    date: "2026-08-05",
    type: "SERVICE",
    description: "Oil change and battery inspection",
    cost: 65000,
    technician: "PowerGen Services",
    status: "COMPLETED",
  },
  {
    id: "MH-004",
    itemId: "ITEM-003",
    date: "2026-08-19",
    type: "REPAIR",
    description: "Replacement of damaged support joints",
    cost: 125000,
    technician: "SafeBuild Maintenance",
    status: "COMPLETED",
  },
  {
    id: "MH-005",
    itemId: "ITEM-003",
    date: "2026-04-15",
    type: "INSPECTION",
    description: "Safety and structural inspection",
    cost: 25000,
    technician: "Internal Maintenance Team",
    status: "COMPLETED",
  },
];

export const otherExpenses: OtherExpense[] = [
  {
    id: "OE-001",
    itemId: "ITEM-001",
    date: "2026-06-12",
    category: "Transport",
    description: "Transportation to customer site",
    amount: 180000,
  },
  {
    id: "OE-002",
    itemId: "ITEM-001",
    date: "2026-07-02",
    category: "Fuel",
    description: "Fuel expense",
    amount: 225000,
  },
  {
    id: "OE-003",
    itemId: "ITEM-001",
    date: "2026-08-03",
    category: "Transport",
    description: "Return transportation",
    amount: 160000,
  },
  {
    id: "OE-004",
    itemId: "ITEM-001",
    date: "2026-08-10",
    category: "Insurance",
    description: "Equipment insurance allocation",
    amount: 275000,
  },

  {
    id: "OE-005",
    itemId: "ITEM-002",
    date: "2026-06-15",
    category: "Transport",
    description: "Generator transportation",
    amount: 75000,
  },
  {
    id: "OE-006",
    itemId: "ITEM-002",
    date: "2026-07-10",
    category: "Fuel",
    description: "Fuel expense",
    amount: 65000,
  },

  {
    id: "OE-007",
    itemId: "ITEM-003",
    date: "2026-05-08",
    category: "Transport",
    description: "Scaffolding delivery",
    amount: 45000,
  },
];

export const monthlyPerformance: Record<string, MonthlyPerformance[]> = {
  "ITEM-001": [
    {
      month: "Mar",
      rentalIncome: 2100000,
      maintenanceExpense: 420000,
      otherExpense: 160000,
      rentalDays: 25,
      rentalCount: 4,
    },
    {
      month: "Apr",
      rentalIncome: 2380000,
      maintenanceExpense: 285000,
      otherExpense: 190000,
      rentalDays: 28,
      rentalCount: 5,
    },
    {
      month: "May",
      rentalIncome: 1955000,
      maintenanceExpense: 650000,
      otherExpense: 130000,
      rentalDays: 23,
      rentalCount: 4,
    },
    {
      month: "Jun",
      rentalIncome: 2720000,
      maintenanceExpense: 510000,
      otherExpense: 225000,
      rentalDays: 30,
      rentalCount: 5,
    },
    {
      month: "Jul",
      rentalIncome: 3145000,
      maintenanceExpense: 725000,
      otherExpense: 180000,
      rentalDays: 31,
      rentalCount: 6,
    },
    {
      month: "Aug",
      rentalIncome: 4250000,
      maintenanceExpense: 660000,
      otherExpense: 185000,
      rentalDays: 29,
      rentalCount: 6,
    },
  ],

  "ITEM-002": [
    {
      month: "Mar",
      rentalIncome: 620000,
      maintenanceExpense: 85000,
      otherExpense: 30000,
      rentalDays: 22,
      rentalCount: 4,
    },
    {
      month: "Apr",
      rentalIncome: 720000,
      maintenanceExpense: 45000,
      otherExpense: 35000,
      rentalDays: 25,
      rentalCount: 5,
    },
    {
      month: "May",
      rentalIncome: 510000,
      maintenanceExpense: 110000,
      otherExpense: 25000,
      rentalDays: 18,
      rentalCount: 3,
    },
    {
      month: "Jun",
      rentalIncome: 880000,
      maintenanceExpense: 125000,
      otherExpense: 45000,
      rentalDays: 30,
      rentalCount: 5,
    },
    {
      month: "Jul",
      rentalIncome: 945000,
      maintenanceExpense: 135000,
      otherExpense: 50000,
      rentalDays: 31,
      rentalCount: 6,
    },
    {
      month: "Aug",
      rentalIncome: 1505000,
      maintenanceExpense: 120000,
      otherExpense: 65000,
      rentalDays: 29,
      rentalCount: 7,
    },
  ],

  "ITEM-003": [
    {
      month: "Mar",
      rentalIncome: 420000,
      maintenanceExpense: 45000,
      otherExpense: 15000,
      rentalDays: 28,
      rentalCount: 6,
    },
    {
      month: "Apr",
      rentalIncome: 385000,
      maintenanceExpense: 65000,
      otherExpense: 12000,
      rentalDays: 25,
      rentalCount: 5,
    },
    {
      month: "May",
      rentalIncome: 540000,
      maintenanceExpense: 85000,
      otherExpense: 18000,
      rentalDays: 30,
      rentalCount: 7,
    },
    {
      month: "Jun",
      rentalIncome: 510000,
      maintenanceExpense: 95000,
      otherExpense: 22000,
      rentalDays: 29,
      rentalCount: 6,
    },
    {
      month: "Jul",
      rentalIncome: 625000,
      maintenanceExpense: 120000,
      otherExpense: 25000,
      rentalDays: 31,
      rentalCount: 7,
    },
    {
      month: "Aug",
      rentalIncome: 420000,
      maintenanceExpense: 75000,
      otherExpense: 30000,
      rentalDays: 20,
      rentalCount: 5,
    },
  ],
};

// src/data/reportData.ts

export interface EmployeeReportData {
  id: string;
  employeeCode: string;
  name: string;
  nic: string;
  phone: string;
  email: string;
  address: string;
  joinedDate: string;
  designation: string;
  department: string;
  employmentType: "FULL_TIME" | "PART_TIME" | "CONTRACT";
  status: "ACTIVE" | "INACTIVE";
  basicSalary: number;
  allowances: number;
  deductions: number;
  netSalary: number;
  payableBalance: number;
  advanceBalance: number;
  totalPaid: number;
  totalEarned: number;
  totalAdvance: number;
  attendanceRate: number;
  presentDays: number;
  absentDays: number;
  leaveDays: number;
}

export interface EmployeeSalaryRecord {
  id: string;
  employeeId: string;
  month: string;
  basicSalary: number;
  allowances: number;
  deductions: number;
  netSalary: number;
  paidAmount: number;
  balance: number;
  status: "PAID" | "PARTIAL" | "PENDING";
  paidDate?: string;
}

export interface EmployeePaymentRecord {
  id: string;
  employeeId: string;
  date: string;
  type: "SALARY" | "ADVANCE" | "OTHER";
  reference: string;
  amount: number;
  paymentMethod: "CASH" | "BANK" | "CHEQUE";
  note?: string;
}

export interface EmployeeAdvanceRecord {
  id: string;
  employeeId: string;
  date: string;
  amount: number;
  paidAmount: number;
  balance: number;
  status: "SETTLED" | "PARTIAL" | "OUTSTANDING";
  note?: string;
}

export interface EmployeeAttendanceRecord {
  id: string;
  employeeId: string;
  month: string;
  workingDays: number;
  presentDays: number;
  absentDays: number;
  leaveDays: number;
  lateDays: number;
  attendanceRate: number;
}

export interface EmployeeDesignationRecord {
  id: string;
  employeeId: string;
  designation: string;
  department: string;
  effectiveDate: string;
  basicSalary: number;
  note?: string;
}

export const employeeReportData: EmployeeReportData[] = [
  {
    id: "EMP-001",
    employeeCode: "EMP-2026-001",
    name: "Kasun Perera",
    nic: "199512345678",
    phone: "077 123 4567",
    email: "kasun@example.com",
    address: "Colombo, Sri Lanka",
    joinedDate: "2024-03-15",
    designation: "Senior Store Keeper",
    department: "Warehouse",
    employmentType: "FULL_TIME",
    status: "ACTIVE",
    basicSalary: 85000,
    allowances: 12000,
    deductions: 4500,
    netSalary: 92500,
    payableBalance: 15000,
    advanceBalance: 10000,
    totalPaid: 1075000,
    totalEarned: 1110000,
    totalAdvance: 60000,
    attendanceRate: 96.5,
    presentDays: 23,
    absentDays: 1,
    leaveDays: 1,
  },
  {
    id: "EMP-002",
    employeeCode: "EMP-2026-002",
    name: "Nimal Fernando",
    nic: "199623456789",
    phone: "071 234 5678",
    email: "nimal@example.com",
    address: "Kaduwela, Sri Lanka",
    joinedDate: "2025-01-10",
    designation: "Rental Assistant",
    department: "Rental",
    employmentType: "FULL_TIME",
    status: "ACTIVE",
    basicSalary: 65000,
    allowances: 8000,
    deductions: 3000,
    netSalary: 70000,
    payableBalance: 70000,
    advanceBalance: 25000,
    totalPaid: 770000,
    totalEarned: 840000,
    totalAdvance: 45000,
    attendanceRate: 91.2,
    presentDays: 21,
    absentDays: 2,
    leaveDays: 2,
  },
  {
    id: "EMP-003",
    employeeCode: "EMP-2026-003",
    name: "Chamod Silva",
    nic: "199834567890",
    phone: "076 345 6789",
    email: "chamod@example.com",
    address: "Malabe, Sri Lanka",
    joinedDate: "2025-07-01",
    designation: "Driver",
    department: "Transport",
    employmentType: "FULL_TIME",
    status: "ACTIVE",
    basicSalary: 60000,
    allowances: 10000,
    deductions: 2500,
    netSalary: 67500,
    payableBalance: 0,
    advanceBalance: 5000,
    totalPaid: 675000,
    totalEarned: 675000,
    totalAdvance: 30000,
    attendanceRate: 98.1,
    presentDays: 24,
    absentDays: 0,
    leaveDays: 1,
  },
];

export const employeeSalaryRecords: EmployeeSalaryRecord[] = [
  {
    id: "SAL-001",
    employeeId: "EMP-001",
    month: "2026-08",
    basicSalary: 85000,
    allowances: 12000,
    deductions: 4500,
    netSalary: 92500,
    paidAmount: 77500,
    balance: 15000,
    status: "PARTIAL",
    paidDate: "2026-08-28",
  },
  {
    id: "SAL-002",
    employeeId: "EMP-001",
    month: "2026-07",
    basicSalary: 85000,
    allowances: 12000,
    deductions: 4500,
    netSalary: 92500,
    paidAmount: 92500,
    balance: 0,
    status: "PAID",
    paidDate: "2026-07-31",
  },
  {
    id: "SAL-003",
    employeeId: "EMP-001",
    month: "2026-06",
    basicSalary: 85000,
    allowances: 10000,
    deductions: 4000,
    netSalary: 91000,
    paidAmount: 91000,
    balance: 0,
    status: "PAID",
    paidDate: "2026-06-30",
  },
  {
    id: "SAL-004",
    employeeId: "EMP-001",
    month: "2026-05",
    basicSalary: 80000,
    allowances: 10000,
    deductions: 4000,
    netSalary: 86000,
    paidAmount: 86000,
    balance: 0,
    status: "PAID",
    paidDate: "2026-05-30",
  },
  {
    id: "SAL-005",
    employeeId: "EMP-002",
    month: "2026-08",
    basicSalary: 65000,
    allowances: 8000,
    deductions: 3000,
    netSalary: 70000,
    paidAmount: 0,
    balance: 70000,
    status: "PENDING",
  },
  {
    id: "SAL-006",
    employeeId: "EMP-002",
    month: "2026-07",
    basicSalary: 65000,
    allowances: 8000,
    deductions: 3000,
    netSalary: 70000,
    paidAmount: 70000,
    balance: 0,
    status: "PAID",
    paidDate: "2026-07-31",
  },
  {
    id: "SAL-007",
    employeeId: "EMP-003",
    month: "2026-08",
    basicSalary: 60000,
    allowances: 10000,
    deductions: 2500,
    netSalary: 67500,
    paidAmount: 67500,
    balance: 0,
    status: "PAID",
    paidDate: "2026-08-29",
  },
];

export const employeePaymentRecords: EmployeePaymentRecord[] = [
  {
    id: "PAY-001",
    employeeId: "EMP-001",
    date: "2026-08-28",
    type: "SALARY",
    reference: "SAL-PAY-0088",
    amount: 77500,
    paymentMethod: "BANK",
    note: "August salary partial payment",
  },
  {
    id: "PAY-002",
    employeeId: "EMP-001",
    date: "2026-08-15",
    type: "ADVANCE",
    reference: "ADV-0021",
    amount: 10000,
    paymentMethod: "CASH",
    note: "Salary advance",
  },
  {
    id: "PAY-003",
    employeeId: "EMP-001",
    date: "2026-07-31",
    type: "SALARY",
    reference: "SAL-PAY-0077",
    amount: 92500,
    paymentMethod: "BANK",
  },
  {
    id: "PAY-004",
    employeeId: "EMP-002",
    date: "2026-07-31",
    type: "SALARY",
    reference: "SAL-PAY-0078",
    amount: 70000,
    paymentMethod: "BANK",
  },
  {
    id: "PAY-005",
    employeeId: "EMP-003",
    date: "2026-08-29",
    type: "SALARY",
    reference: "SAL-PAY-0089",
    amount: 67500,
    paymentMethod: "CASH",
  },
];

export const employeeAdvanceRecords: EmployeeAdvanceRecord[] = [
  {
    id: "ADV-001",
    employeeId: "EMP-001",
    date: "2026-08-15",
    amount: 10000,
    paidAmount: 0,
    balance: 10000,
    status: "OUTSTANDING",
    note: "Salary advance",
  },
  {
    id: "ADV-002",
    employeeId: "EMP-001",
    date: "2026-05-10",
    amount: 50000,
    paidAmount: 50000,
    balance: 0,
    status: "SETTLED",
    note: "Emergency advance",
  },
  {
    id: "ADV-003",
    employeeId: "EMP-002",
    date: "2026-06-15",
    amount: 45000,
    paidAmount: 20000,
    balance: 25000,
    status: "PARTIAL",
    note: "Personal advance",
  },
  {
    id: "ADV-004",
    employeeId: "EMP-003",
    date: "2026-08-01",
    amount: 30000,
    paidAmount: 25000,
    balance: 5000,
    status: "PARTIAL",
    note: "Salary advance",
  },
];

export const employeeAttendanceRecords: EmployeeAttendanceRecord[] = [
  {
    id: "ATT-001",
    employeeId: "EMP-001",
    month: "2026-08",
    workingDays: 25,
    presentDays: 23,
    absentDays: 1,
    leaveDays: 1,
    lateDays: 2,
    attendanceRate: 96.5,
  },
  {
    id: "ATT-002",
    employeeId: "EMP-001",
    month: "2026-07",
    workingDays: 26,
    presentDays: 25,
    absentDays: 0,
    leaveDays: 1,
    lateDays: 1,
    attendanceRate: 98.1,
  },
  {
    id: "ATT-003",
    employeeId: "EMP-001",
    month: "2026-06",
    workingDays: 25,
    presentDays: 24,
    absentDays: 1,
    leaveDays: 0,
    lateDays: 3,
    attendanceRate: 96,
  },
  {
    id: "ATT-004",
    employeeId: "EMP-001",
    month: "2026-05",
    workingDays: 24,
    presentDays: 22,
    absentDays: 1,
    leaveDays: 1,
    lateDays: 2,
    attendanceRate: 95,
  },
  {
    id: "ATT-005",
    employeeId: "EMP-002",
    month: "2026-08",
    workingDays: 25,
    presentDays: 21,
    absentDays: 2,
    leaveDays: 2,
    lateDays: 4,
    attendanceRate: 91.2,
  },
  {
    id: "ATT-006",
    employeeId: "EMP-003",
    month: "2026-08",
    workingDays: 25,
    presentDays: 24,
    absentDays: 0,
    leaveDays: 1,
    lateDays: 1,
    attendanceRate: 98.1,
  },
];

export const employeeDesignationRecords: EmployeeDesignationRecord[] = [
  {
    id: "DES-001",
    employeeId: "EMP-001",
    designation: "Senior Store Keeper",
    department: "Warehouse",
    effectiveDate: "2026-01-01",
    basicSalary: 85000,
    note: "Promoted from Store Keeper",
  },
  {
    id: "DES-002",
    employeeId: "EMP-001",
    designation: "Store Keeper",
    department: "Warehouse",
    effectiveDate: "2024-03-15",
    basicSalary: 70000,
    note: "Joined company",
  },
  {
    id: "DES-003",
    employeeId: "EMP-002",
    designation: "Rental Assistant",
    department: "Rental",
    effectiveDate: "2025-01-10",
    basicSalary: 65000,
    note: "Joined company",
  },
  {
    id: "DES-004",
    employeeId: "EMP-003",
    designation: "Driver",
    department: "Transport",
    effectiveDate: "2025-07-01",
    basicSalary: 60000,
    note: "Joined company",
  },
];

// =====================================================
// SUPPLIER REPORT DATA
// =====================================================

export interface SupplierReportData {
  id: string;
  supplierCode: string;
  name: string;
  companyName: string;
  phone: string;
  email: string;
  address: string;
  registrationNo: string;
  status: "ACTIVE" | "INACTIVE";
  creditLimit: number;

  totalPurchases: number;
  totalPaid: number;
  totalCredit: number;
  totalDebit: number;
  outstandingBalance: number;
}

export interface SupplierPurchaseRecord {
  id: string;
  supplierId: string;
  poNumber: string;
  invoiceNumber: string;
  date: string;
  itemCount: number;
  grossAmount: number;
  discount: number;
  netAmount: number;
  paidAmount: number;
  balance: number;
  status: "PAID" | "PARTIAL" | "CREDIT" | "CANCELLED";
}

export interface SupplierTransactionRecord {
  id: string;
  supplierId: string;
  date: string;
  reference: string;
  type: "CREDIT" | "DEBIT";
  description: string;
  amount: number;
}

export interface SupplierPaymentRecord {
  id: string;
  supplierId: string;
  date: string;
  reference: string;
  amount: number;
  method: "CASH" | "BANK" | "CHEQUE";
  note?: string;
}

export const supplierReportData: SupplierReportData[] = [
  {
    id: "SUP-001",
    supplierCode: "SUP-2026-001",
    name: "Nimal Perera",
    companyName: "Perera Hardware Suppliers",
    phone: "077 123 4567",
    email: "pererahardware@example.com",
    address: "Colombo, Sri Lanka",
    registrationNo: "PV-45821",
    status: "ACTIVE",
    creditLimit: 500000,

    totalPurchases: 2850000,
    totalPaid: 2250000,
    totalCredit: 650000,
    totalDebit: 50000,
    outstandingBalance: 600000,
  },

  {
    id: "SUP-002",
    supplierCode: "SUP-2026-002",
    name: "Kasun Fernando",
    companyName: "Fernando Equipment Traders",
    phone: "071 234 5678",
    email: "fernandoequipment@example.com",
    address: "Kaduwela, Sri Lanka",
    registrationNo: "PV-78234",
    status: "ACTIVE",
    creditLimit: 750000,

    totalPurchases: 4200000,
    totalPaid: 3500000,
    totalCredit: 800000,
    totalDebit: 100000,
    outstandingBalance: 700000,
  },

  {
    id: "SUP-003",
    supplierCode: "SUP-2026-003",
    name: "Chamod Silva",
    companyName: "Silva Construction Materials",
    phone: "076 345 6789",
    email: "silvamaterials@example.com",
    address: "Malabe, Sri Lanka",
    registrationNo: "PV-91342",
    status: "ACTIVE",
    creditLimit: 300000,

    totalPurchases: 1750000,
    totalPaid: 1600000,
    totalCredit: 180000,
    totalDebit: 30000,
    outstandingBalance: 150000,
  },
];

export const supplierPurchaseRecords: SupplierPurchaseRecord[] = [
  {
    id: "PO-001",
    supplierId: "SUP-001",
    poNumber: "PO-2026-0018",
    invoiceNumber: "INV-4588",
    date: "2026-08-25",
    itemCount: 12,
    grossAmount: 450000,
    discount: 15000,
    netAmount: 435000,
    paidAmount: 300000,
    balance: 135000,
    status: "PARTIAL",
  },
  {
    id: "PO-002",
    supplierId: "SUP-001",
    poNumber: "PO-2026-0012",
    invoiceNumber: "INV-4512",
    date: "2026-07-18",
    itemCount: 8,
    grossAmount: 380000,
    discount: 10000,
    netAmount: 370000,
    paidAmount: 370000,
    balance: 0,
    status: "PAID",
  },
  {
    id: "PO-003",
    supplierId: "SUP-001",
    poNumber: "PO-2026-0008",
    invoiceNumber: "INV-4467",
    date: "2026-06-10",
    itemCount: 15,
    grossAmount: 520000,
    discount: 20000,
    netAmount: 500000,
    paidAmount: 350000,
    balance: 150000,
    status: "CREDIT",
  },
  {
    id: "PO-004",
    supplierId: "SUP-002",
    poNumber: "PO-2026-0020",
    invoiceNumber: "INV-7821",
    date: "2026-08-27",
    itemCount: 20,
    grossAmount: 650000,
    discount: 25000,
    netAmount: 625000,
    paidAmount: 500000,
    balance: 125000,
    status: "PARTIAL",
  },
  {
    id: "PO-005",
    supplierId: "SUP-002",
    poNumber: "PO-2026-0014",
    invoiceNumber: "INV-7702",
    date: "2026-07-20",
    itemCount: 14,
    grossAmount: 480000,
    discount: 15000,
    netAmount: 465000,
    paidAmount: 465000,
    balance: 0,
    status: "PAID",
  },
  {
    id: "PO-006",
    supplierId: "SUP-003",
    poNumber: "PO-2026-0016",
    invoiceNumber: "INV-9121",
    date: "2026-08-05",
    itemCount: 10,
    grossAmount: 320000,
    discount: 12000,
    netAmount: 308000,
    paidAmount: 250000,
    balance: 58000,
    status: "PARTIAL",
  },
];

export const supplierTransactionRecords: SupplierTransactionRecord[] = [
  {
    id: "TRX-001",
    supplierId: "SUP-001",
    date: "2026-08-25",
    reference: "PO-2026-0018",
    type: "CREDIT",
    description: "Purchase invoice credited to supplier account",
    amount: 435000,
  },
  {
    id: "TRX-002",
    supplierId: "SUP-001",
    date: "2026-08-25",
    reference: "PAY-0081",
    type: "DEBIT",
    description: "Payment made to supplier",
    amount: 300000,
  },
  {
    id: "TRX-003",
    supplierId: "SUP-001",
    date: "2026-07-18",
    reference: "PO-2026-0012",
    type: "CREDIT",
    description: "Purchase invoice",
    amount: 370000,
  },
  {
    id: "TRX-004",
    supplierId: "SUP-001",
    date: "2026-07-18",
    reference: "PAY-0072",
    type: "DEBIT",
    description: "Supplier payment",
    amount: 370000,
  },
  {
    id: "TRX-005",
    supplierId: "SUP-002",
    date: "2026-08-27",
    reference: "PO-2026-0020",
    type: "CREDIT",
    description: "Purchase invoice",
    amount: 625000,
  },
  {
    id: "TRX-006",
    supplierId: "SUP-002",
    date: "2026-08-27",
    reference: "PAY-0084",
    type: "DEBIT",
    description: "Supplier payment",
    amount: 500000,
  },
  {
    id: "TRX-007",
    supplierId: "SUP-003",
    date: "2026-08-05",
    reference: "PO-2026-0016",
    type: "CREDIT",
    description: "Purchase invoice",
    amount: 308000,
  },
];

export const supplierPaymentRecords: SupplierPaymentRecord[] = [
  {
    id: "SPAY-001",
    supplierId: "SUP-001",
    date: "2026-08-25",
    reference: "PAY-0081",
    amount: 300000,
    method: "BANK",
    note: "Partial payment for PO-2026-0018",
  },
  {
    id: "SPAY-002",
    supplierId: "SUP-001",
    date: "2026-07-18",
    reference: "PAY-0072",
    amount: 370000,
    method: "CASH",
    note: "Full invoice settlement",
  },
  {
    id: "SPAY-003",
    supplierId: "SUP-002",
    date: "2026-08-27",
    reference: "PAY-0084",
    amount: 500000,
    method: "BANK",
    note: "Purchase payment",
  },
  {
    id: "SPAY-004",
    supplierId: "SUP-002",
    date: "2026-07-20",
    reference: "PAY-0075",
    amount: 465000,
    method: "CHEQUE",
  },
  {
    id: "SPAY-005",
    supplierId: "SUP-003",
    date: "2026-08-05",
    reference: "PAY-0079",
    amount: 250000,
    method: "BANK",
  },
];