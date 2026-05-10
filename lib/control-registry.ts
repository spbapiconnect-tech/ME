import { controlRegistry } from "@/config/control-registry";
import type { ControlLayer, MeControlRegistryItem } from "@/types/control-registry";

export function getAllControls(): MeControlRegistryItem[] {
  return controlRegistry;
}

export function getControlsByModule(module: string): MeControlRegistryItem[] {
  return controlRegistry.filter((item) => item.module === module);
}

export function getControlsByRoute(route: string): MeControlRegistryItem[] {
  return controlRegistry.filter((item) => item.route === route || item.route === "*" || (item.route.endsWith("/*") && route.startsWith(item.route.replace("/*", ""))));
}

export function getControlsByLayer(layer: ControlLayer): MeControlRegistryItem[] {
  return controlRegistry.filter((item) => item.layer === layer);
}

export function getControlByKey(key: string): MeControlRegistryItem | undefined {
  return controlRegistry.find((item) => item.key === key);
}

export function canControlExecuteNow(key: string): boolean {
  return getControlByKey(key)?.allowedNow ?? false;
}

export function getControlFeedback(key: string): string {
  const control = getControlByKey(key);
  return control ? control.uiFeedback : "Control not registered.";
}
