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
  title = "Workspace Note",
  description = "Current release scope for this workspace.",
  href = "/system-foundation",
  hrefLabel = "Open System Foundation",
}: DemoPresentationNoteProps) {
  return (
    <Card size="sm" className="border-border bg-[#F8FAFC] shadow-none">
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
