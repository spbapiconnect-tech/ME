import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { resolveNavigationDescription, resolveNavigationLabel } from "@/lib/navigation";
import { cn } from "@/lib/utils";
import type { MeNavigationItem, MeNavigationLocale } from "@/types/navigation";

interface MeNavigationCardProps {
  item: MeNavigationItem;
  locale?: MeNavigationLocale;
  className?: string;
}

const statusLabelMap = {
  active: { zh: "启用", en: "Active" },
  "preview-only": { zh: "预览", en: "Preview" },
  placeholder: { zh: "占位", en: "Placeholder" },
  "coming-soon": { zh: "即将推出", en: "Coming Soon" },
  hidden: { zh: "隐藏", en: "Hidden" },
} as const;

function getBadgeVariant(item: MeNavigationItem) {
  if (item.isFoundation) {
    return "outline" as const;
  }

  if (item.status === "active") {
    return "secondary" as const;
  }

  return "outline" as const;
}

export function MeNavigationCard({ item, locale = "en", className }: MeNavigationCardProps) {
  const label = resolveNavigationLabel(item, locale);
  const description = resolveNavigationDescription(item, locale);
  const statusLabel = statusLabelMap[item.status][locale];

  return (
    <Card
      size="sm"
      className={cn(
        "h-full border border-border/70 bg-card/95",
        item.isFoundation && "border-dashed bg-muted/20",
        item.status !== "active" && "bg-background/80",
        className,
      )}
    >
      <CardHeader className="gap-2">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <CardTitle className="text-sm">{label}</CardTitle>
          <div className="flex flex-wrap items-center gap-1.5">
            {item.badge ? <Badge variant={getBadgeVariant(item)}>{item.badge[locale]}</Badge> : null}
            <Badge variant="outline">{statusLabel}</Badge>
          </div>
        </div>
        {description ? <CardDescription>{description}</CardDescription> : null}
      </CardHeader>
      <CardContent className="flex items-end justify-between gap-3">
        <p className="text-xs text-muted-foreground">{item.isFoundation ? "Secondary foundation route" : "Read-only navigation preview"}</p>
        <Button asChild size="sm" variant="outline">
          <Link href={item.href}>{locale === "zh" ? "打开" : "Open"}</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
