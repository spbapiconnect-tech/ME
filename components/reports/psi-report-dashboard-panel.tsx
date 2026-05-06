import { PsiReportSourceCard } from "@/components/reports/psi-report-source-card";
import { PsiReportWidgetCard } from "@/components/reports/psi-report-widget-card";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { reportWidgetRegistryByKey } from "@/config/reports";
import type { SupportedLocale } from "@/types/module";
import type { PsiReportDashboardData } from "@/types/psi";

interface PsiReportDashboardPanelProps {
  data: PsiReportDashboardData;
  locale: SupportedLocale;
}

function byModule(data: PsiReportDashboardData) {
  return data.widgets.reduce<Record<string, typeof data.widgets>>((acc, item) => {
    acc[item.sourceModule] = acc[item.sourceModule] ?? [];
    acc[item.sourceModule].push(item);
    return acc;
  }, {});
}

export function PsiReportDashboardPanel({ data, locale }: PsiReportDashboardPanelProps) {
  const grouped = byModule(data);

  return (
    <section className="grid gap-4">
      <Card size="sm">
        <CardHeader className="gap-1">
          <CardTitle className="text-sm">{locale === "zh" ? data.title.zh : data.title.en}</CardTitle>
          <CardDescription>{locale === "zh" ? data.subtitle.zh : data.subtitle.en}</CardDescription>
          <CardDescription>generatedAt: {data.generatedAt} · source: {data.metaSource}</CardDescription>
        </CardHeader>
        <CardContent className="text-xs text-muted-foreground">
          {locale === "zh" ? data.notice.zh : data.notice.en}
        </CardContent>
      </Card>

      {Object.entries(grouped).map(([moduleCode, widgets]) => (
        <Card size="sm" key={moduleCode}>
          <CardHeader className="gap-1">
            <CardTitle className="text-sm">{moduleCode}</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-2">
            {widgets.map((widget) => (
              <div key={widget.widgetKey} className="grid gap-3">
                <PsiReportWidgetCard widget={widget} locale={locale} />
                <PsiReportSourceCard widget={widget} contract={reportWidgetRegistryByKey[widget.widgetKey]} locale={locale} />
              </div>
            ))}
          </CardContent>
        </Card>
      ))}
    </section>
  );
}
