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




function workItemColor(item: OutletWorkspaceCard) {
  if (item.module === "tasks") return "bg-blue-500";
  if (item.module === "inspection") return "bg-amber-500";
  if (item.module === "issues") return "bg-red-500";
  if (item.module === "sop") return "bg-emerald-500";
  return "bg-muted-foreground";
}

function workItemGroupLabel(item: OutletWorkspaceCard) {
  const text = `${item.title} ${item.subtitle}`.toLowerCase();
  if (text.includes("grab")) return "GrabFood Complaint";
  if (text.includes("customer") || text.includes("complaint")) return "Customer Complaint";
  if (item.module === "inspection") return "Inspection Follow-up";
  if (item.module === "issues") return "Rework / Proof";
  if (item.module === "sop") return "Training / SOP";
  return "Outlet Task";
}

function getItemHour(item: OutletWorkspaceCard, index: number) {
  const source = `${item.dueLabel || ""} ${item.subtitle || ""} ${item.title || ""}`;
  const match = source.match(/(\d{1,2})(?::\d{2})?\s*(am|pm)?/i);
  if (match) {
    let hour = Number(match[1]);
    const meridiem = match[2]?.toLowerCase();
    if (meridiem === "pm" && hour < 12) hour += 12;
    if (meridiem === "am" && hour === 12) hour = 0;
    return Math.max(0, Math.min(23, hour));
  }
  return [9, 11, 14, 16, 18, 20][index % 6];
}

