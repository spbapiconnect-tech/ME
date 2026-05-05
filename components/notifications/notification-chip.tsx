import { Badge } from "@/components/ui/badge";
import type { SupportedLocale } from "@/types/module";
import type {
  NotificationCategory,
  NotificationChannel,
  NotificationSeverity,
  NotificationStatus,
} from "@/types/notification";

const statusLabel: Record<NotificationStatus, { zh: string; en: string }> = {
  active: { zh: "已启用", en: "Active" },
  "preview-only": { zh: "仅预览", en: "Preview-Only" },
  placeholder: { zh: "占位", en: "Placeholder" },
  "coming-soon": { zh: "即将上线", en: "Coming Soon" },
  blocked: { zh: "已阻止", en: "Blocked" },
  disabled: { zh: "已禁用", en: "Disabled" },
};

export function NotificationChip({
  kind,
  locale,
  status,
  severity,
  channel,
  category,
}: {
  kind: "status" | "severity" | "channel" | "category";
  locale: SupportedLocale;
  status?: NotificationStatus;
  severity?: NotificationSeverity;
  channel?: NotificationChannel;
  category?: NotificationCategory;
}) {
  if (kind === "status" && status) {
    const variant = status === "active" ? "default" : "outline";
    return <Badge variant={variant}>{locale === "zh" ? statusLabel[status].zh : statusLabel[status].en}</Badge>;
  }

  if (kind === "severity" && severity) {
    return <Badge variant={severity === "critical" || severity === "high" ? "default" : "outline"}>{severity}</Badge>;
  }

  if (kind === "channel" && channel) {
    return <Badge variant="secondary">{channel}</Badge>;
  }

  if (kind === "category" && category) {
    return <Badge variant="outline">{category}</Badge>;
  }

  return null;
}
