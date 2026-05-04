"use client";

import Link from "next/link";
import { Blocks, Layers3, LayoutDashboard, LayoutTemplate, ListTodo, PanelTopClose, Workflow } from "lucide-react";
import { useEffect, useMemo } from "react";

import { ActionBar } from "@/components/data/action-bar";
import { CardList } from "@/components/data/card-list";
import { DataTable } from "@/components/data/data-table";
import { DetailPanel } from "@/components/data/detail-panel";
import { EmptyState } from "@/components/data/empty-state";
import { FilterBar } from "@/components/data/filter-bar";
import { KpiCard } from "@/components/data/kpi-card";
import { RightDrawer } from "@/components/data/right-drawer";
import { StatusChip } from "@/components/data/status-chip";
import { Timeline } from "@/components/data/timeline";
import { DemoModuleSwitcher } from "@/components/demo/demo-module-switcher";
import { MockDataNotice } from "@/components/demo/mock-data-notice";
import { demoModuleCodes, getDemoModuleData } from "@/data/demo";
import { getPageSchema } from "@/config/page-schemas";
import { getLocalizedText } from "@/lib/localized";
import { getModuleByCode } from "@/lib/modules";
import { useUiPreferencesStore } from "@/stores/ui-preferences";
import type { DemoModuleCode } from "@/data/demo";
import type { LocalizedText, SupportedLocale, ThemeMode } from "@/types/module";
import type { PageSchemaColumn } from "@/types/page-schema";

interface DemoModulePageProps {
  moduleCode: string;
}

const copy = {
  en: {
    back: "Back To Demo Workspace",
    dashboard: "Back To Dashboard",
    modules: "Open Module Center",
    templates: "Open Page Templates",
    components: "Open Core Components",
    tasks: "Open Task Engine",
    layoutEngine: "Layout Engine",
    listing: "Listing",
    detail: "Detail",
    issues: "Issues",
    report: "Report",
    form: "Form Placeholder",
    distribution: "Status Distribution",
    invalidTitle: "Demo Module Not Found",
    invalidDescription: "This route only supports the six ME demo modules registered in the local demo workspace.",
    openAction: "Open Demo Workspace",
    view: "View",
    handle: "Handle",
    summary: "Presentation-Ready Module Demo",
    prototypeStatus: "Mock Data Only",
  },
  zh: {
    back: "返回 Demo Workspace",
    dashboard: "返回 Dashboard",
    modules: "打开模块中心",
    templates: "打开页面模板",
    components: "打开核心组件",
    tasks: "打开任务引擎",
    layoutEngine: "布局引擎",
    listing: "列表",
    detail: "详情",
    issues: "问题",
    report: "报表",
    form: "表单占位",
    distribution: "状态分布",
    invalidTitle: "未找到演示模块",
    invalidDescription: "当前路由仅支持本地演示工作台中注册的六个模块。",
    openAction: "打开 Demo Workspace",
    view: "查看",
    handle: "处理",
    summary: "适合演示的模块页面",
    prototypeStatus: "仅使用 Mock Data",
  },
} as const;

const reportColumnLabels: Record<string, LocalizedText> = {
  bucket: { zh: "分组", en: "Bucket" },
  amount: { zh: "金额", en: "Amount" },
  requests: { zh: "申请数", en: "Requests" },
  variance: { zh: "差异", en: "Variance" },
  segment: { zh: "分段", en: "Segment" },
  onTime: { zh: "准时率", en: "On Time" },
  rating: { zh: "评分", en: "Rating" },
  priceTrend: { zh: "价格趋势", en: "Price Trend" },
  warehouse: { zh: "仓库", en: "Warehouse" },
  stockValue: { zh: "库存价值", en: "Stock Value" },
  riskSkus: { zh: "风险 SKU", en: "Risk SKUs" },
  varianceRate: { zh: "差异率", en: "Variance Rate" },
  sales: { zh: "销售额", en: "Sales" },
  transactions: { zh: "交易数", en: "Transactions" },
  refundRate: { zh: "退款率", en: "Refund Rate" },
  program: { zh: "项目", en: "Program" },
  assigned: { zh: "已分派", en: "Assigned" },
  completion: { zh: "完成率", en: "Completion" },
  overdue: { zh: "逾期", en: "Overdue" },
  queue: { zh: "队列", en: "Queue" },
  open: { zh: "开启", en: "Open" },
  completedToday: { zh: "今日完成", en: "Completed Today" },
};

