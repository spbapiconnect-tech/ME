import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { PsiActionDraftContract } from "@/types/psi/actions";
import type { SupportedLocale } from "@/types/module";

interface PsiActionFormPreviewProps {
  action: PsiActionDraftContract;
  locale: SupportedLocale;
}

export function PsiActionFormPreview({ action, locale }: PsiActionFormPreviewProps) {
  return (
    <Card size="sm">
      <CardHeader>
        <CardTitle className="text-sm">{locale === "zh" ? "表单占位预览" : "Form Placeholder Preview"}</CardTitle>
        <CardDescription className="text-xs">Preview only — no data will be saved.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3">
        {action.sections.map((section) => (
          <div key={section.key} className="rounded-xl border p-3">
            <div className="text-sm font-medium">{locale === "zh" ? section.title.zh : section.title.en}</div>
            {section.description ? (
              <div className="text-xs text-muted-foreground">{locale === "zh" ? section.description.zh : section.description.en}</div>
            ) : null}
            <div className="mt-2 grid gap-2">
              {section.fields.map((field) => (
                <div key={field.key} className="rounded-lg bg-muted/40 p-2 text-xs">
                  <div className="font-medium">
                    {locale === "zh" ? field.label.zh : field.label.en}
                    {field.required ? " *" : ""}
                  </div>
                  <div className="text-muted-foreground">{field.fieldType} · disabled placeholder</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
