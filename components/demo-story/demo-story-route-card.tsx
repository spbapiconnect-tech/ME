import Link from "next/link";

import { DemoStoryChip } from "@/components/demo-story/demo-story-chip";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface DemoStoryRouteCardProps {
  title: string;
  description: string;
  route: string;
  tone?: "neutral" | "info" | "success" | "warning" | "danger" | "muted";
}

export function DemoStoryRouteCard({ title, description, route, tone = "neutral" }: DemoStoryRouteCardProps) {
  return (
    <Card size="sm" className="border border-border/70 bg-card/95">
      <CardHeader className="gap-1">
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle className="text-sm">{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          <DemoStoryChip label={route} tone={tone} />
        </div>
      </CardHeader>
      <CardContent>
        <Button asChild size="sm" variant="outline">
          <Link href={route}>Open Route</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
