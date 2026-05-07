import { Card, CardContent } from "@/components/ui/card";
import type { ErpKpiItem } from "@/lib/erp/erp-module-schema";

export function ErpKpiGrid({ items }: { items: ErpKpiItem[] }) {
  return (
    <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-8">
      {items.map((item) => (
        <Card key={item.key} size="sm">
          <CardContent className="pt-4">
            <p className="text-[11px] font-semibold uppercase text-muted-foreground">{item.label}</p>
            <p className="mt-2 text-xl font-semibold text-foreground">{item.value}</p>
            {item.helper ? <p className="mt-1 text-xs text-muted-foreground">{item.helper}</p> : null}
          </CardContent>
        </Card>
      ))}
    </section>
  );
}
