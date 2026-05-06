import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { meDemoStorySections, meDemoStorySteps } from "../config/demo-story";
import { navigationMap } from "../config/navigation";
import {
  getDemoStoryPageData,
  getDemoStoryProgressPreview,
  getDemoStoryStepByKey,
  getNextDemoStoryStep,
  getPreviousDemoStoryStep,
} from "../lib/demo-story";

const requiredSteps = [
  "business-overview",
  "navigation-ia",
  "role-workspaces",
  "branch-context",
  "psi-operations",
  "report-preview",
  "system-foundation",
  "next-steps",
] as const;

test("all demo story steps have zh/en title and description", () => {
  for (const step of meDemoStorySteps) {
    assert.ok(step.title.zh.length > 0);
    assert.ok(step.title.en.length > 0);
    assert.ok(step.description.zh.length > 0);
    assert.ok(step.description.en.length > 0);
  }
});

test("required demo story steps exist", () => {
  const stepKeys = new Set(meDemoStorySteps.map((step) => step.key));
  for (const key of requiredSteps) {
    assert.equal(stepKeys.has(key), true);
  }
});

test("story order starts with business-overview and ends with next-steps", () => {
  const orderedKeys = [...meDemoStorySteps].sort((left, right) => left.order - right.order).map((step) => step.key);
  assert.equal(orderedKeys[0], "business-overview");
  assert.equal(orderedKeys.at(-1), "next-steps");
});

test("helper returns next and previous steps correctly", () => {
  assert.equal(getNextDemoStoryStep("business-overview")?.key, "navigation-ia");
  assert.equal(getPreviousDemoStoryStep("navigation-ia")?.key, "business-overview");
  assert.equal(getPreviousDemoStoryStep("business-overview"), undefined);
  assert.equal(getNextDemoStoryStep("next-steps"), undefined);
});

test("page-data returns grouped sections", () => {
  const data = getDemoStoryPageData();
  assert.equal(data.sections.length >= 4, true);
  assert.equal(data.sections.some((section) => section.title.en === "Business Story"), true);
  assert.equal(data.steps.length, meDemoStorySteps.length);
});

test("progress preview is computed but not persisted", () => {
  const preview = getDemoStoryProgressPreview("psi-operations");
  assert.equal(preview.currentOrder, 5);
  assert.equal(preview.isPreviewOnly, true);
  assert.equal(preview.percentComplete > 0, true);
});

test("/demo-story route imports without crashing", async () => {
  const route = await import("../app/demo-story/page");
  assert.equal(typeof route.default, "function");
});

test("/demo-story/[stepKey] route imports without crashing", async () => {
  const route = await import("../app/demo-story/[stepKey]/page");
  assert.equal(typeof route.default, "function");
});

test("config/navigation includes demo-story item", () => {
  const allItems = [
    ...navigationMap.primaryItems,
    ...navigationMap.footerItems,
    ...navigationMap.groups.flatMap((group) => group.items),
  ];
  assert.equal(allItems.some((item) => item.key === "demo-story" && item.href === "/demo-story"), true);
});

test("demo story helper contains no fetch or axios", async () => {
  const helper = await readFile("lib/demo-story.ts", "utf8");
  assert.equal(helper.includes("fetch("), false);
  assert.equal(helper.includes("axios"), false);
});

test("demo story config, helper, and components contain no storage API usage", async () => {
  const files = [
    "config/demo-story.ts",
    "lib/demo-story.ts",
    "components/demo-story/demo-story-page.tsx",
    "components/demo-story/demo-story-detail-page.tsx",
    "components/demo-story/demo-story-progress-placeholder.tsx",
  ];
  const text = (await Promise.all(files.map((file) => readFile(file, "utf8")))).join("\n");
  assert.equal(text.includes("localStorage."), false);
  assert.equal(text.includes("sessionStorage."), false);
  assert.equal(text.includes("window.localStorage"), false);
  assert.equal(text.includes("window.sessionStorage"), false);
});

test("no forbidden legacy brand names in demo story docs config and components", async () => {
  const files = [
    "config/demo-story.ts",
    "components/demo-story/demo-story-page.tsx",
    "components/demo-story/demo-story-detail-page.tsx",
    "docs/ME_DEMO_STORY_FLOW.md",
  ];
  const text = (await Promise.all(files.map((file) => readFile(file, "utf8")))).join("\n");
  for (const legacy of ["OmniOps", "OmniBranch", "ME Ops", "Opsight"]) {
    assert.equal(text.includes(legacy), false);
  }
});

test(".write_test is not referenced", async () => {
  const files = [
    "config/demo-story.ts",
    "lib/demo-story.ts",
    "components/demo-story/demo-story-page.tsx",
    "components/demo-story/demo-story-detail-page.tsx",
    "docs/ME_DEMO_STORY_FLOW.md",
  ];
  const text = (await Promise.all(files.map((file) => readFile(file, "utf8")))).join("\n");
  assert.equal(text.includes(".write_test"), false);
});

test("package.json remains baseline for scripts", async () => {
  const pkgRaw = await readFile("package.json", "utf8");
  const pkg = JSON.parse(pkgRaw) as { scripts?: Record<string, string> };
  assert.equal(pkg.scripts?.build, "next build");
  assert.equal(pkg.scripts?.test, "tsx --test tests/**/*.test.ts");
});

test("story sections remain grouped and current step resolves", () => {
  assert.equal(meDemoStorySections.length, 4);
  assert.equal(getDemoStoryStepByKey("report-preview")?.route, "/reports");
  assert.equal(getDemoStoryPageData("report-preview").currentStep?.key, "report-preview");
});
