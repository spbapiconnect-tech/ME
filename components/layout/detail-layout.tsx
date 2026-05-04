import type { SupportedLocale } from "@/types/module";
import type { PageSchemaDefinition, PageTemplateDemoData } from "@/types/page-schema";

import { PageTemplateShell, getLocalizedText } from "@/components/layout/page-template-shell";

interface DetailLayoutProps {
  schema: PageSchemaDefinition;
  demoData: PageTemplateDemoData;
  locale: SupportedLocale;
}

export function DetailLayout({ schema, demoData, locale }: DetailLayoutProps) {
  return (
    <PageTemplateShell schema={schema} locale={locale}>
      <div className="template-detail-shell">
        <section className="template-card template-detail-main">
          {schema.sections.map((section) => (
            <article key={section.key} className="template-section-block">
              <div className="template-card-header">
                <h3>{getLocalizedText(section.title, locale)}</h3>
              </div>
              <div className="template-detail-grid">
                {(section.fieldKeys ?? Object.keys(demoData.detail)).map((fieldKey) => (
                  <div key={fieldKey} className="template-detail-item">
                    <span>{fieldKey}</span>
                    <strong>{demoData.detail[fieldKey] ?? "placeholder"}</strong>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </section>

        <aside className="template-card template-detail-panel">
          <div className="template-card-header">
            <h3>{getLocalizedText(schema.tabs[1].label, locale)}</h3>
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
        </aside>
      </div>
    </PageTemplateShell>
  );
}
