import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface DemoPresentationNoteProps {
  title?: string;
  description?: string;
  href?: string;
  hrefLabel?: string;
}

export function DemoPresentationNote({
  title = "Screenshot-ready placeholder",
  description = "Screenshot-ready placeholder — all data is mock/read-only.",
  href = "/demo-mode",
  hrefLabel = "Open Demo Mode",
}: DemoPresentationNoteProps) {
  return (
    <Card size="sm" className="border-dashed border-border/80 bg-muted/20">
      <CardHeader className="gap-1">
        <CardTitle className="text-sm">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-2">
        <Button asChild size="sm" variant="outline">
          <Link href={href}>{hrefLabel}</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
