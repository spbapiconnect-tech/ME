import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { MeRoleWorkspaceStatus, MeRoleWorkspaceTone } from "@/types/role-workspace";

const toneVariant: Record<MeRoleWorkspaceTone, "default" | "secondary" | "destructive" | "outline"> = {
  neutral: "secondary",
  info: "default",
  success: "default",
  warning: "outline",
  danger: "destructive",
  muted: "outline",
};

interface RoleChipProps {
  label: string;
  tone?: MeRoleWorkspaceTone;
  status?: MeRoleWorkspaceStatus;
  className?: string;
}

export function RoleChip({ label, tone = "neutral", status, className }: RoleChipProps) {
  return (
    <Badge variant={toneVariant[tone]} className={cn(status === "hidden" && "opacity-70", className)}>
      {label}
    </Badge>
  );
}
