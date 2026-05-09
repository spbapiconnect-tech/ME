import { BranchWorkspacePage } from "@/components/branches/branch-workspace-page";
import { meBranchProfiles } from "@/config/branches";

export default function BranchesPage() {
  return <BranchWorkspacePage branches={meBranchProfiles} />;
}
