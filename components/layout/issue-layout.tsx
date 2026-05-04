import type { SupportedLocale } from "@/types/module";
import type { PageSchemaDefinition, PageTemplateDemoData } from "@/types/page-schema";

import { PageTemplateShell, getLocalizedText } from "@/components/layout/page-template-shell";

interface IssueLayoutProps {
  schema: PageSchemaDefinition;
  demoData: PageTemplateDemoData;
  locale: SupportedLocale;
}

export function IssueLayout({ schema, demoData, locale }: IssueLayoutProps) {
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
      <div className="template-issue-shell">
        <section className="template-card template-issue-board">
          <div className="template-card-header">
            <h3>{getLocalizedText(schema.sections[0].title, locale)}</h3>
          </div>
          <div className="template-board-columns">
            {schema.tabs.map((tab) => (
              <div key={tab.key} className="template-board-column">
                <div className="template-board-column-header">{getLocalizedText(tab.label, locale)}</div>
                {demoData.issues.map((issue) => (
                  <article key={`${tab.key}-${issue.id}`} className="template-board-card">
                    <strong>{issue.title}</strong>
                    <p>{issue.owner}</p>
                    <div className="template-chip-row">
                      <span className="template-chip">{issue.severity}</span>
                      <span className="template-chip">{issue.dueDate}</span>
                    </div>
                  </article>
                ))}
              </div>
            ))}
          </div>
        </section>

        <aside className="template-card template-detail-panel">
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
        </aside>
      </div>
    </PageTemplateShell>
  );
}
