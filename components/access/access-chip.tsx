import * as React from "react"

import { Badge } from "@/components/ui/badge"
import type { AccessPlan, AccessRole, AccessStatus } from "@/types/access-control"
import type { SupportedLocale } from "@/types/module"

type AccessChipKind = "status" | "role" | "plan" | "permission"

export interface AccessChipProps {
  kind: AccessChipKind
  locale: SupportedLocale
  status?: AccessStatus
  role?: AccessRole
  plan?: AccessPlan
  permission?: string
  compact?: boolean
}

const statusLabel: Record<AccessStatus, { zh: string; en: string }> = {
  allowed: { zh: "可访问", en: "Allowed" },
  blocked: { zh: "阻止", en: "Blocked" },
  placeholder: { zh: "占位", en: "Placeholder" },
  "coming-soon": { zh: "即将上线", en: "Coming Soon" },
  hidden: { zh: "隐藏", en: "Hidden" },
}

const roleLabel: Record<AccessRole, { zh: string; en: string }> = {
  owner: { zh: "负责人", en: "Owner" },
  "operations-manager": { zh: "运营经理", en: "Operations Manager" },
  "purchasing-manager": { zh: "采购经理", en: "Purchasing Manager" },
  "store-manager": { zh: "店长", en: "Store Manager" },
  "warehouse-handler": { zh: "仓储专员", en: "Warehouse Handler" },
  "supplier-coordinator": { zh: "供应商协同员", en: "Supplier Coordinator" },
  staff: { zh: "员工", en: "Staff" },
  admin: { zh: "管理员", en: "Admin" },
  system: { zh: "系统", en: "System" },
}

const planLabel: Record<AccessPlan, { zh: string; en: string }> = {
  starter: { zh: "基础版", en: "Starter" },
  ops: { zh: "运营版", en: "Ops" },
  pro: { zh: "专业版", en: "Pro" },
  enterprise: { zh: "企业版", en: "Enterprise" },
}

function getStatusVariant(status: AccessStatus) {
  if (status === "allowed") return "default"
  if (status === "blocked") return "destructive"
  return "outline"
}

export function AccessChip({ kind, locale, status, role, plan, permission, compact = true }: AccessChipProps) {
  const textSize = compact ? "text-[11px]" : "text-xs"

  if (kind === "status" && status) {
    const item = statusLabel[status]
    return (
      <Badge variant={getStatusVariant(status)} className={textSize}>
        {locale === "zh" ? item.zh : item.en}
      </Badge>
    )
  }

  if (kind === "role" && role) {
    const item = roleLabel[role]
    return (
      <Badge variant="outline" className={textSize}>
        {locale === "zh" ? item.zh : item.en}
      </Badge>
    )
  }

  if (kind === "plan" && plan) {
    const item = planLabel[plan]
    return (
      <Badge variant="secondary" className={textSize}>
        {locale === "zh" ? item.zh : item.en}
      </Badge>
    )
  }

  return (
    <Badge variant="outline" className={textSize}>
      {permission ?? "-"}
    </Badge>
  )
}
