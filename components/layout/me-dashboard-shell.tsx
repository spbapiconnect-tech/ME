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
    <main className={cn("mx-auto flex min-h-screen w-full max-w-[110rem] flex-col gap-3 px-3 py-3 sm:px-4 sm:py-4 xl:px-6 xl:py-5", className)}>
      <MeBreadcrumbs />
      <MeTopbar />

      <div className="grid min-w-0 items-start gap-3 lg:grid-cols-[15.5rem_minmax(0,1fr)] xl:grid-cols-[15.5rem_minmax(0,1fr)_18.25rem] 2xl:grid-cols-[16rem_minmax(0,1fr)_19rem] 2xl:gap-4">
        <MeSidebar activeKey={activeKey} className="self-start" />

        <div className={cn("grid min-w-0 gap-3 xl:gap-4", contentClassName)}>
          {children}
          {rightRail ? <div className="grid gap-3 xl:hidden">{rightRail}</div> : null}
        </div>

        {rightRail ? <div className="hidden xl:block xl:min-w-0 xl:pl-1">{rightRail}</div> : null}
      </div>
    </main>
  );
}
