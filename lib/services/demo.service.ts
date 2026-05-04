import { getRepositoryProvider } from "../repositories/provider";

export async function listDemoModuleCodes() {
  return getRepositoryProvider().demo.listModuleCodes();
}

export async function getDemoModuleData(moduleCode: string) {
  return getRepositoryProvider().demo.getModuleData(moduleCode);
}
