import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { SupportedLocale } from "@/types/module";
import type { NotificationTemplate } from "@/types/notification";

import { NotificationChip } from "./notification-chip";

export function NotificationTemplateCard({ template, locale }: { template: NotificationTemplate; locale: SupportedLocale }) {
  return (
    <Card size="sm" className="gap-3">
      <CardHeader className="gap-1">
        <CardTitle className="text-sm">{locale === "zh" ? template.name.zh : template.name.en}</CardTitle>
        <CardDescription className="text-xs">{template.code}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-2 text-xs text-muted-foreground">
        <div>{locale === "zh" ? template.description.zh : template.description.en}</div>
        <div className="flex flex-wrap gap-1.5">
          <NotificationChip kind="category" locale={locale} category={template.category} />
          <NotificationChip kind="channel" locale={locale} channel={template.defaultChannel} />
          <NotificationChip kind="status" locale={locale} status={template.status} />
        </div>
        <div>{locale === "zh" ? "示例标题" : "Sample Title"}: {locale === "zh" ? template.sampleTitle.zh : template.sampleTitle.en}</div>
        <div>{locale === "zh" ? "示例正文" : "Sample Body"}: {locale === "zh" ? template.sampleBody.zh : template.sampleBody.en}</div>
      </CardContent>
    </Card>
  );
}
