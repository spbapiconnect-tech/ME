import { DashboardHome } from "@/components/dashboard-home";
import { moduleRegistry } from "@/config/modules";

export default function HomePage() {
  return <DashboardHome modules={moduleRegistry} />;
}
