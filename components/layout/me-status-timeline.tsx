import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function MeStatusTimeline({
  title = "Status Timeline",
  items,
  embedded = false,
}: {
  title?: string;
  items: Array<{ title: string; description: string; time: string }>;
  embedded?: boolean;
}) {
  const timeline = (
    <div className="grid gap-3">
      {items.map((item, index) => (
        <div key={`${item.time}-${item.title}`} className="grid grid-cols-[0.95rem_minmax(0,1fr)] gap-3">
          <div className="relative mt-1 flex justify-center">
            {index < items.length - 1 ? <div className="absolute top-3 h-[calc(100%+0.5rem)] w-px bg-slate-200" /> : null}
            <div className="relative z-10 h-3 w-3 rounded-full border-2 border-white bg-blue-500 shadow-[0_0_0_3px_rgba(219,234,254,0.82)]" />
          </div>
          <div className="rounded-[10px] border border-slate-200 bg-slate-50/70 px-4 py-3">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-semibold text-slate-900">{item.title}</p>
              <p className="text-xs text-slate-500">{item.time}</p>
            </div>
            <p className="mt-1.5 text-sm leading-6 text-slate-600">{item.description}</p>
          </div>
        </div>
      ))}
    </div>
  );

  if (embedded) {
    return (
      <div className="grid gap-4">
        {title ? <div className="text-sm font-semibold text-slate-900">{title}</div> : null}
        {timeline}
      </div>
    );
  }

  return (
    <Card size="sm" className="border-border bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
      <CardHeader className="gap-1">
        <CardTitle className="text-sm text-slate-900">{title}</CardTitle>
      </CardHeader>
      <CardContent>{timeline}</CardContent>
    </Card>
  );
}
