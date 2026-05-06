import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { MeDemoReadinessStatus, MeDemoReadinessTone } from "@/types/demo-readiness";

const toneClasses: Record<MeDemoReadinessTone, string> = {
  neutral: "border-border/70 bg-background text-foreground",
  info: "border-sky-500/20 bg-sky-500/10 text-sky-700 dark:text-sky-300",
  success: "border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  warning: "border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-300",
  danger: "border-rose-500/20 bg-rose-500/10 text-rose-700 dark:text-rose-300",
  muted: "border-border/70 bg-muted text-muted-foreground",
};

const statusLabels: Record<MeDemoReadinessStatus, string> = {
  pass: "Pass",
  review: "Review",
  placeholder: "Placeholder",
  blocked: "Blocked",
  future: "Future",
};

interface DemoReadinessChipProps {
  tone: MeDemoReadinessTone;
  status?: MeDemoReadinessStatus;
  label?: string;
  className?: string;
}

export function DemoReadinessChip({ tone, status, label, className }: DemoReadinessChipProps) {
  return (
    <Badge variant="outline" className={cn("rounded-full px-2.5 py-0.5 text-[11px] font-medium", toneClasses[tone], className)}>
      {label ?? (status ? statusLabels[status] : "Info")}
    </Badge>
  );
}
