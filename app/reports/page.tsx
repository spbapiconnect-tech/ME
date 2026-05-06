import { ReportWidgetsPage } from "@/components/reports";
import { getPsiReportDashboardPageData } from "@/lib/page-data/psi";

export default async function ReportsRoute() {
  const psiDashboard = await getPsiReportDashboardPageData();
  return <ReportWidgetsPage psiDashboardData={psiDashboard.dashboardData} />;
}
