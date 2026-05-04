import type { LocalizedText, SupportedLocale } from "@/types/module";
import type { PageTemplateTimelineItem } from "@/types/page-schema";

import { EmptyState } from "@/components/data/empty-state";
import { StatusChip } from "@/components/data/status-chip";
import { getLocalizedText } from "@/lib/localized";

interface TimelineProps {
  locale: SupportedLocale;
  title?: string | LocalizedText;
  items: PageTemplateTimelineItem[];
}

export function Timeline({ locale, title, items }: TimelineProps) {
  return (
    <section className="me-panel-card">
      {title ? <h3 className="me-panel-title">{getLocalizedText(title, locale)}</h3> : null}
      {items.length === 0 ? (
        <EmptyState
          locale={locale}
          title={{ zh: "暂无时间线", en: "No Timeline Yet" }}
          description={{ zh: "当前没有可展示的时间线占位项。", en: "No timeline placeholder items are available yet." }}
        />
      ) : (
        <div className="me-timeline">
          {items.map((item) => (
            <article key={`${item.title.en}-${item.timestamp}`} className="me-timeline-item">
              <span className="me-timeline-rail" aria-hidden="true" />
              <div className="me-timeline-body">
                <div className="me-timeline-header">
                  <strong>{getLocalizedText(item.title, locale)}</strong>
                  <StatusChip label={item.status} locale={locale} tone="info" size="sm" dot />
                </div>
                <p>{item.timestamp}</p>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
