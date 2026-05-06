import type { ReactNode } from "react";

import { MeBreadcrumbs, MeSidebar, MeTopbar } from "@/components/navigation";
import { cn } from "@/lib/utils";

interface MeDashboardShellProps {
  activeKey?: string;
  children: ReactNode;
  rightRail?: ReactNode;
  className?: string;
  contentClassName?: string;
}

export function MeDashboardShell({
  activeKey,
  children,
  rightRail,
  className,
  contentClassName,
}: MeDashboardShellProps) {
  return (
    <main className={cn("mx-auto flex min-h-screen w-full max-w-[98rem] flex-col gap-4 px-4 py-4 lg:px-5 lg:py-5", className)}>
      <MeBreadcrumbs />
      <MeTopbar />

      <div className="grid items-start gap-4 lg:grid-cols-[17.5rem_minmax(0,1fr)] xl:grid-cols-[17.5rem_minmax(0,1fr)_18.5rem]">
        <MeSidebar activeKey={activeKey} className="self-start" />

        <div className={cn("grid min-w-0 gap-4", contentClassName)}>{children}</div>

        {rightRail ? <div className="hidden xl:block xl:pl-1">{rightRail}</div> : null}
      </div>
    </main>
  );
}
