import { Badge } from "@/components/ui/badge";

export function ErpStatusBadge({ status }: { status: string }) {
  const key = status.toLowerCase();

  const className =
    key.includes("operating") || key.includes("active") || key.includes("passed") || key.includes("on track")
      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
      : key.includes("critical") || key.includes("overdue") || key.includes("failed") || key.includes("warning")
        ? "border-red-200 bg-red-50 text-red-700"
        : key.includes("pending") || key.includes("preparation") || key.includes("attention") || key.includes("low stock")
          ? "border-amber-200 bg-amber-50 text-amber-700"
          : key.includes("progress") || key.includes("review") || key.includes("medium")
            ? "border-blue-200 bg-blue-50 text-blue-700"
            : "border-slate-200 bg-slate-50 text-slate-600";

  return (
    <Badge variant="outline" className={`rounded-md px-2 py-0.5 text-xs font-medium ${className}`}>
      {status}
    </Badge>
  );
}
