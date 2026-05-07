import { BranchErpDetailPage } from "@/components/branches/branch-erp-detail-page";

interface BranchRouteProps {
  params: Promise<{ id: string }>;
}

export default async function BranchRoute({ params }: BranchRouteProps) {
  const { id } = await params;

  return <BranchErpDetailPage id={id} />;
}
