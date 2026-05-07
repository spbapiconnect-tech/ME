import { notFound } from "next/navigation";

import { RestaurantModuleDetailPage } from "@/components/operations/restaurant-module-detail-page";
import { getRestaurantModuleByKey } from "@/lib/restaurant-modules";

export default async function ReceivingDetailPage({ params }: { params: Promise<{ receivingId: string }> }) {
  const moduleItem = getRestaurantModuleByKey("receiving");
  const { receivingId } = await params;

  if (!moduleItem?.preview) {
    notFound();
  }

  return <RestaurantModuleDetailPage module={moduleItem} recordId={receivingId} />;
}
