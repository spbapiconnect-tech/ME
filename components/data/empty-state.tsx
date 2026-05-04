import type { LocalizedText, SupportedLocale } from "@/types/module";

import { getLocalizedText } from "@/lib/localized";

interface EmptyStateProps {
  locale: SupportedLocale;
  title: string | LocalizedText;
  description: string | LocalizedText;
  actionLabel?: string | LocalizedText;
}

export function EmptyState({ locale, title, description, actionLabel }: EmptyStateProps) {
  return (
    <div className="me-state-card me-empty-state">
      <strong>{getLocalizedText(title, locale)}</strong>
      <p>{getLocalizedText(description, locale)}</p>
      {actionLabel ? (
        <button className="me-action-button me-action-button--secondary" type="button">
          {getLocalizedText(actionLabel, locale)}
        </button>
      ) : null}
    </div>
  );
}
