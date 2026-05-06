import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface MeRecordSummaryProps {
  title: string;
  status: string;
  meta: Array<{ label: string; value: string }>;
}

export function MeRecordSummary({ title, status, meta }: MeRecordSummaryProps) {
  return (
    <Card size="sm" className="border-border/40 bg-white/92 shadow-sm shadow-slate-900/5">
      <CardHeader className="gap-2">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <CardTitle className="text-lg text-slate-950">{title}</CardTitle>
          <Badge>{status}</Badge>
        </div>
      </CardHeader>
      <CardContent className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {meta.map((item) => (
          <div key={item.label} className="rounded-2xl border border-border/50 bg-slate-50/90 px-4 py-3">
            <p className="text-xs font-medium uppercase tracking-[0.14em] text-slate-500">{item.label}</p>
            <p className="mt-1 text-sm font-medium text-slate-900">{item.value}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
