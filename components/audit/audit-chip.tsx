import * as React from "react"

import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { AuditEventType, AuditRetentionProfile, AuditSeverity, AuditStatus } from "@/types/audit"
import type { SupportedLocale } from "@/types/module"

type AuditChipKind = "status" | "severity" | "eventType" | "retention"

export interface AuditChipProps {
  kind: AuditChipKind
  locale: SupportedLocale
  status?: AuditStatus
  severity?: AuditSeverity
  eventType?: AuditEventType
  retention?: AuditRetentionProfile
  compact?: boolean
}

const statusLabel: Record<AuditStatus, { zh: string; en: string }> = {
  captured: { zh: "已捕获", en: "Captured" },
  "preview-only": { zh: "仅预览", en: "Preview Only" },
  pending: { zh: "待接入", en: "Pending" },
  skipped: { zh: "已跳过", en: "Skipped" },
  blocked: { zh: "已阻止", en: "Blocked" },
  failed: { zh: "失败", en: "Failed" },
}

const severityLabel: Record<AuditSeverity, { zh: string; en: string }> = {
  info: { zh: "信息", en: "Info" },
  notice: { zh: "提示", en: "Notice" },
  warning: { zh: "警告", en: "Warning" },
  critical: { zh: "严重", en: "Critical" },
}

const eventTypeLabel: Record<AuditEventType, { zh: string; en: string }> = {
  navigation: { zh: "导航", en: "Navigation" },
  create: { zh: "创建", en: "Create" },
  update: { zh: "更新", en: "Update" },
  approve: { zh: "审批", en: "Approve" },
  reject: { zh: "驳回", en: "Reject" },
  export: { zh: "导出", en: "Export" },
  assign: { zh: "分派", en: "Assign" },
  close: { zh: "关闭", en: "Close" },
  "access-check": { zh: "访问检查", en: "Access Check" },
  "permission-preview": { zh: "权限预览", en: "Permission Preview" },
  "workflow-preview": { zh: "工作流预览", en: "Workflow Preview" },
  "system-preview": { zh: "系统预览", en: "System Preview" },
  placeholder: { zh: "占位", en: "Placeholder" },
}

function statusVariant(status: AuditStatus) {
  if (status === "captured") return "default"
  if (status === "pending") return "secondary"
  if (status === "blocked" || status === "failed") return "destructive"
  return "outline"
}

function severityVariant(severity: AuditSeverity) {
  if (severity === "critical") return "destructive"
  if (severity === "warning") return "secondary"
  return "outline"
}

export function AuditChip({ kind, locale, status, severity, eventType, retention, compact = true }: AuditChipProps) {
  const textSize = compact ? "text-[11px]" : "text-xs"

  if (kind === "status" && status) {
    const label = statusLabel[status]
    return (
      <Badge variant={statusVariant(status)} className={textSize}>
        {locale === "zh" ? label.zh : label.en}
      </Badge>
    )
  }

  if (kind === "severity" && severity) {
    const label = severityLabel[severity]
    return (
      <Badge variant={severityVariant(severity)} className={textSize}>
        {locale === "zh" ? label.zh : label.en}
      </Badge>
    )
  }

  if (kind === "eventType" && eventType) {
    const label = eventTypeLabel[eventType]
    return (
      <Badge variant="outline" className={cn("border-dashed", textSize)}>
        {locale === "zh" ? label.zh : label.en}
      </Badge>
    )
  }

  if (kind === "retention" && retention) {
    const retentionName = locale === "zh" ? retention.name.zh : retention.name.en
    return (
      <Badge variant={retention.exportable ? "secondary" : "outline"} className={textSize}>
        {retention.code}: {retentionName}
      </Badge>
    )
  }

  return null
}
