import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { WorkflowChip } from "@/components/workflow/workflow-chip";
import { resolveWorkflowDescription, resolveWorkflowLabel } from "@/lib/workflow";
import type { SupportedLocale } from "@/types/module";
import type { WorkflowContract } from "@/types/workflow";

export function WorkflowTriggerCard({ workflow, locale }: { workflow: WorkflowContract; locale: SupportedLocale }) {
  const label = resolveWorkflowLabel(workflow, locale);
  const description = resolveWorkflowDescription(workflow, locale);

  return (
    <Card size="sm" className="gap-3">
      <CardHeader className="gap-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <CardTitle className="text-sm">{label}</CardTitle>
          <div className="flex flex-wrap gap-1.5">
            <WorkflowChip kind="trigger" locale={locale} triggerType={workflow.triggerType} />
            <WorkflowChip kind="target" locale={locale} targetType={workflow.target.targetType} />
            <WorkflowChip kind="status" locale={locale} status={workflow.status} />
            <WorkflowChip kind="severity" locale={locale} severity={workflow.severity} />
          </div>
        </div>
        <CardDescription className="text-xs">{workflow.key}</CardDescription>
        {description ? <CardDescription className="text-xs">{description}</CardDescription> : null}
      </CardHeader>
      <CardContent className="grid gap-2 text-xs text-muted-foreground">
        <div className="rounded-xl bg-muted/40 p-3">
          <div>{locale === "zh" ? "来源模块" : "Source Module"}: {workflow.source.sourceModule}</div>
          <div>{locale === "zh" ? "来源页面" : "Source Page"}: {workflow.source.sourcePage}</div>
          <div>{locale === "zh" ? "来源组件" : "Source Component"}: {workflow.source.sourceComponent}</div>
          <div>{locale === "zh" ? "来源事件" : "Source Event"}: {workflow.source.sourceEvent}</div>
          {workflow.source.actionKey ? <div>actionKey: {workflow.source.actionKey}</div> : null}
          {workflow.source.auditEventKey ? <div>auditEventKey: {workflow.source.auditEventKey}</div> : null}
          {workflow.source.accessRuleKey ? <div>accessRuleKey: {workflow.source.accessRuleKey}</div> : null}
        </div>
        <div className="rounded-xl bg-muted/40 p-3">
          <div>{locale === "zh" ? "目标动作" : "Target Action"}: {workflow.target.targetAction}</div>
          {workflow.target.targetModule ? <div>{locale === "zh" ? "目标模块" : "Target Module"}: {workflow.target.targetModule}</div> : null}
          {workflow.target.targetRoute ? <div>{locale === "zh" ? "目标路由" : "Target Route"}: {workflow.target.targetRoute}</div> : null}
          {workflow.target.targetOwnerRole ? <div>{locale === "zh" ? "目标角色" : "Target Role"}: {workflow.target.targetOwnerRole}</div> : null}
        </div>
        <div className="rounded-xl border border-dashed border-border bg-muted/20 p-3">
          <div>{locale === "zh" ? "需人工确认" : "Human Confirmation"}: {String(workflow.requirement.humanConfirmationRequired)}</div>
          <div>{locale === "zh" ? "需审计" : "Audit Required"}: {String(workflow.requirement.auditRequired)}</div>
          {workflow.requirement.permissionRequired ? <div>{locale === "zh" ? "权限" : "Permission"}: {workflow.requirement.permissionRequired}</div> : null}
          {workflow.requirement.roleRequired ? <div>{locale === "zh" ? "角色" : "Role"}: {workflow.requirement.roleRequired}</div> : null}
          {workflow.requirement.planRequired ? <div>{locale === "zh" ? "方案" : "Plan"}: {workflow.requirement.planRequired}</div> : null}
          {workflow.isPlaceholder ? <div>{locale === "zh" ? "占位合同：是" : "Placeholder Contract: yes"}</div> : null}
        </div>
      </CardContent>
    </Card>
  );
}
