import Link from "next/link";

import { StatusChip } from "@/components/data/status-chip";
import { demoModuleCodes, demoModuleDataMap } from "@/data/demo";
import { getLocalizedText } from "@/lib/localized";
import { getModuleByCode } from "@/lib/modules";
import type { SupportedLocale } from "@/types/module";

interface DemoOverviewProps {
  locale: SupportedLocale;
}

export function DemoOverview({ locale }: DemoOverviewProps) {
  return (
    <section className="modules-panel">
      <div className="panel-header">
        <div>
          <h2 className="shell-title">{locale === "zh" ? "模块演示概览" : "Module Demo Overview"}</h2>
          <p className="shell-copy">
            {locale === "zh"
              ? "六个演示模块均使用本地 TypeScript mock data。"
              : "All six demo modules run on local TypeScript mock data."}
          </p>
        </div>
      </div>
      <div className="demo-overview-grid">
        {demoModuleCodes.map((code) => {
          const moduleItem = getModuleByCode(code);
          const demoData = demoModuleDataMap[code];

          if (!moduleItem) {
            return null;
          }

          return (
            <Link key={code} className="module-card demo-overview-card" href={`/demo/${code}`}>
              <div className="card-title-block">
                <p className="module-code">{code}</p>
                <h3 className="module-title">{getLocalizedText(moduleItem.name, locale)}</h3>
                <p className="module-short-name">{getLocalizedText(moduleItem.description, locale)}</p>
              </div>
              <p className="module-card-description">{getLocalizedText(demoData.summary, locale)}</p>
              <div className="module-chip-row">
                <StatusChip label={moduleItem.status} locale={locale} tone="brand" size="sm" />
                <StatusChip label={demoData.kpis[0]?.value ?? "--"} locale={locale} tone="success" size="sm" />
                <StatusChip label={demoData.kpis[1]?.value ?? "--"} locale={locale} tone="info" size="sm" />
              </div>
              <div className="demo-overview-metrics">
                {demoData.statusDistribution.slice(0, 3).map((item) => (
                  <div key={item.label.en} className="module-metric">
                    <span>{getLocalizedText(item.label, locale)}</span>
                    <strong>{item.value}</strong>
                  </div>
                ))}
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
