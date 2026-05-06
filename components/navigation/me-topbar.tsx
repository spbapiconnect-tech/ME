import Link from "next/link";

import { MeMobileNav } from "@/components/navigation/me-mobile-nav";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { MeNavigationLocale } from "@/types/navigation";

interface MeTopbarProps {
  locale?: MeNavigationLocale;
}

export function MeTopbar({ locale = "en" }: MeTopbarProps) {
  return (
    <Card size="sm" className="border border-border/70 bg-card/95">
      <CardContent className="grid gap-4 pt-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Badge>ME</Badge>
            <span className="text-sm text-muted-foreground">
              {locale === "zh" ? "业务导航 / 系统基础层" : "Business Navigation / System Foundation"}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <MeMobileNav locale={locale} />
            <Button asChild size="sm" variant="outline">
              <Link href="/navigation">{locale === "zh" ? "导航 IA" : "Navigation IA"}</Link>
            </Button>
            <Button asChild size="sm" variant="outline">
              <Link href="/system-foundation">{locale === "zh" ? "系统基础层" : "System Foundation"}</Link>
            </Button>
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          <div className="rounded-xl border border-border/70 bg-background px-3 py-2 text-sm">{locale === "zh" ? "门店选择器：北区 / 占位" : "Store Selector: North Region / Placeholder"}</div>
          <div className="rounded-xl border border-border/70 bg-background px-3 py-2 text-sm">{locale === "zh" ? "日期范围：最近 7 天 / 占位" : "Date Range: Last 7 days / Placeholder"}</div>
          <div className="rounded-xl border border-border/70 bg-background px-3 py-2 text-sm">{locale === "zh" ? "搜索：工作台快速搜索 / 占位" : "Search: Workspace quick search / Placeholder"}</div>
        </div>
      </CardContent>
    </Card>
  );
}
