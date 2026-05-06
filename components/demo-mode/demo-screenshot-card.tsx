import Link from "next/link";

import { DemoModeBadge } from "@/components/demo-mode/demo-mode-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getDemoModeBadgeByKey, resolveDemoScreenshotTitle } from "@/lib/demo-mode";
import type { MeDemoScreenshotSection } from "@/types/demo-mode";
import type { MeNavigationLocale } from "@/types/navigation";

interface DemoScreenshotCardProps {
  section: MeDemoScreenshotSection;
  locale?: MeNavigationLocale;
}

export function DemoScreenshotCard({ section, locale = "en" }: DemoScreenshotCardProps) {
  const badges = section.highlightKeys
    .map((key) => getDemoModeBadgeByKey(key))
    .filter((badge): badge is NonNullable<typeof badge> => Boolean(badge));

  return (
    <Card size="sm" className="border border-border/70 bg-card/95">
      <CardHeader className="gap-2">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <CardTitle className="text-sm">{resolveDemoScreenshotTitle(section, locale)}</CardTitle>
            <CardDescription>{section.description[locale]}</CardDescription>
          </div>
          <div className="flex flex-wrap gap-2">
            {badges.map((badge) => (
              <DemoModeBadge key={`${section.key}-${badge.key}`} badge={badge} locale={locale} />
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent className="grid gap-3">
        <div className="rounded-xl border border-border/70 bg-background/70 p-3">
          <p className="text-xs font-medium uppercase tracking-[0.08em] text-muted-foreground">Route</p>
          <p className="text-sm font-medium">{section.route}</p>
        </div>
        <div className="rounded-xl border border-border/70 bg-background/70 p-3">
          <p className="text-xs font-medium uppercase tracking-[0.08em] text-muted-foreground">Recommended Shot</p>
          <p className="text-sm text-muted-foreground">{section.recommendedShot[locale]}</p>
        </div>
        <div className="rounded-xl border border-border/70 bg-background/70 p-3">
          <p className="text-xs font-medium uppercase tracking-[0.08em] text-muted-foreground">Framing Tips</p>
          <div className="mt-2 grid gap-2 text-sm text-muted-foreground">
            {section.framingTips.map((tip) => (
              <p key={`${section.key}-${tip.en}`}>{tip[locale]}</p>
            ))}
          </div>
        </div>
        <Button asChild size="sm" variant="outline" className="justify-start">
          <Link href={section.route}>Open Surface</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
