import type { RepositoryProvider } from "../contracts";

import { createMockDemoRepository } from "./demo.repository";
import { createMockInventoryRepository } from "./inventory.repository";
import { createMockProcurementRepository } from "./procurement.repository";
import { createMockSupplierRepository } from "./supplier.repository";
import { createMockTaskRepository } from "./task.repository";

export function createMockRepositoryProvider(): RepositoryProvider {
  return {
    procurement: createMockProcurementRepository(),
    supplier: createMockSupplierRepository(),
    inventory: createMockInventoryRepository(),
    task: createMockTaskRepository(),
    demo: createMockDemoRepository(),
  };
}
