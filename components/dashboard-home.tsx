"use client";

import { Layers3, LayoutDashboard, PanelTopClose, Sparkles } from "lucide-react";
import { useEffect } from "react";

import { LanguageSwitcher } from "@/components/language-switcher";
import { ModuleCard } from "@/components/module-card";
import { ResponsiveShell } from "@/components/shell/responsive-shell";
import { ThemeSwitcher } from "@/components/theme-switcher";
import enMessages from "@/messages/en.json";
import zhMessages from "@/messages/zh.json";
import { useUiPreferencesStore } from "@/stores/ui-preferences";
import type { ModuleDefinition, SupportedLocale, ThemeMode } from "@/types/module";

const catalogs = {
  en: enMessages,
  zh: zhMessages,
} as const;

interface DashboardHomeProps {
  modules: ModuleDefinition[];
}

function getViewportLabel(width: number, shellLabels: (typeof enMessages)["shells"]) {
  if (width < 768) {
    return shellLabels.mobile;
  }

  if (width < 1200) {
    return shellLabels.tablet;
  }

  return shellLabels.desktop;
}

export function DashboardHome({ modules }: DashboardHomeProps) {
  const locale = useUiPreferencesStore((state) => state.locale);
  const setLocale = useUiPreferencesStore((state) => state.setLocale);
  const theme = useUiPreferencesStore((state) => state.theme);
  const setTheme = useUiPreferencesStore((state) => state.setTheme);
  const viewportLabel = useUiPreferencesStore((state) => state.viewportLabel);
  const setViewportLabel = useUiPreferencesStore((state) => state.setViewportLabel);
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

    const updateViewport = () => {
      setViewportLabel(getViewportLabel(window.innerWidth, catalogs[locale].shells));
    };

    updateViewport();
    window.addEventListener("resize", updateViewport);

    return () => window.removeEventListener("resize", updateViewport);
  }, [hydrated, locale, setViewportLabel, theme]);

  const currentLocale: SupportedLocale = hydrated ? locale : "en";
  const currentTheme: ThemeMode = hydrated ? theme : "bright";
  const messages = catalogs[currentLocale];

  return (
    <main className="main-frame">
      <div className="dashboard-shell">
        <div className="shell-backdrop" />
        <ResponsiveShell labels={messages.shells}>
          <div className="dashboard-content">
            <section className="hero-panel">
              <div className="eyebrow-row">
                <span className="brand-mark">
                  <span className="brand-dot" />
                  {messages.app.name}
                </span>
                <span className="milestone-chip">{messages.app.milestone}</span>
              </div>

              <div className="hero-metadata">
                <div>
                  <h1 className="hero-title">{messages.app.name}</h1>
                  <p className="hero-subtitle">{messages.app.subtitle}</p>
                  <p className="hero-subtitle-zh">{messages.app.subtitleZh}</p>
                </div>
                <span className="locale-chip">
                  <Sparkles size={16} />
                  {messages.common.currentTheme}: {messages.themes[currentTheme]}
                </span>
              </div>

              <p className="hero-summary">{messages.app.description}</p>

              <div className="hero-stats">
                <div className="hero-stat">
                  <strong>{modules.length}</strong>
                  <span>{messages.common.moduleCenter}</span>
                </div>
                <div className="hero-stat">
                  <strong>3</strong>
                  <span>{messages.common.supportedThemes}</span>
                </div>
                <div className="hero-stat">
                  <strong>2</strong>
                  <span>{messages.common.activeLanguage}</span>
                </div>
              </div>
            </section>

            <section className="control-panel">
              <div className="panel-header">
                <div>
                  <h2 className="shell-title">{messages.common.foundationStatus}</h2>
                  <p className="shell-copy">{messages.common.noBusinessLogic}</p>
                </div>
                <span className="locale-chip">
                  <PanelTopClose size={16} />
                  {messages.common.currentViewport}: {viewportLabel || getViewportLabel(1440, messages.shells)}
                </span>
              </div>

              <div className="control-row">
                <ThemeSwitcher
                  currentTheme={currentTheme}
                  onThemeChange={setTheme}
                  labels={messages.themes as Record<ThemeMode, string>}
                  title={messages.common.theme}
                />
                <LanguageSwitcher
                  currentLanguage={currentLocale}
                  onLanguageChange={setLocale}
                  labels={messages.languages as Record<SupportedLocale, string>}
                  title={messages.common.language}
                />
              </div>
            </section>

            <section className="modules-panel">
              <div className="panel-header">
                <div>
                  <h2 className="shell-title">{messages.common.moduleCenter}</h2>
                  <p className="shell-copy">{messages.common.bilingualReady}</p>
                </div>
                <span className="locale-chip">
                  <Layers3 size={16} />
                  {messages.common.dashboardReady}
                </span>
              </div>

              <div className="modules-grid">
                {modules.map((module) => (
                  <ModuleCard
                    key={module.code}
                    locale={currentLocale}
                    module={module}
                    labels={{
                      category: messages.common.category,
                      status: messages.common.status,
                      placeholderRoutes: messages.common.placeholderRoutes,
                      permissions: messages.common.permissions,
                      supportedThemes: messages.common.supportedThemes,
                      statusMap: messages.status,
                      categoryMap: messages.category,
                      themeMap: messages.themes,
                    }}
                  />
                ))}
              </div>
            </section>

            <section className="info-grid">
              <article className="info-card">
                <div className="panel-header">
                  <h3 className="shell-title">{messages.shells.mobile}</h3>
                  <LayoutDashboard size={18} />
                </div>
                <p>{messages.shells.mobileCopy}</p>
              </article>
              <article className="info-card">
                <div className="panel-header">
                  <h3 className="shell-title">{messages.shells.tablet}</h3>
                  <LayoutDashboard size={18} />
                </div>
                <p>{messages.shells.tabletCopy}</p>
              </article>
              <article className="info-card">
                <div className="panel-header">
                  <h3 className="shell-title">{messages.shells.desktop}</h3>
                  <LayoutDashboard size={18} />
                </div>
                <p>{messages.shells.desktopCopy}</p>
              </article>
            </section>
          </div>
        </ResponsiveShell>
      </div>
    </main>
  );
}
