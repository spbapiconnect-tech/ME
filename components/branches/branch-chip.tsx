import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { MeBranchContextStatus, MeBranchContextTone } from "@/types/branch-context";

const toneVariant: Record<MeBranchContextTone, "default" | "secondary" | "destructive" | "outline"> = {
  neutral: "secondary",
  info: "default",
  success: "default",
  warning: "outline",
  danger: "destructive",
  muted: "outline",
};

interface BranchChipProps {
  label: string;
  tone?: MeBranchContextTone;
  status?: MeBranchContextStatus;
  className?: string;
}

export function BranchChip({ label, tone = "neutral", status, className }: BranchChipProps) {
  return (
    <Badge variant={toneVariant[tone]} className={cn(status === "coming-soon" && "opacity-80", className)}>
      {label}
    </Badge>
  );
}
