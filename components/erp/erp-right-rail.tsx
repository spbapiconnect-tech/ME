import { ReactNode } from "react";
import { Card } from "@/components/ui/card";

export function ErpRightRail({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Card className="rounded-xl border-border bg-card p-4 shadow-sm">
      <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      <div className="mt-3 space-y-3 text-sm text-muted-foreground">{children}</div>
    </Card>
  );
}
