import type { LocalizedText, SupportedLocale } from "@/types/module";

import { getLocalizedText } from "@/lib/localized";

interface ActionItem {
  key: string;
  label: string | LocalizedText;
}

interface ActionBarProps {
  locale: SupportedLocale;
  primaryAction?: ActionItem;
  secondaryActions?: ActionItem[];
  bulkActionLabel?: string | LocalizedText;
  sticky?: boolean;
  align?: "start" | "end" | "between";
}

export function ActionBar({
  locale,
  primaryAction,
  secondaryActions = [],
  bulkActionLabel,
  sticky = false,
  align = "between",
}: ActionBarProps) {
  return (
    <section className="me-action-bar" data-sticky={sticky} data-align={align}>
      <div className="me-action-bar-group">
        {bulkActionLabel ? (
          <button className="me-action-button me-action-button--ghost" type="button">
            {getLocalizedText(bulkActionLabel, locale)}
          </button>
        ) : null}
      </div>
      <div className="me-action-bar-group">
        {secondaryActions.map((action) => (
          <button key={action.key} className="me-action-button me-action-button--secondary" type="button">
            {getLocalizedText(action.label, locale)}
          </button>
        ))}
        {primaryAction ? (
          <button className="me-action-button me-action-button--primary" type="button">
            {getLocalizedText(primaryAction.label, locale)}
          </button>
        ) : null}
      </div>
    </section>
  );
}
