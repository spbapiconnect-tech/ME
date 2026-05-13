"use client";

import { useMemo, useState } from "react";
import {
  BookOpen,
  CheckCircle2,
  ClipboardCheck,
  GraduationCap,
  Search,
  Store,
  UploadCloud,
} from "lucide-react";

import { ErpShell } from "@/components/erp/erp-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useMeRuntimeStore } from "@/stores/me-runtime";
import {
  buildOutletInspectionCards,
  buildOutletProofLog,
  buildOutletSopLibrary,
  buildOutletTaskCards,
  buildOutletTrainingCards,
  outletDetailValue,
  type OutletRuntimeRow,
  type OutletWorkspaceCard,
} from "@/lib/store-operations/outlet-workspace";

function cardToneClass(tone: OutletWorkspaceCard["tone"]) {
  if (tone === "danger") return "border-destructive/50 bg-destructive/5";
  if (tone === "warning") return "border-amber-500/40 bg-amber-500/5";
  if (tone === "success") return "border-emerald-500/40 bg-emerald-500/5";
  if (tone === "muted") return "bg-muted/20";
  return "border-primary/20 bg-primary/[0.03]";
}

function statusVariant(tone: OutletWorkspaceCard["tone"]) {
  if (tone === "danger") return "destructive" as const;
  if (tone === "warning") return "secondary" as const;
  if (tone === "success") return "outline" as const;
  return "secondary" as const;
}

