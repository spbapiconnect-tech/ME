import { DataTable } from "@/components/data/data-table";
import { DetailPanel } from "@/components/data/detail-panel";
import { KpiCard } from "@/components/data/kpi-card";
import { getLayoutRendererConfig, getSkinConfig, toDisplayRecords } from "@/config/layout-engine";
import { getPageSchema } from "@/config/page-schemas";
import { getLocalizedText } from "@/lib/localized";
import { getModuleByCode } from "@/lib/modules";
import type { DisplayRecord } from "@/types/display-model";
import type { LayoutPageType, LayoutVariant } from "@/types/layout-engine";
import type { SupportedLocale } from "@/types/module";
import type { PageSchemaDefinition } from "@/types/page-schema";
import type { SkinCode } from "@/types/skin";

import { DisplayRecordPreview } from "@/components/layout-engine/display-record-preview";

interface ModulePageRendererProps {
  moduleCode: string;
  pageType: LayoutPageType;
  skinCode?: SkinCode;
  layoutVariant?: LayoutVariant;
  records?: Array<Record<string, unknown>>;
  schema?: PageSchemaDefinition;
  locale: SupportedLocale;
}

function buildFallbackRecords(moduleCode: string, pageType: LayoutPageType): Array<Record<string, unknown>> {
  return [
    {
      id: `${moduleCode}-${pageType}-1001`,
      title: `${moduleCode} ${pageType} preview`,
      subtitle: "Local display model adapter",
      description: "Safe renderer placeholder without business logic.",
      status: "preview",
      priority: "normal",
    },
    {
      id: `${moduleCode}-${pageType}-1002`,
      title: `${moduleCode} ${pageType} secondary preview`,
      subtitle: "Skin/layout comparison",
      description: "Alternative placeholder record for layout rendering.",
      status: "sample",
      priority: "secondary",
    },
  ];
}

export function ModulePageRenderer({
  moduleCode,
  pageType,
  skinCode,
  layoutVariant,
  records,
  schema,
  locale,
}: ModulePageRendererProps) {
  const moduleItem = getModuleByCode(moduleCode);
  const resolvedSchema = schema ?? getPageSchema(moduleCode, pageType);
  const resolvedSkin = getSkinConfig(skinCode);
  const resolvedLayout = getLayoutRendererConfig(pageType, layoutVariant);
  const displayRecords = toDisplayRecords(records ?? buildFallbackRecords(moduleCode, pageType), {
    moduleCode,
    pageType,
    sourceComponent: "module-page-renderer",
    sourceEvent: "layout-preview",
  });

  if (!moduleItem || !resolvedSchema || !resolvedLayout) {
    return (
      <section className="me-panel-card layout-engine-preview-shell">
        <h3 className="me-panel-title">{locale === "zh" ? "无法预览布局" : "Unable To Preview Layout"}</h3>
        <p className="shell-copy">
          {locale === "zh"
            ? "未找到对应模块、页面 schema 或布局配置。"
            : "The requested module, page schema, or layout configuration could not be resolved."}
        </p>
      </section>
    );
  }

  const descriptionRows = displayRecords[0]?.meta.map((item) => ({
    label: getLocalizedText(item.label, locale),
    value: item.value,
  })) ?? [];

  return (
    <section className="me-panel-card layout-engine-preview-shell">
      <div className="panel-header">
        <div>
          <h3 className="me-panel-title">
            {getLocalizedText(moduleItem.name, locale)} · {getLocalizedText(resolvedSchema.title, locale)}
          </h3>
          <p className="shell-copy">
            {locale === "zh"
              ? "该渲染器仅演示 LayoutRegistry + SkinRegistry + DisplayModel 的组合方式。"
              : "This renderer only demonstrates how LayoutRegistry, SkinRegistry, and DisplayModel fit together."}
          </p>
        </div>
      </div>
      <div className="module-chip-row">
        <span className="module-chip">skin: {resolvedSkin.code}</span>
        <span className="module-chip">variant: {resolvedLayout.variant}</span>
        <span className="module-chip">page: {pageType}</span>
      </div>
      <div className="layout-engine-renderer-grid">
        <div className="layout-engine-renderer-column">
          <KpiCard
            locale={locale}
            label={{ zh: "显示记录", en: "Display Records" }}
            value={String(displayRecords.length)}
            description={{ zh: "由 DisplayModel adapter 安全转换", en: "Safely converted by DisplayModel adapter" }}
            tone="brand"
          />
          <DisplayRecordPreview locale={locale} records={displayRecords} />
        </div>
        <div className="layout-engine-renderer-column">
          <DetailPanel
            locale={locale}
            title={{ zh: "渲染上下文", en: "Renderer Context" }}
            description={{ zh: getLocalizedText(resolvedLayout.notes, locale), en: getLocalizedText(resolvedLayout.notes, locale) }}
            sections={[
              {
                title: { zh: "当前布局", en: "Current Layout" },
                rows: [
                  { label: locale === "zh" ? "页面类型" : "Page Type", value: pageType },
                  { label: locale === "zh" ? "布局变体" : "Layout Variant", value: resolvedLayout.variant },
                  { label: locale === "zh" ? "皮肤" : "Skin", value: resolvedSkin.code },
                  { label: locale === "zh" ? "响应模式" : "Responsive Mode", value: resolvedLayout.responsiveMode },
                ],
              },
              {
                title: { zh: "显示模型", en: "Display Model" },
                rows: descriptionRows,
              },
            ]}
          />
          <div className="template-card">
            <DataTable
              locale={locale}
              columns={[
                { key: "id", label: { zh: "ID", en: "ID" } },
                { key: "title", label: { zh: "标题", en: "Title" } },
                { key: "status", label: { zh: "状态", en: "Status" } },
                { key: "priority", label: { zh: "优先级", en: "Priority" } },
              ]}
              rows={displayRecords.map((record: DisplayRecord) => ({
                id: record.id,
                title: record.title,
                status: record.status,
                priority: record.priority,
              }))}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
