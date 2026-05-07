"use client";

import { ReactNode } from "react";
import { ErpSidebar } from "./erp-sidebar";
import { ErpTopbar } from "./erp-topbar";

export function ErpShell({ activeHref, children }: { activeHref?: string; children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <div className="grid min-h-screen grid-cols-[224px_minmax(0,1fr)]">
        <ErpSidebar activeHref={activeHref} />
        <div className="flex flex-col min-w-0">
          <ErpTopbar />
          <main className="flex-1 p-6 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
