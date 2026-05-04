import { ActionBar } from "@/components/data/action-bar";
import { DetailPanel } from "@/components/data/detail-panel";
import { StatusChip } from "@/components/data/status-chip";
import { PageTemplateShell } from "@/components/layout/page-template-shell";
import type { SupportedLocale } from "@/types/module";
import type { PageSchemaDefinition, PageTemplateDemoData } from "@/types/page-schema";

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
        <ActionBar
          locale={locale}
          primaryAction={schema.actions[0] ? { key: schema.actions[0].key, label: schema.actions[0].label } : undefined}
          secondaryActions={schema.actions.slice(1).map((action) => ({ key: action.key, label: action.label }))}
        />
      }
    >
      <div className="template-settings-grid">
        {schema.sections.map((section) => (
          <DetailPanel
            key={section.key}
            locale={locale}
            title={section.title}
            sections={[
              {
                title: section.title,
                rows: (section.fieldKeys ?? []).map((fieldKey) => ({
                  label: fieldKey,
                  value: demoData.settingsValues[fieldKey] ?? schema.sourceMapping.sourceKey,
                })),
              },
            ]}
            contextSlot={
              <div className="template-chip-row">
                <StatusChip label={schema.apiMapping.method} locale={locale} tone="brand" size="sm" />
                <StatusChip label={schema.sourceMapping.sourceKey} locale={locale} tone="info" size="sm" />
              </div>
            }
          />
        ))}
      </div>
    </PageTemplateShell>
  );
}
