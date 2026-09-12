# Rental & Business Management System

An admin panel for managing a rental & sales business — covering rental orders, sales, inventory,
payroll, accounting, and reporting in one place. Built with React, TypeScript, and Tailwind CSS.

## Tech Stack

- **React** + **TypeScript**
- **React Router** for routing
- **Tailwind CSS v4** for styling (custom design tokens — see `src/index.css`)
- **Lucide React** for icons
- **Recharts** for dashboard charts

## Getting Started

```bash
npm install
npm run dev
```

The app expects a router setup with all admin pages nested under a `DashboardLayout`
(`src/layout/DashboardLayout.tsx`), which renders the sidebar (`FloatingSidebarMenu`) and an
`<Outlet />` for the active page.

## Project Structure

```
src/
├── components/         # Reusable UI building blocks, grouped by feature
│   ├── ui/              # Base components: Button, Input, Select, Modal, DataTable, Badge, etc.
│   ├── payment/          # PaymentSection — shared payment method picker (see below)
│   ├── users/ salary/ employee/ attendance/ ...   # Feature-specific form modals & widgets
├── data/                # Mock data (TODO markers show where to swap in real API calls)
├── layout/               # PageContainer, PageHeader, DashboardLayout
├── pages/                # One folder per route/module
├── types/                # TypeScript types + domain logic (calculations, helpers)
├── hooks/                # Shared hooks (e.g. useFullscreen, useDashboardShortcut)
└── config/               # Sidebar menu config, etc.
```

## Modules

| Module           | Path                      | What it does                                                                 |
| ---------------- | ------------------------- | ---------------------------------------------------------------------------- |
| Dashboard        | `/admin/dashboard`        | Business overview, stat cards, "needs attention" feed, charts                |
| Users            | `/admin/users`            | Admin panel user accounts, roles, status                                     |
| Employees        | `/admin/employee`         | Employee records, salary type & rate setup                                   |
| Salary           | `/admin/salary`           | Create/approve salary records, allowances, deductions, advance               |
| Advance          | `/admin/advance`          | Issue employee salary advances, view advance history                         |
| Attendance       | `/admin/attendance`       | Mark & approve monthly attendance (present/expected/OT/leave days)           |
| Items Movement   | `/admin/items-movement`   | Stock In / Out / Return tracking for inventory items                         |
| Role Permissions | `/admin/role-permissions` | Per-role permission matrix                                                   |
| Accounts         | `/admin/accounts`         | Cash accounts & bank accounts (tabbed)                                       |
| Expenses         | `/admin/expenses`         | Expense categories & records, approval + payment                             |
| Income           | `/admin/income`           | Income categories & records, approval + payment                              |
| Fund Transfer    | `/admin/fund-transfer`    | Cash ↔ Bank transfers; cheques-in-hand tracking (release/return)             |
| Payments         | `/admin/payments`         | Unified payment screen — salary, supplier, liability (extensible via config) |
| Rental (Create)  | `/admin/rental`           | Create a rent/sale order — 5 item types, customer, guarantor(s), advance     |
| Rental Orders    | `/admin/rental-orders`    | View/edit pending orders, process (with deductions), reject, notes           |
| Liabilities      | `/admin/liabilities`      | Manual & asset-linked liabilities, approval, payments, history               |
| Assets           | `/admin/assets`           | Asset purchase (with auto-liability on partial payment), sale, installments  |
| General Ledger   | `/admin/general-ledger`   | Journal entries by account, mismatch detection, manual adjustments           |
| Sales Report     | `/admin/sales-report`     | Filterable sales/rental report with charts (customer, item, user-wise)       |
| Profit & Loss    | `/admin/profit-loss`      | Revenue vs expense summary, category breakdown, trend chart                  |
| My Profile       | `/admin/profile`          | Logged-in user's profile, avatar, password change                            |

## Key Shared Patterns

### PageContainer / PageHeader

Every page wraps its content in `<PageContainer title="..." breadcrumbs={...} actions={...}>`.
This renders a consistent header (breadcrumb trail back to Dashboard, icon, title, action
buttons) and a fullscreen toggle.

