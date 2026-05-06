import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { MeDemoStepStatus, MeDemoStoryTone } from "@/types/demo-story";

interface DemoStoryChipProps {
  label: string;
  tone?: MeDemoStoryTone;
  status?: MeDemoStepStatus;
  className?: string;
}

function resolveVariant(tone: MeDemoStoryTone = "neutral", status?: MeDemoStepStatus): "default" | "secondary" | "outline" | "destructive" {
  if (status === "coming-soon") {
    return "outline";
  }

  if (tone === "success" || tone === "info") {
    return "secondary";
  }

  if (tone === "warning" || tone === "muted") {
    return "outline";
  }

  if (tone === "danger") {
    return "destructive";
  }

  return "default";
}

export function DemoStoryChip({ label, tone = "neutral", status, className }: DemoStoryChipProps) {
  return (
    <Badge variant={resolveVariant(tone, status)} className={cn("capitalize", className)}>
      {label.split("-").join(" ")}
    </Badge>
  );
}
