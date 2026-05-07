import Link from "next/link";

import {
  MeActionBar,
  MeDashboardShell,
  MeDataTable,
  MeDetailWorkspace,
  MePageHeader,
  MeRightRail,
  MeStatusTimeline,
  MeTabs,
  MeWorkspaceSection,
} from "@/components/layout";
import type { PsiIssuePlaceholderRow } from "@/lib/page-data/psi/issues-page-data";

interface PsiIssuesPageProps {
  rows: PsiIssuePlaceholderRow[];
  source: string;
  isMock: boolean;
  error?: string;
}

export function PsiIssuesPage({ rows, source, isMock, error }: PsiIssuesPageProps) {
  const rightRail = (
    <MeRightRail
      sections={[
        {
          title: "Issue Context",
          badge: "PSI",
          items: ["Procurement follow-up", "Supplier coordination", "Inventory risk review"],
        },
        {
          title: "Current Queue",
          items: [`${rows.length} active issues`, isMock ? "Published through the shared catalog layer" : "Published through the connected service layer", `Source: ${source}`],
        },
      ]}
    />
  );

  return (
    <MeDashboardShell activeKey="psi-issues" rightRail={rightRail}>
      <MePageHeader
        eyebrow="PSI Issues"
        title="Issue and incident queue"
        description="Cross-module issue queue for procurement, supplier, and inventory follow-up."
        notice={error ?? "Use this workspace to review issue severity, lifecycle stage, linked records, and follow-up actions."}
        badges={[
          { label: "Issues" },
          { label: "PSI coordination", variant: "secondary" },
          { label: "Current release", variant: "outline" },
        ]}
        meta={[
          { label: "Source", value: source },
          { label: "Queue size", value: String(rows.length) },
          { label: "Coverage", value: "Procurement / Supplier / Inventory" },
          { label: "Delivery mode", value: isMock ? "Catalog layer" : "Connected service" },
        ]}
      />

      <MeActionBar
        actions={[
          { label: "Open PSI", href: "/psi" },
          { label: "Open Reports", href: "/reports", variant: "secondary" },
          { label: "Open Branches", href: "/branches", variant: "outline" },
          { label: "Open Actions", href: "/psi/actions", variant: "outline" },
        ]}
      />

      <MeTabs style="detail" tabs={[{ label: "Overview", active: true }, { label: "Queue", badge: String(rows.length) }, { label: "Lifecycle" }, { label: "Activity" }]} />

      <MeDetailWorkspace
        main={
          <>
            <MeWorkspaceSection title="Issue Queue" description="Priority, status, module source, and linked detail access for active PSI issues.">
              <MeDataTable
                embedded
                columns={["Issue", "Module", "Priority", "Status", "Lifecycle", "Detail"]}
                rows={rows.map((row) => [
                  row.title,
                  row.moduleCode,
                  row.priority,
                  row.status,
                  row.lifecycleStage,
                  row.detailHref ? (
                    <Link key={`${row.issueId}-detail`} href={row.detailHref} className="text-blue-700 hover:underline">
                      Open detail
                    </Link>
                  ) : (
                    "Current workspace"
                  ),
                ])}
              />
            </MeWorkspaceSection>
          </>
        }
        context={
          <MeStatusTimeline
            embedded
            title="Issue Activity"
            items={rows.slice(0, 4).map((row) => ({
              title: row.title,
              description: `${row.moduleCode} · ${row.sourceRef} · ${row.status}`,
              time: row.lifecycleStage,
            }))}
          />
        }
      />
    </MeDashboardShell>
  );
}
