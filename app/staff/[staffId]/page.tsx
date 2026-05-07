import { notFound } from "next/navigation";

import { RestaurantModuleDetailPage } from "@/components/operations/restaurant-module-detail-page";
import { getRestaurantModuleByKey } from "@/lib/restaurant-modules";

export default async function StaffDetailPage({ params }: { params: Promise<{ staffId: string }> }) {
  const moduleItem = getRestaurantModuleByKey("staff");
  const { staffId } = await params;

  if (!moduleItem?.preview) {
    notFound();
  }

  return <RestaurantModuleDetailPage module={moduleItem} recordId={staffId} />;
}
