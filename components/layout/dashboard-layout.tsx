import { CardList } from "@/components/data/card-list";
import { DetailPanel } from "@/components/data/detail-panel";
import { KpiCard } from "@/components/data/kpi-card";
import { Timeline } from "@/components/data/timeline";
import { PageTemplateShell, getLocalizedText } from "@/components/layout/page-template-shell";
import type { SupportedLocale } from "@/types/module";
import type { PageSchemaDefinition, PageTemplateDemoData } from "@/types/page-schema";

interface DashboardLayoutProps {
  schema: PageSchemaDefinition;
  demoData: PageTemplateDemoData;
  locale: SupportedLocale;
}

export function DashboardLayout({ schema, demoData, locale }: DashboardLayoutProps) {
  return (
    <PageTemplateShell schema={schema} locale={locale}>
      <div className="template-kpi-grid">
        {demoData.metrics.map((metric) => (
          <KpiCard
            key={metric.label.en}
            locale={locale}
            label={metric.label}
            value={metric.value}
            trend={metric.trend}
            description={{ zh: "模板 KPI 占位组件", en: "Template KPI placeholder component" }}
            tone="brand"
          />
        ))}
      </div>

      <div className="template-dashboard-grid">
        <DetailPanel
          locale={locale}
          title={schema.sections[0].title}
          description={schema.description}
          sections={[
            {
              title: { zh: "模块摘要卡", en: "Module Summary Cards" },
              rows: demoData.previewCards.map((card) => ({
                label: getLocalizedText(card.title, locale),
                value: card.value,
              })),
            },
          ]}
        />
        <Timeline locale={locale} title={schema.sections[1].title} items={demoData.timeline} />
        <section className="template-card">
          <div className="template-card-header">
            <h3>{getLocalizedText(schema.sections[2].title, locale)}</h3>
          </div>
          <CardList
            locale={locale}
            items={demoData.issues.slice(0, 3).map((issue) => ({
              id: issue.id,
              title: issue.title,
              subtitle: issue.owner,
              meta: issue.dueDate,
              status: issue.severity,
              actionLabel: locale === "zh" ? "查看" : "View",
            }))}
          />
        </section>
      </div>
    </PageTemplateShell>
  );
}
