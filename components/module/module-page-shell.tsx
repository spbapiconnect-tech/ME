"use client";

import { useMemo, useState } from "react";
import { MainShell } from "@/components/shell/main-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ErpDataTable } from "@/components/erp/erp-data-table";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";

export type ModuleRow = {
  id: string;
  title: string;
  subtitle: string;
  status: string;
  meta: string;
  owner?: string;
  detailItems?: Array<{ label: string; value: string }>;
  nextAction?: string;
  detailNote?: string;
};
type ModuleTableRow = ModuleRow & Record<string, unknown>;

export type KpiItem = {
  label: string;
  value: string;
};

export type ModulePageConfig = {
  title: string;
  description: string;
  primaryAction: string;
  secondaryAction?: string;
  kpis: KpiItem[];
  chips?: string[];
  searchPlaceholder: string;
  tableTitle: string;
  detailTitle?: string;
  detailActionLabel?: string;
  rows: ModuleRow[];
};

function statusVariant(status: string): "outline" | "secondary" | "destructive" {
  const value = status.toLowerCase();
  if (value.includes("critical") || value.includes("failed") || value.includes("overdue") || value.includes("error")) return "destructive";
  if (value.includes("pending") || value.includes("review") || value.includes("draft") || value.includes("setup")) return "secondary";
  return "outline";
}

export function ModulePageShell({ config }: { config: ModulePageConfig }) {
  const [selected, setSelected] = useState<ModuleRow>(config.rows[0]);

  const columns = useMemo(
    () => [
      {
        key: "title",
        label: config.tableTitle,
        type: "name" as const,
        render: (item: ModuleTableRow) => (
          <div className="space-y-0.5">
            <p className="font-medium">{item.title}</p>
            <p className="text-xs text-muted-foreground">{item.subtitle}</p>
          </div>
        ),
      },
      {
        key: "status",
        label: "Status",
        type: "text" as const,
        render: (item: ModuleTableRow) => <Badge variant={statusVariant(item.status)}>{item.status}</Badge>,
      },
      {
        key: "owner",
        label: "Owner",
        type: "text" as const,
        render: (item: ModuleTableRow) => <span>{item.owner || "System"}</span>,
      },
      {
        key: "meta",
        label: "Updated",
        type: "date" as const,
        align: "right" as const,
      },
    ],
    [config.tableTitle],
  );

  return (
    <MainShell>
      <div className="space-y-4 pb-24 md:space-y-6 md:p-1 md:pb-6">
        <header className="space-y-2 px-3 md:px-0">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">{config.title}</h1>
              <p className="text-sm text-muted-foreground">{config.description}</p>
            </div>
            <div className="flex items-center gap-2">
              {config.secondaryAction ? <Button variant="outline" size="sm" className="hidden sm:inline-flex">{config.secondaryAction}</Button> : null}
              <Button size="sm">{config.primaryAction}</Button>
            </div>
          </div>
        </header>

        <section className="grid grid-cols-2 gap-3 px-3 md:grid-cols-4 md:gap-4 md:px-0">
          {config.kpis.map((kpi) => (
            <Card key={kpi.label} className="rounded-xl">
              <CardHeader className="pb-1"><CardTitle className="text-xs font-medium text-muted-foreground">{kpi.label}</CardTitle></CardHeader>
              <CardContent><p className="text-xl font-semibold md:text-2xl">{kpi.value}</p></CardContent>
            </Card>
          ))}
        </section>

        <section className="space-y-3 rounded-xl border bg-card p-3 md:p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input className="pl-9" placeholder={config.searchPlaceholder} />
          </div>
          {config.chips?.length ? (
            <div className="flex flex-wrap gap-2">
              {config.chips.slice(0, 4).map((chip, idx) => (
                <Badge key={chip} variant={idx === 0 ? "secondary" : "outline"} className="h-7 rounded-md px-2.5">{chip}</Badge>
              ))}
            </div>
          ) : null}
        </section>

        <section className="hidden gap-4 md:grid md:grid-cols-12">
          <div className={cn("space-y-4", config.detailTitle ? "md:col-span-8" : "md:col-span-12")}>
            <ErpDataTable
              data={config.rows as ModuleTableRow[]}
              columns={columns}
              getRowId={(row) => row.id}
              onRowSelect={setSelected}
              selectedId={selected?.id}
            />
          </div>
          {config.detailTitle ? (
            <Card className="md:col-span-4 rounded-xl">
              <CardHeader><CardTitle className="text-sm">{config.detailTitle}</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div><p className="font-medium">{selected?.title}</p><p className="text-sm text-muted-foreground">{selected?.subtitle}</p></div>
                {selected?.detailItems?.length ? (
                  <div className="space-y-2.5">
                    {selected.detailItems.map((item) => (
                      <div key={`${selected.id}-${item.label}`} className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">{item.label}</span>
                        <span className="font-medium text-foreground">{item.value}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between text-sm"><span className="text-muted-foreground">Status</span><Badge variant={statusVariant(selected?.status || "")}>{selected?.status}</Badge></div>
                    <div className="flex items-center justify-between text-sm"><span className="text-muted-foreground">Owner</span><span>{selected?.owner || "System"}</span></div>
                    <div className="flex items-center justify-between text-sm"><span className="text-muted-foreground">Updated</span><span>{selected?.meta}</span></div>
                  </>
                )}
                {selected?.detailNote ? <p className="rounded-lg border bg-muted/30 p-2.5 text-xs text-muted-foreground">{selected.detailNote}</p> : null}
                <Button variant="outline" size="sm" className="w-full">{selected?.nextAction || config.detailActionLabel || "Open Detail"}</Button>
              </CardContent>
            </Card>
          ) : null}
        </section>

        <section className="space-y-3 px-3 md:hidden">
          {config.rows.map((row) => (
            <Card key={row.id} className="rounded-xl">
              <CardContent className="space-y-3 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div><p className="font-medium">{row.title}</p><p className="text-xs text-muted-foreground">{row.subtitle}</p></div>
                  <Badge variant={statusVariant(row.status)}>{row.status}</Badge>
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground"><span>{row.owner || "System"}</span><span>{row.meta}</span></div>
                <Button variant="outline" size="sm" className="w-full">Open</Button>
              </CardContent>
            </Card>
          ))}
        </section>
      </div>
    </MainShell>
  );
}
