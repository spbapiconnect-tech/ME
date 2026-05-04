import { getDemoModuleData } from "@/data/demo";

import { errResult, okResult } from "../../data";
import type { InventoryRepository } from "../contracts";

export function createMockInventoryRepository(): InventoryRepository {
  return {
    async getDemoData() {
      const data = getDemoModuleData("inventory");

      if (!data) {
        return errResult({
          code: "DEMO_DATA_NOT_FOUND",
          message: "Missing inventory demo data",
        });
      }

      return okResult(data);
    },
  };
}
