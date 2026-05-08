"use client";

import Link from "next/link";
import * as React from "react";

import { WorkflowPreviewCard } from "@/components/workflow/workflow-preview-card";
import { WorkflowSourceCard } from "@/components/workflow/workflow-source-card";
import { WorkflowTargetCard } from "@/components/workflow/workflow-target-card";
import { WorkflowTriggerCard } from "@/components/workflow/workflow-trigger-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { workflowRegistry, workflowTargetCatalog } from "@/config/workflow";
import { getHumanConfirmationWorkflows, getPlaceholderWorkflows, getWorkflowByKey, getWorkflowPreview } from "@/lib/workflow";
import { getWorkflowNotificationPreview } from "@/lib/notifications";
import { useUiPreferencesStore } from "@/stores/ui-preferences";
import type { SupportedLocale } from "@/types/module";
import type { WorkflowStatus, WorkflowTargetType, WorkflowTriggerType } from "@/types/workflow";

const copy = {
  en: {
    title: "ME Workflow",
    subtitle: "Trigger Placeholder / Automation Contract Foundation",
    description:
      "Metadata-only workflow trigger and automation contract foundation. No real workflow engine, automation execution, queue, scheduler, task creation, approval creation, API, or backend integration is implemented.",
    all: "All",
    triggerType: "Trigger Type",
    targetType: "Target Type",
    status: "Status",
    sourceModule: "Source Module",
    total: "Total Workflows",
    placeholder: "Placeholder Workflows",
    humanConfirm: "Human-Confirmation Workflows",
  },
  zh: {
    title: "ME Workflow",
    subtitle: "Trigger Placeholder / Automation Contract Foundation",
    description:
      "该页面仅用于工作流触发与自动化合同的元数据预览。不包含真实工作流引擎、自动化执行、队列、调度、任务创建、审批创建、API 或后端接入。",
    all: "全部",
    triggerType: "触发类型",
    targetType: "目标类型",
    status: "状态",
    sourceModule: "来源模块",
    total: "工作流总数",
    placeholder: "占位工作流",
    humanConfirm: "需人工确认工作流",
  },
} as const;

const triggerTypeOptions: Array<WorkflowTriggerType | "all"> = ["all", "action", "audit-event", "access-rule", "schedule", "manual", "system", "placeholder"];
const targetTypeOptions: Array<WorkflowTargetType | "all"> = [
  "all",
  "task",
  "approval",
  "notification",
  "report",
  "webhook-placeholder",
  "api-placeholder",
  "automation-placeholder",
  "human-review",
  "none",
];
const statusOptions: Array<WorkflowStatus | "all"> = ["all", "active", "preview-only", "placeholder", "coming-soon", "blocked", "disabled"];

function groupBy(values: string[]) {
  return values.reduce<Record<string, number>>((acc, value) => {
    acc[value] = (acc[value] ?? 0) + 1;
    return acc;
  }, {});
}

