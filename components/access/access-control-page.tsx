"use client"

import Link from "next/link"
import * as React from "react"

import { AccessPreviewCard } from "@/components/access/access-preview-card"
import { MeDashboardShell, MePageHeader } from "@/components/layout"
import { AccessRuleCard } from "@/components/access/access-rule-card"
import { PlanCard } from "@/components/access/plan-card"
import { RoleCard } from "@/components/access/role-card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { actionRegistry } from "@/config/actions"
import { accessRules, planRegistry, roleRegistry } from "@/config/access"
import { getAccessPreview, getActionAccessPreview } from "@/lib/access"
import { getAccessNotificationPreview, getActionNotificationPreview } from "@/lib/notifications"
import { getAccessAuditPreview, getActionAuditPreview } from "@/lib/audit"
import { getAccessWorkflowPreview, getActionWorkflowPreview } from "@/lib/workflow"
import { useUiPreferencesStore } from "@/stores/ui-preferences"
import type { AccessScope, AccessStatus } from "@/types/access-control"
import type { SupportedLocale } from "@/types/module"

const copy = {
  en: {
    title: "ME Access Control",
    subtitle: "Permission Placeholder / Role Access Contract",
    desc: "Metadata-only access contracts for permission, role, plan, and placeholder status. No real authentication or authorization is implemented.",
    all: "All",
    role: "Role",
    plan: "Plan",
    scope: "Scope",
    status: "Status",
    module: "Module",
    action: "Action",
    stats: "Access Rule Stats",
    total: "Total",
    placeholder: "Placeholder",
    auditable: "Auditable",
    metadata: "Metadata Only",
    noAuth: "No login/session/auth middleware",
    noApi: "No API/database integration",
    noHide: "No production hiding/enforcement",
    openActionContracts: "Open Action Contracts",
    openLayoutEngine: "Open Layout Engine",
    back: "Back To Dashboard",
  },
  zh: {
    title: "ME Access Control",
    subtitle: "Permission Placeholder / Role Access Contract",
    desc: "该页面用于权限、角色、方案和占位状态的元数据合同预览，不包含真实认证或鉴权实现。",
    all: "全部",
    role: "角色",
    plan: "方案",
    scope: "范围",
    status: "状态",
    module: "模块",
    action: "动作",
    stats: "访问规则统计",
    total: "总规则",
    placeholder: "占位规则",
    auditable: "需审计",
    metadata: "仅元数据",
    noAuth: "不包含登录/会话/中间件鉴权",
    noApi: "不包含 API/数据库集成",
    noHide: "不包含生产隐藏或拦截",
    openActionContracts: "打开 Action Contracts",
    openLayoutEngine: "打开布局引擎",
    back: "返回 Dashboard",
  },
} as const

const scopeOptions: Array<AccessScope | "all"> = ["all", "module", "page", "action", "record", "field"]
const statusOptions: Array<AccessStatus | "all"> = ["all", "allowed", "blocked", "placeholder", "coming-soon", "hidden"]

