"use client";

import Link from "next/link";
import { Blocks, LayoutTemplate, ListTodo, Workflow } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { MockDataNotice } from "@/components/demo/mock-data-notice";
import { layoutRegistry, skinRegistry, taskToDisplayRecord } from "@/config/layout-engine";
import { getCoreModules } from "@/lib/modules";
import { taskRecords } from "@/data/tasks/task-records";
import { useUiPreferencesStore } from "@/stores/ui-preferences";
import type { LayoutPageType, LayoutVariant } from "@/types/layout-engine";
import type { SupportedLocale, ThemeMode } from "@/types/module";
import type { SkinCode } from "@/types/skin";

import { LayoutPreviewCard } from "@/components/layout-engine/layout-preview-card";
import { ModulePageRenderer } from "@/components/layout-engine/module-page-renderer";
import { SkinPreviewCard } from "@/components/layout-engine/skin-preview-card";
import { DisplayRecordPreview } from "@/components/layout-engine/display-record-preview";

const pageTypes: LayoutPageType[] = ["dashboard", "listing", "detail", "issue", "form", "report", "settings"];

const copy = {
  en: {
    subtitle: "UI Shell Swap Foundation",
    explanation:
      "Change layout and skin foundations without rewriting every module page or touching business logic, permissions, task contracts, or adapters.",
    templates: "Open Page Templates",
    components: "Open Core Components",
    demo: "Open Demo Workspace",
    tasks: "Open Task Engine",
    controls: "Foundation Controls",
    registry: "Layout And Skin Registries",
    display: "Display Model Preview",
    renderer: "ModulePageRenderer Preview",
  },
  zh: {
    subtitle: "UI Shell Swap Foundation",
    explanation: "在不改动每个模块页面或业务逻辑、权限、任务契约、适配器的前提下，切换布局与皮肤基础。",
    templates: "打开页面模板",
    components: "打开核心组件",
    demo: "打开 Demo Workspace",
    tasks: "打开 Task Engine",
    controls: "基础控制台",
    registry: "布局与皮肤注册表",
    display: "显示模型预览",
    renderer: "ModulePageRenderer 预览",
  },
} as const;

