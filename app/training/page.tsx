import { notFound } from "next/navigation";

import { RestaurantModulePage } from "@/components/operations";
import { getRestaurantModuleByKey } from "@/lib/restaurant-modules";

export default function TrainingPage() {
  const moduleItem = getRestaurantModuleByKey("training");

  if (!moduleItem?.preview) {
    notFound();
  }

  return <RestaurantModulePage module={moduleItem} />;
}
