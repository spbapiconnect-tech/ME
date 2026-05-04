import { DetailPanel } from "@/components/data/detail-panel";
import { RightDrawer } from "@/components/data/right-drawer";
import { Timeline } from "@/components/data/timeline";
import { PageTemplateShell, getLocalizedText } from "@/components/layout/page-template-shell";
import type { SupportedLocale } from "@/types/module";
import type { PageSchemaDefinition, PageTemplateDemoData } from "@/types/page-schema";

interface DetailLayoutProps {
  schema: PageSchemaDefinition;
  demoData: PageTemplateDemoData;
  locale: SupportedLocale;
}

export function DetailLayout({ schema, demoData, locale }: DetailLayoutProps) {
  return (
    <PageTemplateShell schema={schema} locale={locale}>
      <div className="template-detail-shell">
        <DetailPanel
          locale={locale}
          title={schema.title}
          description={schema.description}
          sections={schema.sections.map((section) => ({
            title: section.title,
            rows: (section.fieldKeys ?? Object.keys(demoData.detail)).map((fieldKey) => ({
              label: fieldKey,
              value: demoData.detail[fieldKey] ?? "placeholder",
            })),
          }))}
        />

        <RightDrawer
          locale={locale}
          title={schema.tabs[1].label}
          description={{ zh: "平板/桌面上下文信息占位。", en: "Tablet and desktop context panel placeholder." }}
          alwaysVisible
        >
          <Timeline locale={locale} items={demoData.timeline} />
          <div className="template-card">
            <div className="template-card-header">
              <h3>{getLocalizedText(schema.tabs[2].label, locale)}</h3>
            </div>
            <p>{schema.apiMapping.note}</p>
          </div>
        </RightDrawer>
      </div>
    </PageTemplateShell>
  );
}
