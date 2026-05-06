import { navigationMap } from "@/config/navigation";
import type { MeNavigationGroup, MeNavigationItem, MeNavigationLocale, MeNavigationMap } from "@/types/navigation";

export function getNavigationMap(): MeNavigationMap {
  return navigationMap;
}

export function getNavigationGroups(): MeNavigationGroup[] {
  return navigationMap.groups;
}

export function getNavigationGroupByKey(key: string): MeNavigationGroup | undefined {
  return navigationMap.groups.find((group) => group.key === key);
}

export function getNavigationItemByKey(key: string): MeNavigationItem | undefined {
  return getAllNavigationItems().find((item) => item.key === key);
}

export function getPrimaryNavigationItems(): MeNavigationItem[] {
  return navigationMap.primaryItems;
}

export function getFoundationNavigationItems(): MeNavigationItem[] {
  return getAllNavigationItems().filter((item) => item.isFoundation);
}

export function getBusinessNavigationItems(): MeNavigationItem[] {
  return getNavigationItemsByGroup("business");
}

export function getNavigationItemsByGroup(group: string): MeNavigationItem[] {
  return getNavigationGroupByKey(group)?.items ?? [];
}

export function resolveNavigationLabel(item: MeNavigationItem, locale: MeNavigationLocale = "en"): string {
  return item.label[locale];
}

export function resolveNavigationDescription(item: MeNavigationItem, locale: MeNavigationLocale = "en"): string | undefined {
  return item.description?.[locale];
}

function getAllNavigationItems(): MeNavigationItem[] {
  const items = [...navigationMap.primaryItems, ...navigationMap.footerItems, ...navigationMap.groups.flatMap((group) => group.items)];
  const deduped = new Map<string, MeNavigationItem>();

  for (const item of items) {
    if (!deduped.has(item.key)) {
      deduped.set(item.key, item);
    }
  }

  return [...deduped.values()];
}
