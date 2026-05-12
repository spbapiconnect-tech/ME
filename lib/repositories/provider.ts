import type { RepositoryMode, RepositoryProvider } from "./contracts";
import { createMockRepositoryProvider } from "./mock";

let mode: RepositoryMode = "local";
let provider: RepositoryProvider | null = null;

export function getRepositoryMode() {
  return mode;
}

export function getRepositoryProvider(): RepositoryProvider {
  if (!provider) {
    provider = createMockRepositoryProvider();
  }

  return provider;
}

export function setRepositoryProviderForTests(next: RepositoryProvider) {
  provider = next;
}

export function resetRepositoryProvider() {
  mode = "local";
  provider = null;
}



export function getPsiProcurementRepository() {
  const psiRepository = getRepositoryProvider().psiProcurement;
  if (psiRepository) {
    return psiRepository;
  }

  return createMockRepositoryProvider().psiProcurement!;
}

export function getPsiSupplierRepository() {
  const psiRepository = getRepositoryProvider().psiSupplier;
  if (psiRepository) {
    return psiRepository;
  }

  return createMockRepositoryProvider().psiSupplier!;
}

export function getPsiInventoryRepository() {
  const psiRepository = getRepositoryProvider().psiInventory;
  if (psiRepository) {
    return psiRepository;
  }

  return createMockRepositoryProvider().psiInventory!;
}
