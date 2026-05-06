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
    <main className={cn("mx-auto flex min-h-screen w-full max-w-[96rem] flex-col gap-5 px-4 py-5 lg:px-5", className)}>
      <MeBreadcrumbs />
      <MeTopbar />

      <div className="grid gap-5 lg:grid-cols-[18rem_minmax(0,1fr)] xl:grid-cols-[18rem_minmax(0,1fr)_20rem]">
        <MeSidebar activeKey={activeKey} className="self-start" />

        <div className={cn("grid min-w-0 gap-5", contentClassName)}>{children}</div>

        {rightRail ? <div className="hidden xl:block">{rightRail}</div> : null}
      </div>
    </main>
  );
}
