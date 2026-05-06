import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export function MeListWorkspace({
  filters,
  summary,
  list,
  className,
}: {
  filters?: ReactNode;
  summary?: ReactNode;
  list: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("grid gap-4 xl:grid-cols-[minmax(0,1fr)_17.5rem]", className)}>
      <div className="grid gap-4">
        {filters}
        {list}
      </div>
      {summary ? <div className="grid gap-4">{summary}</div> : null}
    </div>
  );
}
