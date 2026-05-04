import { ActionBar } from "@/components/data/action-bar";
import { CardList } from "@/components/data/card-list";
import { DataTable } from "@/components/data/data-table";
import { FilterBar } from "@/components/data/filter-bar";
import { RightDrawer } from "@/components/data/right-drawer";
import { Timeline } from "@/components/data/timeline";
import { PageTemplateShell, getLocalizedText } from "@/components/layout/page-template-shell";
import type { SupportedLocale } from "@/types/module";
import type { PageSchemaDefinition, PageTemplateDemoData } from "@/types/page-schema";

interface ListingLayoutProps {
  schema: PageSchemaDefinition;
  demoData: PageTemplateDemoData;
  locale: SupportedLocale;
}

export function ListingLayout({ schema, demoData, locale }: ListingLayoutProps) {
  return (
    <PageTemplateShell
      schema={schema}
      locale={locale}
      actions={
        <ActionBar
          locale={locale}
          primaryAction={schema.actions[0] ? { key: schema.actions[0].key, label: schema.actions[0].label } : undefined}
          secondaryActions={schema.actions.slice(1).map((action) => ({ key: action.key, label: action.label }))}
          bulkActionLabel={{ zh: "批量操作占位", en: "Bulk Action Placeholder" }}
        />
      }
    >
      <FilterBar
        locale={locale}
        filters={schema.filters}
        searchPlaceholder={{ zh: "搜索列表占位", en: "Search list placeholder" }}
        actionSlot={
          <div className="template-tab-row">
            {schema.tabs.map((tab) => (
              <button key={tab.key} className="template-tab-button" type="button">
                {getLocalizedText(tab.label, locale)}
              </button>
            ))}
          </div>
        }
      />

      <section className="template-listing-shell">
        <section className="template-card template-mobile-records">
          <CardList
            locale={locale}
            items={demoData.records.map((record, index) => ({
              id: `mobile-${index}`,
              title: record[schema.columns[0]?.key] ?? `Record ${index + 1}`,
              subtitle: record[schema.columns[1]?.key] ?? "--",
              meta: record[schema.columns[2]?.key] ?? "--",
              status: record.status ?? record.stockStatus,
              actionLabel: locale === "zh" ? "查看" : "View",
            }))}
          />
        </section>

        <section className="template-card template-table-card">
          <DataTable locale={locale} columns={schema.columns} rows={demoData.records} />
        </section>

        <RightDrawer
          locale={locale}
          title={schema.sections[1].title}
          description={{ zh: "平板分栏与桌面预览抽屉占位。", en: "Tablet split preview and desktop drawer placeholder." }}
          alwaysVisible
        >
          <Timeline locale={locale} items={demoData.timeline} />
        </RightDrawer>
      </section>
    </PageTemplateShell>
  );
}
