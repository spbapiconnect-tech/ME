"use client";

import Link from "next/link";
import { Blocks, LayoutTemplate, Layers3, Workflow } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { DetailLayout } from "@/components/layout/detail-layout";
import { FormLayout } from "@/components/layout/form-layout";
import { IssueLayout } from "@/components/layout/issue-layout";
import { ListingLayout } from "@/components/layout/listing-layout";
import { ReportLayout } from "@/components/layout/report-layout";
import { SettingsLayout } from "@/components/layout/settings-layout";
import { createPageTemplateDemoData, getPageSchema, pageTypeOrder, templateModuleCodes } from "@/config/page-schemas";
import { getModuleByCode } from "@/lib/modules";
import { useUiPreferencesStore } from "@/stores/ui-preferences";
import type { SupportedLocale, ThemeMode } from "@/types/module";
import type { ModulePageType } from "@/types/page-schema";

const textCatalog = {
  en: {
    title: "ME Page Templates",
    subtitle: "Schema-driven reusable layouts for future module pages.",
    description: "This page uses placeholder schemas and placeholder data only. No real business logic or API integration is included.",
    module: "Module",
    pageType: "Page Type",
    back: "Back To Dashboard",
    moduleCenter: "Open Module Center",
    components: "Open Core Components",
    demo: "Open Demo Workspace",
  },
  zh: {
    title: "ME Page Templates",
    subtitle: "面向未来模块页面的 schema-driven 标准模板演示。",
    description: "当前页面只使用占位 schema 与占位数据，不包含真实业务逻辑或 API 集成。",
    module: "模块",
    pageType: "页面类型",
    back: "返回 Dashboard",
    moduleCenter: "打开模块中心",
    components: "打开核心组件",
    demo: "打开 Demo Workspace",
  },
} as const;

const pageTypeLabels: Record<SupportedLocale, Record<ModulePageType, string>> = {
  en: {
    dashboard: "Dashboard",
    listing: "Listing",
    detail: "Detail",
    issue: "Issue",
    form: "Form",
    report: "Report",
    settings: "Settings",
  },
  zh: {
    dashboard: "Dashboard",
    listing: "Listing",
    detail: "Detail",
    issue: "Issue",
    form: "Form",
    report: "Report",
    settings: "Settings",
  },
};

const layoutMap = {
  dashboard: DashboardLayout,
  listing: ListingLayout,
  detail: DetailLayout,
  issue: IssueLayout,
  form: FormLayout,
  report: ReportLayout,
  settings: SettingsLayout,
} as const;

export function TemplateDemo() {
  const locale = useUiPreferencesStore((state) => state.locale);
  const theme = useUiPreferencesStore((state) => state.theme);
  const hydrated = useUiPreferencesStore((state) => state.hydrated);
  const hydrate = useUiPreferencesStore((state) => state.hydrate);
  const [moduleCode, setModuleCode] = useState<string>(templateModuleCodes[0]);
  const [pageType, setPageType] = useState<ModulePageType>("dashboard");

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
  const copy = textCatalog[currentLocale];
  const selectedModule = getModuleByCode(moduleCode);
  const schema = useMemo(() => getPageSchema(moduleCode, pageType), [moduleCode, pageType]);
  const demoData = useMemo(() => createPageTemplateDemoData(schema), [schema]);
  const SelectedLayout = layoutMap[pageType];

  return (
    <main className="main-frame module-center-page">
      <section className="module-center-shell">
        <div className="shell-backdrop" />
        <div className="dashboard-content module-center-content">
          <section className="hero-panel module-center-hero">
            <div className="eyebrow-row">
              <span className="brand-mark">
                <span className="brand-dot" />
                {copy.title}
              </span>
              <span className="locale-chip">
                <LayoutTemplate size={16} />
                {currentTheme}
              </span>
            </div>

            <div className="hero-metadata">
              <div>
                <h1 className="hero-title">{copy.title}</h1>
                <p className="hero-subtitle">{copy.subtitle}</p>
                <p className="hero-subtitle-zh">{copy.description}</p>
              </div>
              <div className="template-link-row">
                <Link className="shell-link-button" href="/">
                  <LayoutTemplate size={16} />
                  <span>{copy.back}</span>
                </Link>
                <Link className="shell-link-button" href="/modules">
                  <Layers3 size={16} />
                  <span>{copy.moduleCenter}</span>
                </Link>
                <Link className="shell-link-button" href="/demo">
                  <Workflow size={16} />
                  <span>{copy.demo}</span>
                </Link>
                <Link className="shell-link-button" href="/components">
                  <Blocks size={16} />
                  <span>{copy.components}</span>
                </Link>
              </div>
            </div>
          </section>

          <section className="control-panel">
            <div className="template-selector-grid">
              <label className="template-select-card">
                <span>{copy.module}</span>
                <select value={moduleCode} onChange={(event) => setModuleCode(event.target.value)}>
                  {templateModuleCodes.map((code) => {
                    const moduleItem = getModuleByCode(code);
                    return (
                      <option key={code} value={code}>
                        {moduleItem?.name[currentLocale] ?? code}
                      </option>
                    );
                  })}
                </select>
              </label>
              <label className="template-select-card">
                <span>{copy.pageType}</span>
                <select value={pageType} onChange={(event) => setPageType(event.target.value as ModulePageType)}>
                  {pageTypeOrder.map((type) => (
                    <option key={type} value={type}>
                      {pageTypeLabels[currentLocale][type]}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <div className="template-chip-row">
              <span className="template-chip">{selectedModule?.name[currentLocale]}</span>
              <span className="template-chip">{schema.layout}</span>
              <span className="template-chip">{schema.apiMapping.endpoint}</span>
            </div>
          </section>

          <SelectedLayout schema={schema} demoData={demoData} locale={currentLocale} />
        </div>
      </section>
    </main>
  );
}
