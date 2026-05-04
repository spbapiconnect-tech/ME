"use client";

import Link from "next/link";
import { Blocks, Layers3, LayoutDashboard, LayoutTemplate, Workflow } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { ModuleGrid } from "@/components/modules/module-grid";
import { ModuleSwitcher } from "@/components/modules/module-switcher";
import enMessages from "@/messages/en.json";
import zhMessages from "@/messages/zh.json";
import { useUiPreferencesStore } from "@/stores/ui-preferences";
import type { ModuleCategory, ModuleDefinition, SupportedLocale, ThemeMode } from "@/types/module";
import { getModuleStats, getModulesByCategory } from "@/lib/modules";

type ModuleFilter = "all" | ModuleCategory;

const catalogs = {
  en: enMessages,
  zh: zhMessages,
} as const;

const categoryDescriptions: Record<SupportedLocale, Record<ModuleCategory, string>> = {
  en: {
    core: "Execution-facing modules that shape the first store operations foundation.",
    control: "Operational control surfaces that coordinate reporting, approvals, and branch visibility.",
    admin: "Platform governance modules registered early for future configuration and platform control.",
    future: "Strategic modules intentionally registered now but not implemented in this milestone.",
  },
  zh: {
    core: "面向执行的一线核心模块，是门店运营基础层的第一批能力。",
    control: "用于报表、审批、分店协同等运营控制面的模块分组。",
    admin: "面向平台治理与配置管理的注册模块，本里程碑仅做注册展示。",
    future: "已经提前注册、但本阶段不实现页面与业务逻辑的未来模块。",
  },
};

interface ModuleCenterProps {
  modules: ModuleDefinition[];
}

export function ModuleCenter({ modules }: ModuleCenterProps) {
  const locale = useUiPreferencesStore((state) => state.locale);
  const theme = useUiPreferencesStore((state) => state.theme);
  const hydrated = useUiPreferencesStore((state) => state.hydrated);
  const hydrate = useUiPreferencesStore((state) => state.hydrate);
  const [activeFilter, setActiveFilter] = useState<ModuleFilter>("all");

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
  const messages = catalogs[currentLocale];
  const moduleStats = useMemo(() => getModuleStats(modules), [modules]);
  const groupedModules = useMemo(() => getModulesByCategory(modules), [modules]);

  const filterCounts = {
    all: modules.length,
    core: groupedModules.core.length,
    control: groupedModules.control.length,
    admin: groupedModules.admin.length,
    future: groupedModules.future.length,
  } satisfies Record<ModuleFilter, number>;

  const filterLabels = {
    all: messages.common.allModules,
    core: messages.category.core,
    control: messages.category.control,
    admin: messages.category.admin,
    future: messages.category.future,
  } satisfies Record<ModuleFilter, string>;

  const groupsToRender = activeFilter === "all"
    ? groupedModules
    : {
        core: activeFilter === "core" ? groupedModules.core : [],
        control: activeFilter === "control" ? groupedModules.control : [],
        admin: activeFilter === "admin" ? groupedModules.admin : [],
        future: activeFilter === "future" ? groupedModules.future : [],
      };

  return (
    <main className="main-frame module-center-page">
      <section className="module-center-shell">
        <div className="shell-backdrop" />
        <div className="dashboard-content module-center-content">
          <section className="hero-panel module-center-hero">
            <div className="eyebrow-row">
              <span className="brand-mark">
                <span className="brand-dot" />
                {messages.common.moduleCenter}
              </span>
              <span className="locale-chip">
                <Workflow size={16} />
                {messages.themes[currentTheme]}
              </span>
            </div>

            <div className="hero-metadata">
              <div>
                <h1 className="hero-title">{messages.common.moduleRegistry}</h1>
                <p className="hero-subtitle">{messages.common.moduleCenterSummary}</p>
                <p className="hero-subtitle-zh">{messages.common.enabledCoreModules}</p>
              </div>
              <div className="template-link-row">
                <Link className="shell-link-button" href="/">
                  <LayoutDashboard size={16} />
                  <span>{messages.common.backToDashboard}</span>
                </Link>
                <Link className="shell-link-button" href="/templates">
                  <LayoutTemplate size={16} />
                  <span>{messages.common.openTemplates}</span>
                </Link>
                <Link className="shell-link-button shell-link-button--primary" href="/demo">
                  <Workflow size={16} />
                  <span>{messages.common.openDemo}</span>
                </Link>
                <Link className="shell-link-button" href="/components">
                  <Blocks size={16} />
                  <span>{messages.common.openComponents}</span>
                </Link>
              </div>
            </div>
          </section>

          <section className="module-overview-grid">
            <article className="module-stat-card">
              <span>{messages.common.totalModules}</span>
              <strong>{moduleStats.total}</strong>
            </article>
            <article className="module-stat-card">
              <span>{messages.common.enabledModules}</span>
              <strong>{moduleStats.enabled}</strong>
            </article>
            <article className="module-stat-card">
              <span>{messages.common.comingSoonModules}</span>
              <strong>{moduleStats.comingSoon}</strong>
            </article>
            <article className="module-stat-card">
              <span>{messages.common.betaModules}</span>
              <strong>{moduleStats.beta}</strong>
            </article>
          </section>

          <section className="control-panel">
            <div className="panel-header">
              <div>
                <h2 className="shell-title">{messages.common.moduleCategoryGroups}</h2>
                <p className="shell-copy">{messages.common.moduleCenterDescription}</p>
              </div>
              <span className="locale-chip">
                <Layers3 size={16} />
                {messages.common.allRegisteredModules}
              </span>
            </div>

            <ModuleSwitcher
              activeFilter={activeFilter}
              counts={filterCounts}
              labels={filterLabels}
              onChange={setActiveFilter}
            />
          </section>

          {(["core", "control", "admin", "future"] as ModuleCategory[]).map((category) => {
            const categoryModules = groupsToRender[category];

            if (categoryModules.length === 0) {
              return null;
            }

            return (
              <section key={category} className="modules-panel module-group-section">
                <div className="panel-header module-group-header">
                  <div>
                    <h2 className="shell-title">{messages.category[category]}</h2>
                    <p className="shell-copy">{categoryDescriptions[currentLocale][category]}</p>
                  </div>
                  <span className="module-chip">{categoryModules.length}</span>
                </div>

                <ModuleGrid
                  modules={categoryModules}
                  locale={currentLocale}
                  variant="detailed"
                  labels={{
                    category: messages.common.category,
                    status: messages.common.status,
                    plan: messages.common.plan,
                    routeCount: messages.common.routeCount,
                    permissionCount: messages.common.permissionCount,
                    apiScopeCount: messages.common.apiScopeCount,
                    ownerRole: messages.common.ownerRole,
                    sourceMapping: messages.common.sourceMapping,
                    statusMap: messages.status,
                    categoryMap: messages.category,
                    planMap: messages.plan,
                  }}
                />
              </section>
            );
          })}
        </div>
      </section>
    </main>
  );
}
