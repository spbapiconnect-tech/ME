"use client";

import Link from "next/link";
import * as React from "react";

import { RuleCard } from "@/components/rules/rule-card";
import { RuleGroupCard } from "@/components/rules/rule-group-card";
import { RulePreviewCard } from "@/components/rules/rule-preview-card";
import { RuleSourceCard } from "@/components/rules/rule-source-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ruleContracts, ruleGroups } from "@/config/rules";
import {
  getHumanReviewRules,
  getNotificationRules,
  getPlaceholderRules,
  getRuleByKey,
  getTaskCreationRules,
  getWorkflowTriggerRules,
} from "@/lib/rules";
import { useUiPreferencesStore } from "@/stores/ui-preferences";
import type { SupportedLocale } from "@/types/module";
import type { RuleSeverity, RuleStatus, RuleType } from "@/types/rule";

const typeOptions: Array<RuleType | "all"> = [
  "all",
  "formula",
  "threshold",
  "condition",
  "score",
  "risk",
  "sla",
  "validation",
  "recommendation",
  "escalation",
  "placeholder",
];

const statusOptions: Array<RuleStatus | "all"> = ["all", "active", "preview-only", "placeholder", "coming-soon", "blocked", "disabled"];
const severityOptions: Array<RuleSeverity | "all"> = ["all", "neutral", "low", "medium", "high", "critical"];

function groupBy(values: string[]) {
  return values.reduce<Record<string, number>>((acc, value) => {
    acc[value] = (acc[value] ?? 0) + 1;
    return acc;
  }, {});
}

