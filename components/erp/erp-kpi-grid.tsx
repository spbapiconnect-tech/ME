import { Card } from "@/components/ui/card";

export type ErpKpi = {
  label: string;
  value: string;
  hint?: string;
  tone?: "default" | "success" | "warning" | "danger" | "info";
};

export function ErpKpiGrid({ items }: { items: ErpKpi[] }) {
  return (
    <div className="grid gap-3 md:grid-cols-4 xl:grid-cols-8">
      {items.map((item) => (
        <Card key={item.label} className="min-h-[84px] rounded-xl border-border bg-card p-4 shadow-sm">
          <div className="text-xs font-medium text-muted-foreground">{item.label}</div>
          <div className="mt-2 text-xl font-semibold tracking-tight text-foreground">{item.value}</div>
          {item.hint ? <div className="mt-1 text-xs text-muted-foreground">{item.hint}</div> : null}
        </Card>
      ))}
    </div>
  );
}
