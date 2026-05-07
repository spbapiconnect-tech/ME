import { notFound } from "next/navigation";

import { RestaurantModuleDetailPage } from "@/components/operations/restaurant-module-detail-page";
import { getRestaurantModuleByKey } from "@/lib/restaurant-modules";

export default async function IssueDetailPage({ params }: { params: Promise<{ issueId: string }> }) {
  const moduleItem = getRestaurantModuleByKey("issues");
  const { issueId } = await params;

  if (!moduleItem?.preview) {
    notFound();
  }

  return <RestaurantModuleDetailPage module={moduleItem} recordId={issueId} />;
}
