import { getDemoModuleData } from "@/data/demo";

import { errResult, okResult } from "../../data";
import type { ProcurementRepository } from "../contracts";

export function createMockProcurementRepository(): ProcurementRepository {
  return {
    async getDemoData() {
      const data = getDemoModuleData("procurement");

      if (!data) {
        return errResult({
          code: "DEMO_DATA_NOT_FOUND",
          message: "Missing procurement demo data",
        });
      }

      return okResult(data);
    },
  };
}
