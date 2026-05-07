import { ReactNode } from "react";
import { Card } from "@/components/ui/card";

export function ErpActionDrawer({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Card className="rounded-xl border-border bg-card p-4 shadow-lg">
      <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      <div className="mt-3">{children}</div>
    </Card>
  );
}
