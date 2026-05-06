import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MeNavigationCard } from "@/components/navigation/me-navigation-card";
import { cn } from "@/lib/utils";
import type { MeNavigationGroup, MeNavigationLocale } from "@/types/navigation";

interface MeNavigationGroupProps {
  group: MeNavigationGroup;
  locale?: MeNavigationLocale;
  className?: string;
}

export function MeNavigationGroup({ group, locale = "en", className }: MeNavigationGroupProps) {
  return (
    <Card size="sm" className={cn(group.isFoundationGroup && "border-dashed bg-muted/20", className)}>
      <CardHeader className="gap-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <CardTitle className="text-base">{group.title[locale]}</CardTitle>
            {group.description ? <CardDescription>{group.description[locale]}</CardDescription> : null}
          </div>
          {group.isFoundationGroup ? <Badge variant="outline">{locale === "zh" ? "次级" : "Secondary"}</Badge> : null}
        </div>
      </CardHeader>
      <CardContent className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {group.items.map((item) => (
          <MeNavigationCard key={item.key} item={item} locale={locale} />
        ))}
      </CardContent>
    </Card>
  );
}
