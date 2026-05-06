import { StakeholderSummaryPage } from "@/components/stakeholder-summary";
import { getStakeholderSummaryPageData } from "@/lib/stakeholder-summary";

export default function StakeholderSummaryRoute() {
  return <StakeholderSummaryPage data={getStakeholderSummaryPageData()} />;
}
