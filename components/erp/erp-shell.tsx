import { ReactNode } from "react";
import { ErpSidebar } from "./erp-sidebar";
import { ErpTopbar } from "./erp-topbar";

export function ErpShell({ activeHref, children }: { activeHref?: string; children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="grid min-h-screen grid-cols-[224px_1fr]">
        <ErpSidebar activeHref={activeHref} />
        <main className="min-w-0">
          <ErpTopbar />
          <div className="p-5">{children}</div>
        </main>
      </div>
    </div>
  );
}
