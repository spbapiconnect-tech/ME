import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getNavigationMap, resolveNavigationLabel } from "@/lib/navigation";
import { cn } from "@/lib/utils";
import type { MeNavigationItem, MeNavigationLocale } from "@/types/navigation";

interface MeSidebarProps {
  locale?: MeNavigationLocale;
  activeKey?: string;
  className?: string;
}

function isActive(item: MeNavigationItem, activeKey?: string) {
  return item.key === activeKey;
}

export function MeSidebar({ locale = "en", activeKey, className }: MeSidebarProps) {
  const navigation = getNavigationMap();
  const primaryGroups = navigation.groups.filter((group) => !group.isFoundationGroup);
  const foundationGroup = navigation.groups.find((group) => group.isFoundationGroup);
  const isFoundationActive = Boolean(foundationGroup?.items.some((item) => isActive(item, activeKey)));

  return (
    <aside className={cn("hidden lg:block", className)}>
      <Card size="sm" className="sticky top-6 border-border/40 bg-card/70 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <CardHeader className="gap-2">
          <div className="flex items-center justify-between gap-2">
            <CardTitle className="text-sm">ME</CardTitle>
            <Badge variant="outline">{locale === "zh" ? "导航" : "Navigation"}</Badge>
          </div>
          <CardDescription>{navigation.notice[locale]}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="grid gap-2">
            {navigation.primaryItems.map((item) => (
              <Button
                key={item.key}
                asChild
                variant={isActive(item, activeKey) ? "default" : "outline"}
                size="sm"
                className="justify-start"
              >
                <Link href={item.href}>{resolveNavigationLabel(item, locale)}</Link>
              </Button>
            ))}
          </div>

          {primaryGroups.map((group) => (
            <div key={group.key} className="grid gap-2">
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">{group.title[locale]}</p>
                <span className="text-xs text-muted-foreground">{group.items.length}</span>
              </div>
              <div className="grid gap-2">
                {group.items.map((item) => (
                  <Button
                    key={item.key}
                    asChild
                    variant={isActive(item, activeKey) ? "secondary" : "ghost"}
                    size="sm"
                    className="justify-start"
                  >
                    <Link href={item.href}>{resolveNavigationLabel(item, locale)}</Link>
                  </Button>
                ))}
              </div>
            </div>
          ))}

          {foundationGroup ? (
            <>
              <Separator />
              <details className="grid gap-2" open={isFoundationActive || !foundationGroup.collapsedByDefault}>
                <summary className="flex cursor-pointer list-none items-center justify-between gap-2 rounded-lg px-2 py-1 text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground transition-colors hover:bg-muted/40">
                  <span>{foundationGroup.title[locale]}</span>
                  <Badge variant="outline">{locale === "zh" ? "次级" : "Secondary"}</Badge>
                </summary>
                <div className="grid gap-2 pt-1">
                  {foundationGroup.items.map((item) => (
                    <Button
                      key={item.key}
                      asChild
                      variant={isActive(item, activeKey) ? "secondary" : "ghost"}
                      size="sm"
                      className="justify-start"
                    >
                      <Link href={item.href}>{resolveNavigationLabel(item, locale)}</Link>
                    </Button>
                  ))}
                </div>
              </details>
            </>
          ) : null}

          <Separator />
          <div className="grid gap-2">
            <p className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">{locale === "zh" ? "次级链接" : "Footer / Secondary"}</p>
            {navigation.footerItems.map((item) => (
              <Button
                key={item.key}
                asChild
                variant={isActive(item, activeKey) ? "secondary" : "ghost"}
                size="sm"
                className="justify-start"
              >
                <Link href={item.href}>{resolveNavigationLabel(item, locale)}</Link>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </aside>
  );
}
