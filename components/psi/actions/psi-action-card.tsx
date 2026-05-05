import Link from "next/link";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { countPsiActionDraftFields, countPsiActionDraftRequiredFields } from "@/lib/psi-actions";
import type { PsiActionDraftContract } from "@/types/psi/actions";
import type { SupportedLocale } from "@/types/module";

import { PsiActionChip } from "./psi-action-chip";

interface PsiActionCardProps {
  action: PsiActionDraftContract;
  locale: SupportedLocale;
}

export function PsiActionCard({ action, locale }: PsiActionCardProps) {
  const title = locale === "zh" ? action.title.zh : action.title.en;
  const description = action.description ? (locale === "zh" ? action.description.zh : action.description.en) : undefined;

  return (
    <Card size="sm">
      <CardHeader>
        <CardTitle className="text-sm">{title}</CardTitle>
        {description ? <CardDescription className="text-xs">{description}</CardDescription> : null}
      </CardHeader>
      <CardContent className="grid gap-2 text-xs text-muted-foreground">
        <PsiActionChip status={action.status} category={action.category} intent={action.intent} />
        <div>module: {action.source.moduleCode}</div>
        <div>
          fields: {countPsiActionDraftFields(action)} · required: {countPsiActionDraftRequiredFields(action)}
        </div>
        <div>
          audit: {String(action.requirement.auditRequired)} · confirmation: {String(action.requirement.confirmationRequired)}
        </div>
        {action.futureServiceMethod ? <div>future service: {action.futureServiceMethod}</div> : null}
        <Link href={`/psi/actions/${action.key}`} className="text-primary hover:underline">
          Open draft detail
        </Link>
      </CardContent>
    </Card>
  );
}
