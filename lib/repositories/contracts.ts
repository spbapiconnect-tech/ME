import type { DemoModuleCode, DemoModuleData } from "@/data/demo";
import type { TaskRecord } from "@/types/task";

import type { DataResult, ListQuery } from "../data";

export type RepositoryMode = "mock";

export interface ProcurementRepository {
  getDemoData(): Promise<DataResult<DemoModuleData>>;
}

export interface SupplierRepository {
  getDemoData(): Promise<DataResult<DemoModuleData>>;
}

export interface InventoryRepository {
  getDemoData(): Promise<DataResult<DemoModuleData>>;
}

export interface TaskRepository {
  list(query?: ListQuery): Promise<DataResult<TaskRecord[]>>;
  getById(taskId: string): Promise<DataResult<TaskRecord | null>>;
}

export interface DemoRepository {
  listModuleCodes(): Promise<DataResult<DemoModuleCode[]>>;
  getModuleData(moduleCode: string): Promise<DataResult<DemoModuleData | null>>;
}

export interface RepositoryProvider {
  procurement: ProcurementRepository;
  supplier: SupplierRepository;
  inventory: InventoryRepository;
  task: TaskRepository;
  demo: DemoRepository;
}
