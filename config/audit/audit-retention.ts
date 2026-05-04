import type { AuditRetentionProfile } from "@/types/audit"

export const auditRetentionProfiles: AuditRetentionProfile[] = [
  {
    code: "preview-only",
    name: {
      zh: "预览合同保留策略",
      en: "Preview Contract Retention",
    },
    description: {
      zh: "用于当前里程碑的元数据预览事件，不落库，仅用于合同验证。",
      en: "Used for metadata preview events in this milestone. No persistence, contract validation only.",
    },
    retentionDays: 7,
    exportable: false,
    piiRisk: "low",
    status: "placeholder",
  },
  {
    code: "operational",
    name: {
      zh: "运营审计保留策略",
      en: "Operational Audit Retention",
    },
    description: {
      zh: "用于未来运营动作审计事件，支持操作历史追踪。",
      en: "For future operational action audit events and operational history tracing.",
    },
    retentionDays: 90,
    exportable: true,
    piiRisk: "medium",
    status: "future",
  },
  {
    code: "compliance",
    name: {
      zh: "合规保留策略",
      en: "Compliance Retention",
    },
    description: {
      zh: "用于未来合规事件与审批链路，支持长期留存与导出。",
      en: "For future compliance events and approval trails with long-term retention and export.",
    },
    retentionDays: 365,
    exportable: true,
    piiRisk: "high",
    status: "future",
  },
  {
    code: "system",
    name: {
      zh: "系统事件保留策略",
      en: "System Event Retention",
    },
    description: {
      zh: "用于未来系统级事件日志与基础运行诊断。",
      en: "For future system-level event logs and foundational runtime diagnostics.",
    },
    retentionDays: 30,
    exportable: false,
    piiRisk: "low",
    status: "active",
  },
]

export const auditRetentionProfilesByCode: Record<string, AuditRetentionProfile> = Object.fromEntries(
  auditRetentionProfiles.map((profile) => [profile.code, profile]),
)
