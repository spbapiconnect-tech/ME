export type PermissionAction = "view" | "manage" | "export" | "audit";
export type PermissionScope = "module" | "store" | "region" | "tenant";
export type PermissionKey =
  | "procurement.view"
  | "supplier.view"
  | "inventory.view"
  | "pos-report.view"
  | "education.view"
  | "task.view"
  | "task.manage"
  | "module.audit";

export interface PermissionDefinition {
  key: PermissionKey;
  resource: string;
  action: PermissionAction;
  scope: PermissionScope;
  description: string;
}
