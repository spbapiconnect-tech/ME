import Link from "next/link";

import { demoDashboardData } from "@/data/demo";
import { getLocalizedText } from "@/lib/localized";
import { getModuleByCode } from "@/lib/modules";
import type { SupportedLocale } from "@/types/module";

interface DemoFlowProps {
  locale: SupportedLocale;
}

export function DemoFlow({ locale }: DemoFlowProps) {
  return (
    <section className="modules-panel">
      <div className="panel-header">
        <div>
          <h2 className="shell-title">
            {locale === "zh" ? "跨模块演示流" : "Cross-Module Demo Flow"}
          </h2>
          <p className="shell-copy">
            {locale === "zh"
              ? "POS Sales Signal → Inventory Risk → Procurement Suggestion → Supplier Check → Task Assignment → Education / SOP Follow-up"
              : "POS Sales Signal -> Inventory Risk -> Procurement Suggestion -> Supplier Check -> Task Assignment -> Education / SOP Follow-up"}
          </p>
        </div>
      </div>
      <div className="demo-flow-grid">
        {demoDashboardData.flowSteps.map((step, index) => {
          const moduleItem = getModuleByCode(step.moduleCode);

          return (
            <article key={step.id} className="demo-flow-step">
              <div className="demo-flow-step-top">
                <span className="module-chip">{index + 1}</span>
                {moduleItem ? (
                  <Link className="module-chip module-chip--plan" href={`/demo/${step.moduleCode}`}>
                    {getLocalizedText(moduleItem.shortName, locale)}
                  </Link>
                ) : null}
              </div>
              <h3>{getLocalizedText(step.title, locale)}</h3>
              <p>{getLocalizedText(step.description, locale)}</p>
              <strong>{step.signal}</strong>
            </article>
          );
        })}
      </div>
    </section>
  );
}
