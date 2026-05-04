import { DataTable } from "@/components/data/data-table";
import { EmptyState } from "@/components/data/empty-state";
import { KpiCard } from "@/components/data/kpi-card";
import { PageTemplateShell, getLocalizedText } from "@/components/layout/page-template-shell";
import type { SupportedLocale } from "@/types/module";
import type { PageSchemaDefinition, PageTemplateDemoData } from "@/types/page-schema";

interface ReportLayoutProps {
  schema: PageSchemaDefinition;
  demoData: PageTemplateDemoData;
  locale: SupportedLocale;
}

export function ReportLayout({ schema, demoData, locale }: ReportLayoutProps) {
  return (
    <PageTemplateShell schema={schema} locale={locale}>
      <div className="template-kpi-grid">
        {demoData.metrics.map((metric) => (
          <KpiCard key={metric.label.en} locale={locale} label={metric.label} value={metric.value} trend={metric.trend} tone="success" />
        ))}
      </div>

      <div className="template-report-grid">
        <section className="template-card">
          <div className="template-card-header">
            <h3>{getLocalizedText(schema.sections[1].title, locale)}</h3>
          </div>
          {demoData.chartSeries.length === 0 ? (
            <EmptyState
              locale={locale}
              title={{ zh: "暂无图表占位", en: "No Chart Placeholder Yet" }}
              description={{ zh: "报表图表后续可替换为真实图表引擎。", en: "This chart area can later be replaced by a real chart engine." }}
            />
          ) : (
            <div className="template-chart-placeholder">
              {demoData.chartSeries.map((point) => (
                <div key={point.label} className="template-chart-bar-row">
                  <span>{point.label}</span>
                  <div className="template-chart-bar-track">
                    <div className="template-chart-bar-fill" style={{ width: `${point.value}%` }} />
                  </div>
                  <strong>{point.value}</strong>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="template-card">
          <div className="template-card-header">
            <h3>{getLocalizedText(schema.sections[2].title, locale)}</h3>
          </div>
          <DataTable locale={locale} columns={schema.columns} rows={demoData.records} />
        </section>
      </div>
    </PageTemplateShell>
  );
}
