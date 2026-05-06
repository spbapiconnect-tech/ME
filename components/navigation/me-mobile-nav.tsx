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
import { getNavigationMap, resolveNavigationLabel } from "@/lib/navigation";
import type { MeNavigationLocale } from "@/types/navigation";

interface MeMobileNavProps {
  locale?: MeNavigationLocale;
}

export function MeMobileNav({ locale = "en" }: MeMobileNavProps) {
  const pathname = usePathname();
  const navigation = getNavigationMap();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="lg:hidden">
          <Menu className="size-4" />
          <span>{locale === "zh" ? "导航" : "Navigate"}</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>ME</SheetTitle>
          <SheetDescription>{navigation.notice[locale]}</SheetDescription>
        </SheetHeader>
        <div className="grid gap-6 px-6 pb-6">
          <div className="grid gap-2">
            <p className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">{locale === "zh" ? "主导航" : "Primary"}</p>
            {navigation.primaryItems.map((item) => (
              <Button key={item.key} asChild variant={pathname === item.href ? "default" : "outline"} size="sm" className="justify-start">
                <Link href={item.href}>{resolveNavigationLabel(item, locale)}</Link>
              </Button>
            ))}
          </div>

          {navigation.groups.map((group) => (
            <div key={group.key} className="grid gap-2">
              <p className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">{group.title[locale]}</p>
              {group.items.map((item) => (
                <Button key={item.key} asChild variant={pathname === item.href ? "secondary" : "ghost"} size="sm" className="justify-start">
                  <Link href={item.href}>{resolveNavigationLabel(item, locale)}</Link>
                </Button>
              ))}
            </div>
          ))}

          <div className="grid gap-2">
            <p className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">{locale === "zh" ? "次级链接" : "Footer / Secondary"}</p>
            {navigation.footerItems.map((item) => (
              <Button key={item.key} asChild variant={pathname === item.href ? "secondary" : "ghost"} size="sm" className="justify-start">
                <Link href={item.href}>{resolveNavigationLabel(item, locale)}</Link>
              </Button>
            ))}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
