import Link from "next/link";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { PsiActionDraftContract } from "@/types/psi/actions";
import type { SupportedLocale } from "@/types/module";

import { PsiActionFormPreview } from "./psi-action-form-preview";
import { PsiActionPreviewCard } from "./psi-action-preview-card";
import { PsiActionSourceCard } from "./psi-action-source-card";

interface PsiActionDetailPageProps {
  action: PsiActionDraftContract | null;
  actionKey: string;
}

export function PsiActionDetailPage({ action, actionKey }: PsiActionDetailPageProps) {
  const locale: SupportedLocale = "en";

  if (!action) {
    return (
      <main className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>ME PSI Action Draft Not Found</CardTitle>
            <CardDescription>Missing action key: {actionKey}</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            This page is preview-only and does not submit any data.
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>{action.title.en}</CardTitle>
          <CardDescription>{action.description?.en ?? "No description available."}</CardDescription>
          <CardDescription>Preview only — no data will be saved.</CardDescription>
        </CardHeader>
        <CardContent>
          <Link href="/psi/actions" className="text-sm text-primary hover:underline">
            Back to ME PSI Actions
          </Link>
        </CardContent>
      </Card>

      <PsiActionFormPreview action={action} locale={locale} />
      <PsiActionPreviewCard action={action} locale={locale} />
      <PsiActionSourceCard action={action} locale={locale} />
    </main>
  );
}
