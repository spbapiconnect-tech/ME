import { notFound } from "next/navigation";

import { RestaurantModuleDetailPage } from "@/components/operations/restaurant-module-detail-page";
import { getRestaurantModuleByKey } from "@/lib/restaurant-modules";

export default async function SupplierDetailPage({ params }: { params: Promise<{ supplierId: string }> }) {
  const moduleItem = getRestaurantModuleByKey("supplier");
  const { supplierId } = await params;

  if (!moduleItem?.preview) {
    notFound();
  }

  return <RestaurantModuleDetailPage module={moduleItem} recordId={supplierId} />;
}
