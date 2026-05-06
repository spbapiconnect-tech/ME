import Link from "next/link";

import { DemoModeBadge } from "@/components/demo-mode/demo-mode-badge";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getDemoModeBadgeByKey } from "@/lib/demo-mode";
import type { MeNavigationLocale } from "@/types/navigation";

interface DemoModeBannerProps {
  locale?: MeNavigationLocale;
}

export function DemoModeBanner({ locale = "en" }: DemoModeBannerProps) {
  const screenshotReadyBadge = getDemoModeBadgeByKey("screenshot-ready");
  const placeholderBadge = getDemoModeBadgeByKey("placeholder-only");

  return (
    <Card size="sm" className="border-dashed border-border/80 bg-gradient-to-r from-background via-card to-muted/20">
      <CardHeader className="gap-3">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="space-y-1">
            <CardTitle className="text-sm">Demo Mode Preview</CardTitle>
            <CardDescription>Static presentation layer — no tracking or persisted state.</CardDescription>
          </div>
          <div className="flex flex-wrap gap-2">
            {screenshotReadyBadge ? <DemoModeBadge badge={screenshotReadyBadge} locale={locale} /> : null}
            {placeholderBadge ? <DemoModeBadge badge={placeholderBadge} locale={locale} /> : null}
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild size="sm" variant="outline">
            <Link href="/demo-mode">Open Demo Mode</Link>
          </Button>
          <Button asChild size="sm" variant="outline">
            <Link href="/demo-story">Open Demo Story</Link>
          </Button>
        </div>
      </CardHeader>
    </Card>
  );
}