export function RulesPage() {
  const locale = useUiPreferencesStore((state) => state.locale);
  const theme = useUiPreferencesStore((state) => state.theme);
  const hydrated = useUiPreferencesStore((state) => state.hydrated);
  const hydrate = useUiPreferencesStore((state) => state.hydrate);

  React.useEffect(() => {
    hydrate();
  }, [hydrate]);

  React.useEffect(() => {
    if (!hydrated) return;
    document.documentElement.dataset.theme = theme;
    document.documentElement.lang = locale === "zh" ? "zh-CN" : "en";
  }, [hydrated, locale, theme]);

  const currentLocale: SupportedLocale = hydrated ? locale : "en";

  const [typeFilter, setTypeFilter] = React.useState<RuleType | "all">("all");
  const [sourceModuleFilter, setSourceModuleFilter] = React.useState<string>("all");
  const [statusFilter, setStatusFilter] = React.useState<RuleStatus | "all">("all");
  const [severityFilter, setSeverityFilter] = React.useState<RuleSeverity | "all">("all");
  const [selectedRuleKey, setSelectedRuleKey] = React.useState<string>(ruleContracts[0]?.key ?? "");

  const sourceModules = React.useMemo(() => {
    const modules = Array.from(new Set(ruleContracts.map((item) => item.source.sourceModule))).sort();
    return ["all", ...modules];
  }, []);

  const filteredRules = React.useMemo(() => {
    return ruleContracts.filter((item) => {
      if (typeFilter !== "all" && item.ruleType !== typeFilter) return false;
      if (sourceModuleFilter !== "all" && item.source.sourceModule !== sourceModuleFilter) return false;
      if (statusFilter !== "all" && item.status !== statusFilter) return false;
      if (severityFilter !== "all" && item.severity !== severityFilter) return false;
      return true;
    });
  }, [typeFilter, sourceModuleFilter, statusFilter, severityFilter]);

  const selectedRule = React.useMemo(() => {
    if (!selectedRuleKey) return undefined;
    return filteredRules.find((item) => item.key === selectedRuleKey) ?? getRuleByKey(selectedRuleKey);
  }, [filteredRules, selectedRuleKey]);

  const stats = React.useMemo(() => {
    return {
      total: ruleContracts.length,
      active: ruleContracts.filter((item) => item.status === "active").length,
      placeholder: getPlaceholderRules().length,
      humanReview: getHumanReviewRules().length,
      workflowTrigger: getWorkflowTriggerRules().length,
      notifications: getNotificationRules().length,
      tasks: getTaskCreationRules().length,
      byType: groupBy(ruleContracts.map((item) => item.ruleType)),
      bySourceModule: groupBy(ruleContracts.map((item) => item.source.sourceModule)),
    };
  }, []);

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-8">
      <Card>
        <CardHeader className="gap-2">
          <CardTitle className="text-xl">ME Rules</CardTitle>
          <CardDescription>Formula / Rule Placeholder Contract Foundation</CardDescription>
          <CardDescription>
            {currentLocale === "zh"
              ? "该页面仅用于规则/公式合同元数据预览，不执行真实规则引擎、公式计算、SQL/数据库查询、API/后端、自动化、任务创建、通知发送或会话查询。"
              : "Metadata-only rule/formula contract preview. No real rules engine, formula execution, SQL/database query, API/backend, automation, task creation, notification delivery, or session lookup."}
          </CardDescription>
          <div className="flex flex-wrap gap-2">
            <Button asChild variant="outline" size="sm"><Link href="/">Back To Dashboard</Link></Button>
            <Button asChild variant="outline" size="sm"><Link href="/reports">ME Reports</Link></Button>
            <Button asChild variant="outline" size="sm"><Link href="/notifications">ME Notifications</Link></Button>
            <Button asChild variant="outline" size="sm"><Link href="/workflow">ME Workflow</Link></Button>
            <Button asChild variant="outline" size="sm"><Link href="/action-contracts">ME Action Contracts</Link></Button>
            <Button asChild variant="outline" size="sm"><Link href="/access-control">ME Access Control</Link></Button>
            <Button asChild variant="outline" size="sm"><Link href="/audit-trail">ME Audit Trail</Link></Button>
          </div>
        </CardHeader>
      </Card>

      <Card size="sm">
        <CardHeader className="gap-1"><CardTitle className="text-sm">Rule Stats</CardTitle></CardHeader>
        <CardContent className="grid gap-3">
          <div className="grid grid-cols-2 gap-2 md:grid-cols-7">
            <div className="rounded-xl bg-muted/40 p-3"><div className="text-xs text-muted-foreground">Total</div><div className="text-lg font-semibold">{stats.total}</div></div>
            <div className="rounded-xl bg-muted/40 p-3"><div className="text-xs text-muted-foreground">Active</div><div className="text-lg font-semibold">{stats.active}</div></div>
            <div className="rounded-xl bg-muted/40 p-3"><div className="text-xs text-muted-foreground">Placeholder</div><div className="text-lg font-semibold">{stats.placeholder}</div></div>
            <div className="rounded-xl bg-muted/40 p-3"><div className="text-xs text-muted-foreground">Human Review</div><div className="text-lg font-semibold">{stats.humanReview}</div></div>
            <div className="rounded-xl bg-muted/40 p-3"><div className="text-xs text-muted-foreground">Workflow Trigger</div><div className="text-lg font-semibold">{stats.workflowTrigger}</div></div>
            <div className="rounded-xl bg-muted/40 p-3"><div className="text-xs text-muted-foreground">Notification</div><div className="text-lg font-semibold">{stats.notifications}</div></div>
            <div className="rounded-xl bg-muted/40 p-3"><div className="text-xs text-muted-foreground">Task Creation</div><div className="text-lg font-semibold">{stats.tasks}</div></div>
          </div>
          <div className="flex flex-wrap gap-1.5 text-xs">{Object.entries(stats.byType).map(([key, value]) => <Badge key={key} variant="secondary">{key}: {value}</Badge>)}</div>
          <div className="flex flex-wrap gap-1.5 text-xs">{Object.entries(stats.bySourceModule).map(([key, value]) => <Badge key={key} variant="outline">{key}: {value}</Badge>)}</div>
        </CardContent>
      </Card>

      <Card size="sm">
        <CardHeader className="gap-1"><CardTitle className="text-sm">Filters</CardTitle></CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Select value={typeFilter} onValueChange={(value) => setTypeFilter(value as RuleType | "all")}>
            <SelectTrigger size="sm"><SelectValue placeholder="Rule Type" /></SelectTrigger>
            <SelectContent>{typeOptions.map((value) => <SelectItem key={value} value={value}>{value}</SelectItem>)}</SelectContent>
          </Select>
          <Select value={sourceModuleFilter} onValueChange={setSourceModuleFilter}>
            <SelectTrigger size="sm"><SelectValue placeholder="Source Module" /></SelectTrigger>
            <SelectContent>{sourceModules.map((value) => <SelectItem key={value} value={value}>{value}</SelectItem>)}</SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as RuleStatus | "all")}>
            <SelectTrigger size="sm"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>{statusOptions.map((value) => <SelectItem key={value} value={value}>{value}</SelectItem>)}</SelectContent>
          </Select>
          <Select value={severityFilter} onValueChange={(value) => setSeverityFilter(value as RuleSeverity | "all")}>
            <SelectTrigger size="sm"><SelectValue placeholder="Severity" /></SelectTrigger>
            <SelectContent>{severityOptions.map((value) => <SelectItem key={value} value={value}>{value}</SelectItem>)}</SelectContent>
          </Select>
        </CardContent>
      </Card>

      <section className="grid gap-4 md:grid-cols-2">
        <Card size="sm">
          <CardHeader className="gap-1"><CardTitle className="text-sm">Rule Catalog</CardTitle><CardDescription className="text-xs">{filteredRules.length} / {ruleContracts.length}</CardDescription></CardHeader>
          <CardContent className="grid gap-3">
            {filteredRules.map((item) => (
              <button key={item.key} type="button" className="text-left" onClick={() => setSelectedRuleKey(item.key)}>
                <RuleCard rule={item} locale={currentLocale} />
              </button>
            ))}
          </CardContent>
        </Card>
        <div className="grid gap-4">
          {selectedRule ? <RulePreviewCard rule={selectedRule} locale={currentLocale} /> : null}
          {selectedRule ? <RuleSourceCard rule={selectedRule} locale={currentLocale} /> : null}
          {selectedRule ? (
            <Card size="sm">
              <CardHeader className="gap-1"><CardTitle className="text-sm">Related Contract Keys</CardTitle></CardHeader>
              <CardContent className="text-xs text-muted-foreground">
                {selectedRule.source.reportWidgetKey ? <div>ReportWidgetContract key: {selectedRule.source.reportWidgetKey}</div> : null}
                {selectedRule.source.notificationKey ? <div>NotificationContract key: {selectedRule.source.notificationKey}</div> : null}
                {selectedRule.source.workflowKey ? <div>WorkflowContract key: {selectedRule.source.workflowKey}</div> : null}
                {selectedRule.source.actionKey ? <div>ActionContract key: {selectedRule.source.actionKey}</div> : null}
                {selectedRule.source.accessRuleKey ? <div>AccessRule key: {selectedRule.source.accessRuleKey}</div> : null}
                {selectedRule.source.auditEventKey ? <div>AuditEventContract key: {selectedRule.source.auditEventKey}</div> : null}
              </CardContent>
            </Card>
          ) : null}
        </div>
      </section>

      <Card size="sm">
        <CardHeader className="gap-1"><CardTitle className="text-sm">Rule Group Catalog</CardTitle></CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-2">
          {ruleGroups.map((group) => <RuleGroupCard key={group.key} group={group} locale={currentLocale} />)}
        </CardContent>
      </Card>
    </main>
  );
}
