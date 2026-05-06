import { RoleWorkspacePage } from "@/components/roles";
import { getRoleProfiles } from "@/lib/role-workspace";

export default function RolesPage() {
  return <RoleWorkspacePage roles={getRoleProfiles()} />;
}
