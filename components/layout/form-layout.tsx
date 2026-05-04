import type { SupportedLocale } from "@/types/module";
import type { PageSchemaDefinition, PageTemplateDemoData } from "@/types/page-schema";

import { PageTemplateShell, getLocalizedText } from "@/components/layout/page-template-shell";

interface FormLayoutProps {
  schema: PageSchemaDefinition;
  demoData: PageTemplateDemoData;
  locale: SupportedLocale;
}

export function FormLayout({ schema, demoData, locale }: FormLayoutProps) {
  return (
    <PageTemplateShell
      schema={schema}
      locale={locale}
      footer={
        <div className="template-footer-actions">
          {schema.actions.map((action) => (
            <button key={action.key} className="template-action-button" type="button">
              {getLocalizedText(action.label, locale)}
            </button>
          ))}
        </div>
      }
    >
      <div className="template-form-shell">
        {schema.sections.map((section) => (
          <section key={section.key} className="template-card template-form-section">
            <div className="template-card-header">
              <h3>{getLocalizedText(section.title, locale)}</h3>
            </div>
            <div className="template-form-grid">
              {(section.fieldKeys ?? []).map((fieldKey) => {
                const field = schema.fields.find((entry) => entry.key === fieldKey);
                if (!field) {
                  return null;
                }

                return (
                  <label key={field.key} className="template-field-card">
                    <span>{getLocalizedText(field.label, locale)}</span>
                    <div className="template-field-input">{demoData.formValues[field.key] ?? getLocalizedText(field.placeholder ?? field.label, locale)}</div>
                    <small>
                      {field.required
                        ? locale === "zh"
                          ? "必填占位"
                          : "Required placeholder"
                        : locale === "zh"
                          ? "校验提示占位"
                          : "Validation hint placeholder"}
                    </small>
                  </label>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </PageTemplateShell>
  );
}
