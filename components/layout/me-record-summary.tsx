import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface MeRecordSummaryProps {
  title: string;
  status: string;
  meta: Array<{ label: string; value: string }>;
}

export function MeRecordSummary({ title, status, meta }: MeRecordSummaryProps) {
  return (
    <Card size="sm" className="border-border/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.97),rgba(247,250,255,0.92))] shadow-[0_22px_40px_-32px_rgba(15,23,42,0.18)]">
      <CardHeader className="gap-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-1">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Record Summary</p>
            <CardTitle className="text-xl text-slate-950">{title}</CardTitle>
          </div>
          <Badge>{status}</Badge>
        </div>
      </CardHeader>
      <CardContent className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {meta.map((item) => (
          <div key={item.label} className="rounded-[22px] bg-slate-50/88 px-4 py-3.5 ring-1 ring-slate-200/70">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">{item.label}</p>
            <p className="mt-1.5 text-sm font-semibold text-slate-900">{item.value}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
