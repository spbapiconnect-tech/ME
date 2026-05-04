import type { SupportedLocale } from "@/types/module";

import { EmptyState } from "@/components/data/empty-state";
import { StatusChip } from "@/components/data/status-chip";

export interface CardListItem {
  id: string;
  title: string;
  subtitle?: string;
  meta?: string;
  status?: string;
  actionLabel?: string;
}

interface CardListProps {
  locale: SupportedLocale;
  items: CardListItem[];
  emptyTitle?: { zh: string; en: string };
  emptyDescription?: { zh: string; en: string };
}

export function CardList({ locale, items, emptyTitle, emptyDescription }: CardListProps) {
  if (items.length === 0) {
    return (
      <EmptyState
        locale={locale}
        title={emptyTitle ?? { zh: "暂无记录", en: "No Records Yet" }}
        description={emptyDescription ?? { zh: "当前没有可展示的卡片记录。", en: "There are no card records to display yet." }}
      />
    );
  }

  return (
    <div className="me-card-list">
      {items.map((item) => (
        <article key={item.id} className="me-record-card">
          <div className="me-record-card-copy">
            <strong>{item.title}</strong>
            {item.subtitle ? <p>{item.subtitle}</p> : null}
            {item.meta ? <span>{item.meta}</span> : null}
          </div>
          <div className="me-record-card-side">
            {item.status ? <StatusChip label={item.status} locale={locale} tone="info" size="sm" /> : null}
            {item.actionLabel ? (
              <button className="me-action-button me-action-button--ghost" type="button">
                {item.actionLabel}
              </button>
            ) : null}
          </div>
        </article>
      ))}
    </div>
  );
}
