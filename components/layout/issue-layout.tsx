import { ActionBar } from "@/components/data/action-bar";
import { CardList } from "@/components/data/card-list";
import { StatusChip } from "@/components/data/status-chip";
import { Timeline } from "@/components/data/timeline";
import { PageTemplateShell, getLocalizedText } from "@/components/layout/page-template-shell";
import type { SupportedLocale } from "@/types/module";
import type { PageSchemaDefinition, PageTemplateDemoData } from "@/types/page-schema";

interface IssueLayoutProps {
  schema: PageSchemaDefinition;
  demoData: PageTemplateDemoData;
  locale: SupportedLocale;
}

export function IssueLayout({ schema, demoData, locale }: IssueLayoutProps) {
  return (
    <PageTemplateShell
      schema={schema}
      locale={locale}
      actions={
        <ActionBar
          locale={locale}
          primaryAction={schema.actions[2] ? { key: schema.actions[2].key, label: schema.actions[2].label } : undefined}
          secondaryActions={schema.actions.slice(0, 2).map((action) => ({ key: action.key, label: action.label }))}
          bulkActionLabel={{ zh: "批量闭环占位", en: "Bulk Close-Loop Placeholder" }}
        />
      }
    >
      <div className="template-issue-shell">
        <section className="template-card template-issue-board">
          <div className="template-card-header">
            <h3>{getLocalizedText(schema.sections[0].title, locale)}</h3>
          </div>
          <div className="template-board-columns">
            {schema.tabs.map((tab) => (
              <div key={tab.key} className="template-board-column">
                <div className="template-board-column-header">{getLocalizedText(tab.label, locale)}</div>
                <CardList
                  locale={locale}
                  items={demoData.issues.map((issue) => ({
                    id: `${tab.key}-${issue.id}`,
                    title: issue.title,
                    subtitle: issue.owner,
                    meta: issue.dueDate,
                    status: issue.status,
                    actionLabel: locale === "zh" ? "闭环" : "Close Loop",
                  }))}
                />
              </div>
            ))}
          </div>
          <div className="template-chip-row">
            {demoData.issues.map((issue) => (
              <StatusChip key={issue.id} label={issue.severity} locale={locale} tone="warning" size="sm" dot />
            ))}
          </div>
        </section>

        <Timeline locale={locale} title={schema.sections[1].title} items={demoData.timeline} />
      </div>
    </PageTemplateShell>
  );
}
