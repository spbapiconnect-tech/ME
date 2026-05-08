"use client"

import Link from "next/link"
import * as React from "react"

import { actionRegistry } from "@/config/actions"
import { ActionPreviewCard } from "@/components/actions/action-preview-card"
import { ActionSourceCard } from "@/components/actions/action-source-card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getActionByKey, getActionExecutionPreview, getAuditableActions, getPlaceholderActions } from "@/lib/actions"
import { useUiPreferencesStore } from "@/stores/ui-preferences"
import type { ActionContract, ActionIntent, ActionStatus } from "@/types/action-contract"
import type { SupportedLocale, ThemeMode } from "@/types/module"

const copy = {
  en: {
    title: "ME Action Contracts",
    subtitle: "Source Mapping / Button Contract Foundation",
    description:
      "This route demonstrates the metadata-only action contract layer. It does not enforce permissions, write audit logs, execute workflows, or persist changes.",
    back: "Back To Dashboard",
    openLayoutEngine: "Open Layout Engine",
    openComponents: "Open Components",
    openAccessControl: "ME Access Control",
    filters: "Filters",
    intent: "Intent",
    sourceModule: "Source Module",
    status: "Status",
    all: "All",
    stats: "Registry Stats",
    total: "Total Actions",
    placeholders: "Placeholder Actions",
    auditable: "Auditable Actions",
    preview: "Action Preview",
    sourceMapping: "Source Mapping",
    metadataOnly: "Metadata Only",
    noRealEnforcement: "No real permission enforcement",
    noRealAudit: "No real audit logging",
    noRealWorkflow: "No real workflow execution",
    noWrites: "No API/database writes",
    selectAction: "Select an action",
  },
  zh: {
    title: "ME Action Contracts",
    subtitle: "Source Mapping / Button Contract Foundation",
    description:
      "该路由用于展示动作合同(Action Contract)的元数据层，不做真实权限校验、不写审计日志、不执行工作流，也不做任何持久化写入。",
    back: "返回 Dashboard",
    openLayoutEngine: "打开布局引擎",
    openComponents: "打开组件页",
    openAccessControl: "ME Access Control",
    filters: "筛选",
    intent: "意图",
    sourceModule: "来源模块",
    status: "状态",
    all: "全部",
    stats: "注册表统计",
    total: "动作总数",
    placeholders: "占位动作",
    auditable: "需审计动作",
    preview: "动作预览",
    sourceMapping: "Source Mapping",
    metadataOnly: "仅元数据",
    noRealEnforcement: "不做真实权限校验",
    noRealAudit: "不做真实审计日志",
    noRealWorkflow: "不执行工作流",
    noWrites: "不做 API/数据库写入",
    selectAction: "选择一个动作",
  },
} as const

const intentOptions: Array<ActionIntent | "all"> = [
  "all",
  "navigate",
  "create",
  "update",
  "approve",
  "reject",
  "export",
  "assign",
  "close",
  "open-drawer",
  "open-modal",
  "trigger-task",
  "trigger-workflow",
  "configure",
  "placeholder",
]

const statusOptions: Array<ActionStatus | "all"> = ["all", "active", "disabled", "hidden", "coming-soon", "placeholder"]

function groupBy<T extends string>(values: T[]) {
  const counts: Record<string, number> = {}

  values.forEach((value) => {
    counts[value] = (counts[value] ?? 0) + 1
  })

  return counts
}

