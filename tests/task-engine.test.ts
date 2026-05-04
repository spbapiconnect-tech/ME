import assert from "node:assert/strict";
import test from "node:test";

import { moduleRegistry } from "../config/modules";
import { taskRecords } from "../data/tasks/task-records";
import { taskSourceMap } from "../data/tasks/task-source-map";
import { taskStatsSnapshot } from "../data/tasks/task-stats";
import {
  getAllTasks,
  getOverdueTasks,
  getTaskById,
  getTaskSourceSummary,
  getTaskStats,
  getTasksByOwnerRole,
  getTasksBySourceModule,
  getTasksByStatus,
} from "../lib/tasks";

const validModuleCodes = new Set(moduleRegistry.map((moduleItem) => moduleItem.code));

test("all ME task records include required MVP fields", () => {
  for (const task of taskRecords) {
    assert.ok(task.id.length > 0);
    assert.ok(task.title.zh.length > 0);
    assert.ok(task.title.en.length > 0);
    assert.ok(task.description.zh.length > 0);
    assert.ok(task.description.en.length > 0);
    assert.ok(task.ownerRole.length > 0);
    assert.ok(task.ownerName.length > 0);
    assert.ok(task.sourceMapping.target_route.length > 0);
    assert.ok(task.sourceMapping.target_action.length > 0);
    assert.ok(task.timeline.length > 0);
  }
});

test("task source modules are valid registered ME modules", () => {
  for (const task of taskRecords) {
    assert.equal(validModuleCodes.has(task.sourceModule), true);
  }
});

test("task source mapping contains target route and action placeholders", () => {
  for (const item of taskSourceMap) {
    assert.ok(item.mapping.target_route.startsWith("/tasks/"));
    assert.ok(item.mapping.target_action.length > 0);
    assert.ok(item.mapping.api_action.startsWith("/api/"));
  }
});

test("task stats match the current mock task records", () => {
  assert.deepEqual(getTaskStats(), taskStatsSnapshot);
});

test("task helpers return expected records", () => {
  assert.equal(getTaskById("TASK-1001")?.sourceModule, "inventory");
  assert.equal(getTasksByStatus("review").length, 2);
  assert.equal(getTasksBySourceModule("procurement").length, 3);
  assert.equal(getTasksByOwnerRole("Store Manager").length, 2);
  assert.equal(getOverdueTasks().length, 1);
  assert.equal(getAllTasks()[0].priority, "critical");
  assert.ok(getTaskSourceSummary().length >= 3);
});

test("task data and docs contain no forbidden legacy brand names", async () => {
  const { readFile } = await import("node:fs/promises");
  const docs = await Promise.all([
    readFile("docs/ME_MASTER_PROJECT_SCOPE.md", "utf8"),
    readFile("docs/ME_UI_ARCHITECTURE.md", "utf8"),
    readFile("docs/ME_PROJECT_TASKS_GIT_WORKFLOW.md", "utf8"),
    readFile("docs/ME_DEMO_READINESS.md", "utf8"),
  ]);
  const publicText = JSON.stringify({ taskRecords, docs });

  for (const legacyName of ["OmniOps", "OmniBranch", "ME Ops", "Opsight"]) {
    assert.equal(publicText.includes(legacyName), false);
  }
});
