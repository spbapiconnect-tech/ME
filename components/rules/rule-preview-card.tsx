import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getPackagesByFeatureKey, getPackagesByModule } from "@/lib/packages";
import { getRulePreview } from "@/lib/rules";
import type { SupportedLocale } from "@/types/module";
import type { RuleContract } from "@/types/rule";

import { RuleChip } from "./rule-chip";

export function RulePreviewCard({ rule, locale }: { rule: RuleContract; locale: SupportedLocale }) {
  const preview = getRulePreview(rule);
  const packages = [...getPackagesByFeatureKey(rule.key), ...getPackagesByModule(rule.source.sourceModule)].filter((item, idx, arr) => arr.findIndex((v) => v.key === item.key) === idx);

  return (
    <Card size="sm" className="gap-2">
      <CardHeader className="gap-1">
        <CardTitle className="text-sm">{locale === "zh" ? "规则预览" : "Rule Preview"}</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-2 text-xs text-muted-foreground">
        <div className="flex flex-wrap gap-1.5">
          <Badge variant={preview.canEvaluate ? "default" : "outline"}>
            {preview.canEvaluate ? (locale === "zh" ? "可评估（元数据）" : "Evaluable (metadata)") : (locale === "zh" ? "不可评估" : "Not Evaluable")}
          </Badge>
          <RuleChip kind="status" locale={locale} status={preview.status} />
          <RuleChip kind="severity" locale={locale} severity={preview.severity} />
        </div>
        <div>{locale === "zh" ? preview.reason.zh : preview.reason.en}</div>
        {rule.sampleExplanation ? <div>{locale === "zh" ? rule.sampleExplanation.zh : rule.sampleExplanation.en}</div> : null}
        <div className="rounded-xl bg-muted/40 p-3">
          <div>{locale === "zh" ? "需审计" : "Audit Required"}: {String(preview.auditRequired)}</div>
          <div>{locale === "zh" ? "人工复核" : "Human Review"}: {String(preview.humanReviewRequired)}</div>
          <div>{locale === "zh" ? "可触发流程" : "Can Trigger Workflow"}: {String(preview.canTriggerWorkflow)}</div>
          <div>{locale === "zh" ? "可发送通知" : "Can Send Notification"}: {String(preview.canSendNotification)}</div>
          <div>{locale === "zh" ? "可创建任务" : "Can Create Task"}: {String(preview.canCreateTask)}</div>
        </div>
        <div className="rounded-xl border border-dashed border-border bg-muted/20 p-3">
          {locale === "zh"
            ? "说明：规则预览仅为元数据用途，不执行真实规则引擎、公式引擎、自动化、任务创建、通知发送、SQL、数据库或 API。"
            : "Notice: rule preview is metadata-only and does not execute real rule engine, formula engine, automation, task creation, notification delivery, SQL, database, or API."}
        </div>
        {packages.length > 0 ? (
          <div className="rounded-xl bg-muted/40 p-3">
            <div className="font-medium text-foreground/80">{locale === "zh" ? "关联方案" : "Linked Packages"}</div>
            {packages.map((item) => <div key={item.key}>{item.key}</div>)}
            <div>{locale === "zh" ? "仅方案元数据映射，不执行订阅或门禁。" : "Package metadata mapping only; no subscription or plan guard is executed."}</div>
          </div>
        ) : null}
        {preview.placeholderNotice ? <div>{locale === "zh" ? preview.placeholderNotice.zh : preview.placeholderNotice.en}</div> : null}
      </CardContent>
    </Card>
  );
}
