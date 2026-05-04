import type { SupportedLocale } from "@/types/module";
import type { PageSchemaDefinition, PageTemplateDemoData } from "@/types/page-schema";

import { PageTemplateShell, getLocalizedText } from "@/components/layout/page-template-shell";

interface DashboardLayoutProps {
  schema: PageSchemaDefinition;
  demoData: PageTemplateDemoData;
  locale: SupportedLocale;
}

export function DashboardLayout({ schema, demoData, locale }: DashboardLayoutProps) {
  return (
    <PageTemplateShell schema={schema} locale={locale}>
      <div className="template-kpi-grid">
        {demoData.metrics.map((metric) => (
          <article key={metric.label.en} className="template-kpi-card">
            <span>{getLocalizedText(metric.label, locale)}</span>
            <strong>{metric.value}</strong>
            <small>{metric.trend}</small>
          </article>
        ))}
      </div>

      <div className="template-dashboard-grid">
        <section className="template-card">
          <div className="template-card-header">
            <h3>{getLocalizedText(schema.sections[0].title, locale)}</h3>
          </div>
          <div className="template-preview-grid">
            {demoData.previewCards.map((card) => (
              <article key={card.title.en} className="template-preview-card">
                <span>{getLocalizedText(card.title, locale)}</span>
                <strong>{card.value}</strong>
                <p>{getLocalizedText(card.description, locale)}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="template-card">
          <div className="template-card-header">
            <h3>{getLocalizedText(schema.sections[1].title, locale)}</h3>
          </div>
          <div className="template-timeline-list">
            {demoData.timeline.map((item) => (
              <div key={`${item.title.en}-${item.timestamp}`} className="template-timeline-item">
                <div>
                  <strong>{getLocalizedText(item.title, locale)}</strong>
                  <p>{item.timestamp}</p>
                </div>
                <span className="template-status-pill">{item.status}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="template-card">
          <div className="template-card-header">
            <h3>{getLocalizedText(schema.sections[2].title, locale)}</h3>
          </div>
          <div className="template-issue-list">
            {demoData.issues.slice(0, 3).map((issue) => (
              <article key={issue.id} className="template-issue-row">
                <div>
                  <strong>{issue.title}</strong>
                  <p>{issue.owner}</p>
                </div>
                <span className="template-chip">{issue.severity}</span>
              </article>
            ))}
          </div>
        </section>
      </div>
    </PageTemplateShell>
  );
}
