import test from "node:test";
import assert from "node:assert/strict";

import { ComponentShowcase } from "../components/data/component-showcase";
import { ActionBar } from "../components/data/action-bar";
import { CardList } from "../components/data/card-list";
import { DataTable } from "../components/data/data-table";
import { DetailPanel } from "../components/data/detail-panel";
import { EmptyState } from "../components/data/empty-state";
import { ErrorState } from "../components/data/error-state";
import { FilterBar } from "../components/data/filter-bar";
import { KpiCard } from "../components/data/kpi-card";
import { LoadingState } from "../components/data/loading-state";
import { RightDrawer } from "../components/data/right-drawer";
import { StatusChip } from "../components/data/status-chip";
import { Timeline } from "../components/data/timeline";
import { FormField } from "../components/form/form-field";
import { FormFooter } from "../components/form/form-footer";
import { FormSection } from "../components/form/form-section";
import { UploadPlaceholder } from "../components/form/upload-placeholder";
import { DashboardLayout } from "../components/layout/dashboard-layout";
import { FormLayout } from "../components/layout/form-layout";
import enMessages from "../messages/en.json";
import zhMessages from "../messages/zh.json";

const components = [
  ComponentShowcase,
  ActionBar,
  CardList,
  DataTable,
  DetailPanel,
  EmptyState,
  ErrorState,
  FilterBar,
  KpiCard,
  LoadingState,
  RightDrawer,
  StatusChip,
  Timeline,
  FormField,
  FormFooter,
  FormSection,
  UploadPlaceholder,
  DashboardLayout,
  FormLayout,
];

test("ME core component exports exist", () => {
  for (const component of components) {
    assert.equal(typeof component, "function");
  }
});

test("component showcase route dependencies can be imported", () => {
  assert.equal(typeof ComponentShowcase, "function");
  assert.equal(typeof DashboardLayout, "function");
});

test("forbidden legacy brand names are not present in new docs or component copy", () => {
  const publicText = JSON.stringify({ enMessages, zhMessages });
  for (const legacyName of ["OmniOps", "OmniBranch", "ME Ops", "Opsight"]) {
    assert.equal(publicText.includes(legacyName), false);
  }
});
