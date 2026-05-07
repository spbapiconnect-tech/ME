import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type ErpStatusTone = "default" | "success" | "warning" | "danger" | "info" | "muted";

const toneClassName: Record<ErpStatusTone, string> = {
  default: "border-border bg-background text-foreground",
  success: "border-emerald-200 bg-emerald-50 text-emerald-700",
  warning: "border-amber-200 bg-amber-50 text-amber-700",
  danger: "border-rose-200 bg-rose-50 text-rose-700",
  info: "border-blue-200 bg-blue-50 text-blue-700",
  muted: "border-border bg-muted text-muted-foreground",
};

export function ErpStatusBadge({
  children,
  tone = "default",
  className,
}: {
  children: React.ReactNode;
  tone?: ErpStatusTone;
  className?: string;
}) {
  return (
    <Badge variant="outline" className={cn("normal-case tracking-normal", toneClassName[tone], className)}>
      {children}
    </Badge>
  );
}
