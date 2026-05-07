import { notFound } from "next/navigation";

import { RestaurantModulePage } from "@/components/operations/restaurant-module-page";
import { getRestaurantModuleByKey } from "@/lib/restaurant-modules";

export default function InspectionPage() {
  const moduleItem = getRestaurantModuleByKey("inspection");

  if (!moduleItem?.preview) {
    notFound();
  }

  return <RestaurantModulePage module={moduleItem} />;
}
