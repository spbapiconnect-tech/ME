import { Card } from "@/components/ui/card";

export type ErpKpi = {
  label: string;
  value: string;
  hint?: string;
  tone?: "default" | "success" | "warning" | "danger" | "info";
};

export function ErpKpiGrid({ kpis }: { kpis: ErpKpi[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-4 xl:grid-cols-8">
      {kpis.map((item) => (
        <Card key={item.label} className="flex flex-col justify-center min-h-[72px] rounded-md border-border bg-card p-3 shadow-sm">
          <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80">{item.label}</div>
          <div className="mt-1 text-lg font-bold tracking-tight text-foreground">{item.value}</div>
          {item.hint ? <div className="mt-1 text-[10px] text-muted-foreground">{item.hint}</div> : null}
        </Card>
      ))}
    </div>
  );
}
