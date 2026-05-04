import type { LocalizedText, SupportedLocale } from "@/types/module";

import { getLocalizedText } from "@/lib/localized";

interface StatusChipProps {
  label: string | LocalizedText;
  locale: SupportedLocale;
  tone?: "neutral" | "success" | "warning" | "danger" | "info" | "brand";
  size?: "sm" | "md";
  dot?: boolean;
  maxWidth?: string;
}

export function StatusChip({
  label,
  locale,
  tone = "neutral",
  size = "md",
  dot = false,
  maxWidth = "14rem",
}: StatusChipProps) {
  return (
    <span
      className="me-status-chip"
      data-tone={tone}
      data-size={size}
      style={{ maxWidth }}
      title={getLocalizedText(label, locale)}
    >
      {dot ? <span className="me-status-chip-dot" aria-hidden="true" /> : null}
      <span className="me-status-chip-label">{getLocalizedText(label, locale)}</span>
    </span>
  );
}