### CRUD Modal Pattern

Most list pages follow the same shape:

- A `DataTable` with search, filters, and pagination (`pageSize` prop)
- A single `*FormModal` component handling **create / edit / view** via a `mode` prop
- View mode disables all fields; Edit is often restricted to records in a "Pending" state

### PaymentSection (`src/components/payment/PaymentSection.tsx`)

A single reusable component used everywhere money changes hands (Expenses, Income, Salary
advances, Liability payments, Asset sales, Rental advances, the unified Payments screen). It
supports four methods and always emits the same payload shape:

```json
{ "method": "CASH", "cash_id": 1 }
{ "method": "BANK", "bank_account_id": 2, "payee_name": "CEB", "payer_name": null }
{ "method": "CHEQUE", "bank_account_id": 2, "cheque_no": "CHQ-000125", "cheque_date": "2026-08-12", "payee_name": "CEB", "payer_name": null }
{ "method": "EXISTING_CHEQUE", "cheque_id": 25 }
```

Which methods are shown is controlled per-screen via an `allowedMethods` prop, e.g.
`["CASH", "BANK"]` for salary, `["CASH", "BANK", "CHEQUE", "EXISTING_CHEQUE"]` for suppliers.

### Status Workflows

Several modules use a Pending → Approved/Processed/Rejected flow, with editing generally locked
once a record leaves "Pending":

- **Salary / Attendance**: Pending → Approved / Rejected
- **Expenses / Income**: Pending → Approved (payment method required) / Cancelled
- **Rental Orders**: Pending → Processed (with day-count correction + extra charges) / Rejected
- **Liabilities**: Pending (from asset purchase) → Approved → Settled

### Rental Item Types

The rental/sale catalog (`src/types/rental.ts`) supports 6 item types, each with its own pricing
logic in `lineSubtotal()` / `lineAmount()`:

1. **Returnable Unit** — machines, generators, cameras (rate × days)
2. **Returnable Stock** — bulk returnable items, e.g. cutting discs (rate × days)
3. **Consumable / Non-returnable** — milk packets, water bottles (flat qty × price)
4. **Rental + Consumption** — e.g. generator (returnable) + fuel (consumable), combined
5. **Package** — bundle of components (e.g. wedding package) at a flat price
6. **Sale** — outright sale, no customer required, no return

Day counts for rental lines are calculated per-item from its own `outDate` (so items added to an
order later are dated independently), and can be manually corrected during order processing.

## Known Gaps / TODOs

This is a frontend build with mock data throughout. Before going to production:

- **Wire up all `data/mock*.ts` files to real API endpoints** (each has a `// TODO:` comment
  showing the expected endpoint).
- **Shared state / single source of truth**: several modules currently keep independent local
  mock state for things that should be shared (e.g. cash/bank account lists used by
  `PaymentSection`, Accounts page, and Fund Transfer; Assets ↔ Liabilities linkage). These need a
  shared store or API-backed source once connected to a real backend.
- **Dashboard aggregation**: the "Needs Attention" feed and stat cards are hardcoded — these
  should come from a `GET /api/dashboard/summary`-style aggregation endpoint.
- **General Ledger**: pagination is currently client-side; move to server-side pagination for
  large datasets.
- **File/image uploads** (guarantor photos, order images, avatars) currently store base64 data
  URLs in memory — needs a real upload endpoint.
- **Auth**: no authentication/authorization wiring yet — Role Permissions page defines the
  matrix but nothing enforces it yet.

## Design System

Colors, spacing, and other tokens are defined as CSS variables in `src/index.css` (both `:root`
and Tailwind v4 `@theme`), so **do not hardcode hex colors** in components — always use the
existing tokens (`--color-primary`, `--color-secondary`, `--color-success`, etc.) or their
Tailwind class equivalents (`bg-primary`, `text-secondary`, ...).

## Author

**Dhanushka Jayarathna**
📞 0766640384
📧 dhanushka.jayarathna01@gmail.com
