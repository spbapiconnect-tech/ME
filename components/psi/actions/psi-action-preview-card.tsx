import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getPsiActionDraftPreview } from "@/lib/psi-actions";
import type { PsiActionDraftContract } from "@/types/psi/actions";
import type { SupportedLocale } from "@/types/module";

interface PsiActionPreviewCardProps {
  action: PsiActionDraftContract;
  locale: SupportedLocale;
}

export function PsiActionPreviewCard({ action, locale }: PsiActionPreviewCardProps) {
  const preview = getPsiActionDraftPreview(action);

  return (
    <Card size="sm">
      <CardHeader>
        <CardTitle className="text-sm">{locale === "zh" ? "动作可提交预览" : "Action Submit Preview"}</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-1 text-xs text-muted-foreground">
        <div>canSubmit: {String(preview.canSubmit)}</div>
        <div>{locale === "zh" ? preview.reason.zh : preview.reason.en}</div>
        <div>
          fieldCount: {preview.fieldCount} · requiredFieldCount: {preview.requiredFieldCount}
        </div>
        <div>
          audit: {String(preview.auditRequired)} · confirmation: {String(preview.confirmationRequired)}
        </div>
        <div>
          task: {String(preview.createsTaskPlaceholder)} · workflow: {String(preview.triggersWorkflowPlaceholder)} · notification: {String(preview.sendsNotificationPlaceholder)}
        </div>
      </CardContent>
    </Card>
  );
}
