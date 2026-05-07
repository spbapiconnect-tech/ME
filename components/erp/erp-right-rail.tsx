import { ReactNode } from "react";
import { Card } from "@/components/ui/card";

export function ErpRightRail({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Card className="rounded-md border-border bg-card shadow-sm">
      <div className="border-b border-border/50 px-4 py-3">
        <h3 className="text-sm font-bold text-foreground">{title}</h3>
      </div>
      <div className="space-y-4">{children}</div>
    </Card>
  );
}