function StaffCalendarWorkView({
  tasks,
  inspections,
  proofs,
  training,
  onOpen,
}: {
  tasks: OutletWorkspaceCard[];
  inspections: OutletWorkspaceCard[];
  proofs: OutletWorkspaceCard[];
  training: OutletWorkspaceCard[];
  onOpen: (item: OutletWorkspaceCard) => void;
}) {
  const [view, setView] = useState<"calendar" | "timeline">("calendar");
  const [selectedDay, setSelectedDay] = useState(new Date().getDate());

  const allItems = [...tasks, ...inspections, ...proofs, ...training].slice(0, 48);
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();
  const monthLabel = now.toLocaleString(undefined, { month: "long", year: "numeric" });

  const dayItems = (day: number) => allItems.filter((_, index) => ((index * 3) % daysInMonth) + 1 === day);
  const selectedItems = dayItems(selectedDay);
  const timelineItems = allItems
    .map((item, index) => ({ item, hour: getItemHour(item, index) }))
    .sort((a, b) => a.hour - b.hour);

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <CardTitle className="text-base">Outlet Calendar</CardTitle>
            <p className="text-sm text-muted-foreground">Month view and 24-hour timeline for outlet work, special tasks, inspection, complaints, and training.</p>
          </div>
          <div className="flex rounded-lg border p-1">
            <Button size="sm" variant={view === "calendar" ? "secondary" : "ghost"} onClick={() => setView("calendar")}>Month</Button>
            <Button size="sm" variant={view === "timeline" ? "secondary" : "ghost"} onClick={() => setView("timeline")}>24h Timeline</Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
          {[
            ["Task", "bg-blue-500"],
            ["Inspection", "bg-amber-500"],
            ["Complaint / Rework", "bg-red-500"],
            ["Training / SOP", "bg-emerald-500"],
          ].map(([label, color]) => (
            <span key={label} className="flex items-center gap-1 rounded-full border px-2 py-1">
              <span className={cn("h-2 w-2 rounded-full", color)} />
              {label}
            </span>
          ))}
        </div>

        {view === "calendar" ? (
          <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-2xl border bg-muted/5 p-3">
              <div className="mb-3 font-medium">{monthLabel}</div>
              <div className="grid grid-cols-7 gap-1 text-center text-xs text-muted-foreground">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => <div key={day} className="py-1">{day}</div>)}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: firstDay }).map((_, index) => <div key={`empty-${index}`} />)}
                {Array.from({ length: daysInMonth }).map((_, index) => {
                  const day = index + 1;
                  const items = dayItems(day);
                  return (
                    <button
                      key={day}
                      type="button"
                      onClick={() => setSelectedDay(day)}
                      className={cn(
                        "min-h-[74px] rounded-xl border bg-background p-2 text-left transition-colors hover:bg-muted/40",
                        selectedDay === day && "border-primary bg-primary/5"
                      )}
                    >
                      <div className="text-sm font-medium">{day}</div>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {items.slice(0, 4).map((item) => (
                          <span key={`${day}-${item.module}-${item.id}`} className={cn("h-2 w-2 rounded-full", workItemColor(item))} />
                        ))}
                      </div>
                      {items.length > 4 ? <div className="mt-1 text-[10px] text-muted-foreground">+{items.length - 4}</div> : null}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="rounded-2xl border bg-background p-3">
              <div className="mb-3">
                <div className="text-sm font-semibold">Day {selectedDay}</div>
                <div className="text-xs text-muted-foreground">{selectedItems.length} item(s)</div>
              </div>
              <div className="space-y-2">
                {!selectedItems.length ? (
                  <div className="rounded-xl border border-dashed p-3 text-sm text-muted-foreground">No work scheduled for this day.</div>
                ) : selectedItems.map((item) => (
                  <button key={`${item.module}-${item.id}`} type="button" onClick={() => onOpen(item)} className="w-full rounded-xl border bg-muted/10 p-3 text-left hover:bg-muted/30">
                    <div className="flex items-center gap-2">
                      <span className={cn("h-2 w-2 rounded-full", workItemColor(item))} />
                      <span className="text-xs text-muted-foreground">{workItemGroupLabel(item)}</span>
                    </div>
                    <div className="mt-1 font-medium">{item.title}</div>
                    <div className="text-xs text-muted-foreground">{item.dueLabel || item.status}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border bg-muted/5 p-3">
            <div className="space-y-1">
              {Array.from({ length: 24 }).map((_, hour) => {
                const items = timelineItems.filter((entry) => entry.hour === hour).map((entry) => entry.item);
                return (
                  <div key={hour} className="grid grid-cols-[58px_1fr] gap-3 border-b py-2 last:border-b-0">
                    <div className="text-xs font-medium text-muted-foreground">{String(hour).padStart(2, "0")}:00</div>
                    <div className="space-y-2">
                      {!items.length ? <div className="h-5 rounded-lg bg-muted/20" /> : items.map((item) => (
                        <button key={`${hour}-${item.module}-${item.id}`} type="button" onClick={() => onOpen(item)} className="w-full rounded-xl border bg-background p-3 text-left hover:bg-muted/30">
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <span className={cn("h-2 w-2 rounded-full", workItemColor(item))} />
                              <span className="font-medium">{item.title}</span>
                            </div>
                            <Badge variant={statusVariant(item.tone)}>{item.status}</Badge>
                          </div>
                          <div className="mt-1 text-xs text-muted-foreground">{workItemGroupLabel(item)} · {item.subtitle}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function OutletInbox({
  items,
  onOpen,
}: {
  items: OutletWorkspaceCard[];
  onOpen: (item: OutletWorkspaceCard) => void;
}) {
  const groups = ["Customer Complaint", "GrabFood Complaint", "Inspection Follow-up", "Rework / Proof", "Outlet Task"];

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Inbox</CardTitle>
        <p className="text-sm text-muted-foreground">Separated staff inbox for complaint, inspection follow-up, proof rework, and special outlet tasks.</p>
      </CardHeader>
      <CardContent className="grid gap-3 xl:grid-cols-2">
        {groups.map((group) => {
          const groupItems = items.filter((item) => workItemGroupLabel(item) === group);
          return (
            <div key={group} className="rounded-2xl border bg-muted/5 p-3">
              <div className="mb-2 flex items-center justify-between gap-2">
                <div className="font-medium">{group}</div>
                <Badge variant="outline">{groupItems.length}</Badge>
              </div>
              <div className="space-y-2">
                {!groupItems.length ? (
                  <div className="rounded-xl border border-dashed p-3 text-xs text-muted-foreground">Nothing here.</div>
                ) : groupItems.slice(0, 4).map((item) => (
                  <button key={`${group}-${item.module}-${item.id}`} type="button" onClick={() => onOpen(item)} className="w-full rounded-xl border bg-background p-3 text-left hover:bg-muted/30">
                    <div className="font-medium">{item.title}</div>
                    <div className="text-xs text-muted-foreground">{item.subtitle}</div>
                  </button>
                ))}
              </div>
            </div>
          );
        })}
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
  const [readerPage, setReaderPage] = useState(1);
  const [proofName, setProofName] = useState("");
  const [mediaMode, setMediaMode] = useState<"normal" | "focus">("normal");

  if (!item) {
    return (
      <Card className="border-dashed">
        <CardHeader>
          <CardTitle className="text-base">Staff Work View</CardTitle>
          <p className="text-sm text-muted-foreground">
            Select work from Today, Training, SOP Library, Inspection, or Proof Log. Staff complete it here without opening manager modules.
          </p>
        </CardHeader>
        <CardContent className="grid gap-3 text-sm md:grid-cols-3">
          {["Read", "Do", "Upload Proof"].map((step) => (
            <div key={step} className="rounded-xl border bg-muted/10 p-3">
              <div className="font-medium">{step}</div>
              <div className="text-xs text-muted-foreground">One simple staff action at a time.</div>
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
    item.module === "issues" ? "Fix Again" :
    "Outlet Work";

  const primaryAction =
    item.module === "sop" ? "Acknowledge" :
    item.module === "tasks" ? "Submit Proof" :
    item.module === "inspection" ? "Submit Checklist" :
    item.module === "issues" ? "Submit Again" :
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
          <div className={cn("rounded-2xl border bg-background p-4", mediaMode === "focus" && "fixed inset-4 z-50 overflow-y-auto bg-background shadow-2xl")}>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <div className="text-sm font-semibold">Page {readerPage} of 3</div>
                <div className="text-xs text-muted-foreground">Staff reading mode</div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => setReaderPage((value) => Math.max(1, value - 1))}>Previous</Button>
                <Button size="sm" variant="outline" onClick={() => setReaderPage((value) => Math.min(3, value + 1))}>Next</Button>
                <Button size="sm" variant="outline" onClick={() => setMediaMode((value) => value === "focus" ? "normal" : "focus")}>
                  {mediaMode === "focus" ? "Exit" : "Full Screen"}
                </Button>
              </div>
            </div>

            <div className="mt-4 rounded-2xl border bg-muted/10 p-4">
              {readerPage === 1 ? (
                <>
                  <div className="font-medium">Read the instruction</div>
                  <div className="mt-2 text-sm text-muted-foreground">SOP content appears here as page-by-page reading, not a backend editor.</div>
                </>
              ) : readerPage === 2 ? (
                <>
                  <div className="font-medium">Watch training video</div>
                  <div className="mt-2 rounded-xl border bg-black px-4 py-12 text-center text-sm text-white">
                    Video preview area · browser video controls allow fullscreen
                  </div>
                  <div className="mt-2 text-xs text-muted-foreground">Use Next after watching. Keep only one clear action visible.</div>
                </>
              ) : (
                <>
                  <div className="font-medium">Read PDF / checklist</div>
                  <div className="mt-2 rounded-xl border bg-background p-4 text-sm text-muted-foreground">
                    PDF reading should feel like a simple PRD/document reader: clean page, easy scroll, no manager controls.
                  </div>
                </>
              )}
            </div>
          </div>
        ) : null}

        {item.module === "tasks" ? (
          <div className="space-y-3">
            <div className="grid gap-3 md:grid-cols-3">
              {["Start", "Do", "Proof"].map((step, index) => (
                <div key={step} className="rounded-xl border bg-background p-3">
                  <div className="text-xs text-muted-foreground">Step {index + 1}</div>
                  <div className="font-medium">{step}</div>
                </div>
              ))}
            </div>
            <div className="rounded-xl border bg-background p-3">
              <div className="text-sm font-medium">Upload photo / video proof</div>
              <Input
                className="mt-2"
                type="file"
                accept="image/*,video/*"
                onChange={(event) => setProofName(event.target.files?.[0]?.name || "")}
              />
              {proofName ? <div className="mt-2 text-xs text-muted-foreground">Selected: {proofName}</div> : null}
            </div>
          </div>
        ) : null}

        {item.module === "inspection" ? (
          <div className="space-y-3 rounded-2xl border bg-background p-4">
            <div className="font-medium">Checklist Runner</div>
            {["Clean station", "Stock ready", "Photo proof"].map((check) => (
              <div key={check} className="flex items-center justify-between rounded-xl border px-3 py-2 text-sm">
                <span>{check}</span>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">Pass</Button>
                  <Button size="sm" variant="outline">Fail</Button>
                </div>
              </div>
            ))}
          </div>
        ) : null}

        {item.module === "issues" ? (
          <div className="rounded-2xl border bg-background p-4">
            <div className="font-medium">Fix Again</div>
            <div className="mt-2 text-sm text-muted-foreground">
              Show only what failed, what to fix, and upload new proof. Do not show incident center controls.
            </div>
          </div>
        ) : null}

        <div className="flex flex-wrap gap-2">
          <Button>{primaryAction}</Button>
          {item.module !== "sop" ? <Button variant="outline">Save Progress</Button> : null}
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

        <StaffCalendarWorkView
          tasks={filteredTasks}
          inspections={filteredInspections}
          proofs={filteredProofs}
          training={filteredTraining}
          onOpen={setSelectedWorkItem}
        />

        <OutletInbox items={[...filteredTasks, ...filteredInspections, ...filteredProofs]} onOpen={setSelectedWorkItem} />

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
