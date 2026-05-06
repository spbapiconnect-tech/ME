import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function MeStatusTimeline({
  title = "Status Timeline",
  items,
}: {
  title?: string;
  items: Array<{ title: string; description: string; time: string }>;
}) {
  return (
    <Card size="sm" className="border-border/40 bg-white/90 shadow-sm shadow-slate-900/5">
      <CardHeader className="gap-1">
        <CardTitle className="text-sm text-slate-900">{title}</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3">
        {items.map((item) => (
          <div key={`${item.time}-${item.title}`} className="grid grid-cols-[0.75rem_minmax(0,1fr)] gap-3">
            <div className="mt-1 flex justify-center">
              <div className="h-2.5 w-2.5 rounded-full bg-blue-500" />
            </div>
            <div className="rounded-2xl border border-border/50 bg-slate-50/85 px-4 py-3">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-medium text-slate-900">{item.title}</p>
                <p className="text-xs text-slate-500">{item.time}</p>
              </div>
              <p className="mt-1 text-sm text-slate-600">{item.description}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
