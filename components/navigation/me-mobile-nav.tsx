"use client";

import Link from "next/link";
import { Menu } from "lucide-react";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { getSidebarNavigationGroups, resolveSidebarNavigationLabel } from "@/lib/navigation";
import { useUiPreferencesStore } from "@/stores/ui-preferences";
import type { MeNavigationLocale } from "@/types/navigation";

interface MeMobileNavProps {
  locale?: MeNavigationLocale;
}

export function MeMobileNav({ locale = "en" }: MeMobileNavProps) {
  const pathname = usePathname();
  const storeLocale = useUiPreferencesStore((state) => state.locale);
  const setLocale = useUiPreferencesStore((state) => state.setLocale);
  const theme = useUiPreferencesStore((state) => state.theme);
  const setTheme = useUiPreferencesStore((state) => state.setTheme);
  const resolvedLocale = storeLocale ?? locale;
  const sidebarGroups = getSidebarNavigationGroups();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="lg:hidden">
          <Menu className="size-4" />
          <span>{resolvedLocale === "zh" ? "导航" : "Navigate"}</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{resolvedLocale === "zh" ? "ME 门店 ERP" : "ME Branch ERP"}</SheetTitle>
          <SheetDescription>{resolvedLocale === "zh" ? "跨模块运营导航" : "Cross-module operations navigation"}</SheetDescription>
        </SheetHeader>
        <div className="grid gap-6 px-6 pb-6">
          <div className="grid gap-2">
            <p className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">{resolvedLocale === "zh" ? "显示" : "Display"}</p>
            <div className="flex flex-wrap gap-2">
              <Button size="sm" variant={resolvedLocale === "en" ? "default" : "outline"} onClick={() => setLocale("en")}>English</Button>
              <Button size="sm" variant={resolvedLocale === "zh" ? "default" : "outline"} onClick={() => setLocale("zh")}>中文</Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {(["bright", "dark", "moon"] as const).map((value) => (
                <Button key={value} size="sm" variant={theme === value ? "default" : "outline"} onClick={() => setTheme(value)}>
                  {value === "bright" ? "Bright" : value === "dark" ? "Dark" : "Moon"}
                </Button>
              ))}
            </div>
          </div>

          {sidebarGroups.map((group) => (
            <div key={group.key} className="grid gap-2">
              <p className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">{group.title[resolvedLocale]}</p>
              {group.items.map((item) => (
                <Button key={item.key} asChild={Boolean(item.href)} variant={pathname === item.href ? "secondary" : "ghost"} size="sm" className="justify-start">
                  {item.href ? <Link href={item.href}>{resolveSidebarNavigationLabel(item, resolvedLocale)}</Link> : <span>{resolveSidebarNavigationLabel(item, resolvedLocale)}</span>}
                </Button>
              ))}
            </div>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}
