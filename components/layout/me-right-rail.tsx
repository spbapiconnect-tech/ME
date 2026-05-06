import type { ReactNode } from "react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface MeRightRailSection {
  title: string;
  description?: string;
  content?: ReactNode;
  items?: string[];
  badge?: string;
}

export function MeRightRail({ sections }: { title?: string; sections: MeRightRailSection[] }) {
  return (
    <div className="sticky top-5 grid gap-4">
      {sections.map((section) => (
        <Card key={section.title} size="sm" className="border-border/40 bg-white/88 shadow-sm shadow-slate-900/5">
          <CardHeader className="gap-1">
            <div className="flex items-center justify-between gap-2">
              <CardTitle className="text-sm text-slate-900">{section.title}</CardTitle>
              {section.badge ? <Badge variant="outline">{section.badge}</Badge> : null}
            </div>
            {section.description ? <CardDescription className="text-xs text-slate-500">{section.description}</CardDescription> : null}
          </CardHeader>
          <CardContent className="grid gap-2 text-sm text-slate-600">
            {section.content}
            {section.items?.map((item) => (
              <div key={item} className="rounded-2xl border border-border/50 bg-slate-50/80 px-3 py-2">
                {item}
              </div>
            ))}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
