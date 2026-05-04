import type { LocalizedText, SupportedLocale } from "@/types/module";

import { getLocalizedText } from "@/lib/localized";

interface DetailSection {
  title: string | LocalizedText;
  rows: Array<{ label: string; value: string }>;
}

interface DetailPanelProps {
  locale: SupportedLocale;
  title: string | LocalizedText;
  description?: string | LocalizedText;
  sections: DetailSection[];
  contextSlot?: React.ReactNode;
}

export function DetailPanel({ locale, title, description, sections, contextSlot }: DetailPanelProps) {
  return (
    <section className="me-detail-panel">
      <header className="me-detail-panel-header">
        <h3 className="me-panel-title">{getLocalizedText(title, locale)}</h3>
        {description ? <p>{getLocalizedText(description, locale)}</p> : null}
      </header>
      <div className="me-detail-panel-sections">
        {sections.map((section) => (
          <article key={getLocalizedText(section.title, locale)} className="me-detail-section-card">
            <strong>{getLocalizedText(section.title, locale)}</strong>
            <div className="me-detail-kv-list">
              {section.rows.map((row) => (
                <div key={`${row.label}-${row.value}`} className="me-detail-kv-row">
                  <span>{row.label}</span>
                  <strong>{row.value}</strong>
                </div>
              ))}
            </div>
          </article>
        ))}
      </div>
      {contextSlot ? <aside className="me-detail-panel-context">{contextSlot}</aside> : null}
    </section>
  );
}
