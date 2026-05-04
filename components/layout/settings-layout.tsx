import type { SupportedLocale } from "@/types/module";
import type { PageSchemaDefinition, PageTemplateDemoData } from "@/types/page-schema";

import { PageTemplateShell, getLocalizedText } from "@/components/layout/page-template-shell";

interface SettingsLayoutProps {
  schema: PageSchemaDefinition;
  demoData: PageTemplateDemoData;
  locale: SupportedLocale;
}

export function SettingsLayout({ schema, demoData, locale }: SettingsLayoutProps) {
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
      <div className="template-settings-grid">
        {schema.sections.map((section) => (
          <section key={section.key} className="template-card template-settings-card">
            <div className="template-card-header">
              <h3>{getLocalizedText(section.title, locale)}</h3>
            </div>
            <div className="template-setting-list">
              {(section.fieldKeys ?? []).map((fieldKey) => (
                <div key={fieldKey} className="template-setting-row">
                  <span>{fieldKey}</span>
                  <strong>{demoData.settingsValues[fieldKey] ?? schema.sourceMapping.sourceKey}</strong>
                </div>
              ))}
            </div>
            <div className="template-setting-note">
              <span>{schema.apiMapping.endpoint}</span>
              <span>{schema.sourceMapping.note}</span>
            </div>
          </section>
        ))}
      </div>
    </PageTemplateShell>
  );
}
