import { BranchWorkspacePage } from "@/components/branches";
import { getBranchProfiles } from "@/lib/branch-context";

export default function BranchesPage() {
  return <BranchWorkspacePage branches={getBranchProfiles()} />;
}
