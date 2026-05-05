import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { SupportedLocale } from "@/types/module";
import type { WorkflowContract } from "@/types/workflow";

export function WorkflowSourceCard({ workflow, locale }: { workflow: WorkflowContract; locale: SupportedLocale }) {
  return (
    <Card size="sm" className="gap-3">
      <CardHeader className="gap-1">
        <CardTitle className="text-sm">{locale === "zh" ? "Workflow Source Mapping" : "Workflow Source Mapping"}</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-2 text-xs text-muted-foreground">
        <div className="rounded-xl bg-muted/40 p-3">
          <div>sourceModule: {workflow.source.sourceModule}</div>
          <div>sourcePage: {workflow.source.sourcePage}</div>
          <div>sourceComponent: {workflow.source.sourceComponent}</div>
          <div>sourceEvent: {workflow.source.sourceEvent}</div>
          {workflow.source.sourceRoute ? <div>sourceRoute: {workflow.source.sourceRoute}</div> : null}
          {workflow.source.sourceRecordId ? <div>sourceRecordId: {workflow.source.sourceRecordId}</div> : null}
        </div>
        <div className="rounded-xl bg-muted/40 p-3">
          {workflow.source.actionKey ? <div>actionKey: {workflow.source.actionKey}</div> : null}
          {workflow.source.auditEventKey ? <div>auditEventKey: {workflow.source.auditEventKey}</div> : null}
          {workflow.source.accessRuleKey ? <div>accessRuleKey: {workflow.source.accessRuleKey}</div> : null}
          {!workflow.source.actionKey && !workflow.source.auditEventKey && !workflow.source.accessRuleKey ? (
            <div>{locale === "zh" ? "当前来源未关联 action/audit/access 键。" : "No action/audit/access key linkage is currently defined."}</div>
          ) : null}
        </div>
        <div className="rounded-xl border border-dashed border-border bg-muted/20 p-3">
          <div>targetModule: {workflow.target.targetModule ?? "-"}</div>
          <div>targetAction: {workflow.target.targetAction}</div>
          <div>targetRoute: {workflow.target.targetRoute ?? "-"}</div>
          <div>{locale === "zh" ? "用于未来引擎调试映射，不执行真实流程。" : "Used for future engine debugging mappings; no real flow is executed."}</div>
        </div>
      </CardContent>
    </Card>
  );
}
