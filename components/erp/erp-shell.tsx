"use client";

import { ReactNode, useState } from "react";
import { ErpSidebar } from "./erp-sidebar";
import { ErpTopbar } from "./erp-topbar";
import { ErpMobileBottomNav } from "./erp-mobile-bottom-nav";

let sidebarCollapsedMemory = false;

export function ErpShell({
  activeHref,
  children,
}: {
  activeHref?: string;
  children: ReactNode;
}) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(sidebarCollapsedMemory);

  const toggleSidebarCollapsed = () => {
    setIsSidebarCollapsed((prev) => {
      sidebarCollapsedMemory = !prev;
      return sidebarCollapsedMemory;
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="hidden min-h-screen md:flex">
        <ErpSidebar
          activeHref={activeHref}
          collapsed={isSidebarCollapsed}
          onToggleCollapsed={toggleSidebarCollapsed}
        />

        <div className="flex min-w-0 flex-1 flex-col">
          <ErpTopbar />
          <main className="min-h-0 min-w-0 flex-1 overflow-y-auto p-4">{children}</main>
        </div>
      </div>

      <div className="md:hidden">
        <div className="flex h-14 items-center justify-between border-b border-border bg-background/95 px-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-xs font-bold text-primary-foreground">ME</div>
            <div>
              <div className="text-sm font-semibold leading-none">ME Branch</div>
              <div className="mt-1 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Enterprise ERP</div>
            </div>
          </div>
        </div>
        <main className="min-w-0 p-3 pb-24">{children}</main>
        <ErpMobileBottomNav />
      </div>
    </div>
  );
}
