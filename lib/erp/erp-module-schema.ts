import type { ReactNode } from "react";

import type { ErpDictionaryKey, ErpLocale } from "@/lib/erp/erp-i18n";

export type ErpModuleGroupKey = "dashboard" | "store-operations" | "psi" | "workforce" | "business" | "system";

export interface ErpNavigationItem {
  key: ErpDictionaryKey;
  href: string;
  labelKey: ErpDictionaryKey;
}

export interface ErpNavigationGroup {
  key: ErpModuleGroupKey;
  label: Record<ErpLocale, string>;
  items: ErpNavigationItem[];
}

export const erpNavigationGroups: ErpNavigationGroup[] = [
  {
    key: "dashboard",
    label: { en: "Dashboard", zh: "工作台" },
    items: [{ key: "dashboard", href: "/", labelKey: "dashboard" }],
  },
  {
    key: "store-operations",
    label: { en: "Store Operations", zh: "门店营运" },
    items: [
      { key: "branches", href: "/branches", labelKey: "branches" },
      { key: "inspection", href: "/inspection", labelKey: "inspection" },
      { key: "issues", href: "/issues", labelKey: "issues" },
      { key: "tasks", href: "/tasks", labelKey: "tasks" },
    ],
  },
  {
    key: "psi",
    label: { en: "PSI", zh: "采购库存" },
    items: [
      { key: "psiOverview", href: "/psi", labelKey: "psiOverview" },
      { key: "procurement", href: "/psi/procurement", labelKey: "procurement" },
      { key: "supplier", href: "/psi/supplier", labelKey: "supplier" },
      { key: "inventory", href: "/psi/inventory", labelKey: "inventory" },
      { key: "receiving", href: "/psi/receiving", labelKey: "receiving" },
    ],
  },
  {
    key: "workforce",
    label: { en: "Workforce", zh: "人员" },
    items: [
      { key: "staff", href: "/staff", labelKey: "staff" },
      { key: "schedule", href: "/schedule", labelKey: "schedule" },
      { key: "training", href: "/training", labelKey: "training" },
    ],
  },
  {
    key: "business",
    label: { en: "Business", zh: "业务" },
    items: [
      { key: "reports", href: "/reports", labelKey: "reports" },
      { key: "rolesPermission", href: "/roles", labelKey: "rolesPermission" },
    ],
  },
  {
    key: "system",
    label: { en: "System", zh: "系统" },
    items: [
      { key: "settings", href: "/settings", labelKey: "settings" },
      { key: "integration", href: "/integration", labelKey: "integration" },
    ],
  },
];

export type ErpColumnType =
  | "id"
  | "code"
  | "name"
  | "title"
  | "text"
  | "amount"
  | "currency"
  | "number"
  | "count"
  | "quantity"
  | "percentage"
  | "score"
  | "status"
  | "priority"
  | "badge"
  | "date"
  | "time"
  | "action";

export interface ErpDataTableColumn<TRecord extends { id: string }> {
  key: keyof TRecord & string;
  label: string;
  type?: ErpColumnType;
  width?: string;
  render?: (record: TRecord) => ReactNode;
}

export interface ErpKpiItem {
  key: string;
  label: string;
  value: string;
  helper?: string;
  tone?: "default" | "success" | "warning" | "danger" | "info";
}

export interface ErpDetailField {
  label: string;
  value: ReactNode;
}
