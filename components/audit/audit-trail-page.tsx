"use client"

import Link from "next/link"
import * as React from "react"

import { AuditEventCard } from "@/components/audit/audit-event-card"
import { AuditPreviewCard } from "@/components/audit/audit-preview-card"
import { AuditRetentionCard } from "@/components/audit/audit-retention-card"
import { AuditSourceCard } from "@/components/audit/audit-source-card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { auditEventRegistry, auditRetentionProfiles } from "@/config/audit"
import { getAuditablePreviewEvents, getAuditEventByKey, getAuditPreview, getPlaceholderAuditEvents } from "@/lib/audit"
import { getAuditNotificationPreview } from "@/lib/notifications"
import { getAuditWorkflowPreview } from "@/lib/workflow"
import { useUiPreferencesStore } from "@/stores/ui-preferences"
import type { AuditEventType, AuditSeverity, AuditStatus } from "@/types/audit"
import type { SupportedLocale } from "@/types/module"

const copy = {
  en: {
    title: "ME Audit Trail",
    subtitle: "Event Log Contract / Audit Preview Foundation",
    description:
      "This route standardizes audit metadata previews only. No real audit persistence, database, backend, API, event queue, session lookup, or middleware is implemented.",
    back: "Back To Dashboard",
    openActionContracts: "Open Action Contracts",
    openAccessControl: "Open Access Control",
    openLayoutEngine: "Open Layout Engine",
    totalEvents: "Total Events",
    placeholders: "Placeholder Events",
    auditable: "Auditable Preview Events",
    filters: "Filters",
    all: "All",
    eventType: "Event Type",
    severity: "Severity",
    status: "Status",
    sourceModule: "Source Module",
    eventList: "Audit Event Registry",
    preview: "Preview",
    sourceMap: "Source Mapping",
    retention: "Retention Profiles",
    metadataOnly: "Metadata-only contract layer",
    noPersistence: "No real event persistence",
    noBackend: "No backend/API/logging middleware",
    noSession: "No user/session lookup",
    noDatabase: "No database integration",
  },
  zh: {
    title: "ME Audit Trail",
    subtitle: "Event Log Contract / Audit Preview Foundation",
    description:
      "该路由仅用于标准化审计元数据预览，不包含真实审计持久化、数据库、后端、API、事件队列、会话查询或中间件。",
    back: "返回 Dashboard",
    openActionContracts: "打开 Action Contracts",
    openAccessControl: "打开 Access Control",
    openLayoutEngine: "打开 Layout Engine",
    totalEvents: "事件总数",
    placeholders: "占位事件",
    auditable: "可审计预览事件",
    filters: "筛选",
    all: "全部",
    eventType: "事件类型",
    severity: "严重级别",
    status: "状态",
    sourceModule: "来源模块",
    eventList: "审计事件注册表",
    preview: "预览",
    sourceMap: "来源映射",
    retention: "保留策略",
    metadataOnly: "仅元数据合同层",
    noPersistence: "不做真实事件持久化",
    noBackend: "不接后端/API/日志中间件",
    noSession: "不做用户/会话查询",
    noDatabase: "不接数据库",
  },
} as const

const eventTypeOptions: Array<AuditEventType | "all"> = [
  "all",
  "navigation",
  "create",
  "update",
  "approve",
  "reject",
  "export",
  "assign",
  "close",
  "access-check",
  "permission-preview",
  "workflow-preview",
  "system-preview",
  "placeholder",
]

const severityOptions: Array<AuditSeverity | "all"> = ["all", "info", "notice", "warning", "critical"]
const statusOptions: Array<AuditStatus | "all"> = ["all", "captured", "preview-only", "pending", "skipped", "blocked", "failed"]

function groupBy(values: string[]) {
  const counts: Record<string, number> = {}
  values.forEach((value) => {
    counts[value] = (counts[value] ?? 0) + 1
  })
  return counts
}

