import type { SupportedLocale } from "@/types/module";
import type { PageSchemaDefinition, PageTemplateDemoData } from "@/types/page-schema";

import { PageTemplateShell, getLocalizedText } from "@/components/layout/page-template-shell";

interface ListingLayoutProps {
  schema: PageSchemaDefinition;
  demoData: PageTemplateDemoData;
  locale: SupportedLocale;
}

export function ListingLayout({ schema, demoData, locale }: ListingLayoutProps) {
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
      <section className="template-card">
        <div className="template-filter-row">
          {schema.filters.map((filter) => (
            <div key={filter.key} className="template-filter-pill">
              <span>{getLocalizedText(filter.label, locale)}</span>
              <small>{filter.type}</small>
            </div>
          ))}
        </div>
        <div className="template-tab-row">
          {schema.tabs.map((tab) => (
            <button key={tab.key} className="template-tab-button" type="button">
              {getLocalizedText(tab.label, locale)}
            </button>
          ))}
        </div>
      </section>

      <section className="template-listing-shell">
        <div className="template-card template-mobile-records">
          {demoData.records.map((record, index) => (
            <article key={`mobile-${index}`} className="template-mobile-record-card">
              {schema.columns.map((column) => (
                <div key={column.key} className="template-mobile-record-row">
                  <span>{getLocalizedText(column.label, locale)}</span>
                  <strong>{record[column.key]}</strong>
                </div>
              ))}
            </article>
          ))}
        </div>

        <div className="template-card template-table-card">
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
                <tr key={`row-${index}`}>
                  {schema.columns.map((column) => (
                    <td key={column.key}>{record[column.key]}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <aside className="template-card template-listing-preview">
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
      </section>
    </PageTemplateShell>
  );
}
