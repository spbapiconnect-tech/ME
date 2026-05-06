import { meDemoModeBadges, meDemoModePageData, meDemoScreenshotSections, meDemoWalkthroughItems } from "@/config/demo-mode";
import type {
  MeDemoModeBadge,
  MeDemoModePageData,
  MeDemoScreenshotSection,
  MeDemoWalkthroughItem,
} from "@/types/demo-mode";
import type { MeNavigationLocale } from "@/types/navigation";

function cloneBadge(badge: MeDemoModeBadge): MeDemoModeBadge {
  return {
    ...badge,
    label: { ...badge.label },
    description: badge.description ? { ...badge.description } : undefined,
  };
}

function cloneScreenshotSection(section: MeDemoScreenshotSection): MeDemoScreenshotSection {
  return {
    ...section,
    title: { ...section.title },
    description: { ...section.description },
    recommendedShot: { ...section.recommendedShot },
    framingTips: section.framingTips.map((tip) => ({ ...tip })),
    highlightKeys: [...section.highlightKeys],
  };
}

function cloneWalkthroughItem(item: MeDemoWalkthroughItem): MeDemoWalkthroughItem {
  return {
    ...item,
    title: { ...item.title },
    description: { ...item.description },
  };
}

export function getDemoModeBadges(): MeDemoModeBadge[] {
  return meDemoModeBadges.map(cloneBadge);
}

export function getDemoModeBadgeByKey(key: string): MeDemoModeBadge | undefined {
  const badge = meDemoModeBadges.find((item) => item.key === key);
  return badge ? cloneBadge(badge) : undefined;
}

export function getDemoScreenshotSections(): MeDemoScreenshotSection[] {
  return meDemoScreenshotSections.map(cloneScreenshotSection);
}

export function getDemoScreenshotSectionsBySurface(surface: MeDemoScreenshotSection["surface"]): MeDemoScreenshotSection[] {
  return meDemoScreenshotSections.filter((section) => section.surface === surface).map(cloneScreenshotSection);
}

export function getDemoWalkthroughItems(): MeDemoWalkthroughItem[] {
  return [...meDemoWalkthroughItems].sort((left, right) => left.order - right.order).map(cloneWalkthroughItem);
}

export function getRecommendedDemoRouteSequence(): string[] {
  return [...meDemoModePageData.recommendedRouteSequence];
}

export function getDemoModePageData(): MeDemoModePageData {
  return {
    title: { ...meDemoModePageData.title },
    subtitle: { ...meDemoModePageData.subtitle },
    badges: getDemoModeBadges(),
    screenshotSections: getDemoScreenshotSections(),
    walkthroughItems: getDemoWalkthroughItems(),
    recommendedRouteSequence: getRecommendedDemoRouteSequence(),
    generatedAt: meDemoModePageData.generatedAt,
    notice: { ...meDemoModePageData.notice },
  };
}

export function resolveDemoModeBadgeLabel(badge: MeDemoModeBadge, locale: MeNavigationLocale = "en"): string {
  return badge.label[locale];
}

export function resolveDemoScreenshotTitle(section: MeDemoScreenshotSection, locale: MeNavigationLocale = "en"): string {
  return section.title[locale];
}

export function resolveDemoWalkthroughTitle(item: MeDemoWalkthroughItem, locale: MeNavigationLocale = "en"): string {
  return item.title[locale];
}
