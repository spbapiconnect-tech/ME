import type { DemoModuleCode, DemoModuleData } from "@/data/demo";
import type * as Psi from "@/types/psi";
import type { TaskRecord } from "@/types/task";

import type { DataResult, ListQuery } from "../data";

export type RepositoryMode = "local";

export interface PsiQueryParams {
  search?: string;
  status?: Psi.PsiRecordStatus;
  sourceModule?: string;
  page?: number;
  pageSize?: number;
}

export interface ProcurementRepository {
  getDemoData(): Promise<DataResult<unknown>>;
}


export interface SupplierRepository {
  getDemoData(): Promise<DataResult<unknown>>;
}


export interface InventoryRepository {
  getDemoData(): Promise<DataResult<unknown>>;
}


export interface TaskRepository {
  list(params?: ListQuery): Promise<DataResult<TaskRecord[]>>;
  getById(id: string): Promise<DataResult<TaskRecord | null>>;
}



export interface DemoRepository {
  listModuleCodes(): Promise<DataResult<DemoModuleCode[]>>;
  getModuleData(moduleCode: string): Promise<DataResult<DemoModuleData | null>>;
}


export interface PsiProcurementRepository {
  listPurchaseRequests(params?: PsiQueryParams): Promise<DataResult<Psi.PurchaseRequestDto[]>>;
  getPurchaseRequestById(id: string): Promise<DataResult<Psi.PurchaseRequestDto | null>>;
  listPurchaseOrders(params?: PsiQueryParams): Promise<DataResult<Psi.PurchaseOrderDto[]>>;
  getPurchaseOrderById(id: string): Promise<DataResult<Psi.PurchaseOrderDto | null>>;
  listReceiving(params?: PsiQueryParams): Promise<DataResult<Psi.ReceivingDto[]>>;
  listPurchaseIssues(params?: PsiQueryParams): Promise<DataResult<Psi.PurchaseIssueDto[]>>;
  getProcurementStats(params?: PsiQueryParams): Promise<DataResult<Psi.ProcurementStatsDto>>;
  getProcurementPageData(params?: PsiQueryParams): Promise<DataResult<Psi.ProcurementPageData>>;
}

export interface PsiSupplierRepository {
  listSuppliers(params?: PsiQueryParams): Promise<DataResult<Psi.SupplierDto[]>>;
  getSupplierById(id: string): Promise<DataResult<Psi.SupplierDto | null>>;
  listSupplierProducts(supplierId?: string, params?: PsiQueryParams): Promise<DataResult<Psi.SupplierProductDto[]>>;
  listSupplierIssues(params?: PsiQueryParams): Promise<DataResult<Psi.SupplierIssueDto[]>>;
  getSupplierStats(params?: PsiQueryParams): Promise<DataResult<Psi.SupplierStatsDto>>;
  getSupplierPageData(params?: PsiQueryParams): Promise<DataResult<Psi.SupplierPageData>>;
}

export interface PsiInventoryRepository {
  listSkus(params?: PsiQueryParams): Promise<DataResult<Psi.SkuDto[]>>;
  getSkuById(id: string): Promise<DataResult<Psi.SkuDto | null>>;
  listStoreStock(params?: PsiQueryParams): Promise<DataResult<Psi.StoreStockDto[]>>;
  listInventoryIssues(params?: PsiQueryParams): Promise<DataResult<Psi.InventoryIssueDto[]>>;
  listReplenishmentSuggestions(params?: PsiQueryParams): Promise<DataResult<Psi.ReplenishmentSuggestionDto[]>>;
  getInventoryStats(params?: PsiQueryParams): Promise<DataResult<Psi.InventoryStatsDto>>;
  getInventoryPageData(params?: PsiQueryParams): Promise<DataResult<Psi.InventoryPageData>>;
}

export interface RepositoryProvider {
  mode?: RepositoryMode;
  procurement: ProcurementRepository;
  supplier: SupplierRepository;
  inventory: InventoryRepository;
  task: TaskRepository;
  demo: DemoRepository;
  psiProcurement?: PsiProcurementRepository;
  psiSupplier?: PsiSupplierRepository;
  psiInventory?: PsiInventoryRepository;
}
