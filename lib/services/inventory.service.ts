import { getRepositoryProvider } from "../repositories/provider";

export async function getInventoryDemoData() {
  return getRepositoryProvider().inventory.getDemoData();
}
