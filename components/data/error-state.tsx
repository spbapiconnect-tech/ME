import type { LocalizedText, SupportedLocale } from "@/types/module";

import { getLocalizedText } from "@/lib/localized";

interface ErrorStateProps {
  locale: SupportedLocale;
  title: string | LocalizedText;
  description: string | LocalizedText;
  retryLabel?: string | LocalizedText;
}

export function ErrorState({ locale, title, description, retryLabel }: ErrorStateProps) {
  return (
    <div className="me-state-card me-error-state">
      <strong>{getLocalizedText(title, locale)}</strong>
      <p>{getLocalizedText(description, locale)}</p>
      <button className="me-action-button me-action-button--primary" type="button">
        {getLocalizedText(retryLabel ?? { zh: "重试占位", en: "Retry Placeholder" }, locale)}
      </button>
    </div>
  );
}
