import { restaurantModules, restaurantModuleGroupLabels, type RestaurantModuleDefinition, type RestaurantModuleGroup } from "@/config/restaurant-modules";

export function getRestaurantModules(): RestaurantModuleDefinition[] {
  return restaurantModules;
}

export function getRestaurantModulesByGroup(group: RestaurantModuleGroup): RestaurantModuleDefinition[] {
  return restaurantModules.filter((moduleItem) => moduleItem.group === group);
}

export function getRestaurantModuleByKey(key: string): RestaurantModuleDefinition | undefined {
  return restaurantModules.find((moduleItem) => moduleItem.key === key);
}

export function getRestaurantModuleSurfaces() {
  return restaurantModules.map((moduleItem) => ({
    key: moduleItem.key,
    route: moduleItem.route,
    surfaceType: moduleItem.surfaceType,
    group: moduleItem.group,
    status: moduleItem.status,
  }));
}

export function getModulesRequiringDataTables(): RestaurantModuleDefinition[] {
  return restaurantModules.filter((moduleItem) => moduleItem.dataLayerNeeded);
}

export function getModulesRequiringFormulaLayer(): RestaurantModuleDefinition[] {
  return restaurantModules.filter((moduleItem) => moduleItem.formulaLayerNeeded);
}

export function getModulesRequiringBrainLayer(): RestaurantModuleDefinition[] {
  return restaurantModules.filter((moduleItem) => moduleItem.brainLayerNeeded);
}

export function getModulesRequiringPermissionLayer(): RestaurantModuleDefinition[] {
  return restaurantModules.filter((moduleItem) => moduleItem.permissionLayerNeeded);
}

export function getRestaurantModuleGroupLabels() {
  return restaurantModuleGroupLabels;
}
