import { notFound } from "next/navigation";

import { RestaurantModulePage } from "@/components/operations/restaurant-module-page";
import { getRestaurantModuleByKey } from "@/lib/restaurant-modules";

export default function SchedulePage() {
  const moduleItem = getRestaurantModuleByKey("schedule");

  if (!moduleItem?.preview) {
    notFound();
  }

  return <RestaurantModulePage module={moduleItem} />;
}
