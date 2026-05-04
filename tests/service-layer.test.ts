import assert from "node:assert/strict";
import test from "node:test";

import type { DemoModuleData } from "../data/demo";
import { okResult } from "../lib/data";
import type { RepositoryProvider } from "../lib/repositories/contracts";
import { getRepositoryMode, resetRepositoryProvider, setRepositoryProviderForTests } from "../lib/repositories/provider";
import { getDemoModuleData, getProcurementDemoData, getTaskById, listTasks } from "../lib/services";

test("repository provider defaults to mock mode", () => {
  assert.equal(getRepositoryMode(), "mock");
});

test("procurement service returns mock DataResult", async () => {
  const result = await getProcurementDemoData();

  assert.equal(result.ok, true);

  if (result.ok) {
    assert.equal(result.meta.source, "mock");
    assert.equal(result.data.moduleCode, "procurement");
  }
});

test("task service reads local task records via repository provider", async () => {
  const listResult = await listTasks();

  assert.equal(listResult.ok, true);

  if (listResult.ok) {
    assert.equal(listResult.meta.source, "mock");
    assert.ok(listResult.data.length > 0);
  }

  const itemResult = await getTaskById("TASK-1001");

  assert.equal(itemResult.ok, true);

  if (itemResult.ok) {
    assert.equal(itemResult.meta.source, "mock");
    assert.equal(itemResult.data?.id, "TASK-1001");
  }
});

test("demo service returns null for unknown module", async () => {
  const result = await getDemoModuleData("unknown-module");

  assert.equal(result.ok, true);

  if (result.ok) {
    assert.equal(result.meta.source, "mock");
    assert.equal(result.data, null);
  }
});

test("services resolve repositories through the provider indirection", async () => {
  const stubDemoData: DemoModuleData = {
    moduleCode: "procurement",
    scenario: { zh: "stub", en: "stub" },
    summary: { zh: "stub", en: "stub" },
    kpis: [],
    listingRows: [],
    detailRecord: {},
    detailSections: [],
    issues: [],
    timeline: [],
    formPlaceholders: [],
    statusDistribution: [],
    reportRows: [],
    chartSeries: [],
    ctaPlaceholders: [],
  };

  const stubProvider: RepositoryProvider = {
    procurement: {
      async getDemoData() {
        return okResult(stubDemoData);
      },
    },
    supplier: {
      async getDemoData() {
        return okResult(stubDemoData);
      },
    },
    inventory: {
      async getDemoData() {
        return okResult(stubDemoData);
      },
    },
    task: {
      async list() {
        return okResult([]);
      },
      async getById() {
        return okResult(null);
      },
    },
    demo: {
      async listModuleCodes() {
        return okResult([]);
      },
      async getModuleData() {
        return okResult(null);
      },
    },
  };

  setRepositoryProviderForTests(stubProvider);

  const result = await getProcurementDemoData();

  assert.equal(result.ok, true);

  if (result.ok) {
    assert.equal(result.data.scenario.en, "stub");
  }

  resetRepositoryProvider();
});
