import { MeRightRail } from "@/components/layout";
import type { RestaurantModuleRailSection } from "@/config/restaurant-modules";

export function RestaurantModuleRightRail({ sections }: { sections: RestaurantModuleRailSection[] }) {
  return <MeRightRail sticky={false} sections={sections} />;
}
