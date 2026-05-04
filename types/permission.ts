export type PermissionAction = "view" | "create" | "edit" | "approve" | "export" | "assign" | "close" | "manage" | "configure" | "audit"
export type PermissionScope = "module" | "store" | "region" | "tenant"

export type PermissionKey =
  | "procurement.view"
  | "procurement.create"
  | "procurement.edit"
  | "procurement.approve"
  | "procurement.export"
  | "supplier.view"
  | "supplier.create"
  | "supplier.edit"
  | "supplier.approve"
  | "supplier.export"
  | "inventory.view"
  | "inventory.create"
  | "inventory.edit"
  | "inventory.approve"
  | "inventory.export"
  | "pos-report.view"
  | "pos-report.create"
  | "pos-report.edit"
  | "pos-report.approve"
  | "pos-report.export"
  | "education.view"
  | "education.create"
  | "education.edit"
  | "education.approve"
  | "education.export"
  | "task.view"
  | "task.create"
  | "task.edit"
  | "task.assign"
  | "task.close"
  | "task.export"
  | "module.audit"

export interface PermissionDefinition {
  key: PermissionKey
  resource: string
  action: PermissionAction
  scope: PermissionScope
  description: string
}
