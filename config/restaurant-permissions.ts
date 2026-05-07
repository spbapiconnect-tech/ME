export interface RestaurantPermissionDefinition {
  key: string;
  module: string;
  description: string;
  futureRoleOwner: string;
  status: "planning-only";
}

export const restaurantPermissions: RestaurantPermissionDefinition[] = [
  { key: "view_inventory", module: "inventory", description: "Future permission to view inventory detail and risk surfaces.", futureRoleOwner: "warehouse / manager", status: "planning-only" },
  { key: "edit_inventory_future", module: "inventory", description: "Future permission for inventory adjustments or stock posting flows.", futureRoleOwner: "warehouse admin", status: "planning-only" },
  { key: "approve_procurement_future", module: "procurement", description: "Future permission for procurement review and approval actions.", futureRoleOwner: "purchasing lead / manager", status: "planning-only" },
  { key: "view_schedule", module: "schedule", description: "Future permission to view roster and shift assignments.", futureRoleOwner: "store manager", status: "planning-only" },
  { key: "manage_schedule_future", module: "schedule", description: "Future permission to create or update schedules.", futureRoleOwner: "store manager / hr lead", status: "planning-only" },
  { key: "view_staff", module: "staff", description: "Future permission to view staff roster and profile context.", futureRoleOwner: "hr / manager", status: "planning-only" },
  { key: "manage_staff_future", module: "staff", description: "Future permission to manage staff records and branch assignment.", futureRoleOwner: "hr admin", status: "planning-only" },
  { key: "view_reports", module: "reports", description: "Future permission to view reports and performance snapshots.", futureRoleOwner: "manager / analyst", status: "planning-only" },
  { key: "export_reports_future", module: "reports", description: "Future permission to export report files or snapshots.", futureRoleOwner: "manager / analyst", status: "planning-only" },
  { key: "manage_sop_future", module: "sop", description: "Future permission to revise SOP, recipes, and product standards.", futureRoleOwner: "food operations admin", status: "planning-only" },
];
