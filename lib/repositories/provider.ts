import type { RepositoryMode, RepositoryProvider } from "./contracts";
import { createMockRepositoryProvider } from "./mock";

let mode: RepositoryMode = "mock";
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
  mode = "mock";
  provider = null;
}
