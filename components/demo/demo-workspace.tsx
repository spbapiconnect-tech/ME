"use client";

import Link from "next/link";
import { Blocks, Layers3, LayoutDashboard, LayoutTemplate, ListTodo, Workflow } from "lucide-react";
import { useEffect } from "react";

import { KpiCard } from "@/components/data/kpi-card";
import { DemoFlow } from "@/components/demo/demo-flow";
import { DemoOverview } from "@/components/demo/demo-overview";
import { DemoModuleSwitcher } from "@/components/demo/demo-module-switcher";
import { MockDataNotice } from "@/components/demo/mock-data-notice";
import { demoDashboardData } from "@/data/demo";
import { useUiPreferencesStore } from "@/stores/ui-preferences";
import type { SupportedLocale, ThemeMode } from "@/types/module";

const copy = {
  en: {
    back: "Back To Dashboard",
    modules: "Open Module Center",
    templates: "Open Page Templates",
    components: "Open Core Components",
    tasks: "Open Task Engine",
    summary: "Sales Demo Ready Prototype",
  },
  zh: {
    back: "返回 Dashboard",
    modules: "打开模块中心",
    templates: "打开页面模板",
    components: "打开核心组件",
    tasks: "打开任务引擎",
    summary: "适合销售演示的原型",
  },
} as const;

export function DemoWorkspace() {
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

  return (
    <main className="main-frame module-center-page">
      <section className="module-center-shell">
        <div className="shell-backdrop" />
        <div className="dashboard-content module-center-content">
          <section className="hero-panel module-center-hero">
            <div className="eyebrow-row">
              <span className="brand-mark">
                <span className="brand-dot" />
                {demoDashboardData.title[currentLocale]}
              </span>
              <span className="locale-chip">
                <Workflow size={16} />
                {currentTheme}
              </span>
            </div>
            <div className="hero-metadata">
              <div>
                <h1 className="hero-title">{demoDashboardData.title[currentLocale]}</h1>
                <p className="hero-subtitle">{demoDashboardData.subtitle[currentLocale]}</p>
                <p className="hero-subtitle-zh">{demoDashboardData.description[currentLocale]}</p>
                <div className="template-chip-row">
                  <span className="template-chip template-chip--type">{currentCopy.summary}</span>
                  <span className="template-chip">v0.4.1</span>
                </div>
              </div>
              <div className="template-link-row">
                <Link className="shell-link-button" href="/">
                  <LayoutDashboard size={16} />
                  <span>{currentCopy.back}</span>
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
                <Link className="shell-link-button" href="/components">
                  <Blocks size={16} />
                  <span>{currentCopy.components}</span>
                </Link>
              </div>
            </div>
          </section>

          <MockDataNotice locale={currentLocale} />

          <section className="modules-panel">
            <div className="panel-header">
              <div>
                <h2 className="shell-title">{currentLocale === "zh" ? "演示指标" : "Demo Metrics"}</h2>
                <p className="shell-copy">
                  {currentLocale === "zh"
                    ? "这些指标仅用于展示本地 mock data 流，不连接任何真实系统。"
                    : "These metrics visualize a local mock-data flow only and do not connect any real systems."}
                </p>
              </div>
            </div>
            <div className="template-kpi-grid">
              {demoDashboardData.heroMetrics.map((metric) => (
                <KpiCard key={metric.label.en} locale={currentLocale} label={metric.label} value={metric.value} tone="brand" />
              ))}
            </div>
          </section>

          <section className="control-panel">
            <div className="panel-header">
              <div>
                <h2 className="shell-title">{currentLocale === "zh" ? "快速切换模块" : "Jump To Modules"}</h2>
                <p className="shell-copy">
                  {currentLocale === "zh"
                    ? "所有模块页都使用 data/demo/ 中的本地 TypeScript 数据。"
                    : "Each module page uses local TypeScript data from data/demo/."}
                </p>
              </div>
            </div>
            <DemoModuleSwitcher locale={currentLocale} />
          </section>

          <DemoOverview locale={currentLocale} />
          <DemoFlow locale={currentLocale} />
        </div>
      </section>
    </main>
  );
}
