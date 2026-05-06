import { RoleWorkspaceDetailPage } from "@/components/roles";
import { getRoleWorkspaceData } from "@/lib/role-workspace";

interface RoleWorkspaceRouteProps {
  params: Promise<{
    roleKey: string;
  }>;
}

export default async function RoleWorkspaceRoute({ params }: RoleWorkspaceRouteProps) {
  const resolvedParams = await params;
  const data = await getRoleWorkspaceData(resolvedParams.roleKey);

  return <RoleWorkspaceDetailPage data={data} roleKey={resolvedParams.roleKey} />;
}
