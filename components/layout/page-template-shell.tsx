import type { ReactNode } from "react";

import type { LocalizedText, SupportedLocale } from "@/types/module";
import type { PageSchemaDefinition, ResponsiveLayoutPattern } from "@/types/page-schema";

const pageTypeLabels = {
  dashboard: { zh: "Dashboard", en: "Dashboard" },
  listing: { zh: "Listing", en: "Listing" },
  detail: { zh: "Detail", en: "Detail" },
  issue: { zh: "Issue", en: "Issue" },
  form: { zh: "Form", en: "Form" },
  report: { zh: "Report", en: "Report" },
  settings: { zh: "Settings", en: "Settings" },
} as const;

const patternLabels: Record<ResponsiveLayoutPattern, LocalizedText> = {
  "mobile-card-list": { zh: "移动卡片列表", en: "Mobile Card List" },
  "mobile-single-column": { zh: "移动单列", en: "Mobile Single Column" },
  "tablet-split-view": { zh: "平板分栏预览", en: "Tablet Split View" },
  "tablet-workspace": { zh: "平板工作区", en: "Tablet Workspace" },
  "desktop-data-grid": { zh: "桌面数据网格", en: "Desktop Data Grid" },
  "desktop-detail-drawer": { zh: "桌面详情抽屉", en: "Desktop Detail Drawer" },
  "desktop-board": { zh: "桌面看板", en: "Desktop Board" },
  "desktop-settings-panel": { zh: "桌面设置面板", en: "Desktop Settings Panel" },
};

export function getLocalizedText(text: LocalizedText, locale: SupportedLocale) {
  return text[locale];
}

function getUniquePatterns(schema: PageSchemaDefinition) {
  return Array.from(
    new Set([
      ...schema.responsiveBehavior.mobile,
      ...schema.responsiveBehavior.tablet,
      ...schema.responsiveBehavior.desktop,
    ]),
  );
}

interface PageTemplateShellProps {
  schema: PageSchemaDefinition;
  locale: SupportedLocale;
  actions?: ReactNode;
  footer?: ReactNode;
  children: ReactNode;
}

export function PageTemplateShell({ schema, locale, actions, footer, children }: PageTemplateShellProps) {
  const patterns = getUniquePatterns(schema);

  return (
    <section className="template-layout-shell">
      <header className="template-layout-header">
        <div className="template-layout-copy">
          <div className="template-chip-row">
            <span className="template-chip template-chip--type">
              {getLocalizedText(pageTypeLabels[schema.pageType], locale)}
            </span>
            <span className="template-chip">{schema.layout}</span>
          </div>
          <h2 className="template-layout-title">{getLocalizedText(schema.title, locale)}</h2>
          <p className="template-layout-description">{getLocalizedText(schema.description, locale)}</p>
          <div className="template-chip-row">
            {patterns.map((pattern) => (
              <span key={pattern} className="template-chip">
                {getLocalizedText(patternLabels[pattern], locale)}
              </span>
            ))}
          </div>
        </div>
        {actions ? <div className="template-layout-actions">{actions}</div> : null}
      </header>

      <div className="template-layout-content">{children}</div>
      {footer ? <footer className="template-layout-footer">{footer}</footer> : null}
    </section>
  );
}
