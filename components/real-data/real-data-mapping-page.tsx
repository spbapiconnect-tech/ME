import Link from "next/link";

import {
  MeDashboardShell,
  MePageHeader,
  MeRightRail,
  MeWorkspaceSection,
} from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  getApiBoundaryDrafts,
  getEntityMappings,
  getMigrationSteps,
  getRealDataGuardrails,
  getRealDataMappingPageData,
  getUiDataBlocksBySurface,
  resolveSurfaceLabel,
} from "@/lib/real-data-mapping";

import { ApiBoundaryCard } from "./api-boundary-card";
import { EntityMappingCard } from "./entity-mapping-card";
import { MigrationStepCard } from "./migration-step-card";
import { RealDataSurfaceCard } from "./real-data-surface-card";

const surfaceOrder = [
  "dashboard",
  "psi-procurement",
  "psi-supplier",
  "psi-inventory",
  "branch-workspace",
  "reports",
  "roles",
] as const;

export function RealDataMappingPage() {
  const page = getRealDataMappingPageData();
  const entities = getEntityMappings();
  const apiBoundaries = getApiBoundaryDrafts();
  const migrationSteps = getMigrationSteps();
  const guardrails = getRealDataGuardrails();

  const readBoundaries = apiBoundaries.filter((item) => item.readOrWrite === "read-only").length;
  const futureWriteBoundaries = apiBoundaries.filter((item) => item.readOrWrite === "write-future").length;

  return (
    <MeDashboardShell
      activeKey="real-data-mapping"
      rightRail={
        <MeRightRail
          sections={[
            {
              title: "Planning Status",
              badge: "Planning-only",
              items: [
                "No database or API is connected",
                "No auth/session or permission enforcement",
                "No write execution, approvals, stock posting, or notifications",
              ],
            },
            {
              title: "Coverage",
              items: [
                `${page.uiBlocks.length} UI data blocks mapped`,
                `${entities.length} future entities drafted`,
                `${apiBoundaries.length} API boundaries outlined`,
              ],
            },
            {
              title: "Migration Order",
              items: [
                "Freeze shell and detail pattern",
                "Define schema and read-only APIs",
                "Swap page-data helpers before any writes",
              ],
            },
          ]}
        />
      }
    >
      <MePageHeader
        eyebrow="System Planning"
        title={page.title.en}
        description={page.subtitle.en}
        notice="Planning-only route. The current shell, navigation, and detail workspaces stay read-only and data-source agnostic while future entities, APIs, and guardrails are defined here."
        badges={[
          { label: "Planning-only" },
          { label: "Read layer first", variant: "secondary" },
          { label: "No writes", variant: "outline" },
        ]}
        actions={
          <>
            <Button asChild size="sm">
              <Link href="/system-foundation">Open System Foundation</Link>
            </Button>
            <Button asChild size="sm" variant="outline">
              <Link href="/psi">Open PSI</Link>
            </Button>
            <Button asChild size="sm" variant="outline">
              <Link href="/navigation">Open Navigation IA</Link>
            </Button>
          </>
        }
        meta={[
          { label: "UI blocks", value: String(page.uiBlocks.length) },
          { label: "Entities", value: String(entities.length) },
          { label: "Read APIs", value: String(readBoundaries) },
          { label: "Future writes", value: String(futureWriteBoundaries) },
        ]}
      />

      <MeWorkspaceSection title="Purpose / Guardrail" description="This page defines the mock-to-real preparation layer without connecting any backend runtime.">
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_20rem]">
          <div className="grid gap-3">
            {guardrails.map((guardrail) => (
              <div key={guardrail} className="rounded-[22px] bg-slate-50/88 px-4 py-3.5 ring-1 ring-slate-200/70">
                <p className="text-sm leading-6 text-slate-600">{guardrail}</p>
              </div>
            ))}
          </div>
          <Card size="sm" className="border-border/60 bg-[linear-gradient(180deg,rgba(248,250,252,0.98),rgba(241,245,249,0.92))] shadow-[0_18px_34px_-30px_rgba(15,23,42,0.14)]">
            <CardContent className="grid gap-3 pt-4 text-sm text-slate-600">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">Not Implemented</p>
                <p className="mt-1.5 leading-6">No database, API handlers, auth/session, permission middleware, writes, approvals, stock posting, task creation, or notifications.</p>
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">Generated</p>
                <p className="mt-1.5 leading-6">{page.generatedAt}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </MeWorkspaceSection>

      <MeWorkspaceSection title="UI Surface Mapping" description="Every current operational surface keeps a stable shell contract while its future datasource is drafted here.">
        <div className="grid gap-4 xl:grid-cols-2">
          {surfaceOrder.map((surface) => (
            <RealDataSurfaceCard
              key={surface}
              surface={surface}
              title={resolveSurfaceLabel(surface)}
              blocks={getUiDataBlocksBySurface(surface)}
            />
          ))}
        </div>
      </MeWorkspaceSection>

      <MeWorkspaceSection title="Entity Mapping" description="Future tables and relationships are defined here before any repository or API implementation begins.">
        <div className="grid gap-4 xl:grid-cols-2">
          {entities.map((item) => (
            <EntityMappingCard key={item.entity} entity={item} />
          ))}
        </div>
      </MeWorkspaceSection>

      <MeWorkspaceSection title="API Boundary Drafts" description="Read-only boundaries come first. Write endpoints remain deferred and explicitly non-implemented.">
        <div className="grid gap-4 xl:grid-cols-2">
          {apiBoundaries.map((boundary) => (
            <ApiBoundaryCard key={boundary.key} boundary={boundary} />
          ))}
        </div>
      </MeWorkspaceSection>

      <MeWorkspaceSection title="Mock-to-real Migration Steps" description="Migration order protects the current shell, routes, and page contracts from datasource coupling.">
        <div className="grid gap-4 xl:grid-cols-2">
          {migrationSteps.map((item) => (
            <MigrationStepCard key={item.key} step={item} />
          ))}
        </div>
      </MeWorkspaceSection>

      <MeWorkspaceSection title="What Is Not Implemented Yet" description="This planning route is explicit about scope boundaries so backend work does not land ad hoc.">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {[
            "No database connection",
            "No API route handlers",
            "No auth or session layer",
            "No permission enforcement",
            "No write behavior",
            "No stock posting or approval execution",
          ].map((item) => (
            <div key={item} className="rounded-[22px] bg-slate-50/88 px-4 py-3.5 ring-1 ring-slate-200/70">
              <p className="text-sm font-medium text-slate-700">{item}</p>
            </div>
          ))}
        </div>
      </MeWorkspaceSection>
    </MeDashboardShell>
  );
}
