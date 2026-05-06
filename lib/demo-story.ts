import {
  meDemoStoryGeneratedAt,
  meDemoStoryNotice,
  meDemoStorySections,
  meDemoStorySteps,
} from "@/config/demo-story";
import { getBranchProfiles } from "@/lib/branch-context";
import { getNavigationMap } from "@/lib/navigation";
import { getRoleProfiles } from "@/lib/role-workspace";
import type { MeDemoStoryKey, MeDemoStoryPageData, MeDemoStorySection, MeDemoStoryStep } from "@/types/demo-story";
import type { MeNavigationLocale } from "@/types/navigation";

function sortSteps(steps: MeDemoStoryStep[]): MeDemoStoryStep[] {
  return [...steps].sort((left, right) => left.order - right.order);
}

function cloneStep(step: MeDemoStoryStep): MeDemoStoryStep {
  return {
    ...step,
    relatedRoutes: [...step.relatedRoutes],
    sourceModules: [...step.sourceModules],
    highlights: [...step.highlights],
    proofPoints: [...step.proofPoints],
  };
}

function cloneSection(section: MeDemoStorySection): MeDemoStorySection {
  return {
    ...section,
    steps: sortSteps(section.steps).map(cloneStep),
  };
}

export function getDemoStorySteps(): MeDemoStoryStep[] {
  return sortSteps(meDemoStorySteps).map(cloneStep);
}

export function getDemoStoryStepByKey(stepKey: string): MeDemoStoryStep | undefined {
  const step = meDemoStorySteps.find((item) => item.key === stepKey);
  return step ? cloneStep(step) : undefined;
}

export function getDemoStoryStepByRoute(route: string): MeDemoStoryStep | undefined {
  const normalizedRoute = route === "/" ? route : route.replace(/\/$/, "");
  const step = meDemoStorySteps.find((item) => {
    const itemRoute = item.route === "/" ? item.route : item.route.replace(/\/$/, "");
    return itemRoute === normalizedRoute;
  });

  return step ? cloneStep(step) : undefined;
}

export function getDemoStorySections(): MeDemoStorySection[] {
  return meDemoStorySections.map(cloneSection);
}

export function getDemoStoryPageData(currentStepKey?: MeDemoStoryKey): MeDemoStoryPageData {
  const sections = getDemoStorySections();
  const steps = getDemoStorySteps();
  const navigation = getNavigationMap();
  const roleCount = getRoleProfiles().length;
  const branchCount = getBranchProfiles().length;

  const enrichedSteps = steps.map((step) => {
    if (step.key === "navigation-ia") {
      return {
        ...step,
        proofPoints: [
          ...step.proofPoints,
          {
            zh: `当前导航包含 ${navigation.groups.length} 个主要分组与 ${navigation.footerItems.length} 个次级入口。`,
            en: `Current navigation exposes ${navigation.groups.length} major groups and ${navigation.footerItems.length} secondary entries.`,
          },
        ],
      };
    }

    if (step.key === "role-workspaces") {
      return {
        ...step,
        proofPoints: [
          ...step.proofPoints,
          {
            zh: `当前角色预览共 ${roleCount} 个。`,
            en: `Current role preview count: ${roleCount}.`,
          },
        ],
      };
    }

    if (step.key === "branch-context") {
      return {
        ...step,
        proofPoints: [
          ...step.proofPoints,
          {
            zh: `当前门店上下文预览共 ${branchCount} 个。`,
            en: `Current branch context preview count: ${branchCount}.`,
          },
        ],
      };
    }

    return step;
  });

  const sectionMap = new Map(enrichedSteps.map((step) => [step.key, step]));
  const enrichedSections = sections.map((section) => ({
    ...section,
    steps: section.steps
      .map((step) => sectionMap.get(step.key))
      .filter((step): step is MeDemoStoryStep => Boolean(step)),
  }));

  const resolvedCurrentStep = currentStepKey ? enrichedSteps.find((step) => step.key === currentStepKey) : undefined;

  return {
    title: { zh: "ME Demo Story", en: "ME Demo Story" },
    subtitle: { zh: "Guided Product Tour Placeholder", en: "Guided Product Tour Placeholder" },
    sections: enrichedSections,
    steps: enrichedSteps,
    currentStep: resolvedCurrentStep,
    generatedAt: meDemoStoryGeneratedAt,
    notice: meDemoStoryNotice,
  };
}

export function getNextDemoStoryStep(stepKey: string): MeDemoStoryStep | undefined {
  const steps = getDemoStorySteps();
  const currentIndex = steps.findIndex((step) => step.key === stepKey);
  if (currentIndex < 0) {
    return undefined;
  }

  return steps[currentIndex + 1];
}

export function getPreviousDemoStoryStep(stepKey: string): MeDemoStoryStep | undefined {
  const steps = getDemoStorySteps();
  const currentIndex = steps.findIndex((step) => step.key === stepKey);
  if (currentIndex <= 0) {
    return undefined;
  }

  return steps[currentIndex - 1];
}

export function getDemoStoryProgressPreview(stepKey: string) {
  const steps = getDemoStorySteps();
  const currentStep = steps.find((step) => step.key === stepKey);
  const totalSteps = steps.length;
  const currentOrder = currentStep?.order ?? 0;
  const completedSteps = currentStep ? Math.max(currentStep.order - 1, 0) : 0;
  const remainingSteps = currentStep ? totalSteps - currentStep.order : totalSteps;

  return {
    stepKey,
    totalSteps,
    currentOrder,
    completedSteps,
    remainingSteps,
    percentComplete: totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0,
    isFirstStep: currentOrder === 1,
    isLastStep: currentOrder === totalSteps,
    isPreviewOnly: true,
    notice: {
      zh: "仅计算可视导览进度，不做任何持久化。",
      en: "Calculates a visual tour-progress preview only and persists nothing.",
    },
  };
}

export function resolveDemoStoryTitle(step: MeDemoStoryStep, locale: MeNavigationLocale = "en"): string {
  return step.title[locale];
}

export function resolveDemoStoryDescription(step: MeDemoStoryStep, locale: MeNavigationLocale = "en"): string {
  return step.description[locale];
}
