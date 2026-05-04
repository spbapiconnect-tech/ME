import type { LocalizedText, SupportedLocale } from "@/types/module";

import { getLocalizedText } from "@/lib/localized";
import { StatusChip } from "@/components/data/status-chip";

interface KpiCardProps {
  label: LocalizedText;
  locale: SupportedLocale;
  value: string;
  trend?: string;
  description?: LocalizedText;
  tone?: "neutral" | "success" | "warning" | "danger" | "info" | "brand";
  density?: "compact" | "comfortable";
}

export function KpiCard({
  label,
  locale,
  value,
  trend,
  description,
  tone = "neutral",
  density = "comfortable",
}: KpiCardProps) {
  return (
    <article className="me-kpi-card" data-density={density}>
      <div className="me-kpi-card-header">
        <span className="me-kpi-card-label">{getLocalizedText(label, locale)}</span>
        {trend ? <StatusChip label={trend} locale={locale} tone={tone} size="sm" /> : null}
      </div>
      <strong className="me-kpi-card-value">{value}</strong>
      {description ? (
        <p className="me-kpi-card-description">{getLocalizedText(description, locale)}</p>
      ) : null}
    </article>
  );
}
