import type { LocalizedText, SupportedLocale } from "@/types/module";

import { getLocalizedText } from "@/lib/localized";

interface FormSectionProps {
  locale: SupportedLocale;
  title: string | LocalizedText;
  description?: string | LocalizedText;
  children: React.ReactNode;
}

export function FormSection({ locale, title, description, children }: FormSectionProps) {
  return (
    <section className="me-form-section">
      <header className="me-form-section-header">
        <h3 className="me-panel-title">{getLocalizedText(title, locale)}</h3>
        {description ? <p>{getLocalizedText(description, locale)}</p> : null}
      </header>
      <div className="me-form-section-body">{children}</div>
    </section>
  );
}
