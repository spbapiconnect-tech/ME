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
    <div className={cn("grid min-w-0 gap-3 xl:grid-cols-[minmax(0,1fr)_18rem] 2xl:grid-cols-[minmax(0,1fr)_19rem] 2xl:gap-4", className)}>
      <div className="grid min-w-0 gap-3 xl:gap-4">
        {filters}
        {list}
      </div>
      {summary ? <div className="grid min-w-0 gap-3 xl:gap-4">{summary}</div> : null}
    </div>
  );
}
