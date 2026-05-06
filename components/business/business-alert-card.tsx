import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { BusinessWorkspaceAlert } from "@/types/business-workspace";

const alertVariant: Record<BusinessWorkspaceAlert["tone"], "default" | "secondary" | "destructive" | "outline"> = {
  neutral: "secondary",
  info: "default",
  success: "default",
  warning: "outline",
  danger: "destructive",
  muted: "outline",
};

interface BusinessAlertCardProps {
  alert: BusinessWorkspaceAlert;
}

export function BusinessAlertCard({ alert }: BusinessAlertCardProps) {
  return (
    <Card size="sm">
      <CardHeader className="gap-2">
        <div className="flex items-center justify-between gap-3">
          <CardTitle className="text-sm">{alert.title.en}</CardTitle>
          <Badge variant={alertVariant[alert.tone]}>{alert.sourceModule}</Badge>
        </div>
        <CardDescription>{alert.title.zh}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-2 text-xs text-muted-foreground">
        <p>{alert.description.en}</p>
        <p>{alert.description.zh}</p>
        {alert.timestampLabel ? <p>{alert.timestampLabel.en}</p> : null}
        {alert.route ? <Link href={alert.route} className="text-primary underline-offset-4 hover:underline">Open module</Link> : null}
      </CardContent>
    </Card>
  );
}
