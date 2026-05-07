import { notFound } from "next/navigation";

import { RestaurantModuleDetailPage } from "@/components/operations/restaurant-module-detail-page";
import { getRestaurantModuleByKey } from "@/lib/restaurant-modules";

export default async function InspectionDetailPage({ params }: { params: Promise<{ inspectionId: string }> }) {
  const moduleItem = getRestaurantModuleByKey("inspection");
  const { inspectionId } = await params;

  if (!moduleItem?.preview) {
    notFound();
  }

  return <RestaurantModuleDetailPage module={moduleItem} recordId={inspectionId} />;
}
