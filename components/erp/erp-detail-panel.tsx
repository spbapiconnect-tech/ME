import { ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { ErpStatusBadge } from "./erp-status-badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

export function ErpDetailPanel({
  title,
  status,
  subtitle,
  actions,
  children,
  tabs,
  activeTab,
  onTabChange,
  className,
}: {
  title: string;
  status?: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
  tabs?: string[];
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  className?: string;
}) {
  return (
    <Card className={cn("rounded-md border-border bg-card shadow-sm", className)}>
      <div className="flex items-start justify-between gap-4 border-b border-border/50 p-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold tracking-tight text-foreground">{title}</h2>
            {status ? <ErpStatusBadge status={status} /> : null}
          </div>
          {subtitle ? <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p> : null}
        </div>
        {actions ? <div className="flex shrink-0 gap-2">{actions}</div> : null}
      </div>

      {tabs && tabs.length > 0 && (
        <div className="border-b border-border/50 px-4">
          <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
            <TabsList className="h-10 w-full justify-start rounded-none bg-transparent p-0">
              {tabs.map((tab) => (
                <TabsTrigger
                  key={tab}
                  value={tab}
                  className="relative h-10 rounded-none border-b-2 border-b-transparent bg-transparent px-4 pb-3 pt-2 text-sm font-medium text-muted-foreground transition-none data-[state=active]:border-b-primary data-[state=active]:text-primary data-[state=active]:shadow-none"
                >
                  {tab}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      )}

      <div className="min-h-[200px]">{children}</div>
    </Card>
  );
}
