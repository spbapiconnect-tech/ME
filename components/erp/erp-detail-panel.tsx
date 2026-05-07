import type { ReactNode } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { ErpDetailField } from "@/lib/erp/erp-module-schema";

export function ErpDetailPanel({
  title,
  description,
  fields,
  tabs,
}: {
  title: string;
  description?: string;
  fields: ErpDetailField[];
  tabs?: Array<{ value: string; label: string; content?: ReactNode }>;
}) {
  const defaultTab = tabs?.[0]?.value ?? "overview";

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
        {description ? <p className="text-sm text-muted-foreground">{description}</p> : null}
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {tabs?.length ? (
          <Tabs defaultValue={defaultTab}>
            <TabsList variant="line">
              {tabs.map((tab) => (
                <TabsTrigger key={tab.value} value={tab.value}>
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
            {tabs.map((tab) => (
              <TabsContent key={tab.value} value={tab.value}>
                {tab.content}
              </TabsContent>
            ))}
          </Tabs>
        ) : null}
        <div className="grid gap-3 md:grid-cols-2">
          {fields.map((field) => (
            <div key={field.label} className="border-b pb-3">
              <p className="text-[11px] font-semibold uppercase text-muted-foreground">{field.label}</p>
              <div className="mt-1 text-sm font-medium text-foreground">{field.value}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
