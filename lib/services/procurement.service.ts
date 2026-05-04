import { getRepositoryProvider } from "../repositories/provider";

export async function getProcurementDemoData() {
  return getRepositoryProvider().procurement.getDemoData();
}
