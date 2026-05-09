import { BranchWorkspacePage } from "@/components/branches/branch-workspace-page";
import { branchProfiles } from "@/config/branches";

export default function BranchesPage() {
  return <BranchWorkspacePage branches={branchProfiles} />;
}
