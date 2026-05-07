import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { SupportedLocale } from "@/types/module";
import type { PsiReportWidgetData } from "@/types/psi";

interface PsiReportWidgetCardProps {
  widget: PsiReportWidgetData;
  locale: SupportedLocale;
}

function resolveText(locale: SupportedLocale, zh?: string, en?: string) {
  return locale === "zh" ? (zh ?? en ?? "") : (en ?? zh ?? "");
}

export function PsiReportWidgetCard({ widget, locale }: PsiReportWidgetCardProps) {
  return (
    <Card size="sm" className="gap-3">
      <CardHeader className="gap-1">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-sm">{resolveText(locale, widget.title.zh, widget.title.en)}</CardTitle>
          <Badge variant={widget.isPlaceholder ? "outline" : "secondary"}>{widget.kind}</Badge>
        </div>
        <CardDescription className="text-xs">{widget.widgetKey}</CardDescription>
        {widget.description ? <CardDescription className="text-xs">{resolveText(locale, widget.description.zh, widget.description.en)}</CardDescription> : null}
      </CardHeader>
      <CardContent className="grid gap-2 text-xs text-muted-foreground">
        <div className="flex flex-wrap gap-1.5">
          <Badge variant="outline">module: {widget.sourceModule}</Badge>
          <Badge variant="outline">catalog: {String(widget.isMock)}</Badge>
          <Badge variant="outline">planned: {String(widget.isPlaceholder)}</Badge>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {widget.metrics.slice(0, 4).map((metric) => (
            <div key={metric.key} className="rounded-xl bg-muted/40 p-2">
              <div>{resolveText(locale, metric.label.zh, metric.label.en)}</div>
              <div className="font-semibold text-foreground">
                {metric.value}
                {metric.unit ? ` ${resolveText(locale, metric.unit.zh, metric.unit.en)}` : ""}
              </div>
            </div>
          ))}
        </div>
        {widget.items.length > 0 ? (
          <div className="rounded-xl bg-muted/40 p-3">
            {widget.items.slice(0, 3).map((item) => (
              <div key={item.key} className="mb-2 last:mb-0">
                <div className="font-medium text-foreground/90">{resolveText(locale, item.title.zh, item.title.en)}</div>
                {item.subtitle ? <div>{resolveText(locale, item.subtitle.zh, item.subtitle.en)}</div> : null}
              </div>
            ))}
          </div>
        ) : null}
        {widget.notice ? <div>{resolveText(locale, widget.notice.zh, widget.notice.en)}</div> : null}
        {widget.linkedRoute ? (
          <Link href={widget.linkedRoute} className="text-primary hover:underline">
            {locale === "zh" ? "打开关联页面" : "Open Linked Route"}
          </Link>
        ) : null}
      </CardContent>
    </Card>
  );
}
