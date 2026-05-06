import Link from "next/link";

import {
  MeActionBar,
  MeDashboardShell,
  MePageHeader,
  MeRightRail,
  MeTabs,
  MeWorkspaceSection,
} from "@/components/layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const densityCards = [
  ["Comfortable", "Larger spacing for reviews, demos, and overview browsing."],
  ["Compact", "Balanced density for daily operational work across most screens."],
  ["Dense", "High information density for detail tables and wide desktop workspaces."],
];

export function DisplaySettingsPage() {
  return (
    <MeDashboardShell
      activeKey="display-settings"
      rightRail={
        <MeRightRail
          sections={[
            {
              title: "Coverage",
              badge: "Preview-only",
              items: ["Desktop 1710 x 1112+", "Tablet split workspace", "Phone stacked workspace"],
            },
            {
              title: "Guardrails",
              items: ["No persistence", "No localStorage/sessionStorage", "No user setting save", "No backend integration"],
            },
            {
              title: "Current Recommendation",
              items: ["Desktop: Comfortable", "Tablet: Compact", "Phone: Compact with rail moved below"],
            },
          ]}
        />
      }
    >
      <MePageHeader
        eyebrow="Display Settings"
        title="ME display settings"
        description="Preview how density, layout mode, sidebar behavior, and right rail behavior should feel across desktop, tablet, and phone."
        notice="Preview-only route. No settings are saved, persisted, or applied to runtime user preferences."
        badges={[
          { label: "Preview-only" },
          { label: "Desktop / Tablet / Phone", variant: "secondary" },
          { label: "No persistence", variant: "outline" },
        ]}
        actions={
          <>
            <Button asChild size="sm">
              <Link href="/">Open Dashboard</Link>
            </Button>
            <Button asChild size="sm" variant="outline">
              <Link href="/psi">Open PSI</Link>
            </Button>
            <Button asChild size="sm" variant="outline">
              <Link href="/system-foundation">Open System Foundation</Link>
            </Button>
          </>
        }
        meta={[
          { label: "Desktop target", value: "1710 x 1112+" },
          { label: "Tablet mode", value: "Compact split view" },
          { label: "Phone mode", value: "Stacked workspace" },
          { label: "Settings state", value: "Not persisted" },
        ]}
      />

      <MeActionBar
        actions={[
          { label: "Preview Desktop" },
          { label: "Preview Tablet", variant: "outline" },
          { label: "Preview Mobile", variant: "outline" },
          { label: "Reset Preview", variant: "ghost" },
        ]}
      />

      <MeTabs
        tabs={[
          { label: "Density", active: true },
          { label: "Layout Mode" },
          { label: "Sidebar" },
          { label: "Right Rail" },
          { label: "Tables" },
          { label: "Breakpoints" },
        ]}
      />

      <MeWorkspaceSection title="Display Density Preview" description="Operational density should change spacing and table compactness, not create a different product.">
        <div className="grid gap-3 xl:grid-cols-3">
          {densityCards.map(([title, description], index) => (
            <div key={title} className="rounded-[20px] bg-slate-50/90 px-4 py-4 ring-1 ring-slate-200/70">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-slate-950">{title}</p>
                <Badge variant={index === 0 ? "default" : "outline"}>{index === 0 ? "Current" : "Preview"}</Badge>
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
            </div>
          ))}
        </div>
      </MeWorkspaceSection>

      <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <MeWorkspaceSection title="Layout Mode Preview" description="One shared B-end platform across desktop, tablet, and phone.">
          <div className="grid gap-3">
            {[
              ["Desktop", "Sidebar + topbar + wide main workspace + visible right rail."],
              ["Tablet", "Sidebar becomes compact or drawer, right rail moves below or collapses."],
              ["Phone", "Drawer navigation, wrapped actions, horizontally scrollable tabs, stacked sections."],
            ].map(([label, value]) => (
              <div key={label} className="flex items-start gap-3 rounded-[20px] border border-slate-200/75 bg-slate-50/80 px-4 py-3.5">
                <span className="mt-1.5 h-2 w-2 rounded-full bg-blue-400/90" />
                <div>
                  <p className="text-sm font-semibold text-slate-950">{label}</p>
                  <p className="mt-1 text-sm leading-6 text-slate-600">{value}</p>
                </div>
              </div>
            ))}
          </div>
        </MeWorkspaceSection>

        <MeWorkspaceSection title="Sidebar and Right Rail Preview" description="Navigation and context behavior should adapt without changing route structure.">
          <div className="grid gap-3 md:grid-cols-2">
            <div className="rounded-[20px] bg-slate-50/90 px-4 py-4 ring-1 ring-slate-200/70">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">Sidebar modes</p>
              <p className="mt-2 text-sm font-semibold text-slate-900">Expanded / Compact / Drawer</p>
              <p className="mt-1 text-sm leading-6 text-slate-600">Desktop keeps it stable, tablet compresses it, phone moves it into the drawer.</p>
            </div>
            <div className="rounded-[20px] bg-slate-50/90 px-4 py-4 ring-1 ring-slate-200/70">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">Right rail modes</p>
              <p className="mt-2 text-sm font-semibold text-slate-900">Visible / Collapsed / Below content</p>
              <p className="mt-1 text-sm leading-6 text-slate-600">Desktop keeps context visible, smaller screens move it below the main workspace.</p>
            </div>
          </div>
        </MeWorkspaceSection>
      </div>

      <MeWorkspaceSection title="Table and Card Density Preview" description="Dense data should compress responsibly and remain readable.">
        <div className="grid gap-3 xl:grid-cols-2">
          <div className="rounded-[20px] bg-slate-50/90 px-4 py-4 ring-1 ring-slate-200/70">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">Table density</p>
            <p className="mt-2 text-sm font-semibold text-slate-900">Compact rows, horizontal scroll on smaller screens, no heavy grid boxing.</p>
          </div>
          <div className="rounded-[20px] bg-slate-50/90 px-4 py-4 ring-1 ring-slate-200/70">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">Card density</p>
            <p className="mt-2 text-sm font-semibold text-slate-900">Use section separators and aligned rows before adding more nested cards.</p>
          </div>
        </div>
      </MeWorkspaceSection>

      <MeWorkspaceSection title="Responsive Breakpoint Notes" description="These notes describe the intended operation behavior rather than persisting any device setting.">
        <div className="grid gap-3 md:grid-cols-3">
          {[
            ["Desktop", "1710 x 1112 or larger should use the full workspace width with visible right context."],
            ["Tablet", "Primary actions stay visible, rails collapse, and tables scroll instead of clipping."],
            ["Phone", "Header, actions, tabs, tables, and rail stack into one vertical operational flow."],
          ].map(([label, value]) => (
            <div key={label} className="rounded-[20px] bg-slate-50/90 px-4 py-4 ring-1 ring-slate-200/70">
              <p className="text-sm font-semibold text-slate-950">{label}</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">{value}</p>
            </div>
          ))}
        </div>
      </MeWorkspaceSection>
    </MeDashboardShell>
  );
}
