import { demoDashboardData } from "@/data/demo";
import type { DemoModuleCode, DemoModuleData } from "@/data/demo";

import type { DataResult } from "../data";
import { errResult, okResult } from "../data";
import { getRepositoryProvider } from "../repositories/provider";

export async function listDemoModuleCodes() {
  return getRepositoryProvider().demo.listModuleCodes();
}

export async function getDemoModuleData(moduleCode: string) {
  return getRepositoryProvider().demo.getModuleData(moduleCode);
}

export interface DemoOverviewData {
  dashboard: typeof demoDashboardData;
  moduleCodes: DemoModuleCode[];
  moduleDataMap: Record<DemoModuleCode, DemoModuleData>;
}

export async function getDemoOverview(): Promise<DataResult<DemoOverviewData>> {
  const moduleCodesResult = await listDemoModuleCodes();

  if (!moduleCodesResult.ok) {
    return errResult(moduleCodesResult.error, moduleCodesResult.meta.source);
  }

  const moduleDataMap = {} as Record<DemoModuleCode, DemoModuleData>;

  for (const moduleCode of moduleCodesResult.data) {
    const moduleDataResult = await getDemoModuleData(moduleCode);

    if (!moduleDataResult.ok) {
      return errResult(moduleDataResult.error, moduleDataResult.meta.source);
    }

    if (!moduleDataResult.data) {
      return errResult(
        {
          code: "demo_module_missing",
          message: `Demo module ${moduleCode} returned no data.`,
        },
        moduleDataResult.meta.source,
      );
    }

    moduleDataMap[moduleCode] = moduleDataResult.data;
  }

  return okResult(
    {
      dashboard: demoDashboardData,
      moduleCodes: moduleCodesResult.data,
      moduleDataMap,
    },
    moduleCodesResult.meta.source,
  );
}