function buildReportColumns(rows: Array<Record<string, string>>): PageSchemaColumn[] {
  if (rows.length === 0) {
    return [];
  }

  return Object.keys(rows[0]).map((key) => ({
    key,
    label: reportColumnLabels[key] ?? { zh: key, en: key },
  }));
}

export function DemoModulePage({ moduleCode }: DemoModulePageProps) {
  const locale = useUiPreferencesStore((state) => state.locale);
  const theme = useUiPreferencesStore((state) => state.theme);
  const hydrated = useUiPreferencesStore((state) => state.hydrated);
  const hydrate = useUiPreferencesStore((state) => state.hydrate);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    document.documentElement.dataset.theme = theme;
    document.documentElement.lang = locale === "zh" ? "zh-CN" : "en";
  }, [hydrated, locale, theme]);

  const currentLocale: SupportedLocale = hydrated ? locale : "en";
  const currentTheme: ThemeMode = hydrated ? theme : "bright";
  const currentCopy = copy[currentLocale];
  const isValid = demoModuleCodes.includes(moduleCode as DemoModuleCode);
  const demoData = isValid ? getDemoModuleData(moduleCode) : undefined;
  const moduleItem = getModuleByCode(moduleCode);

  const listingSchema = useMemo(() => {
    if (!isValid) {
      return null;
    }

    return getPageSchema(moduleCode, "listing");
  }, [isValid, moduleCode]);

  const detailSchema = useMemo(() => {
    if (!isValid) {
      return null;
    }

    return getPageSchema(moduleCode, "detail");
  }, [isValid, moduleCode]);

  const issueSchema = useMemo(() => {
    if (!isValid) {
      return null;
    }

    return getPageSchema(moduleCode, "issue");
  }, [isValid, moduleCode]);

  const formSchema = useMemo(() => {
    if (!isValid) {
      return null;
    }

    return getPageSchema(moduleCode, "form");
  }, [isValid, moduleCode]);

  const reportSchema = useMemo(() => {
    if (!isValid) {
      return null;
    }

    return getPageSchema(moduleCode, "report");
  }, [isValid, moduleCode]);

  if (!isValid || !demoData || !moduleItem || !listingSchema || !detailSchema || !issueSchema || !formSchema || !reportSchema) {
    return (
      <main className="main-frame module-center-page">
        <section className="module-center-shell">
          <div className="shell-backdrop" />
          <div className="dashboard-content module-center-content">
            <section className="hero-panel module-center-hero">
              <div className="eyebrow-row">
                <span className="brand-mark">
                  <span className="brand-dot" />
                  ME Demo Workspace
                </span>
                <span className="locale-chip">
                  <Workflow size={16} />
                  {currentTheme}
                </span>
              </div>
              <div className="hero-metadata">
                <div>
                  <h1 className="hero-title">{currentCopy.invalidTitle}</h1>
                  <p className="hero-subtitle">{currentCopy.invalidDescription}</p>
                </div>
                <div className="template-link-row">
                  <Link className="shell-link-button" href="/demo">
                    <Workflow size={16} />
                    <span>{currentCopy.openAction}</span>
                  </Link>
                  <Link className="shell-link-button" href="/">
                    <LayoutDashboard size={16} />
                    <span>{currentCopy.dashboard}</span>
                  </Link>
                  <Link className="shell-link-button" href="/tasks">
                    <ListTodo size={16} />
                    <span>{currentCopy.tasks}</span>
                  </Link>
                </div>
              </div>
            </section>
            <section className="modules-panel">
              <EmptyState
                locale={currentLocale}
                title={{ zh: currentCopy.invalidTitle, en: currentCopy.invalidTitle }}
                description={{ zh: currentCopy.invalidDescription, en: currentCopy.invalidDescription }}
                actionLabel={{ zh: currentCopy.openAction, en: currentCopy.openAction }}
              />
            </section>
            <MockDataNotice locale={currentLocale} compact />

          <section className="control-panel">
              <DemoModuleSwitcher locale={currentLocale} />
            </section>
          </div>
        </section>
      </main>
    );
  }

  const reportColumns = buildReportColumns(demoData.reportRows);

  return (
    <main className="main-frame module-center-page">
      <section className="module-center-shell">
        <div className="shell-backdrop" />
        <div className="dashboard-content module-center-content">
          <section className="hero-panel module-center-hero">
            <div className="eyebrow-row">
              <span className="brand-mark">
                <span className="brand-dot" />
                ME Demo Workspace
              </span>
              <span className="locale-chip">
                <Workflow size={16} />
                {currentTheme}
              </span>
            </div>
            <div className="hero-metadata">
              <div>
                <h1 className="hero-title">{getLocalizedText(moduleItem.name, currentLocale)}</h1>
                <p className="hero-subtitle">{getLocalizedText(demoData.scenario, currentLocale)}</p>
                <p className="hero-subtitle-zh">{getLocalizedText(demoData.summary, currentLocale)}</p>
                <div className="template-chip-row">
                  <span className="template-chip template-chip--type">{currentCopy.summary}</span>
                  <span className="template-chip">{currentCopy.prototypeStatus}</span>
                </div>
              </div>
              <div className="template-link-row">
                <Link className="shell-link-button" href="/demo">
                  <Workflow size={16} />
                  <span>{currentCopy.back}</span>
                </Link>
                <Link className="shell-link-button" href="/">
                  <LayoutDashboard size={16} />
                  <span>{currentCopy.dashboard}</span>
                </Link>
                <Link className="shell-link-button" href="/modules">
                  <Layers3 size={16} />
                  <span>{currentCopy.modules}</span>
                </Link>
                <Link className="shell-link-button" href="/templates">
                  <LayoutTemplate size={16} />
                  <span>{currentCopy.templates}</span>
                </Link>
                <Link className="shell-link-button" href="/tasks">
                  <ListTodo size={16} />
                  <span>{currentCopy.tasks}</span>
                </Link>
                <Link className="shell-link-button" href="/layout-engine">
                  <PanelTopClose size={16} />
                  <span>{currentCopy.layoutEngine}</span>
                </Link>
                <Link className="shell-link-button" href="/components">
                  <Blocks size={16} />
                  <span>{currentCopy.components}</span>
                </Link>
              </div>
            </div>
            <div className="module-chip-row">
              <StatusChip label={moduleItem.status} locale={currentLocale} tone="brand" size="sm" />
              <StatusChip label={moduleItem.plan} locale={currentLocale} tone="info" size="sm" />
              <StatusChip label={demoData.detailRecord.status ?? "demo"} locale={currentLocale} tone="success" size="sm" />
            </div>
          </section>

          <MockDataNotice locale={currentLocale} compact />

          <section className="control-panel">
            <div className="panel-header">
              <div>
                <h2 className="shell-title">{currentLocale === "zh" ? "模块切换" : "Module Switcher"}</h2>
                <p className="shell-copy">
                  {currentLocale === "zh"
                    ? "同一套 ME 组件与本地 mock data 支撑六个模块演示页。"
                    : "The same ME component system and local mock data power all six demo pages."}
                </p>
              </div>
            </div>
            <DemoModuleSwitcher locale={currentLocale} activeModuleCode={moduleCode} />
          </section>

          <section className="modules-panel">
            <ActionBar
              locale={currentLocale}
              primaryAction={{ key: "primary", label: demoData.ctaPlaceholders[0] }}
              secondaryActions={demoData.ctaPlaceholders.slice(1).map((action, index) => ({ key: `secondary-${index}`, label: action }))}
              bulkActionLabel={{ zh: "演示动作占位", en: "Demo Action Placeholder" }}
            />
          </section>

          <section className="modules-panel">
            <div className="template-kpi-grid">
              {demoData.kpis.map((metric) => (
                <KpiCard
                  key={metric.label.en}
                  locale={currentLocale}
                  label={metric.label}
                  value={metric.value}
                  trend={metric.trend}
                  description={metric.description}
                  tone={metric.tone ?? "brand"}
                />
              ))}
            </div>
          </section>

          <section className="demo-section-grid">
            <section className="modules-panel">
              <div className="panel-header">
                <div>
                  <h2 className="shell-title">{getLocalizedText(listingSchema.title, currentLocale)}</h2>
                  <p className="shell-copy">{currentCopy.listing}</p>
                </div>
              </div>
              <FilterBar
                locale={currentLocale}
                filters={listingSchema.filters}
                searchPlaceholder={{ zh: "搜索演示记录", en: "Search demo records" }}
                actionSlot={
                  <div className="template-tab-row">
                    {demoData.statusDistribution.map((item) => (
                      <StatusChip key={item.label.en} label={getLocalizedText(item.label, currentLocale)} locale={currentLocale} tone={item.tone ?? "info"} size="sm" />
                    ))}
                  </div>
                }
              />
              <div className="template-listing-shell">
                <section className="template-card template-mobile-records">
                  <CardList
                    locale={currentLocale}
                    items={demoData.listingRows.map((row, index) => ({
                      id: `${moduleCode}-listing-${index}`,
                      title: row[listingSchema.columns[0]?.key] ?? `Row ${index + 1}`,
                      subtitle: row[listingSchema.columns[1]?.key] ?? "--",
                      meta: row[listingSchema.columns[2]?.key] ?? "--",
                      status: row.status ?? row.stockStatus ?? row.priority,
                      actionLabel: currentCopy.view,
                    }))}
                  />
                </section>
                <section className="template-card template-table-card">
                  <DataTable locale={currentLocale} columns={listingSchema.columns} rows={demoData.listingRows} />
                </section>
                <RightDrawer
                  locale={currentLocale}
                  title={detailSchema.title}
                  description={{ zh: "演示详情与上下文占位。", en: "Demo detail and context placeholder." }}
                  alwaysVisible
                >
                  <DetailPanel
                    locale={currentLocale}
                    title={detailSchema.title}
                    description={detailSchema.description}
                    sections={demoData.detailSections}
                  />
                </RightDrawer>
              </div>
            </section>

            <section className="modules-panel">
              <div className="panel-header">
                <div>
                  <h2 className="shell-title">{getLocalizedText(issueSchema.title, currentLocale)}</h2>
                  <p className="shell-copy">{currentCopy.issues}</p>
                </div>
              </div>
              <CardList
                locale={currentLocale}
                items={demoData.issues.map((issue) => ({
                  id: issue.id,
                  title: issue.title,
                  subtitle: issue.owner,
                  meta: issue.dueDate,
                  status: issue.severity,
                  actionLabel: currentCopy.handle,
                }))}
              />
              <Timeline locale={currentLocale} title={{ zh: "活动时间线", en: "Activity Timeline" }} items={demoData.timeline} />
            </section>
          </section>

          <section className="demo-section-grid demo-section-grid--report">
            <section className="modules-panel">
              <div className="panel-header">
                <div>
                  <h2 className="shell-title">{getLocalizedText(reportSchema.title, currentLocale)}</h2>
                  <p className="shell-copy">{currentCopy.report}</p>
                </div>
              </div>
              <div className="demo-distribution-row">
                {demoData.statusDistribution.map((item) => (
                  <div key={item.label.en} className="module-metric">
                    <span>{getLocalizedText(item.label, currentLocale)}</span>
                    <strong>{item.value}</strong>
                  </div>
                ))}
              </div>
              <div className="template-card">
                <DataTable locale={currentLocale} columns={reportColumns} rows={demoData.reportRows} />
              </div>
            </section>

            <section className="modules-panel">
              <div className="panel-header">
                <div>
                  <h2 className="shell-title">{getLocalizedText(formSchema.title, currentLocale)}</h2>
                  <p className="shell-copy">{currentCopy.form}</p>
                </div>
              </div>
              <div className="template-form-shell">
                {demoData.formPlaceholders.map((section) => (
                  <section key={section.title.en} className="template-card">
                    <DetailPanel
                      locale={currentLocale}
                      title={section.title}
                      description={section.description}
                      sections={[
                        {
                          title: section.title,
                          rows: section.fields.map((field) => ({
                            label: getLocalizedText(field.label, currentLocale),
                            value: field.value,
                          })),
                        },
                      ]}
                    />
                  </section>
                ))}
              </div>
            </section>
          </section>
        </div>
      </section>
    </main>
  );
}
