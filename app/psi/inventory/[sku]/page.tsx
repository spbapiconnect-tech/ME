import { notFound } from "next/navigation";

import { RestaurantModuleDetailPage } from "@/components/operations/restaurant-module-detail-page";
import { getRestaurantModuleByKey } from "@/lib/restaurant-modules";

export default async function InventoryDetailPage({ params }: { params: Promise<{ sku: string }> }) {
  const moduleItem = getRestaurantModuleByKey("inventory");
  const { sku } = await params;

  if (!moduleItem?.preview) {
    notFound();
  }

  return <RestaurantModuleDetailPage module={moduleItem} recordId={sku} />;
}
