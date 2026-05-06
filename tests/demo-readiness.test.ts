import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { meDemoReadinessItems, meDemoReadinessSections } from "../config/demo-readiness";
import { navigationMap } from "../config/navigation";
import {
  getDemoReadinessGuardrailChecklist,
  getDemoReadinessPageData,
  getDemoReadinessRouteChecklist,
} from "../lib/demo-readiness";

const requiredCategories = [
  "route-completeness",
  "navigation-reachability",
  "presentation-consistency",
  "screenshot-readiness",
  "scope-guardrail",
  "docs-consistency",
  "demo-walkthrough",
  "stakeholder-summary",
  "future-readiness",
] as const;

const requiredRoutes = ["/", "/demo-story", "/demo-mode", "/stakeholder-summary", "/roles", "/branches", "/psi", "/reports", "/system-foundation"] as const;

test("readiness items have zh/en title and description", () => {
  for (const item of meDemoReadinessItems) {
    assert.ok(item.title.zh.length > 0);
    assert.ok(item.title.en.length > 0);
    assert.ok(item.description.zh.length > 0);
    assert.ok(item.description.en.length > 0);
  }
});

test("required readiness categories exist", () => {
  const categories = new Set(meDemoReadinessItems.map((item) => item.category));
  for (const category of requiredCategories) {
    assert.equal(categories.has(category), true);
  }
});

test("route checklist includes required presentation routes", () => {
  const routes = new Set(getDemoReadinessRouteChecklist().map((item) => item.route));
  for (const route of requiredRoutes) {
    assert.equal(routes.has(route), true);
  }
});

test("guardrail checklist includes required exclusions", () => {
  const keys = new Set(getDemoReadinessGuardrailChecklist().map((item) => item.key));
  for (const key of [
    "guardrail-no-database",
    "guardrail-no-api",
    "guardrail-no-writes",
    "guardrail-no-auth-session",
    "guardrail-no-analytics-tracking",
    "guardrail-no-storage",
    "guardrail-no-permission-enforcement",
    "guardrail-no-workflow",
    "guardrail-no-monitoring-browser-ci",
  ]) {
    assert.equal(keys.has(key), true);
  }
});

test("page-data returns metrics, sections, routeChecklist, and guardrailChecklist", () => {
  const data = getDemoReadinessPageData();
  assert.equal(data.summaryMetrics.length > 0, true);
  assert.equal(data.sections.length, meDemoReadinessSections.length);
  assert.equal(data.routeChecklist.length >= requiredRoutes.length, true);
  assert.equal(data.guardrailChecklist.length >= 9, true);
});

test("/demo-readiness route imports without crashing", async () => {
  const route = await import("../app/demo-readiness/page");
  assert.equal(typeof route.default, "function");
});

test("config/navigation includes demo-readiness item", () => {
  const allItems = [
    ...navigationMap.primaryItems,
    ...navigationMap.footerItems,
    ...navigationMap.groups.flatMap((group) => group.items),
  ];
  assert.equal(allItems.some((item) => item.key === "demo-readiness" && item.href === "/demo-readiness"), true);
});

test("demo-mode config closes with stakeholder summary and demo-readiness", async () => {
  const config = await import("../config/demo-mode");
  assert.equal(config.meDemoModePageData.recommendedRouteSequence.includes("/stakeholder-summary"), true);
  assert.equal(config.meDemoModePageData.recommendedRouteSequence.includes("/demo-readiness"), true);
  assert.equal(config.meDemoModePageData.walkthroughItems.some((item: { route: string }) => item.route === "/demo-readiness"), true);
});

test("stakeholder summary route map and roadmap include demo-readiness", async () => {
  const config = await import("../config/stakeholder-summary");
  assert.equal(config.meStakeholderDemoRouteMap.some((route: { route: string }) => route.route === "/demo-readiness"), true);
  assert.equal(config.meStakeholderRoadmapItems.some((item: { route?: string }) => item.route === "/demo-readiness"), true);
});

test("demo readiness helper contains no fetch or axios", async () => {
  const helper = await readFile("lib/demo-readiness.ts", "utf8");
  assert.equal(helper.includes("fetch("), false);
  assert.equal(helper.includes("axios"), false);
});

test("demo readiness helper, config, and components contain no storage API usage", async () => {
  const files = [
    "config/demo-readiness.ts",
    "lib/demo-readiness.ts",
    "components/demo-readiness/demo-readiness-page.tsx",
    "components/demo-readiness/demo-readiness-route-map.tsx",
    "components/demo-readiness/demo-readiness-guardrail-card.tsx",
  ];
  const text = (await Promise.all(files.map((file) => readFile(file, "utf8")))).join("\n");
  for (const keyword of ["localStorage.", "sessionStorage.", "window.localStorage", "window.sessionStorage"]) {
    assert.equal(text.includes(keyword), false);
  }
});

test("demo readiness helper, config, and components contain no monitoring or browser automation implementation keywords", async () => {
  const files = [
    "config/demo-readiness.ts",
    "lib/demo-readiness.ts",
    "components/demo-readiness/demo-readiness-page.tsx",
    "components/demo-readiness/demo-readiness-route-map.tsx",
    "components/demo-readiness/demo-readiness-section.tsx",
  ];
  const text = (await Promise.all(files.map((file) => readFile(file, "utf8")))).join("\n");
  for (const keyword of ["posthog", "mixpanel", "amplitude", "gtag(", "segment(", "Sentry.init", "Datadog", "playwright", "cypress", "puppeteer", "browser_navigate"]) {
    assert.equal(text.includes(keyword), false);
  }
});

test("no forbidden legacy brand names in readiness docs config and components", async () => {
  const files = [
    "config/demo-readiness.ts",
    "components/demo-readiness/demo-readiness-page.tsx",
    "components/demo-readiness/demo-readiness-section.tsx",
    "docs/ME_DEMO_READINESS.md",
    "docs/ME_DEMO_READINESS_FINAL_AUDIT.md",
  ];
  const text = (await Promise.all(files.map((file) => readFile(file, "utf8")))).join("\n");
  for (const legacy of ["OmniOps", "OmniBranch", "ME Ops", "Opsight"]) {
    assert.equal(text.includes(legacy), false);
  }
});

test(".write_test is not referenced", async () => {
  const files = [
    "config/demo-readiness.ts",
    "lib/demo-readiness.ts",
    "components/demo-readiness/demo-readiness-page.tsx",
    "docs/ME_DEMO_READINESS.md",
    "docs/ME_DEMO_READINESS_FINAL_AUDIT.md",
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
