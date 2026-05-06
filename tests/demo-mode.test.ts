import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { meDemoModeBadges, meDemoModePageData, meDemoScreenshotSections, meDemoWalkthroughItems } from "../config/demo-mode";
import { navigationMap } from "../config/navigation";
import {
  getDemoModeBadges,
  getDemoModePageData,
  getDemoScreenshotSections,
  getRecommendedDemoRouteSequence,
} from "../lib/demo-mode";

const requiredSurfaces = ["homepage", "demo-story", "roles", "branches", "psi", "reports", "system-foundation", "navigation"] as const;

test("demo mode badges have zh/en labels", () => {
  for (const badge of meDemoModeBadges) {
    assert.ok(badge.label.zh.length > 0);
    assert.ok(badge.label.en.length > 0);
  }
});

test("screenshot sections exist for required surfaces", () => {
  const surfaces = new Set(meDemoScreenshotSections.map((section) => section.surface));
  for (const surface of requiredSurfaces) {
    assert.equal(surfaces.has(surface), true);
  }
});

test("walkthrough checklist starts with Business Workspace and includes System Foundation", () => {
  const ordered = [...meDemoWalkthroughItems].sort((left, right) => left.order - right.order);
  assert.equal(ordered[0]?.title.en, "Open Business Workspace");
  assert.equal(ordered.some((item) => item.title.en === "Show System Foundation"), true);
});

test("page-data returns badges, screenshot sections, walkthrough items, and route sequence", () => {
  const data = getDemoModePageData();
  assert.equal(data.badges.length > 0, true);
  assert.equal(data.screenshotSections.length, meDemoScreenshotSections.length);
  assert.equal(data.walkthroughItems.length, meDemoWalkthroughItems.length);
  assert.deepEqual(data.recommendedRouteSequence, getRecommendedDemoRouteSequence());
});

test("/demo-mode route imports without crashing", async () => {
  const route = await import("../app/demo-mode/page");
  assert.equal(typeof route.default, "function");
});

test("config/navigation includes demo-mode item", () => {
  const allItems = [
    ...navigationMap.primaryItems,
    ...navigationMap.footerItems,
    ...navigationMap.groups.flatMap((group) => group.items),
  ];
  assert.equal(allItems.some((item) => item.key === "demo-mode" && item.href === "/demo-mode"), true);
});

test("demo mode helper contains no fetch or axios", async () => {
  const helper = await readFile("lib/demo-mode.ts", "utf8");
  assert.equal(helper.includes("fetch("), false);
  assert.equal(helper.includes("axios"), false);
});

test("demo mode config helper and components contain no storage API usage", async () => {
  const files = [
    "config/demo-mode.ts",
    "lib/demo-mode.ts",
    "components/demo-mode/demo-mode-banner.tsx",
    "components/demo-mode/demo-mode-page.tsx",
    "components/demo-mode/demo-presentation-note.tsx",
  ];
  const text = (await Promise.all(files.map((file) => readFile(file, "utf8")))).join("\n");
  assert.equal(text.includes("localStorage."), false);
  assert.equal(text.includes("sessionStorage."), false);
  assert.equal(text.includes("window.localStorage"), false);
  assert.equal(text.includes("window.sessionStorage"), false);
});

test("no forbidden legacy brand names in demo mode docs config and components", async () => {
  const files = [
    "config/demo-mode.ts",
    "components/demo-mode/demo-mode-page.tsx",
    "components/demo-mode/demo-mode-banner.tsx",
    "docs/ME_DEMO_MODE_SCREENSHOT_READY.md",
  ];
  const text = (await Promise.all(files.map((file) => readFile(file, "utf8")))).join("\n");
  for (const legacy of ["OmniOps", "OmniBranch", "ME Ops", "Opsight"]) {
    assert.equal(text.includes(legacy), false);
  }
});

test(".write_test is not referenced", async () => {
  const files = [
    "config/demo-mode.ts",
    "lib/demo-mode.ts",
    "components/demo-mode/demo-mode-page.tsx",
    "docs/ME_DEMO_MODE_SCREENSHOT_READY.md",
  ];
  const text = (await Promise.all(files.map((file) => readFile(file, "utf8")))).join("\n");
  assert.equal(text.includes(".write_test"), false);
});

test("package.json unchanged if practical", async () => {
  const pkgRaw = await readFile("package.json", "utf8");
  const pkg = JSON.parse(pkgRaw) as { scripts?: Record<string, string> };
  assert.equal(pkg.scripts?.build, "next build");
  assert.equal(pkg.scripts?.test, "tsx --test tests/**/*.test.ts");
});

test("demo mode page data remains metadata-only and route-sequence driven", () => {
  assert.equal(meDemoModePageData.title.en, "ME Demo Mode");
  assert.equal(getDemoModeBadges().some((badge) => badge.key === "placeholder-only"), true);
  assert.equal(getDemoScreenshotSections().some((section) => section.route === "/demo-story"), true);
});
