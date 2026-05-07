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

export function MeRightRail({ sections, sticky = true }: { title?: string; sections: MeRightRailSection[]; sticky?: boolean }) {
  return (
    <div className={sticky ? "grid gap-3 xl:sticky xl:top-5" : "grid gap-3"}>
      {sections.map((section) => (
        <Card key={section.title} size="sm" className="border-border bg-[#F8FAFC] shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
          <CardHeader className="gap-1.5">
            <div className="flex items-center justify-between gap-2">
              <CardTitle className="text-[13px] text-slate-900">{section.title}</CardTitle>
              {section.badge ? <Badge variant="outline">{section.badge}</Badge> : null}
            </div>
            {section.description ? <CardDescription className="text-xs leading-5 text-slate-500">{section.description}</CardDescription> : null}
          </CardHeader>
          <CardContent className="grid gap-2.5 text-sm text-slate-600">
            {section.content}
            {section.items?.map((item) => (
              <div key={item} className="flex items-start gap-2.5 rounded-xl border-b border-slate-100/80 px-0 py-2 last:border-b-0 last:pb-0">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-slate-300" />
                <span className="leading-6 text-slate-600">{item}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
