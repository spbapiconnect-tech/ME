export type ErpModuleGroup = "Dashboard" | "Store Operations" | "PSI" | "Workforce" | "Business" | "System";

export type ErpModuleItem = {
  label: string;
  zhLabel: string;
  href: string;
  group: ErpModuleGroup;
};

export const erpNavigation: ErpModuleItem[] = [
  { label: "Dashboard", zhLabel: "工作台", href: "/", group: "Dashboard" },
  { label: "Branches", zhLabel: "门店管理", href: "/branches", group: "Store Operations" },
  { label: "Inspection", zhLabel: "巡检管理", href: "/inspection", group: "Store Operations" },
  { label: "Issues", zhLabel: "异常事件", href: "/issues", group: "Store Operations" },
  { label: "Tasks", zhLabel: "任务管理", href: "/tasks", group: "Store Operations" },
  { label: "Overview", zhLabel: "总览", href: "/psi", group: "PSI" },
  { label: "Procurement", zhLabel: "采购管理", href: "/psi/procurement", group: "PSI" },
  { label: "Supplier", zhLabel: "供应商管理", href: "/psi/supplier", group: "PSI" },
  { label: "Inventory", zhLabel: "库存管理", href: "/psi/inventory", group: "PSI" },
  { label: "Receiving", zhLabel: "收货管理", href: "/psi/receiving", group: "PSI" },
  { label: "Staff", zhLabel: "员工管理", href: "/staff", group: "Workforce" },
  { label: "Schedule", zhLabel: "排班管理", href: "/schedule", group: "Workforce" },
  { label: "Training", zhLabel: "培训与 SOP", href: "/training", group: "Workforce" },
  { label: "Reports", zhLabel: "报表中心", href: "/reports", group: "Business" },
  { label: "Roles & Permission", zhLabel: "权限管理", href: "/roles", group: "Business" },
  { label: "Settings", zhLabel: "系统设置", href: "/settings", group: "System" },
  { label: "Integration", zhLabel: "集成管理", href: "/integration", group: "System" },
];
