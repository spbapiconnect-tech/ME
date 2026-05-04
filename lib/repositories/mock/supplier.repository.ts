import { getDemoModuleData } from "@/data/demo";

import { errResult, okResult } from "../../data";
import type { SupplierRepository } from "../contracts";

export function createMockSupplierRepository(): SupplierRepository {
  return {
    async getDemoData() {
      const data = getDemoModuleData("supplier");

      if (!data) {
        return errResult({
          code: "DEMO_DATA_NOT_FOUND",
          message: "Missing supplier demo data",
        });
      }

      return okResult(data);
    },
  };
}
