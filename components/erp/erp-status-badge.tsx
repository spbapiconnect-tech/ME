import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function ErpStatusBadge({ status, className }: { status: string; className?: string }) {
  const key = status.toLowerCase();

  let colorClass = "bg-secondary text-secondary-foreground border-border";

  if (key.includes("operating") || key.includes("active") || key.includes("passed") || key.includes("on track")) {
    colorClass = "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400";
  } else if (key.includes("critical") || key.includes("overdue") || key.includes("failed") || key.includes("warning")) {
    colorClass = "bg-destructive/10 text-destructive border-destructive/20";
  } else if (key.includes("pending") || key.includes("preparation") || key.includes("attention") || key.includes("low stock")) {
    colorClass = "bg-amber-500/10 text-amber-600 border-amber-500/20 dark:text-amber-400";
  } else if (key.includes("progress") || key.includes("review") || key.includes("medium")) {
    colorClass = "bg-primary/10 text-primary border-primary/20";
  }

  return (
    <Badge 
      variant="outline" 
      className={cn("rounded-md px-1.5 py-0 text-[10px] font-bold uppercase tracking-wider", colorClass, className)}
    >
      {status}
    </Badge>
  );
}
