export interface Permission {
  id: string;
  label: string;
  category: string;
}

export interface RolePermissionMap {
  role: string;
  permissionIds: string[];
}

// TODO: replace with real API call e.g. GET /api/permissions
export const availableRoles = ["Admin", "Manager", "Staff"] as const;

export const mockPermissions: Permission[] = [
  { id: "users.view", label: "View Users", category: "Users" },
  { id: "users.create", label: "Create Users", category: "Users" },
  { id: "users.edit", label: "Edit Users", category: "Users" },
  { id: "users.status", label: "Change User Status", category: "Users" },

  { id: "employees.view", label: "View Employees", category: "Employees" },
  { id: "employees.create", label: "Create Employees", category: "Employees" },
  { id: "employees.edit", label: "Edit Employees", category: "Employees" },
  { id: "employees.status", label: "Change Employee Status", category: "Employees" },

  { id: "salary.view", label: "View Salary Records", category: "Payroll" },
  { id: "salary.create", label: "Create Salary Records", category: "Payroll" },
  { id: "salary.edit", label: "Edit Pending Salary", category: "Payroll" },
  { id: "salary.approve", label: "Approve / Reject Salary", category: "Payroll" },
  { id: "advance.create", label: "Issue Advances", category: "Payroll" },
  { id: "attendance.mark", label: "Mark Attendance", category: "Payroll" },
  { id: "attendance.approve", label: "Approve Attendance", category: "Payroll" },

  { id: "items.view", label: "View Item Movements", category: "Inventory" },
  { id: "items.create", label: "Record Item Movement", category: "Inventory" },

  { id: "settings.view", label: "View System Settings", category: "System" },
  { id: "settings.edit", label: "Edit System Settings", category: "System" },
  { id: "roles.manage", label: "Manage Roles & Permissions", category: "System" },
];

// TODO: replace with real API call e.g. GET /api/roles/:role/permissions
export const mockRolePermissions: RolePermissionMap[] = [
  {
    role: "Admin",
    permissionIds: mockPermissions.map((p) => p.id), // all permissions
  },
  {
    role: "Manager",
    permissionIds: [
      "users.view",
      "employees.view",
      "employees.create",
      "employees.edit",
      "employees.status",
      "salary.view",
      "salary.create",
      "salary.edit",
      "salary.approve",
      "advance.create",
      "attendance.mark",
      "attendance.approve",
      "items.view",
      "items.create",
    ],
  },
  {
    role: "Staff",
    permissionIds: ["employees.view", "salary.view", "attendance.mark", "items.view", "items.create"],
  },
];