"use client";

import { ReactNode } from "react";
import { ErpSidebar } from "./erp-sidebar";
import { ErpTopbar } from "./erp-topbar";

export function ErpShell({ activeHref, children }: { activeHref?: string; children: ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <ErpSidebar activeHref={activeHref} />
      <div className="flex flex-col flex-1 min-w-0">
        <ErpTopbar />
        <main className="flex-1 overflow-y-auto bg-background/50">
          <div className="p-6 lg:p-8">
            <div className="mx-auto max-w-full">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
