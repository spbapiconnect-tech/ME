import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ErpRightRail({
  sections,
}: {
  sections: Array<{ title: string; items: string[] }>;
}) {
  return (
    <aside className="grid gap-3 xl:w-[20rem]">
      {sections.map((section) => (
        <Card key={section.title} size="sm">
          <CardHeader>
            <CardTitle className="text-sm">{section.title}</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2 text-sm text-muted-foreground">
            {section.items.map((item) => (
              <div key={item} className="rounded-md border bg-muted/30 px-3 py-2">
                {item}
              </div>
            ))}
          </CardContent>
        </Card>
      ))}
    </aside>
  );
}
