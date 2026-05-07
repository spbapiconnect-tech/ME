import { notFound } from "next/navigation";

import { RestaurantModulePage } from "@/components/operations/restaurant-module-page";
import { getRestaurantModuleByKey } from "@/lib/restaurant-modules";

export default function FinancePage() {
  const moduleItem = getRestaurantModuleByKey("finance");

  if (!moduleItem?.preview) {
    notFound();
  }

  return <RestaurantModulePage module={moduleItem} />;
}
