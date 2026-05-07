import { notFound } from "next/navigation";

import { RestaurantModuleDetailPage } from "@/components/operations/restaurant-module-detail-page";
import { getRestaurantModuleByKey } from "@/lib/restaurant-modules";

export default async function IntegrationDetailPage({ params }: { params: Promise<{ connectorId: string }> }) {
  const moduleItem = getRestaurantModuleByKey("integration");
  const { connectorId } = await params;

  if (!moduleItem?.preview) {
    notFound();
  }

  return <RestaurantModuleDetailPage module={moduleItem} recordId={connectorId} />;
}
