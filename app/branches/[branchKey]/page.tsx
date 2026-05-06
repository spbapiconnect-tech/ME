import { BranchWorkspaceDetailPage } from "@/components/branches";
import { getBranchWorkspaceData } from "@/lib/branch-context";

interface BranchWorkspaceRouteProps {
  params: Promise<{
    branchKey: string;
  }>;
}

export default async function BranchWorkspaceRoute({ params }: BranchWorkspaceRouteProps) {
  const resolvedParams = await params;
  const data = await getBranchWorkspaceData(resolvedParams.branchKey);

  return <BranchWorkspaceDetailPage data={data} branchKey={resolvedParams.branchKey} />;
}