function WorkspaceSection({
  title,
  description,
  icon,
  items,
  empty,
  onOpen,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  items: OutletWorkspaceCard[];
  empty: string;
  onOpen: (item: OutletWorkspaceCard) => void;
}) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between gap-3 text-base">
          <span className="flex items-center gap-2">{icon}{title}</span>
          <Badge variant="outline">{items.length}</Badge>
        </CardTitle>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardHeader>
      <CardContent className="space-y-3">
        {!items.length ? (
          <div className="rounded-xl border border-dashed p-4 text-sm text-muted-foreground">{empty}</div>
        ) : items.map((item) => (
          <div key={`${item.module}-${item.id}`} className={cn("rounded-xl border p-3", cardToneClass(item.tone))}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="font-medium">{item.title}</div>
                <div className="text-xs text-muted-foreground">{item.subtitle}</div>
              </div>
              <Badge variant={statusVariant(item.tone)}>{item.status}</Badge>
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              {item.dueLabel ? <span className="rounded-full border px-2 py-0.5">Due {item.dueLabel}</span> : null}
              {item.proofLabel ? <span className="rounded-full border px-2 py-0.5">Proof {item.proofLabel}</span> : null}
            </div>
            <div className="mt-3">
              <Button size="sm" variant="outline" onClick={() => onOpen(item)}>
                {item.actionLabel || "Open"}
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}


function StaffWorkPanel({
  item,
  onClose,
}: {
  item?: OutletWorkspaceCard;
  onClose: () => void;
}) {
  if (!item) {
    return (
      <Card className="border-dashed">
        <CardHeader>
          <CardTitle className="text-base">Staff Work View</CardTitle>
          <p className="text-sm text-muted-foreground">
            Select today work, training, SOP, inspection, or proof item. Staff will complete the action here without opening manager modules.
          </p>
        </CardHeader>
        <CardContent className="grid gap-3 text-sm md:grid-cols-3">
          {["Read", "Do", "Upload Proof"].map((step) => (
            <div key={step} className="rounded-xl border bg-muted/10 p-3">
              <div className="font-medium">{step}</div>
              <div className="text-xs text-muted-foreground">Simple staff action, no backend navigation.</div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  const mode =
    item.module === "sop" ? "SOP Reading" :
    item.module === "tasks" ? "Task Execution" :
    item.module === "inspection" ? "Inspection Runner" :
    item.module === "issues" ? "Rework Request" :
    "Outlet Work";

  const primaryAction =
    item.module === "sop" ? "Acknowledge" :
    item.module === "tasks" ? "Submit Proof" :
    item.module === "inspection" ? "Submit Checklist" :
    item.module === "issues" ? "Fix Again" :
    "Continue";

  return (
    <Card className="border-primary/30 bg-primary/[0.02]">
      <CardHeader className="pb-3">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="text-xs font-medium uppercase text-muted-foreground">{mode}</div>
            <CardTitle className="text-lg">{item.title}</CardTitle>
            <p className="text-sm text-muted-foreground">{item.subtitle}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge variant={statusVariant(item.tone)}>{item.status}</Badge>
            <Button size="sm" variant="ghost" onClick={onClose}>Close</Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {item.module === "sop" ? (
          <div className="rounded-2xl border bg-background p-4">
            <div className="text-sm font-semibold">Employee Reading</div>
            <div className="mt-2 rounded-xl border bg-muted/10 p-4 text-sm text-muted-foreground">
              Staff should read the SOP page by page here, with image / video / PDF preview, checklist, then acknowledgement.
            </div>
          </div>
        ) : null}

        {item.module === "tasks" ? (
          <div className="grid gap-3 md:grid-cols-3">
            {["Read instruction", "Do work", "Upload proof"].map((step, index) => (
              <div key={step} className="rounded-xl border bg-background p-3">
                <div className="text-xs text-muted-foreground">Step {index + 1}</div>
                <div className="font-medium">{step}</div>
              </div>
            ))}
          </div>
        ) : null}

        {item.module === "inspection" ? (
          <div className="rounded-2xl border bg-background p-4">
            <div className="font-medium">Checklist Runner</div>
            <div className="mt-2 text-sm text-muted-foreground">
              Staff should only see pass / fail, comment, and proof upload. Manager review controls stay hidden.
            </div>
          </div>
        ) : null}

        {item.module === "issues" ? (
          <div className="rounded-2xl border bg-background p-4">
            <div className="font-medium">What needs fixing</div>
            <div className="mt-2 text-sm text-muted-foreground">
              Show the rejected proof, what needs to be corrected, and allow a new photo / video proof submission.
            </div>
          </div>
        ) : null}

        <div className="flex flex-wrap gap-2">
          <Button>{primaryAction}</Button>
          <Button variant="outline">Upload Photo / Video</Button>
          <Button variant="outline">Save Progress</Button>
        </div>
      </CardContent>
    </Card>
  );
}


export function OutletWorkspacePage() {
  const hydrateFromFoundation = useMeRuntimeStore((state) => state.hydrateFromFoundation);
  const getRows = useMeRuntimeStore((state) => state.getRows);

  useMemo(() => {
    hydrateFromFoundation();
  }, [hydrateFromFoundation]);

  const taskRows = getRows("tasks", []);
  const sopRows = getRows("sop", []);
  const inspectionRows = getRows("inspection", []);
  const issueRows = getRows("issues", []);
  const branchRows = getRows("branches", []);

  const branchOptions = useMemo(() => {
    const names = (branchRows as OutletRuntimeRow[]).map((row) => row.title || outletDetailValue(row, "Branch") || row.id).filter(Boolean);
    return ["All Branches", ...Array.from(new Set(names))];
  }, [branchRows]);

  const [selectedOutlet, setSelectedOutlet] = useState("All Branches");
  const [selectedRole, setSelectedRole] = useState("Outlet Manager");
  const [query, setQuery] = useState("");
  const [selectedWorkItem, setSelectedWorkItem] = useState<OutletWorkspaceCard | undefined>();

  const filter = { outlet: selectedOutlet, role: selectedRole };

  const todayTasks = buildOutletTaskCards(taskRows, filter);
  const trainingInbox = buildOutletTrainingCards(sopRows, filter);
  const sopLibrary = buildOutletSopLibrary(sopRows, filter);
  const inspections = buildOutletInspectionCards(inspectionRows, filter);
  const proofLog = buildOutletProofLog(taskRows, inspectionRows, issueRows, filter);

  const search = query.toLowerCase().trim();
  const filterItems = (items: OutletWorkspaceCard[]) => !search
    ? items
    : items.filter((item) => `${item.title} ${item.subtitle} ${item.status}`.toLowerCase().includes(search));

  const filteredTasks = filterItems(todayTasks);
  const filteredTraining = filterItems(trainingInbox);
  const filteredSops = filterItems(sopLibrary);
  const filteredInspections = filterItems(inspections);
  const filteredProofs = filterItems(proofLog);

  const urgentCount = [...todayTasks, ...proofLog].filter((item) => item.tone === "danger" || item.tone === "warning").length;
  const proofCount = proofLog.length;

  return (
    <ErpShell>
      <div className="space-y-6 p-4 pb-24 md:p-6">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Store Operations</p>
            <div>
              <h1 className="text-3xl font-semibold tracking-tight">Outlet Workspace</h1>
              <p className="text-muted-foreground">Staff-facing view for daily execution, SOP reading, training acknowledgement, proof upload, and audit follow-up.</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input className="w-[260px] pl-9" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search outlet work..." />
            </div>
            <Select value={selectedOutlet} onValueChange={setSelectedOutlet}>
              <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
              <SelectContent>{branchOptions.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent>
            </Select>
            <Select value={selectedRole} onValueChange={setSelectedRole}>
              <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
              <SelectContent>{["Outlet Manager", "Kitchen", "Cashier", "All Roles"].map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
          {[
            ["Today Tasks", filteredTasks.length],
            ["Training Inbox", filteredTraining.length],
            ["Proof / Audit", proofCount],
            ["Needs Attention", urgentCount],
          ].map(([label, value]) => (
            <Card key={label}>
              <CardHeader className="px-3 pb-1 pt-3"><CardTitle className="text-[11px] font-medium text-muted-foreground md:text-xs">{label}</CardTitle></CardHeader>
              <CardContent className="px-3 pb-3 pt-0"><div className="text-xl font-semibold md:text-2xl">{value}</div></CardContent>
            </Card>
          ))}
        </div>

        <StaffWorkPanel item={selectedWorkItem} onClose={() => setSelectedWorkItem(undefined)} />

        <div className="grid gap-4 xl:grid-cols-[1.1fr_1fr_1fr]">
          <WorkspaceSection
            title="Today"
            description="Daily work assigned to this outlet, including corrective actions and proof-required tasks."
            icon={<Store className="h-4 w-4" />}
            items={filteredTasks}
            empty="No outlet tasks for the current filter."
            onOpen={setSelectedWorkItem}
          />

          <WorkspaceSection
            title="Training Inbox"
            description="SOPs assigned to this outlet or role for employee reading and acknowledgement."
            icon={<GraduationCap className="h-4 w-4" />}
            items={filteredTraining}
            empty="No training acknowledgement pending."
            onOpen={setSelectedWorkItem}
          />

          <WorkspaceSection
            title="SOP Library"
            description="Employee-readable SOP library filtered by outlet, role, and category."
            icon={<BookOpen className="h-4 w-4" />}
            items={filteredSops}
            empty="No SOPs available for this outlet or role."
            onOpen={setSelectedWorkItem}
          />
        </div>

        <div className="grid gap-4 xl:grid-cols-2">
          <WorkspaceSection
            title="Inspection"
            description="Assigned inspection reviews and checklist runners for outlet staff."
            icon={<ClipboardCheck className="h-4 w-4" />}
            items={filteredInspections}
            empty="No inspection assigned."
            onOpen={setSelectedWorkItem}
          />

          <WorkspaceSection
            title="Proof / Audit Log"
            description="Submitted proof, manager review, rejected proof, incidents, and corrective action history."
            icon={<UploadCloud className="h-4 w-4" />}
            items={filteredProofs}
            empty="No proof, audit, or incident follow-up found."
            onOpen={setSelectedWorkItem}
          />
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base"><CheckCircle2 className="h-4 w-4" />Outlet workflow loop</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 text-sm md:grid-cols-5">
            {[
              "Read SOP",
              "Execute Task",
              "Upload Proof",
              "Manager Review",
              "Rework / Complete",
            ].map((step, index) => (
              <div key={step} className="rounded-xl border bg-muted/10 p-3">
                <div className="text-xs text-muted-foreground">Step {index + 1}</div>
                <div className="font-medium">{step}</div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </ErpShell>
  );
}
