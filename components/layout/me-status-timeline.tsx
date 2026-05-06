import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function MeStatusTimeline({
  title = "Status Timeline",
  items,
}: {
  title?: string;
  items: Array<{ title: string; description: string; time: string }>;
}) {
  return (
    <Card size="sm" className="border-border/70 bg-white/90 shadow-[0_18px_34px_-30px_rgba(15,23,42,0.16)]">
      <CardHeader className="gap-1">
        <CardTitle className="text-sm text-slate-900">{title}</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        {items.map((item) => (
          <div key={`${item.time}-${item.title}`} className="grid grid-cols-[1rem_minmax(0,1fr)] gap-3">
            <div className="relative mt-1 flex justify-center">
              <div className="absolute top-3 h-[calc(100%+0.75rem)] w-px bg-slate-200 last:hidden" />
              <div className="relative z-10 h-3 w-3 rounded-full border-2 border-white bg-blue-500 shadow-[0_0_0_3px_rgba(219,234,254,0.9)]" />
            </div>
            <div className="rounded-[22px] bg-slate-50/88 px-4 py-3.5 ring-1 ring-slate-200/70">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                <p className="text-xs text-slate-500">{item.time}</p>
              </div>
              <p className="mt-1.5 text-sm leading-6 text-slate-600">{item.description}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
