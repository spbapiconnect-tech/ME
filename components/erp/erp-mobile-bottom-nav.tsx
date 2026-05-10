"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, LayoutGrid, PackageSearch, Users, Workflow } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ErpMobileModuleLauncher } from "./erp-mobile-module-launcher";
import { cn } from "@/lib/utils";
import { useState } from "react";

export const erpMobileBottomNavItems = [
  { key: "dashboard", label: "Dashboard", href: "/", icon: LayoutDashboard },
  { key: "operations", label: "Operations", href: "/branches", icon: Workflow },
  { key: "psi", label: "PSI", href: "/psi", icon: PackageSearch },
  { key: "workforce", label: "Workforce", href: "/staff", icon: Users },
] as const;

export function ErpMobileBottomNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/90 md:hidden">
        <div className="grid h-16 grid-cols-5 px-1 pb-[max(env(safe-area-inset-bottom),0px)]">
          {erpMobileBottomNavItems.map((item) => {
            const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
            const Icon = item.icon;

            return (
              <Link
                key={item.key}
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 rounded-md text-[10px] font-medium",
                  active ? "text-primary" : "text-muted-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                <span className="leading-none">{item.label}</span>
              </Link>
            );
          })}

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                className="h-full w-full flex-col gap-1 rounded-md text-[10px] font-medium text-muted-foreground"
                aria-label="Open all modules"
              >
                <LayoutGrid className="h-4 w-4" />
                <span className="leading-none">All Modules</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[86vh] rounded-t-2xl p-0">
              <SheetHeader className="px-4 pt-4">
                <SheetTitle>All Modules</SheetTitle>
                <SheetDescription>Navigate all ME workspace modules.</SheetDescription>
              </SheetHeader>
              <ErpMobileModuleLauncher onNavigate={() => setOpen(false)} />
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </>
  );
}
