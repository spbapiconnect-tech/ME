import { notFound } from "next/navigation";

import { RestaurantModuleDetailPage } from "@/components/operations/restaurant-module-detail-page";
import { getRestaurantModuleByKey } from "@/lib/restaurant-modules";

export default async function ProcurementDetailPage({ params }: { params: Promise<{ requestId: string }> }) {
  const moduleItem = getRestaurantModuleByKey("procurement");
  const { requestId } = await params;

  if (!moduleItem?.preview) {
    notFound();
  }

  return <RestaurantModuleDetailPage module={moduleItem} recordId={requestId} />;
}
