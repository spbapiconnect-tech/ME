import { getLocalizedText } from "@/lib/localized";
import type { SupportedLocale } from "@/types/module";
import type { SkinConfig } from "@/types/skin";

interface SkinPreviewCardProps {
  skin: SkinConfig;
  locale: SupportedLocale;
}

export function SkinPreviewCard({ skin, locale }: SkinPreviewCardProps) {
  return (
    <article className="module-card layout-engine-card">
      <div className="card-title-block">
        <p className="module-code">{skin.code}</p>
        <h3 className="module-title">{getLocalizedText(skin.name, locale)}</h3>
        <p className="module-short-name">{getLocalizedText(skin.description, locale)}</p>
      </div>
      <div className="module-chip-row">
        <span className="module-chip">{skin.preferredShell}</span>
        <span className="module-chip">{skin.navigation}</span>
        <span className="module-chip">{skin.componentStyle}</span>
      </div>
      <div className="task-card-tags">
        {skin.roleTargets.map((role) => (
          <span key={role} className="module-chip">
            {role}
          </span>
        ))}
      </div>
    </article>
  );
}
