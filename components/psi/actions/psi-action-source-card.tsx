import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { PsiActionDraftContract } from "@/types/psi/actions";
import type { SupportedLocale } from "@/types/module";

interface PsiActionSourceCardProps {
  action: PsiActionDraftContract;
  locale: SupportedLocale;
}

export function PsiActionSourceCard({ action, locale }: PsiActionSourceCardProps) {
  return (
    <Card size="sm">
      <CardHeader>
        <CardTitle className="text-sm">{locale === "zh" ? "来源映射" : "Source Mapping"}</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-1 text-xs text-muted-foreground">
        <div>moduleCode: {action.source.moduleCode}</div>
        {action.source.sourceRoute ? <div>sourceRoute: {action.source.sourceRoute}</div> : null}
        {action.source.sourceRecordType ? <div>sourceRecordType: {action.source.sourceRecordType}</div> : null}
        {action.source.sourceRecordId ? <div>sourceRecordId: {action.source.sourceRecordId}</div> : null}
        {action.source.actionKey ? <div>actionKey: {action.source.actionKey}</div> : null}
        {action.source.accessRuleKey ? <div>accessRuleKey: {action.source.accessRuleKey}</div> : null}
        {action.source.auditEventKey ? <div>auditEventKey: {action.source.auditEventKey}</div> : null}
        {action.source.workflowKey ? <div>workflowKey: {action.source.workflowKey}</div> : null}
        {action.source.notificationKey ? <div>notificationKey: {action.source.notificationKey}</div> : null}
        {action.source.packageKey ? <div>packageKey: {action.source.packageKey}</div> : null}
        {action.futureServiceMethod ? <div>futureServiceMethod: {action.futureServiceMethod}</div> : null}
        {action.futureRepositoryMethod ? <div>futureRepositoryMethod: {action.futureRepositoryMethod}</div> : null}
        {action.futureApiEndpoint ? <div>futureApiEndpoint: {action.futureApiEndpoint}</div> : null}
      </CardContent>
    </Card>
  );
}
