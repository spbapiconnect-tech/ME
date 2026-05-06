import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { navigationMap } from "../config/navigation";
import {
  meStakeholderDemoRouteMap,
  meStakeholderRoadmapItems,
  meStakeholderSummaryCards,
  meStakeholderSummaryMetrics,
} from "../config/stakeholder-summary";
import { getStakeholderSummaryPageData } from "../lib/stakeholder-summary";

test("stakeholder summary metrics have zh/en labels", () => {
  for (const metric of meStakeholderSummaryMetrics) {
    assert.ok(metric.label.zh.length > 0);
    assert.ok(metric.label.en.length > 0);
  }
});

test("summary cards include What ME is, Problem / Opportunity, Roadmap, and Demo Route Map", () => {
  const titles = new Set(meStakeholderSummaryCards.map((card) => card.title.en));
  for (const requiredTitle of ["What ME is", "Problem / Opportunity", "Roadmap", "Demo Route Map"]) {
    assert.equal(titles.has(requiredTitle), true);
  }
});

test("roadmap includes completed v0.8.0 through v0.8.5 and in-progress v0.8.6", () => {
  const roadmap = new Map(meStakeholderRoadmapItems.map((item) => [item.key, item.status]));
  for (const key of [
    "v0-8-0-business-workspace",
    "v0-8-1-navigation-ia",
    "v0-8-2-role-workspace",
    "v0-8-3-branch-context",
    "v0-8-4-demo-story",
    "v0-8-5-demo-mode",
  ]) {
    assert.equal(roadmap.get(key), "completed");
  }
  assert.equal(roadmap.get("v0-8-6-stakeholder-summary"), "in-progress");
});

test("demo route map includes required stakeholder routes", () => {
  const routes = new Set(meStakeholderDemoRouteMap.map((route) => route.route));
  for (const route of ["/", "/demo-story", "/demo-mode", "/navigation", "/roles", "/branches", "/psi", "/reports", "/system-foundation"]) {
    assert.equal(routes.has(route), true);
  }
});

test("page-data returns title, metrics, cards, roadmap, and demo routes", () => {
  const data = getStakeholderSummaryPageData();
  assert.equal(data.title.en, "ME Stakeholder Summary");
  assert.equal(data.metrics.length > 0, true);
  assert.equal(data.cards.length > 0, true);
  assert.equal(data.roadmap.length > 0, true);
  assert.equal(data.demoRoutes.length > 0, true);
});

test("/stakeholder-summary route imports without crashing", async () => {
  const route = await import("../app/stakeholder-summary/page");
  assert.equal(typeof route.default, "function");
});

test("config/navigation includes stakeholder-summary item", () => {
  const allItems = [
    ...navigationMap.primaryItems,
    ...navigationMap.footerItems,
    ...navigationMap.groups.flatMap((group) => group.items),
  ];
  assert.equal(allItems.some((item) => item.key === "stakeholder-summary" && item.href === "/stakeholder-summary"), true);
});

test("stakeholder helper contains no fetch or axios", async () => {
  const helper = await readFile("lib/stakeholder-summary.ts", "utf8");
  assert.equal(helper.includes("fetch("), false);
  assert.equal(helper.includes("axios"), false);
});

test("stakeholder config helper and components contain no storage API usage", async () => {
  const files = [
    "config/stakeholder-summary.ts",
    "lib/stakeholder-summary.ts",
    "components/stakeholder-summary/stakeholder-summary-page.tsx",
    "components/stakeholder-summary/stakeholder-demo-route-map.tsx",
    "components/stakeholder-summary/stakeholder-summary-card.tsx",
  ];
  const text = (await Promise.all(files.map((file) => readFile(file, "utf8")))).join("\n");
  assert.equal(text.includes("localStorage."), false);
  assert.equal(text.includes("sessionStorage."), false);
  assert.equal(text.includes("window.localStorage"), false);
  assert.equal(text.includes("window.sessionStorage"), false);
});

test("stakeholder config helper and components contain no analytics or tracking implementation keywords", async () => {
  const files = [
    "config/stakeholder-summary.ts",
    "lib/stakeholder-summary.ts",
    "components/stakeholder-summary/stakeholder-summary-page.tsx",
    "components/stakeholder-summary/stakeholder-demo-route-map.tsx",
    "components/stakeholder-summary/stakeholder-summary-card.tsx",
  ];
  const text = (await Promise.all(files.map((file) => readFile(file, "utf8")))).join("\n");
  for (const keyword of ["track(", "analytics.", "posthog", "segment(", "mixpanel", "gtag(", "amplitude"]) {
    assert.equal(text.includes(keyword), false);
  }
});

test("no forbidden legacy brand names in stakeholder docs config and components", async () => {
  const files = [
    "config/stakeholder-summary.ts",
    "components/stakeholder-summary/stakeholder-summary-page.tsx",
    "components/stakeholder-summary/stakeholder-summary-card.tsx",
    "docs/ME_STAKEHOLDER_SUMMARY.md",
  ];
  const text = (await Promise.all(files.map((file) => readFile(file, "utf8")))).join("\n");
  for (const legacy of ["OmniOps", "OmniBranch", "ME Ops", "Opsight"]) {
    assert.equal(text.includes(legacy), false);
  }
});

test(".write_test is not referenced", async () => {
  const files = [
    "config/stakeholder-summary.ts",
    "lib/stakeholder-summary.ts",
    "components/stakeholder-summary/stakeholder-summary-page.tsx",
    "docs/ME_STAKEHOLDER_SUMMARY.md",
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
