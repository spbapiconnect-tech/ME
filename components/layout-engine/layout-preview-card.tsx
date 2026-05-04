import { getLocalizedText } from "@/lib/localized";
import type { LayoutRendererConfig } from "@/types/layout-engine";
import type { SupportedLocale } from "@/types/module";

interface LayoutPreviewCardProps {
  config: LayoutRendererConfig;
  locale: SupportedLocale;
}

export function LayoutPreviewCard({ config, locale }: LayoutPreviewCardProps) {
  return (
    <article className="module-card layout-engine-card">
      <div className="card-title-block">
        <p className="module-code">{config.pageType}</p>
        <h3 className="module-title">{config.variant}</h3>
        <p className="module-short-name">{getLocalizedText(config.notes, locale)}</p>
      </div>
      <div className="module-chip-row">
        <span className="module-chip">{config.responsiveMode}</span>
        <span className="module-chip">{config.density}</span>
        <span className="module-chip">{config.componentVariant}</span>
      </div>
      <div className="task-card-tags">
        {config.capabilities.map((capability) => (
          <span key={capability} className="module-chip">
            {capability}
          </span>
        ))}
      </div>
    </article>
  );
}
