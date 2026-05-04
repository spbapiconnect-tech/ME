import { demoModuleCodes, getDemoModuleData } from "@/data/demo";

import { okResult } from "../../data";
import type { DemoRepository } from "../contracts";

export function createMockDemoRepository(): DemoRepository {
  return {
    async listModuleCodes() {
      return okResult([...demoModuleCodes]);
    },

    async getModuleData(moduleCode: string) {
      return okResult(getDemoModuleData(moduleCode) ?? null);
    },
  };
}