export function ActionContractsPage() {
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
  const currentTheme: ThemeMode = hydrated ? theme : "bright"
  const t = copy[currentLocale]

  const [intentFilter, setIntentFilter] = React.useState<ActionIntent | "all">("all")
  const [sourceModuleFilter, setSourceModuleFilter] = React.useState<string>("all")
  const [statusFilter, setStatusFilter] = React.useState<ActionStatus | "all">("all")
  const [selectedKey, setSelectedKey] = React.useState<string>(actionRegistry[0]?.key ?? "")

  const sourceModules = React.useMemo(() => {
    const modules = Array.from(new Set(actionRegistry.map((action) => action.source.sourceModule))).sort()
    return ["all", ...modules]
  }, [])

  const filteredActions = React.useMemo(() => {
    return actionRegistry.filter((action) => {
      if (intentFilter !== "all" && action.intent !== intentFilter) return false
      if (statusFilter !== "all" && action.status !== statusFilter) return false
      if (sourceModuleFilter !== "all" && action.source.sourceModule !== sourceModuleFilter) return false
      return true
    })
  }, [intentFilter, sourceModuleFilter, statusFilter])

  const effectiveSelectedKey = React.useMemo(() => {
    if (selectedKey && filteredActions.some((item) => item.key === selectedKey)) {
      return selectedKey
    }

    return filteredActions[0]?.key ?? ""
  }, [filteredActions, selectedKey])

  const selectedAction = React.useMemo<ActionContract | undefined>(() => {
    if (!effectiveSelectedKey) return undefined
    return filteredActions.find((item) => item.key === effectiveSelectedKey) ?? getActionByKey(effectiveSelectedKey)
  }, [effectiveSelectedKey, filteredActions])

  const stats = React.useMemo(() => {
    const placeholderCount = getPlaceholderActions().length
    const auditableCount = getAuditableActions().length
    const intentCounts = groupBy(actionRegistry.map((action) => action.intent))
    const sourceCounts = groupBy(actionRegistry.map((action) => action.source.sourceModule))

    return {
      total: actionRegistry.length,
      placeholders: placeholderCount,
      auditable: auditableCount,
      intentCounts,
      sourceCounts,
    }
  }, [])

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8">
      <Card>
        <CardHeader className="gap-2">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="min-w-0">
              <CardTitle className="text-xl">{t.title}</CardTitle>
              <CardDescription className="mt-1">{t.subtitle}</CardDescription>
            </div>
            <Badge variant="secondary">{currentTheme}</Badge>
          </div>
          <CardDescription>{t.description}</CardDescription>
          <div className="flex flex-wrap gap-2 pt-2">
            <Button asChild variant="outline" size="sm">
              <Link href="/">{t.back}</Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link href="/layout-engine">{t.openLayoutEngine}</Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link href="/components">{t.openComponents}</Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link href="/access-control">{t.openAccessControl}</Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link href="/reports">ME Reports</Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link href="/audit-trail">ME Audit Trail</Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link href="/workflow">ME Workflow</Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link href="/notifications">ME Notifications</Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link href="/rules">ME Rules</Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link href="/packages">ME Packages</Link>
            </Button>
          </div>
        </CardHeader>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        <Card size="sm">
          <CardHeader className="gap-1">
            <CardTitle className="text-sm">{t.stats}</CardTitle>
            <CardDescription className="text-xs">{t.metadataOnly}</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3">
            <div className="grid grid-cols-3 gap-2">
              <div className="rounded-xl bg-muted/40 p-3">
                <div className="text-xs text-muted-foreground">{t.total}</div>
                <div className="text-lg font-semibold">{stats.total}</div>
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
            <div className="flex flex-wrap gap-2 text-xs">
              <Badge variant="outline">{t.noRealEnforcement}</Badge>
              <Badge variant="outline">{t.noRealAudit}</Badge>
              <Badge variant="outline">{t.noRealWorkflow}</Badge>
              <Badge variant="outline">{t.noWrites}</Badge>
            </div>
          </CardContent>
        </Card>

        <Card size="sm" className="md:col-span-2">
          <CardHeader className="gap-2">
            <CardTitle className="text-sm">{t.filters}</CardTitle>
            <CardDescription className="text-xs">{t.selectAction}</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3">
            <Select value={intentFilter} onValueChange={(value) => setIntentFilter(value as ActionIntent | "all")}>
              <SelectTrigger className="h-8 text-xs">
                <SelectValue placeholder={t.intent} />
              </SelectTrigger>
              <SelectContent>
                {intentOptions.map((value) => (
                  <SelectItem key={value} value={value}>
                    {value === "all" ? t.all : value}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sourceModuleFilter} onValueChange={setSourceModuleFilter}>
              <SelectTrigger className="h-8 text-xs">
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

            <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as ActionStatus | "all")}>
              <SelectTrigger className="h-8 text-xs">
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

            {filteredActions.length > 0 ? (
              <Select value={effectiveSelectedKey} onValueChange={setSelectedKey}>
                <SelectTrigger className="h-8 text-xs min-w-[14rem]">
                  <SelectValue placeholder={t.selectAction} />
                </SelectTrigger>
                <SelectContent>
                  {filteredActions.map((action) => (
                    <SelectItem key={action.key} value={action.key}>
                      {currentLocale === "zh" ? action.label.zh : action.label.en}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : null}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card size="sm">
          <CardHeader className="gap-1">
            <CardTitle className="text-sm">{t.preview}</CardTitle>
            <CardDescription className="text-xs">{selectedAction ? selectedAction.key : ""}</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3">
            {selectedAction ? <ActionPreviewCard action={selectedAction} locale={currentLocale} /> : null}
          </CardContent>
        </Card>
        <Card size="sm">
          <CardHeader className="gap-1">
            <CardTitle className="text-sm">{t.sourceMapping}</CardTitle>
            <CardDescription className="text-xs">{selectedAction ? getActionExecutionPreview(selectedAction).actionKey : ""}</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3">
            {selectedAction ? <ActionSourceCard action={selectedAction} locale={currentLocale} /> : null}
          </CardContent>
        </Card>
      </div>

      <Card size="sm">
        <CardHeader className="gap-1">
          <CardTitle className="text-sm">{t.preview}</CardTitle>
          <CardDescription className="text-xs">
            {filteredActions.length} / {actionRegistry.length}
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-2">
          {filteredActions.map((action) => (
            <button
              key={action.key}
              type="button"
              className="text-left"
              onClick={() => setSelectedKey(action.key)}
            >
              <ActionPreviewCard action={action} locale={currentLocale} />
            </button>
          ))}
        </CardContent>
      </Card>
    </main>
  )
}
