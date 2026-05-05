import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { resolveRuleDescription, resolveRuleTitle } from "@/lib/rules";
import type { SupportedLocale } from "@/types/module";
import type { RuleContract } from "@/types/rule";

import { RuleChip } from "./rule-chip";

export function RuleCard({ rule, locale }: { rule: RuleContract; locale: SupportedLocale }) {
  const title = resolveRuleTitle(rule, locale);
  const description = resolveRuleDescription(rule, locale);

  return (
    <Card size="sm" className="gap-2">
      <CardHeader className="gap-1">
        <CardTitle className="text-sm">{title}</CardTitle>
        <CardDescription className="text-xs">{rule.key}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-2 text-xs text-muted-foreground">
        {description ? <div>{description}</div> : null}
        <div className="flex flex-wrap gap-1.5">
          <RuleChip kind="type" locale={locale} ruleType={rule.ruleType} />
          <RuleChip kind="status" locale={locale} status={rule.status} />
          <RuleChip kind="severity" locale={locale} severity={rule.severity} />
        </div>
        <div>{locale === "zh" ? "来源模块" : "Source Module"}: {rule.source.sourceModule}</div>
        <div className="grid grid-cols-3 gap-2">
          <div>{locale === "zh" ? "输入" : "Inputs"}: {rule.inputs.length}</div>
          <div>{locale === "zh" ? "输出" : "Outputs"}: {rule.outputs.length}</div>
          <div>{locale === "zh" ? "条件" : "Conditions"}: {rule.conditions.length}</div>
        </div>
        <div className="rounded-xl bg-muted/40 p-3">
          <div>{locale === "zh" ? "需审计" : "Audit"}: {String(rule.requirement.auditRequired)}</div>
          <div>{locale === "zh" ? "人工复核" : "Human Review"}: {String(rule.requirement.humanReviewRequired)}</div>
          <div>{locale === "zh" ? "可触发流程" : "Workflow Trigger"}: {String(rule.requirement.canTriggerWorkflow)}</div>
          <div>{locale === "zh" ? "可发送通知" : "Notification"}: {String(rule.requirement.canSendNotification)}</div>
          <div>{locale === "zh" ? "可创建任务" : "Task Creation"}: {String(rule.requirement.canCreateTask)}</div>
        </div>
        {rule.sampleExpression ? <div>{locale === "zh" ? "样例表达式" : "Sample Expression"}: {rule.sampleExpression}</div> : null}
        {rule.requirement.isPlaceholder ? (
          <div className="rounded-xl border border-dashed border-border bg-muted/20 p-3">
            {locale === "zh" ? "该规则为占位合同，不执行真实规则/公式计算。" : "This rule is a placeholder contract and performs no real rule/formula evaluation."}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
