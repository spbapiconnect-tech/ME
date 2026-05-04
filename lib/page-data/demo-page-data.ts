import { demoDashboardData } from "@/data/demo";
import type { DemoModuleCode, DemoModuleData } from "@/data/demo";

import type { DataMeta } from "../data";
import { getDemoModuleData, getDemoOverview, listDemoModuleCodes } from "../services";

export interface DemoWorkspacePageData {
  dashboard: typeof demoDashboardData;
  moduleCodes: DemoModuleCode[];
  moduleDataMap: Record<DemoModuleCode, DemoModuleData>;
  meta: DataMeta;
  isMock: boolean;
  error?: string;
}

export async function getDemoWorkspacePageData(): Promise<DemoWorkspacePageData> {
  const result = await getDemoOverview();

  if (!result.ok) {
    return {
      dashboard: demoDashboardData,
      moduleCodes: [],
      moduleDataMap: {} as Record<DemoModuleCode, DemoModuleData>,
      meta: result.meta,
      isMock: result.meta.source === "mock",
      error: result.error.message,
    };
  }

  return {
    ...result.data,
    meta: result.meta,
    isMock: result.meta.source === "mock",
  };
}

export interface DemoModuleRoutePageData {
  moduleCode: string;
  moduleCodes: DemoModuleCode[];
  demoData: DemoModuleData | null;
  meta: DataMeta;
  isMock: boolean;
  error?: string;
}

export async function getDemoModuleRoutePageData(moduleCode: string): Promise<DemoModuleRoutePageData> {
  const moduleCodesResult = await listDemoModuleCodes();

  if (!moduleCodesResult.ok) {
    return {
      moduleCode,
      moduleCodes: [],
      demoData: null,
      meta: moduleCodesResult.meta,
      isMock: moduleCodesResult.meta.source === "mock",
      error: moduleCodesResult.error.message,
    };
  }

  const moduleCodes = moduleCodesResult.data;

  if (!moduleCodes.includes(moduleCode as DemoModuleCode)) {
    return {
      moduleCode,
      moduleCodes,
      demoData: null,
      meta: moduleCodesResult.meta,
      isMock: moduleCodesResult.meta.source === "mock",
    };
  }

  const moduleDataResult = await getDemoModuleData(moduleCode);

  if (!moduleDataResult.ok) {
    return {
      moduleCode,
      moduleCodes,
      demoData: null,
      meta: moduleDataResult.meta,
      isMock: moduleDataResult.meta.source === "mock",
      error: moduleDataResult.error.message,
    };
  }

  return {
    moduleCode,
    moduleCodes,
    demoData: moduleDataResult.data,
    meta: moduleDataResult.meta,
    isMock: moduleDataResult.meta.source === "mock",
  };
}
