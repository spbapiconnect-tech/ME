"use client";

import { ReactNode } from "react";
import { Menu } from "lucide-react";
import { ErpSidebar } from "./erp-sidebar";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ErpTopbar } from "./erp-topbar";

export function ErpShell({ activeHref, children }: { activeHref?: string; children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <div className="grid min-h-screen grid-cols-1 md:grid-cols-[224px_minmax(0,1fr)]">
        <div className="hidden md:block"><div className="hidden md:block"><ErpSidebar activeHref={activeHref} /></div></div>
        <div className="flex flex-col min-w-0">
          <div className="flex h-14 items-center justify-between border-b border-border bg-background/95 px-4 md:hidden">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-xs font-bold text-primary-foreground">
                ME
              </div>
              <div>
                <div className="text-sm font-semibold leading-none">ME Branch</div>
                <div className="mt-1 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Enterprise ERP</div>
              </div>
            </div>

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="h-9 w-9">
                  <Menu className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[280px] p-0">
                <SheetHeader className="sr-only">
                  <SheetTitle>ERP Navigation</SheetTitle>
                  <SheetDescription>Mobile navigation for ME Branch ERP modules.</SheetDescription>
                </SheetHeader>
                <ErpSidebar activeHref={activeHref} />
              </SheetContent>
            </Sheet>
          </div>
          <ErpTopbar />
          <main className="flex-1 overflow-y-auto p-4 md:p-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