export function WorkflowPage() {
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
  const t = copy[currentLocale];

  const [triggerTypeFilter, setTriggerTypeFilter] = React.useState<WorkflowTriggerType | "all">("all");
  const [targetTypeFilter, setTargetTypeFilter] = React.useState<WorkflowTargetType | "all">("all");
  const [statusFilter, setStatusFilter] = React.useState<WorkflowStatus | "all">("all");
  const [sourceModuleFilter, setSourceModuleFilter] = React.useState<string>("all");
  const [selectedWorkflowKey, setSelectedWorkflowKey] = React.useState<string>(workflowRegistry[0]?.key ?? "");

  const sourceModules = React.useMemo(() => {
    const modules = Array.from(new Set(workflowRegistry.map((workflow) => workflow.source.sourceModule))).sort();
    return ["all", ...modules];
  }, []);

  const filteredWorkflows = React.useMemo(() => {
    return workflowRegistry.filter((workflow) => {
      if (triggerTypeFilter !== "all" && workflow.triggerType !== triggerTypeFilter) return false;
      if (targetTypeFilter !== "all" && workflow.target.targetType !== targetTypeFilter) return false;
      if (statusFilter !== "all" && workflow.status !== statusFilter) return false;
      if (sourceModuleFilter !== "all" && workflow.source.sourceModule !== sourceModuleFilter) return false;
      return true;
    });
  }, [triggerTypeFilter, targetTypeFilter, statusFilter, sourceModuleFilter]);

  const effectiveWorkflowKey = React.useMemo(() => {
    if (selectedWorkflowKey && filteredWorkflows.some((workflow) => workflow.key === selectedWorkflowKey)) return selectedWorkflowKey;
    return filteredWorkflows[0]?.key ?? "";
  }, [filteredWorkflows, selectedWorkflowKey]);

  const selectedWorkflow = React.useMemo(() => {
    if (!effectiveWorkflowKey) return undefined;
    return filteredWorkflows.find((workflow) => workflow.key === effectiveWorkflowKey) ?? getWorkflowByKey(effectiveWorkflowKey);
  }, [effectiveWorkflowKey, filteredWorkflows]);

  const preview = React.useMemo(() => (selectedWorkflow ? getWorkflowPreview(selectedWorkflow) : undefined), [selectedWorkflow]);
  const notificationPreview = React.useMemo(() => (selectedWorkflow ? getWorkflowNotificationPreview(selectedWorkflow) : undefined), [selectedWorkflow]);

  const stats = React.useMemo(() => {
    return {
      total: workflowRegistry.length,
      placeholders: getPlaceholderWorkflows().length,
      humanConfirm: getHumanConfirmationWorkflows().length,
      byTriggerType: groupBy(workflowRegistry.map((workflow) => workflow.triggerType)),
      byTargetType: groupBy(workflowRegistry.map((workflow) => workflow.target.targetType)),
      bySourceModule: groupBy(workflowRegistry.map((workflow) => workflow.source.sourceModule)),
    };
  }, []);

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-8">
      <Card>
        <CardHeader className="gap-2">
          <CardTitle className="text-xl">{t.title}</CardTitle>
          <CardDescription>{t.subtitle}</CardDescription>
          <CardDescription>{t.description}</CardDescription>
          <div className="flex flex-wrap gap-2">
            <Button asChild variant="outline" size="sm"><Link href="/">Back To Dashboard</Link></Button>
            <Button asChild variant="outline" size="sm"><Link href="/action-contracts">ME Action Contracts</Link></Button>
            <Button asChild variant="outline" size="sm"><Link href="/reports">ME Reports</Link></Button>
            <Button asChild variant="outline" size="sm"><Link href="/access-control">ME Access Control</Link></Button>
            <Button asChild variant="outline" size="sm"><Link href="/audit-trail">ME Audit Trail</Link></Button>
            <Button asChild variant="outline" size="sm"><Link href="/layout-engine">ME Layout Engine</Link></Button>
            <Button asChild variant="outline" size="sm"><Link href="/notifications">ME Notifications</Link></Button>
            <Button asChild variant="outline" size="sm"><Link href="/rules">ME Rules</Link></Button>
            <Button asChild variant="outline" size="sm"><Link href="/packages">ME Packages</Link></Button>
          </div>
        </CardHeader>
      </Card>

      <Card size="sm">
        <CardHeader className="gap-1">
          <CardTitle className="text-sm">Workflow Trigger Stats</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3">
          <div className="grid grid-cols-3 gap-2 md:max-w-md">
            <div className="rounded-xl bg-muted/40 p-3"><div className="text-xs text-muted-foreground">{t.total}</div><div className="text-lg font-semibold">{stats.total}</div></div>
            <div className="rounded-xl bg-muted/40 p-3"><div className="text-xs text-muted-foreground">{t.placeholder}</div><div className="text-lg font-semibold">{stats.placeholders}</div></div>
            <div className="rounded-xl bg-muted/40 p-3"><div className="text-xs text-muted-foreground">{t.humanConfirm}</div><div className="text-lg font-semibold">{stats.humanConfirm}</div></div>
          </div>
          <div className="flex flex-wrap gap-1.5 text-xs">{Object.entries(stats.byTriggerType).map(([k, v]) => <Badge key={k} variant="outline">{k}: {v}</Badge>)}</div>
          <div className="flex flex-wrap gap-1.5 text-xs">{Object.entries(stats.byTargetType).map(([k, v]) => <Badge key={k} variant="secondary">{k}: {v}</Badge>)}</div>
          <div className="flex flex-wrap gap-1.5 text-xs">{Object.entries(stats.bySourceModule).map(([k, v]) => <Badge key={k} variant="outline">{k}: {v}</Badge>)}</div>
          <div className="rounded-xl border border-dashed border-border bg-muted/20 p-3 text-xs text-muted-foreground">
            <div>No real workflow engine</div>
            <div>No real automation execution</div>
            <div>No queue/scheduler/background job</div>
            <div>No notification service</div>
            <div>No database/API/backend</div>
            <div>No task/approval creation, session lookup, or middleware</div>
          </div>
        </CardContent>
      </Card>

      <Card size="sm">
        <CardHeader className="gap-1"><CardTitle className="text-sm">Filters</CardTitle></CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Select value={triggerTypeFilter} onValueChange={(value) => setTriggerTypeFilter(value as WorkflowTriggerType | "all")}>
            <SelectTrigger className="h-8 text-xs"><SelectValue placeholder={t.triggerType} /></SelectTrigger>
            <SelectContent>{triggerTypeOptions.map((value) => <SelectItem key={value} value={value}>{value === "all" ? t.all : value}</SelectItem>)}</SelectContent>
          </Select>
          <Select value={targetTypeFilter} onValueChange={(value) => setTargetTypeFilter(value as WorkflowTargetType | "all")}>
            <SelectTrigger className="h-8 text-xs"><SelectValue placeholder={t.targetType} /></SelectTrigger>
            <SelectContent>{targetTypeOptions.map((value) => <SelectItem key={value} value={value}>{value === "all" ? t.all : value}</SelectItem>)}</SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as WorkflowStatus | "all")}>
            <SelectTrigger className="h-8 text-xs"><SelectValue placeholder={t.status} /></SelectTrigger>
            <SelectContent>{statusOptions.map((value) => <SelectItem key={value} value={value}>{value === "all" ? t.all : value}</SelectItem>)}</SelectContent>
          </Select>
          <Select value={sourceModuleFilter} onValueChange={setSourceModuleFilter}>
            <SelectTrigger className="h-8 text-xs"><SelectValue placeholder={t.sourceModule} /></SelectTrigger>
            <SelectContent>{sourceModules.map((value) => <SelectItem key={value} value={value}>{value === "all" ? t.all : value}</SelectItem>)}</SelectContent>
          </Select>
          {filteredWorkflows.length > 0 ? (
            <Select value={effectiveWorkflowKey} onValueChange={setSelectedWorkflowKey}>
              <SelectTrigger className="h-8 text-xs min-w-[16rem]"><SelectValue placeholder="Workflow" /></SelectTrigger>
              <SelectContent>
                {filteredWorkflows.map((workflow) => (
                  <SelectItem key={workflow.key} value={workflow.key}>{currentLocale === "zh" ? workflow.label.zh : workflow.label.en}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : null}
        </CardContent>
      </Card>

      <section className="grid gap-4 md:grid-cols-2">
        <Card size="sm">
          <CardHeader className="gap-1"><CardTitle className="text-sm">Workflow Trigger Catalog</CardTitle><CardDescription className="text-xs">{filteredWorkflows.length} / {workflowRegistry.length}</CardDescription></CardHeader>
          <CardContent className="grid gap-3">
            {filteredWorkflows.map((workflow) => (
              <button key={workflow.key} type="button" className="text-left" onClick={() => setSelectedWorkflowKey(workflow.key)}>
                <WorkflowTriggerCard workflow={workflow} locale={currentLocale} />
              </button>
            ))}
          </CardContent>
        </Card>
        <div className="grid gap-4">
          {preview ? <WorkflowPreviewCard preview={preview} locale={currentLocale} notificationPreview={notificationPreview} /> : null}
          {selectedWorkflow ? <WorkflowSourceCard workflow={selectedWorkflow} locale={currentLocale} /> : null}
          {selectedWorkflow ? (
            <Card size="sm">
              <CardHeader className="gap-1"><CardTitle className="text-sm">Related Contract Keys</CardTitle></CardHeader>
              <CardContent className="text-xs text-muted-foreground">
                {selectedWorkflow.source.actionKey ? <div>ActionContract key: {selectedWorkflow.source.actionKey}</div> : null}
                {selectedWorkflow.source.auditEventKey ? <div>AuditEventContract key: {selectedWorkflow.source.auditEventKey}</div> : null}
                {selectedWorkflow.source.accessRuleKey ? <div>AccessRule key: {selectedWorkflow.source.accessRuleKey}</div> : null}
                {notificationPreview ? <div>NotificationContract key: {notificationPreview.notificationKey}</div> : null}
                {!selectedWorkflow.source.actionKey && !selectedWorkflow.source.auditEventKey && !selectedWorkflow.source.accessRuleKey ? (
                  <div>{currentLocale === "zh" ? "当前 workflow 未绑定 action/audit/access 键。" : "This workflow has no action/audit/access key linkage."}</div>
                ) : null}
              </CardContent>
            </Card>
          ) : null}
        </div>
      </section>

      <Card size="sm">
        <CardHeader className="gap-1"><CardTitle className="text-sm">Workflow Target Catalog Preview</CardTitle></CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-2">
          {workflowTargetCatalog.map((target) => <WorkflowTargetCard key={target.code} target={target} locale={currentLocale} />)}
        </CardContent>
      </Card>
    </main>
  );
}
