import { ReactNode } from "react";
import { Input } from "@/components/ui/input";

export function ErpFilterBar({
  searchPlaceholder = "Search...",
  filters,
  actions,
}: {
  searchPlaceholder?: string;
  filters?: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2 rounded-xl border border-border bg-card p-3 shadow-sm lg:flex-row lg:items-center">
      <Input className="h-10 min-w-[260px] rounded-xl" placeholder={searchPlaceholder} />
      {filters ? <div className="flex flex-1 flex-wrap gap-2">{filters}</div> : null}
      {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
    </div>
  );
}