export function AuditTrailPage() {
  const locale = useUiPreferencesStore((state) => state.locale)
  const theme = useUiPreferencesStore((state) => state.theme)
  const hydrated = useUiPreferencesStore((state) => state.hydrated)
  const hydrate = useUiPreferencesStore((state) => state.hydrate)

  React.useEffect(() => {
    hydrate()
  }, [hydrate])

  React.useEffect(() => {
    if (!hydrated) return
    document.documentElement.dataset.theme = theme
    document.documentElement.lang = locale === "zh" ? "zh-CN" : "en"
  }, [hydrated, locale, theme])

  const currentLocale: SupportedLocale = hydrated ? locale : "en"
  const t = copy[currentLocale]

  const [eventTypeFilter, setEventTypeFilter] = React.useState<AuditEventType | "all">("all")
  const [severityFilter, setSeverityFilter] = React.useState<AuditSeverity | "all">("all")
  const [statusFilter, setStatusFilter] = React.useState<AuditStatus | "all">("all")
  const [sourceModuleFilter, setSourceModuleFilter] = React.useState<string>("all")
  const [selectedEventKey, setSelectedEventKey] = React.useState<string>(auditEventRegistry[0]?.key ?? "")

  const sourceModules = React.useMemo(() => {
    const modules = Array.from(new Set(auditEventRegistry.map((event) => event.source.sourceModule))).sort()
    return ["all", ...modules]
  }, [])

  const filteredEvents = React.useMemo(() => {
    return auditEventRegistry.filter((event) => {
      if (eventTypeFilter !== "all" && event.eventType !== eventTypeFilter) return false
      if (severityFilter !== "all" && event.severity !== severityFilter) return false
      if (statusFilter !== "all" && event.status !== statusFilter) return false
      if (sourceModuleFilter !== "all" && event.source.sourceModule !== sourceModuleFilter) return false
      return true
    })
  }, [eventTypeFilter, severityFilter, sourceModuleFilter, statusFilter])

  const effectiveSelectedKey = React.useMemo(() => {
    if (selectedEventKey && filteredEvents.some((event) => event.key === selectedEventKey)) return selectedEventKey
    return filteredEvents[0]?.key ?? ""
  }, [filteredEvents, selectedEventKey])

  const selectedEvent = React.useMemo(() => {
    if (!effectiveSelectedKey) return undefined
    return filteredEvents.find((event) => event.key === effectiveSelectedKey) ?? getAuditEventByKey(effectiveSelectedKey)
  }, [effectiveSelectedKey, filteredEvents])

  const selectedPreview = React.useMemo(() => {
    if (!selectedEvent) return undefined
    return getAuditPreview(selectedEvent)
  }, [selectedEvent])

  const selectedWorkflowPreview = React.useMemo(() => (selectedEvent ? getAuditWorkflowPreview(selectedEvent) : undefined), [selectedEvent])
  const selectedNotificationPreview = React.useMemo(() => (selectedEvent ? getAuditNotificationPreview(selectedEvent) : undefined), [selectedEvent])

  const stats = React.useMemo(() => {
    return {
      totalEvents: auditEventRegistry.length,
      placeholders: getPlaceholderAuditEvents().length,
      auditable: getAuditablePreviewEvents().length,
      byType: groupBy(auditEventRegistry.map((event) => event.eventType)),
      bySeverity: groupBy(auditEventRegistry.map((event) => event.severity)),
      bySource: groupBy(auditEventRegistry.map((event) => event.source.sourceModule)),
    }
  }, [])

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-8">
      <Card>
        <CardHeader className="gap-2">
          <CardTitle className="text-xl">{t.title}</CardTitle>
          <CardDescription>{t.subtitle}</CardDescription>
          <CardDescription>{t.description}</CardDescription>
          <div className="flex flex-wrap gap-2 pt-2">
            <Button asChild size="sm" variant="outline">
              <Link href="/">{t.back}</Link>
            </Button>
            <Button asChild size="sm" variant="outline">
              <Link href="/action-contracts">{t.openActionContracts}</Link>
            </Button>
            <Button asChild size="sm" variant="outline">
              <Link href="/access-control">{t.openAccessControl}</Link>
            </Button>
            <Button asChild size="sm" variant="outline">
              <Link href="/layout-engine">{t.openLayoutEngine}</Link>
            </Button>
            <Button asChild size="sm" variant="outline">
              <Link href="/workflow">ME Workflow</Link>
            </Button>
            <Button asChild size="sm" variant="outline">
              <Link href="/reports">ME Reports</Link>
            </Button>
            <Button asChild size="sm" variant="outline">
              <Link href="/notifications">ME Notifications</Link>
            </Button>
            <Button asChild size="sm" variant="outline">
              <Link href="/rules">ME Rules</Link>
            </Button>
          </div>
        </CardHeader>
      </Card>

      <Card size="sm">
        <CardHeader className="gap-1">
          <CardTitle className="text-sm">{t.metadataOnly}</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3">
          <div className="grid grid-cols-3 gap-2 md:max-w-md">
            <div className="rounded-xl bg-muted/40 p-3">
              <div className="text-xs text-muted-foreground">{t.totalEvents}</div>
              <div className="text-lg font-semibold">{stats.totalEvents}</div>
            </div>
            <div className="rounded-xl bg-muted/40 p-3">
              <div className="text-xs text-muted-foreground">{t.placeholders}</div>
              <div className="text-lg font-semibold">{stats.placeholders}</div>
            </div>
            <div className="rounded-xl bg-muted/40 p-3">
              <div className="text-xs text-muted-foreground">{t.auditable}</div>
              <div className="text-lg font-semibold">{stats.auditable}</div>
            </div>
          </div>
          <div className="flex flex-wrap gap-1.5 text-xs">
            {Object.entries(stats.byType).map(([type, count]) => (
              <Badge key={type} variant="outline">
                {type}: {count}
              </Badge>
            ))}
          </div>
          <div className="flex flex-wrap gap-1.5 text-xs">
            {Object.entries(stats.bySeverity).map(([severity, count]) => (
              <Badge key={severity} variant="secondary">
                {severity}: {count}
              </Badge>
            ))}
          </div>
          <div className="flex flex-wrap gap-1.5 text-xs">
            {Object.entries(stats.bySource).map(([source, count]) => (
              <Badge key={source} variant="outline">
                {source}: {count}
              </Badge>
            ))}
          </div>
          <div className="flex flex-wrap gap-1.5 text-xs">
            <Badge variant="outline">{t.noPersistence}</Badge>
            <Badge variant="outline">{t.noBackend}</Badge>
            <Badge variant="outline">{t.noDatabase}</Badge>
            <Badge variant="outline">{t.noSession}</Badge>
          </div>
        </CardContent>
      </Card>

      <Card size="sm">
        <CardHeader className="gap-1">
          <CardTitle className="text-sm">{t.filters}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Select value={eventTypeFilter} onValueChange={(value) => setEventTypeFilter(value as AuditEventType | "all")}>
            <SelectTrigger size="sm">
              <SelectValue placeholder={t.eventType} />
            </SelectTrigger>
            <SelectContent>
              {eventTypeOptions.map((value) => (
                <SelectItem key={value} value={value}>
                  {value === "all" ? t.all : value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={severityFilter} onValueChange={(value) => setSeverityFilter(value as AuditSeverity | "all")}>
            <SelectTrigger size="sm">
              <SelectValue placeholder={t.severity} />
            </SelectTrigger>
            <SelectContent>
              {severityOptions.map((value) => (
                <SelectItem key={value} value={value}>
                  {value === "all" ? t.all : value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as AuditStatus | "all")}>
            <SelectTrigger size="sm">
              <SelectValue placeholder={t.status} />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((value) => (
                <SelectItem key={value} value={value}>
                  {value === "all" ? t.all : value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={sourceModuleFilter} onValueChange={setSourceModuleFilter}>
            <SelectTrigger size="sm">
              <SelectValue placeholder={t.sourceModule} />
            </SelectTrigger>
            <SelectContent>
              {sourceModules.map((value) => (
                <SelectItem key={value} value={value}>
                  {value === "all" ? t.all : value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <section className="grid gap-4 md:grid-cols-2">
        <Card size="sm">
          <CardHeader className="gap-1">
            <CardTitle className="text-sm">{t.eventList}</CardTitle>
            <CardDescription className="text-xs">
              {filteredEvents.length} / {auditEventRegistry.length}
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3">
            {filteredEvents.map((event) => (
              <button key={event.key} type="button" className="text-left" onClick={() => setSelectedEventKey(event.key)}>
                <AuditEventCard event={event} locale={currentLocale} />
              </button>
            ))}
          </CardContent>
        </Card>
        <div className="grid gap-4">
          {selectedPreview ? <AuditPreviewCard preview={selectedPreview} locale={currentLocale} workflowPreview={selectedWorkflowPreview} notificationPreview={selectedNotificationPreview} /> : null}
          {selectedEvent ? <AuditSourceCard event={selectedEvent} locale={currentLocale} /> : null}
          {selectedEvent ? (
            <Card size="sm">
              <CardHeader className="gap-1">
                <CardTitle className="text-sm">{t.preview}</CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-muted-foreground">
                {selectedEvent.requirement.actionKey ? <div>actionKey: {selectedEvent.requirement.actionKey}</div> : null}
                {selectedEvent.requirement.accessRuleKey ? <div>accessRuleKey: {selectedEvent.requirement.accessRuleKey}</div> : null}
                {selectedNotificationPreview ? <div>notificationKey: {selectedNotificationPreview.notificationKey}</div> : null}
                {!selectedEvent.requirement.actionKey && !selectedEvent.requirement.accessRuleKey ? (
                  <div>{currentLocale === "zh" ? "当前事件未绑定 ActionContract 或 AccessRule。" : "No ActionContract or AccessRule linkage is defined for this event."}</div>
                ) : null}
              </CardContent>
            </Card>
          ) : null}
        </div>
      </section>

      <Card size="sm">
        <CardHeader className="gap-1">
          <CardTitle className="text-sm">{t.retention}</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-2">
          {auditRetentionProfiles.map((profile) => (
            <AuditRetentionCard key={profile.code} profile={profile} locale={currentLocale} />
          ))}
        </CardContent>
      </Card>
    </main>
  )
}
