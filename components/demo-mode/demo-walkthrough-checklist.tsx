import { CheckCircle2, CircleDashed } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { resolveDemoWalkthroughTitle } from "@/lib/demo-mode";
import type { MeDemoWalkthroughItem } from "@/types/demo-mode";
import type { MeNavigationLocale } from "@/types/navigation";

interface DemoWalkthroughChecklistProps {
  items: MeDemoWalkthroughItem[];
  locale?: MeNavigationLocale;
}

export function DemoWalkthroughChecklist({ items, locale = "en" }: DemoWalkthroughChecklistProps) {
  return (
    <Card size="sm" className="border border-border/70 bg-card/95">
      <CardHeader className="gap-1">
        <CardTitle className="text-sm">Demo Walkthrough Checklist</CardTitle>
        <CardDescription>Visual checklist only. No persisted checked state and no interaction is required.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3">
        {items.map((item) => {
          const Icon = item.checkedByDefault ? CheckCircle2 : CircleDashed;

          return (
            <div key={item.key} className="flex items-start gap-3 rounded-xl border border-border/70 bg-background/70 p-3">
              <Icon className="mt-0.5 size-4 text-muted-foreground" />
              <div className="grid gap-1">
                <p className="text-sm font-medium">
                  {item.order}. {resolveDemoWalkthroughTitle(item, locale)}
                </p>
                <p className="text-sm text-muted-foreground">{item.description[locale]}</p>
                <p className="text-xs text-muted-foreground">{item.route}</p>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
