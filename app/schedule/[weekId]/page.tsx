import { notFound } from "next/navigation";

import { RestaurantModuleDetailPage } from "@/components/operations/restaurant-module-detail-page";
import { getRestaurantModuleByKey } from "@/lib/restaurant-modules";

export default async function ScheduleDetailPage({ params }: { params: Promise<{ weekId: string }> }) {
  const moduleItem = getRestaurantModuleByKey("schedule");
  const { weekId } = await params;

  if (!moduleItem?.preview) {
    notFound();
  }

  return <RestaurantModuleDetailPage module={moduleItem} recordId={weekId} />;
}
