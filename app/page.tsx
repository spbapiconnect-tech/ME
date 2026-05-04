import { DashboardHome } from "@/components/dashboard-home";
import { coreModules } from "@/config/modules";

export default function HomePage() {
  return <DashboardHome modules={coreModules} />;
}
