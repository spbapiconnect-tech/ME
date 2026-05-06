import { navigationMap } from "@/config/navigation";
import type {
  MeNavigationGroup,
  MeNavigationItem,
  MeNavigationLocale,
  MeNavigationMap,
  MeSidebarNavigationGroup,
  MeSidebarNavigationItem,
} from "@/types/navigation";

export function getNavigationMap(): MeNavigationMap {
  return navigationMap;
}

export function getNavigationGroups(): MeNavigationGroup[] {
  return navigationMap.groups;
}

export function getSidebarNavigationGroups(): MeSidebarNavigationGroup[] {
  return navigationMap.sidebarGroups;
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

export function resolveSidebarNavigationLabel(item: MeSidebarNavigationItem, locale: MeNavigationLocale = "en"): string {
  return item.label[locale];
}

export function resolveSidebarNavigationDescription(item: MeSidebarNavigationItem, locale: MeNavigationLocale = "en"): string | undefined {
  return item.description?.[locale];
}

export function isNavigationPathActive(pathname: string, href?: string, matchPaths: string[] = []): boolean {
  const candidates = [...matchPaths, href].filter((value): value is string => Boolean(value));
  return candidates.some((candidate) => {
    if (candidate === "/") {
      return pathname === "/";
    }

    return pathname === candidate || pathname.startsWith(`${candidate}/`);
  });
}

export function hasActiveSidebarChild(pathname: string, item: MeSidebarNavigationItem): boolean {
  if (isNavigationPathActive(pathname, item.href, item.matchPaths)) {
    return true;
  }

  return item.children?.some((child) => hasActiveSidebarChild(pathname, child)) ?? false;
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
