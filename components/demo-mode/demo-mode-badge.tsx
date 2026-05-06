import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { resolveDemoModeBadgeLabel } from "@/lib/demo-mode";
import type { MeDemoModeBadge } from "@/types/demo-mode";
import type { MeNavigationLocale } from "@/types/navigation";

interface DemoModeBadgeProps {
  badge: MeDemoModeBadge;
  locale?: MeNavigationLocale;
}

const toneClassName: Record<MeDemoModeBadge["tone"], string> = {
  neutral: "border-slate-300 bg-slate-100 text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200",
  info: "border-sky-300 bg-sky-100 text-sky-700 dark:border-sky-700 dark:bg-sky-950 dark:text-sky-200",
  success: "border-emerald-300 bg-emerald-100 text-emerald-700 dark:border-emerald-700 dark:bg-emerald-950 dark:text-emerald-200",
  warning: "border-amber-300 bg-amber-100 text-amber-700 dark:border-amber-700 dark:bg-amber-950 dark:text-amber-200",
  danger: "border-rose-300 bg-rose-100 text-rose-700 dark:border-rose-700 dark:bg-rose-950 dark:text-rose-200",
  muted: "border-zinc-300 bg-zinc-100 text-zinc-700 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200",
};

export function DemoModeBadge({ badge, locale = "en" }: DemoModeBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "rounded-full border px-2.5 py-1 text-[11px] font-medium tracking-[0.08em] uppercase",
        toneClassName[badge.tone],
      )}
      title={badge.description?.[locale]}
    >
      {resolveDemoModeBadgeLabel(badge, locale)}
    </Badge>
  );
}