export function AccessControlPage() {
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

  const [roleFilter, setRoleFilter] = React.useState<string>("all")
  const [planFilter, setPlanFilter] = React.useState<string>("all")
  const [scopeFilter, setScopeFilter] = React.useState<AccessScope | "all">("all")
  const [statusFilter, setStatusFilter] = React.useState<AccessStatus | "all">("all")
  const [moduleFilter, setModuleFilter] = React.useState<string>("all")
  const [selectedRuleKey, setSelectedRuleKey] = React.useState<string>(accessRules[0]?.key ?? "")
  const [selectedActionKey, setSelectedActionKey] = React.useState<string>(actionRegistry[0]?.key ?? "")

  const moduleOptions = React.useMemo(() => {
    const options = new Set<string>()
    accessRules.forEach((rule) => {
      if (rule.targetModule) options.add(rule.targetModule)
      if (rule.condition.requiredModule) options.add(rule.condition.requiredModule)
    })
    return ["all", ...Array.from(options).sort()]
  }, [])

  const filteredRules = React.useMemo(() => {
    return accessRules.filter((rule) => {
      if (roleFilter !== "all" && rule.condition.requiredRole !== roleFilter) return false
      if (planFilter !== "all" && rule.condition.requiredPlan !== planFilter) return false
      if (scopeFilter !== "all" && rule.scope !== scopeFilter) return false
      if (statusFilter !== "all" && rule.status !== statusFilter) return false
      if (moduleFilter !== "all" && rule.targetModule !== moduleFilter && rule.condition.requiredModule !== moduleFilter) return false
      return true
    })
  }, [roleFilter, planFilter, scopeFilter, statusFilter, moduleFilter])

  const effectiveRule = React.useMemo(() => {
    return filteredRules.find((rule) => rule.key === selectedRuleKey) ?? filteredRules[0]
  }, [filteredRules, selectedRuleKey])

  const rulePreview = React.useMemo(() => (effectiveRule ? getAccessPreview(effectiveRule) : undefined), [effectiveRule])
  const actionPreview = React.useMemo(() => (selectedActionKey ? getActionAccessPreview(selectedActionKey) : undefined), [selectedActionKey])
  const ruleAuditPreview = React.useMemo(() => (effectiveRule ? getAccessAuditPreview(effectiveRule.key) : undefined), [effectiveRule])
  const actionAuditPreview = React.useMemo(() => (selectedActionKey ? getActionAuditPreview(selectedActionKey) : undefined), [selectedActionKey])
  const ruleWorkflowPreview = React.useMemo(() => (effectiveRule ? getAccessWorkflowPreview(effectiveRule.key) : undefined), [effectiveRule])
  const actionWorkflowPreview = React.useMemo(() => (selectedActionKey ? getActionWorkflowPreview(selectedActionKey) : undefined), [selectedActionKey])
  const ruleNotificationPreview = React.useMemo(() => (effectiveRule ? getAccessNotificationPreview(effectiveRule.key) : undefined), [effectiveRule])
  const actionNotificationPreview = React.useMemo(() => (selectedActionKey ? getActionNotificationPreview(selectedActionKey) : undefined), [selectedActionKey])

  const stats = React.useMemo(() => {
    const placeholder = accessRules.filter((rule) => rule.status === "placeholder" || rule.status === "coming-soon" || rule.condition.isPlaceholder).length
    const auditable = accessRules.filter((rule) => rule.condition.requiresAudit).length
    const byScope = accessRules.reduce<Record<string, number>>((acc, rule) => {
      acc[rule.scope] = (acc[rule.scope] ?? 0) + 1
      return acc
    }, {})
    const byModule = accessRules.reduce<Record<string, number>>((acc, rule) => {
      const key = rule.targetModule ?? rule.condition.requiredModule ?? "global"
      acc[key] = (acc[key] ?? 0) + 1
      return acc
    }, {})

    return {
      total: accessRules.length,
      placeholder,
      auditable,
      byScope,
      byModule,
    }
  }, [])

  return (
    <MeDashboardShell activeKey="access-control">
      <MePageHeader
        eyebrow={currentLocale === "zh" ? "权限 / 治理" : "Access / Governance"}
        title={t.title}
        description={t.subtitle}
        notice={t.desc}
        badges={[
          { label: t.metadata, variant: "secondary" },
          { label: t.noAuth, variant: "outline" },
          { label: t.noApi, variant: "outline" },
          { label: t.noHide, variant: "outline" },
        ]}
        actions={
          <>
            <Button asChild variant="outline" size="sm"><Link href="/">{t.back}</Link></Button>
            <Button asChild variant="outline" size="sm"><Link href="/action-contracts">{t.openActionContracts}</Link></Button>
            <Button asChild variant="outline" size="sm"><Link href="/layout-engine">{t.openLayoutEngine}</Link></Button>
            <Button asChild variant="outline" size="sm"><Link href="/audit-trail">ME Audit Trail</Link></Button>
            <Button asChild variant="outline" size="sm"><Link href="/workflow">ME Workflow</Link></Button>
            <Button asChild variant="outline" size="sm"><Link href="/reports">ME Reports</Link></Button>
            <Button asChild variant="outline" size="sm"><Link href="/notifications">ME Notifications</Link></Button>
            <Button asChild variant="outline" size="sm"><Link href="/rules">ME Rules</Link></Button>
            <Button asChild variant="outline" size="sm"><Link href="/packages">ME Packages</Link></Button>
          </>
        }
      />

      <Card size="sm">
        <CardHeader className="gap-1">
          <CardTitle className="text-sm">{t.stats}</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3">
          <div className="grid grid-cols-3 gap-2 md:max-w-md">
            <div className="rounded-xl bg-muted/40 p-3"><div className="text-xs text-muted-foreground">{t.total}</div><div className="text-lg font-semibold">{stats.total}</div></div>
            <div className="rounded-xl bg-muted/40 p-3"><div className="text-xs text-muted-foreground">{t.placeholder}</div><div className="text-lg font-semibold">{stats.placeholder}</div></div>
            <div className="rounded-xl bg-muted/40 p-3"><div className="text-xs text-muted-foreground">{t.auditable}</div><div className="text-lg font-semibold">{stats.auditable}</div></div>
          </div>
          <div className="flex flex-wrap gap-1.5 text-xs">
            {Object.entries(stats.byScope).map(([scope, count]) => <Badge key={scope} variant="outline">{scope}: {count}</Badge>)}
          </div>
          <div className="flex flex-wrap gap-1.5 text-xs">
            {Object.entries(stats.byModule).map(([module, count]) => <Badge key={module} variant="secondary">{module}: {count}</Badge>)}
          </div>
          <div className="flex flex-wrap gap-1.5 text-xs">
            <Badge variant="outline">{t.metadata}</Badge>
            <Badge variant="outline">{t.noAuth}</Badge>
            <Badge variant="outline">{t.noApi}</Badge>
            <Badge variant="outline">{t.noHide}</Badge>
          </div>
        </CardContent>
      </Card>

      <Card size="sm">
        <CardHeader className="gap-1"><CardTitle className="text-sm">Filters</CardTitle></CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="h-8 text-xs"><SelectValue placeholder={t.role} /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t.all}</SelectItem>
              {roleRegistry.map((role) => <SelectItem key={role.code} value={role.code}>{currentLocale === "zh" ? role.name.zh : role.name.en}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={planFilter} onValueChange={setPlanFilter}>
            <SelectTrigger className="h-8 text-xs"><SelectValue placeholder={t.plan} /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t.all}</SelectItem>
              {planRegistry.map((plan) => <SelectItem key={plan.code} value={plan.code}>{currentLocale === "zh" ? plan.name.zh : plan.name.en}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={scopeFilter} onValueChange={(value) => setScopeFilter(value as AccessScope | "all") }>
            <SelectTrigger className="h-8 text-xs"><SelectValue placeholder={t.scope} /></SelectTrigger>
            <SelectContent>
              {scopeOptions.map((scope) => <SelectItem key={scope} value={scope}>{scope === "all" ? t.all : scope}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as AccessStatus | "all") }>
            <SelectTrigger className="h-8 text-xs"><SelectValue placeholder={t.status} /></SelectTrigger>
            <SelectContent>
              {statusOptions.map((status) => <SelectItem key={status} value={status}>{status === "all" ? t.all : status}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={moduleFilter} onValueChange={setModuleFilter}>
            <SelectTrigger className="h-8 text-xs"><SelectValue placeholder={t.module} /></SelectTrigger>
            <SelectContent>
              {moduleOptions.map((module) => <SelectItem key={module} value={module}>{module === "all" ? t.all : module}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={selectedActionKey} onValueChange={setSelectedActionKey}>
            <SelectTrigger className="h-8 text-xs min-w-[14rem]"><SelectValue placeholder={t.action} /></SelectTrigger>
            <SelectContent>
              {actionRegistry.map((action) => <SelectItem key={action.key} value={action.key}>{currentLocale === "zh" ? action.label.zh : action.label.en}</SelectItem>)}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <section className="grid gap-4 md:grid-cols-2">
        <Card size="sm">
          <CardHeader className="gap-1"><CardTitle className="text-sm">Role Registry</CardTitle></CardHeader>
          <CardContent className="grid gap-3">
            {roleRegistry.map((role) => <RoleCard key={role.code} role={role} locale={currentLocale} />)}
          </CardContent>
        </Card>
        <Card size="sm">
          <CardHeader className="gap-1"><CardTitle className="text-sm">Plan Registry</CardTitle></CardHeader>
          <CardContent className="grid gap-3">
            {planRegistry.map((plan) => <PlanCard key={plan.code} plan={plan} locale={currentLocale} />)}
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <Card size="sm">
          <CardHeader className="gap-1"><CardTitle className="text-sm">Access Rules</CardTitle><CardDescription className="text-xs">{filteredRules.length} / {accessRules.length}</CardDescription></CardHeader>
          <CardContent className="grid gap-3">
            {filteredRules.map((rule) => (
              <button key={rule.key} type="button" className="text-left" onClick={() => setSelectedRuleKey(rule.key)}>
                <AccessRuleCard rule={rule} locale={currentLocale} />
              </button>
            ))}
          </CardContent>
        </Card>
        <div className="grid gap-4">
          {rulePreview ? <AccessPreviewCard preview={rulePreview} locale={currentLocale} auditPreview={ruleAuditPreview} workflowPreview={ruleWorkflowPreview} notificationPreview={ruleNotificationPreview} /> : null}
          {actionPreview ? <AccessPreviewCard preview={actionPreview} locale={currentLocale} auditPreview={actionAuditPreview} workflowPreview={actionWorkflowPreview} notificationPreview={actionNotificationPreview} /> : null}
        </div>
      </section>
    </MeDashboardShell>
  )
}
