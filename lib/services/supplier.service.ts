import { getRepositoryProvider } from "../repositories/provider";

export async function getSupplierDemoData() {
  return getRepositoryProvider().supplier.getDemoData();
}