export function LayoutEnginePage() {
  const locale = useUiPreferencesStore((state) => state.locale);
  const theme = useUiPreferencesStore((state) => state.theme);
  const hydrated = useUiPreferencesStore((state) => state.hydrated);
  const hydrate = useUiPreferencesStore((state) => state.hydrate);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    if (!hydrated) return;
    document.documentElement.dataset.theme = theme;
    document.documentElement.lang = locale === "zh" ? "zh-CN" : "en";
  }, [hydrated, locale, theme]);

  const currentLocale: SupportedLocale = hydrated ? locale : "en";
  const currentTheme: ThemeMode = hydrated ? theme : "bright";
  const currentCopy = copy[currentLocale];
  const coreModules = getCoreModules();

  const [moduleCode, setModuleCode] = useState(coreModules[0]?.code ?? "procurement");
  const [pageType, setPageType] = useState<LayoutPageType>("listing");
  const [skinCode, setSkinCode] = useState<SkinCode>("classic");
  const [layoutVariant, setLayoutVariant] = useState<LayoutVariant>("classic");

  const availableVariants = useMemo(
    () => layoutRegistry.filter((entry) => entry.pageType === pageType).map((entry) => entry.variant),
    [pageType],
  );

  const resolvedLayoutVariant = useMemo(
    () => (availableVariants.includes(layoutVariant) ? layoutVariant : (availableVariants[0] ?? "classic")),
    [availableVariants, layoutVariant],
  );

  const previewRecords = useMemo(() => taskRecords.slice(0, 3).map((task) => taskToDisplayRecord(task)), []);

  return (
    <main className="main-frame module-center-page">
      <section className="module-center-shell">
        <div className="shell-backdrop" />
        <div className="dashboard-content module-center-content">
          <section className="hero-panel module-center-hero">
            <div className="eyebrow-row">
              <span className="brand-mark">
                <span className="brand-dot" />
                ME Layout Engine
              </span>
              <span className="locale-chip">
                <Workflow size={16} />
                {currentTheme}
              </span>
            </div>
            <div className="hero-metadata">
              <div>
                <h1 className="hero-title">ME Layout Engine</h1>
                <p className="hero-subtitle">{currentCopy.subtitle}</p>
                <p className="hero-subtitle-zh">{currentCopy.explanation}</p>
              </div>
              <div className="template-link-row">
                <Link className="shell-link-button shell-link-button--primary" href="/templates">
                  <LayoutTemplate size={16} />
                  <span>{currentCopy.templates}</span>
                </Link>
                <Link className="shell-link-button" href="/components">
                  <Blocks size={16} />
                  <span>{currentCopy.components}</span>
                </Link>
                <Link className="shell-link-button" href="/demo">
                  <Workflow size={16} />
                  <span>{currentCopy.demo}</span>
                </Link>
                <Link className="shell-link-button" href="/tasks">
                  <ListTodo size={16} />
                  <span>{currentCopy.tasks}</span>
                </Link>
              </div>
            </div>
          </section>

          <MockDataNotice
            locale={currentLocale}
            title={{ zh: "Layout Engine Foundation", en: "Layout Engine Foundation" }}
            message={{ zh: "该路由仅用于演示未来 UI Shell Swap 基础。", en: "This route only demonstrates the future UI shell swap foundation." }}
            detail={{ zh: "不连接真实业务逻辑、API、数据库或持久化设置。", en: "No real business logic, API, database, or persisted settings are connected." }}
            tags={[{ zh: "LayoutRegistry", en: "LayoutRegistry" }, { zh: "SkinRegistry", en: "SkinRegistry" }, { zh: "DisplayModel", en: "DisplayModel" }]}
          />

          <section className="modules-panel">
            <div className="panel-header">
              <div>
                <h2 className="shell-title">{currentCopy.controls}</h2>
                <p className="shell-copy">
                  {currentLocale === "zh"
                    ? "切换模块、页面类型、皮肤与布局变体，验证模块逻辑不需要一起重写。"
                    : "Switch module, page type, skin, and layout variant to verify module logic does not need to be rewritten."}
                </p>
              </div>
            </div>
            <div className="layout-engine-controls-grid">
              <label className="template-select-card">
                <span>{currentLocale === "zh" ? "模块" : "Module"}</span>
                <select value={moduleCode} onChange={(event) => setModuleCode(event.target.value)}>
                  {coreModules.map((moduleItem) => (
                    <option key={moduleItem.code} value={moduleItem.code}>
                      {moduleItem.name.en}
                    </option>
                  ))}
                </select>
              </label>
              <label className="template-select-card">
                <span>{currentLocale === "zh" ? "页面类型" : "Page Type"}</span>
                <select value={pageType} onChange={(event) => setPageType(event.target.value as LayoutPageType)}>
                  {pageTypes.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </label>
              <label className="template-select-card">
                <span>{currentLocale === "zh" ? "皮肤" : "Skin"}</span>
                <select value={skinCode} onChange={(event) => setSkinCode(event.target.value as SkinCode)}>
                  {skinRegistry.map((skin) => (
                    <option key={skin.code} value={skin.code}>
                      {skin.name.en}
                    </option>
                  ))}
                </select>
              </label>
              <label className="template-select-card">
                <span>{currentLocale === "zh" ? "布局变体" : "Layout Variant"}</span>
                <select value={resolvedLayoutVariant} onChange={(event) => setLayoutVariant(event.target.value as LayoutVariant)}>
                  {availableVariants.map((variant) => (
                    <option key={variant} value={variant}>
                      {variant}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </section>

          <section className="demo-section-grid">
            <section className="modules-panel">
              <div className="panel-header">
                <div>
                  <h2 className="shell-title">{currentCopy.registry}</h2>
                  <p className="shell-copy">
                    {currentLocale === "zh"
                      ? "LayoutRegistry 决定结构能力，SkinRegistry 决定视觉与壳层偏好。"
                      : "LayoutRegistry defines structure capabilities while SkinRegistry defines visual and shell preferences."}
                  </p>
                </div>
              </div>
              <div className="demo-overview-grid">
                {layoutRegistry.slice(0, 6).map((config) => (
                  <LayoutPreviewCard key={`${config.pageType}-${config.variant}`} config={config} locale={currentLocale} />
                ))}
              </div>
            </section>
            <section className="modules-panel">
              <div className="panel-header">
                <div>
                  <h2 className="shell-title">{currentLocale === "zh" ? "皮肤注册表" : "Skin Registry"}</h2>
                  <p className="shell-copy">
                    {currentLocale === "zh"
                      ? "不同角色、终端与视觉密度可以通过皮肤切换实现。"
                      : "Different roles, device contexts, and visual density can be handled via skin switching."}
                  </p>
                </div>
              </div>
              <div className="demo-overview-grid">
                {skinRegistry.map((skin) => (
                  <SkinPreviewCard key={skin.code} skin={skin} locale={currentLocale} />
                ))}
              </div>
            </section>
          </section>

          <section className="demo-section-grid">
            <section className="modules-panel">
              <div className="panel-header">
                <div>
                  <h2 className="shell-title">{currentCopy.display}</h2>
                  <p className="shell-copy">
                    {currentLocale === "zh"
                      ? "显示模型把不同模块记录转换为 UI-safe records。"
                      : "Display model adapters convert different module records into UI-safe records."}
                  </p>
                </div>
              </div>
              <DisplayRecordPreview locale={currentLocale} records={previewRecords} />
            </section>
            <section className="modules-panel">
              <div className="panel-header">
                <div>
                  <h2 className="shell-title">{currentCopy.renderer}</h2>
                  <p className="shell-copy">
                    {currentLocale === "zh"
                      ? "这是未来 renderer-based pages 的安全基础，不替换现有模块页。"
                      : "This is a safe base for future renderer-based pages and does not replace existing module pages yet."}
                  </p>
                </div>
              </div>
              <ModulePageRenderer
                moduleCode={moduleCode}
                pageType={pageType}
                skinCode={skinCode}
                layoutVariant={resolvedLayoutVariant}
                locale={currentLocale}
                records={previewRecords.map((record) => ({
                  id: record.id,
                  title: record.title,
                  subtitle: record.subtitle,
                  description: record.description,
                  status: record.status,
                  priority: record.priority,
                }))}
              />
            </section>
          </section>
        </div>
      </section>
    </main>
  );
}
