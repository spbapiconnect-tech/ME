import type { SupportedLocale } from "@/types/module";
import type { PageSchemaDefinition, PageTemplateDemoData } from "@/types/page-schema";

import { PageTemplateShell, getLocalizedText } from "@/components/layout/page-template-shell";

interface ReportLayoutProps {
  schema: PageSchemaDefinition;
  demoData: PageTemplateDemoData;
  locale: SupportedLocale;
}

export function ReportLayout({ schema, demoData, locale }: ReportLayoutProps) {
  return (
    <PageTemplateShell
      schema={schema}
      locale={locale}
      actions={
        <div className="template-chip-row">
          {schema.actions.map((action) => (
            <button key={action.key} className="template-action-button" type="button">
              {getLocalizedText(action.label, locale)}
            </button>
          ))}
        </div>
      }
    >
      <div className="template-kpi-grid">
        {demoData.metrics.map((metric) => (
          <article key={metric.label.en} className="template-kpi-card">
            <span>{getLocalizedText(metric.label, locale)}</span>
            <strong>{metric.value}</strong>
            <small>{metric.trend}</small>
          </article>
        ))}
      </div>

      <div className="template-report-grid">
        <section className="template-card">
          <div className="template-card-header">
            <h3>{getLocalizedText(schema.sections[1].title, locale)}</h3>
          </div>
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
        </section>

        <section className="template-card">
          <div className="template-card-header">
            <h3>{getLocalizedText(schema.sections[2].title, locale)}</h3>
          </div>
          <table className="template-table">
            <thead>
              <tr>
                {schema.columns.map((column) => (
                  <th key={column.key}>{getLocalizedText(column.label, locale)}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {demoData.records.map((record, index) => (
                <tr key={`report-${index}`}>
                  {schema.columns.map((column) => (
                    <td key={column.key}>{record[column.key]}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
    </PageTemplateShell>
  );
}
