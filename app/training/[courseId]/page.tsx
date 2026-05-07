import { notFound } from "next/navigation";

import { RestaurantModuleDetailPage } from "@/components/operations/restaurant-module-detail-page";
import { getRestaurantModuleByKey } from "@/lib/restaurant-modules";

export default async function TrainingDetailPage({ params }: { params: Promise<{ courseId: string }> }) {
  const moduleItem = getRestaurantModuleByKey("training");
  const { courseId } = await params;

  if (!moduleItem?.preview) {
    notFound();
  }

  return <RestaurantModuleDetailPage module={moduleItem} recordId={courseId} />;
}
