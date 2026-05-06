import {
  meStakeholderDemoRouteMap,
  meStakeholderRoadmapItems,
  meStakeholderSummaryAudiences,
  meStakeholderSummaryCards,
  meStakeholderSummaryGeneratedAt,
  meStakeholderSummaryNotice,
  meStakeholderSummaryPageData,
} from "@/config/stakeholder-summary";
import { getRecommendedDemoRouteSequence } from "@/lib/demo-mode";
import { getDemoStorySteps } from "@/lib/demo-story";
import type { MeNavigationLocale } from "@/types/navigation";
import type {
  MeStakeholderAudience,
  MeStakeholderDemoRoute,
  MeStakeholderLocalizedText,
  MeStakeholderRoadmapItem,
  MeStakeholderSectionKind,
  MeStakeholderSummaryCard,
  MeStakeholderSummaryMetric,
  MeStakeholderSummaryPageData,
} from "@/types/stakeholder-summary";

function cloneLocalizedText(text: MeStakeholderLocalizedText): MeStakeholderLocalizedText {
  return { ...text };
}

function cloneMetric(metric: MeStakeholderSummaryMetric): MeStakeholderSummaryMetric {
  return {
    ...metric,
    label: cloneLocalizedText(metric.label),
    description: metric.description ? cloneLocalizedText(metric.description) : undefined,
  };
}

function cloneCard(card: MeStakeholderSummaryCard): MeStakeholderSummaryCard {
  return {
    ...card,
    title: cloneLocalizedText(card.title),
    description: cloneLocalizedText(card.description),
    highlights: card.highlights.map(cloneLocalizedText),
    proofPoints: card.proofPoints.map(cloneLocalizedText),
  };
}

function cloneRoadmapItem(item: MeStakeholderRoadmapItem): MeStakeholderRoadmapItem {
  return {
    ...item,
    title: cloneLocalizedText(item.title),
    description: cloneLocalizedText(item.description),
  };
}

function cloneDemoRoute(route: MeStakeholderDemoRoute): MeStakeholderDemoRoute {
  return {
    ...route,
    title: cloneLocalizedText(route.title),
    description: cloneLocalizedText(route.description),
  };
}

export function getStakeholderSummaryAudiences(): MeStakeholderAudience[] {
  return [...meStakeholderSummaryAudiences];
}

export function getStakeholderSummaryMetrics(): MeStakeholderSummaryMetric[] {
  const baseMetrics = meStakeholderSummaryPageData.metrics.map(cloneMetric);
  const routeCount = getStakeholderDemoRouteMap().length;
  const placeholderCardCount = getStakeholderSummaryCards().filter((card) => !["roadmap", "demo-route-map"].includes(card.kind)).length;
  const demoStoryStepCount = getDemoStorySteps().length;
  const recommendedRouteCount = getRecommendedDemoRouteSequence().length;

  return baseMetrics.map((metric) => {
    if (metric.key === "demo-routes") {
      return { ...metric, value: String(routeCount) };
    }

    if (metric.key === "placeholder-modules") {
      return { ...metric, value: String(placeholderCardCount) };
    }

    if (metric.key === "foundation-checkpoints") {
      return { ...metric, value: String(Math.max(demoStoryStepCount - 2, recommendedRouteCount - 2, 1)) };
    }

    return metric;
  });
}

export function getStakeholderSummaryCards(): MeStakeholderSummaryCard[] {
  return meStakeholderSummaryCards.map(cloneCard);
}

export function getStakeholderRoadmapItems(): MeStakeholderRoadmapItem[] {
  return meStakeholderRoadmapItems.map(cloneRoadmapItem);
}

export function getStakeholderDemoRouteMap(): MeStakeholderDemoRoute[] {
  const sequence = ["/", "/demo-story", "/demo-mode", ...getRecommendedDemoRouteSequence().filter((route) => !["/", "/demo-story"].includes(route))];
  const order = new Map(sequence.map((route, index) => [route, index]));

  return meStakeholderDemoRouteMap
    .map(cloneDemoRoute)
    .sort((left, right) => (order.get(left.route) ?? Number.MAX_SAFE_INTEGER) - (order.get(right.route) ?? Number.MAX_SAFE_INTEGER));
}

export function getStakeholderSummaryPageData(): MeStakeholderSummaryPageData {
  return {
    title: cloneLocalizedText(meStakeholderSummaryPageData.title),
    subtitle: cloneLocalizedText(meStakeholderSummaryPageData.subtitle),
    audience: getStakeholderSummaryAudiences(),
    metrics: getStakeholderSummaryMetrics(),
    cards: getStakeholderSummaryCards(),
    roadmap: getStakeholderRoadmapItems(),
    demoRoutes: getStakeholderDemoRouteMap(),
    generatedAt: meStakeholderSummaryGeneratedAt,
    notice: cloneLocalizedText(meStakeholderSummaryNotice),
  };
}

export function getStakeholderCardsByKind(kind: MeStakeholderSectionKind): MeStakeholderSummaryCard[] {
  return getStakeholderSummaryCards().filter((card) => card.kind === kind);
}

export function resolveStakeholderCardTitle(
  card: MeStakeholderSummaryCard,
  locale: MeNavigationLocale = "en",
): string {
  return card.title[locale];
}

export function resolveStakeholderCardDescription(
  card: MeStakeholderSummaryCard,
  locale: MeNavigationLocale = "en",
): string {
  return card.description[locale];
}
