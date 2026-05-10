"use client";

import { ReactNode } from "react";
import { ErpSidebar } from "./erp-sidebar";
import { ErpTopbar } from "./erp-topbar";
import { ErpMobileBottomNav } from "./erp-mobile-bottom-nav";

export function ErpShell({
  activeHref,
  children,
  compactSidebar = false,
}: {
  activeHref?: string;
  children: ReactNode;
  compactSidebar?: boolean;
}) {
  return (
    <div className="h-screen overflow-hidden bg-background">
      <div className={`grid h-screen grid-cols-1 md:grid-cols-[${compactSidebar ? "64px" : "224px"}_minmax(0,1fr)]`}>
        <div className="hidden md:block">
          <div className="hidden h-screen overflow-hidden md:block">
            <ErpSidebar activeHref={activeHref} compact={compactSidebar} />
          </div>
        </div>
        <div className="flex min-h-0 min-w-0 flex-col">
          <div className="flex h-14 items-center justify-between border-b border-border bg-background/95 px-4 md:hidden">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-xs font-bold text-primary-foreground">ME</div>
              <div>
                <div className="text-sm font-semibold leading-none">ME Branch</div>
                <div className="mt-1 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Enterprise ERP</div>
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <ErpTopbar />
          </div>
          <main className="min-h-0 flex-1 overflow-y-auto p-3 pb-24 md:p-4 md:pb-4">{children}</main>
          <ErpMobileBottomNav />
        </div>
      </div>
    </div>
  );
}
