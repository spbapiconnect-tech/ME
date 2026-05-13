"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Clock3,
  ClipboardCheck,
  GraduationCap,
  Inbox,
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

type StaffView = "today" | "calendar" | "inbox" | "library";

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
  return "Special / Outlet Task";
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

  return [8, 10, 12, 14, 16, 18, 20][index % 7];
}

function simpleDateKey(day: number) {
  return `day-${day}`;
}

function assignDayIndex(index: number, daysInMonth: number) {
  return ((index * 3) % daysInMonth) + 1;
}

function StaffViewTabs({
  activeView,
  onChange,
}: {
  activeView: StaffView;
  onChange: (view: StaffView) => void;
}) {
  const tabs: Array<{ key: StaffView; label: string; icon: ReactNode }> = [
    { key: "today", label: "Today", icon: <Clock3 className="h-4 w-4" /> },
    { key: "calendar", label: "Calendar", icon: <CalendarDays className="h-4 w-4" /> },
    { key: "inbox", label: "Inbox", icon: <Inbox className="h-4 w-4" /> },
    { key: "library", label: "SOP Library", icon: <BookOpen className="h-4 w-4" /> },
  ];

  return (
    <div className="flex flex-wrap gap-2 rounded-2xl border bg-background p-1">
      {tabs.map((tab) => (
        <Button
          key={tab.key}
          variant={activeView === tab.key ? "secondary" : "ghost"}
          className="gap-2"
          onClick={() => onChange(tab.key)}
        >
          {tab.icon}
          {tab.label}
        </Button>
      ))}
    </div>
  );
}

function WorkItemButton({
  item,
  onOpen,
  compact = false,
}: {
  item: OutletWorkspaceCard;
  onOpen: (item: OutletWorkspaceCard) => void;
  compact?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={() => onOpen(item)}
      className={cn("w-full rounded-xl border p-3 text-left transition-colors hover:bg-muted/30", cardToneClass(item.tone))}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className={cn("font-medium", compact && "text-sm")}>{item.title}</div>
          <div className="text-xs text-muted-foreground">{item.subtitle}</div>
        </div>
        <Badge variant={statusVariant(item.tone)}>{item.status}</Badge>
      </div>
      <div className="mt-2 flex flex-wrap gap-2 text-xs text-muted-foreground">
        <span className="flex items-center gap-1 rounded-full border bg-background px-2 py-0.5">
          <span className={cn("h-2 w-2 rounded-full", workItemColor(item))} />
          {workItemGroupLabel(item)}
        </span>
        {item.dueLabel ? <span className="rounded-full border bg-background px-2 py-0.5">{item.dueLabel}</span> : null}
        {item.proofLabel ? <span className="rounded-full border bg-background px-2 py-0.5">Proof {item.proofLabel}</span> : null}
      </div>
    </button>
  );
}

function TodayFocus({
  items,
  inboxItems,
  onOpen,
}: {
  items: OutletWorkspaceCard[];
  inboxItems: OutletWorkspaceCard[];
  onOpen: (item: OutletWorkspaceCard) => void;
}) {
  const scheduled = items.map((item, index) => ({ item, hour: getItemHour(item, index) })).sort((a, b) => a.hour - b.hour);
  const nowItem = scheduled[0]?.item;
  const nextItem = scheduled[1]?.item;
  const priorityInbox = inboxItems.filter((item) => item.tone === "danger" || item.tone === "warning").slice(0, 3);

  return (
    <div className="grid gap-4 xl:grid-cols-[0.9fr_1.2fr_0.9fr]">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Now / Next</CardTitle>
          <p className="text-sm text-muted-foreground">First thing staff should look at every day.</p>
        </CardHeader>
        <CardContent className="space-y-3">
          {nowItem ? (
            <div>
              <div className="mb-2 text-xs font-medium uppercase text-muted-foreground">Now</div>
              <WorkItemButton item={nowItem} onOpen={onOpen} />
            </div>
          ) : (
            <div className="rounded-xl border border-dashed p-4 text-sm text-muted-foreground">No current work.</div>
          )}

          {nextItem ? (
            <div>
              <div className="mb-2 text-xs font-medium uppercase text-muted-foreground">Next</div>
              <WorkItemButton item={nextItem} onOpen={onOpen} compact />
            </div>
          ) : null}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">24h Timeline</CardTitle>
          <p className="text-sm text-muted-foreground">See what starts at what time.</p>
        </CardHeader>
        <CardContent>
          <div className="max-h-[520px] space-y-1 overflow-y-auto pr-1">
            {Array.from({ length: 24 }).map((_, hour) => {
              const slotItems = scheduled.filter((entry) => entry.hour === hour).map((entry) => entry.item);

              return (
                <div key={hour} className="grid grid-cols-[58px_1fr] gap-3 border-b py-2 last:border-b-0">
                  <div className="text-xs font-medium text-muted-foreground">{String(hour).padStart(2, "0")}:00</div>
                  <div className="space-y-2">
                    {!slotItems.length ? <div className="h-5 rounded-lg bg-muted/20" /> : slotItems.map((item) => (
                      <WorkItemButton key={`${hour}-${item.module}-${item.id}`} item={item} onOpen={onOpen} compact />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Priority Inbox</CardTitle>
          <p className="text-sm text-muted-foreground">Complaints, rejected proof, inspection follow-up.</p>
        </CardHeader>
        <CardContent className="space-y-3">
          {!priorityInbox.length ? (
            <div className="rounded-xl border border-dashed p-4 text-sm text-muted-foreground">No urgent inbox item.</div>
          ) : priorityInbox.map((item) => (
            <WorkItemButton key={`${item.module}-${item.id}`} item={item} onOpen={onOpen} compact />
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

function MonthCalendarView({
  items,
  onOpen,
}: {
  items: OutletWorkspaceCard[];
  onOpen: (item: OutletWorkspaceCard) => void;
}) {
  const [selectedDay, setSelectedDay] = useState(new Date().getDate());

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();
  const monthLabel = now.toLocaleString(undefined, { month: "long", year: "numeric" });

  const dayItems = (day: number) => items.filter((_, index) => assignDayIndex(index, daysInMonth) === day);
  const selectedItems = dayItems(selectedDay);

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <CardTitle className="text-base">Month Calendar</CardTitle>
            <p className="text-sm text-muted-foreground">Color dots show task, inspection, complaint, rework, and training.</p>
          </div>
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
        </div>
      </CardHeader>

      <CardContent className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-2xl border bg-muted/5 p-3">
          <div className="mb-3 font-medium">{monthLabel}</div>
          <div className="grid grid-cols-7 gap-1 text-center text-xs text-muted-foreground">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => <div key={day} className="py-1">{day}</div>)}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: firstDay }).map((_, index) => <div key={`empty-${index}`} />)}
            {Array.from({ length: daysInMonth }).map((_, index) => {
              const day = index + 1;
              const currentItems = dayItems(day);

              return (
                <button
                  key={simpleDateKey(day)}
                  type="button"
                  onClick={() => setSelectedDay(day)}
                  className={cn(
                    "min-h-[74px] rounded-xl border bg-background p-2 text-left transition-colors hover:bg-muted/40",
                    selectedDay === day && "border-primary bg-primary/5",
                  )}
                >
                  <div className="text-sm font-medium">{day}</div>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {currentItems.slice(0, 4).map((item) => (
                      <span key={`${day}-${item.module}-${item.id}`} className={cn("h-2 w-2 rounded-full", workItemColor(item))} />
                    ))}
                  </div>
                  {currentItems.length > 4 ? <div className="mt-1 text-[10px] text-muted-foreground">+{currentItems.length - 4}</div> : null}
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
              <div className="rounded-xl border border-dashed p-3 text-sm text-muted-foreground">No outlet work scheduled for this day.</div>
            ) : selectedItems.map((item) => (
              <WorkItemButton key={`${item.module}-${item.id}`} item={item} onOpen={onOpen} compact />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function InboxView({
  items,
  onOpen,
}: {
  items: OutletWorkspaceCard[];
  onOpen: (item: OutletWorkspaceCard) => void;
}) {
  const groups = ["Customer Complaint", "GrabFood Complaint", "Inspection Follow-up", "Rework / Proof", "Special / Outlet Task"];

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Inbox</CardTitle>
        <p className="text-sm text-muted-foreground">Separated staff inbox for complaint, inspection follow-up, rework, proof, and special tasks.</p>
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
                ) : groupItems.map((item) => (
                  <WorkItemButton key={`${group}-${item.module}-${item.id}`} item={item} onOpen={onOpen} compact />
                ))}
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

function LibraryView({
  training,
  sopLibrary,
  onOpen,
}: {
  training: OutletWorkspaceCard[];
  sopLibrary: OutletWorkspaceCard[];
  onOpen: (item: OutletWorkspaceCard) => void;
}) {
  return (
    <div className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base"><GraduationCap className="h-4 w-4" />Training</CardTitle>
          <p className="text-sm text-muted-foreground">Assigned SOPs to read and acknowledge.</p>
        </CardHeader>
        <CardContent className="space-y-3">
          {!training.length ? (
            <div className="rounded-xl border border-dashed p-4 text-sm text-muted-foreground">No training assigned.</div>
          ) : training.map((item) => (
            <WorkItemButton key={`${item.module}-${item.id}`} item={item} onOpen={onOpen} />
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base"><BookOpen className="h-4 w-4" />SOP / PRD Reader</CardTitle>
          <p className="text-sm text-muted-foreground">Reading-first SOP library. Open one document, read page by page, acknowledge only at the end.</p>
        </CardHeader>
        <CardContent className="space-y-3">
          {!sopLibrary.length ? (
            <div className="rounded-xl border border-dashed p-4 text-sm text-muted-foreground">No SOP available for this outlet or role.</div>
          ) : sopLibrary.map((item) => (
            <WorkItemButton key={`${item.module}-${item.id}`} item={item} onOpen={onOpen} />
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

function StaffReaderPanel({
  item,
  onClose,
}: {
  item?: OutletWorkspaceCard;
  onClose: () => void;
}) {
  const [readerPage, setReaderPage] = useState(1);
  const [proofName, setProofName] = useState("");
  const [focusMode, setFocusMode] = useState(false);

  if (!item) return null;

  const mode =
    item.module === "sop" ? "SOP / Training Reader" :
    item.module === "tasks" ? "Task Execution" :
    item.module === "inspection" ? "Checklist Runner" :
    item.module === "issues" ? "Rework Request" :
    "Outlet Work";

  const primaryAction =
    item.module === "sop" ? "Acknowledge" :
    item.module === "tasks" ? "Submit Proof" :
    item.module === "inspection" ? "Submit Checklist" :
    item.module === "issues" ? "Submit Again" :
    "Done";

  return (
    <Card className={cn("border-primary/30 bg-primary/[0.02]", focusMode && "fixed inset-4 z-50 overflow-y-auto bg-background shadow-2xl")}>
      <CardHeader className="pb-3">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="text-xs font-medium uppercase text-muted-foreground">{mode}</div>
            <CardTitle className="text-lg">{item.title}</CardTitle>
            <p className="text-sm text-muted-foreground">{item.subtitle}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge variant={statusVariant(item.tone)}>{item.status}</Badge>
            {item.module === "sop" ? <Button size="sm" variant="outline" onClick={() => setFocusMode((value) => !value)}>{focusMode ? "Exit" : "Full Screen"}</Button> : null}
            <Button size="sm" variant="ghost" onClick={onClose}>Close</Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {item.module === "sop" ? (
          <div className="rounded-2xl border bg-background p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <div className="text-sm font-semibold">Page {readerPage} of 3</div>
                <div className="text-xs text-muted-foreground">Read like PRD / document, no backend controls.</div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => setReaderPage((value) => Math.max(1, value - 1))}>Previous</Button>
                <Button size="sm" variant="outline" onClick={() => setReaderPage((value) => Math.min(3, value + 1))}>Next</Button>
              </div>
            </div>

            <div className="mt-4 rounded-2xl border bg-muted/10 p-5">
              {readerPage === 1 ? (
                <>
                  <div className="text-lg font-semibold">Document Summary</div>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground">This SOP should be rendered as a staff-readable document, similar to a PRD: clear title, short sections, simple steps, and media preview where needed.</p>
                </>
              ) : readerPage === 2 ? (
                <>
                  <div className="text-lg font-semibold">Training Video</div>
                  <div className="mt-3 rounded-2xl border bg-black px-4 py-16 text-center text-sm text-white">
                    Video preview area · use browser full screen · Next video after watching
                  </div>
                </>
              ) : (
                <>
                  <div className="text-lg font-semibold">PDF / Checklist</div>
                  <div className="mt-3 rounded-2xl border bg-background p-5 text-sm leading-7 text-muted-foreground">
                    PDF reading should be calm and document-first. Staff should scroll, read, and acknowledge only after finishing the content.
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
            <div className="mt-2 text-sm text-muted-foreground">Show what failed, what to fix, and upload new proof. No incident center controls.</div>
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

  useEffect(() => {
    hydrateFromFoundation();
  }, [hydrateFromFoundation]);

  const taskRows = getRows("tasks", []);
  const sopRows = getRows("sop", []);
  const inspectionRows = getRows("inspection", []);
  const issueRows = getRows("issues", []);
  const branchRows = getRows("branches", []);

  const branchOptions = useMemo(() => {
    const names = (branchRows as OutletRuntimeRow[])
      .map((row) => row.title || outletDetailValue(row, "Branch") || row.id)
      .filter(Boolean);

    return ["All Branches", ...Array.from(new Set(names))];
  }, [branchRows]);

  const [activeView, setActiveView] = useState<StaffView>("today");
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
    : items.filter((item) => `${item.title} ${item.subtitle} ${item.status} ${workItemGroupLabel(item)}`.toLowerCase().includes(search));

  const filteredTasks = filterItems(todayTasks);
  const filteredTraining = filterItems(trainingInbox);
  const filteredSops = filterItems(sopLibrary);
  const filteredInspections = filterItems(inspections);
  const filteredProofs = filterItems(proofLog);

  const timelineItems = [...filteredTasks, ...filteredInspections, ...filteredProofs, ...filteredTraining];
  const inboxItems = [...filteredTasks, ...filteredInspections, ...filteredProofs];
  const attentionCount = inboxItems.filter((item) => item.tone === "danger" || item.tone === "warning").length;

  const summaryCards = [
    {
      label: "Today",
      value: filteredTasks.length,
      description: "Tasks / special work",
      icon: <Store className="h-4 w-4" />,
    },
    {
      label: "Inbox",
      value: inboxItems.length,
      description: "Complaint / follow-up",
      icon: <Inbox className="h-4 w-4" />,
    },
    {
      label: "Training",
      value: filteredTraining.length,
      description: "Read / acknowledge",
      icon: <GraduationCap className="h-4 w-4" />,
    },
    {
      label: "Attention",
      value: attentionCount,
      description: "Need action",
      icon: <UploadCloud className="h-4 w-4" />,
    },
  ];

  return (
    <ErpShell>
      <div className="space-y-5 p-4 pb-24 md:p-6">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Store Operations</p>
            <div>
              <h1 className="text-3xl font-semibold tracking-tight">Outlet Workspace</h1>
              <p className="max-w-3xl text-muted-foreground">
                Staff app for daily calendar, 24-hour timeline, inbox, SOP reading, training, and proof submission.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                className="w-[260px] pl-9"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search outlet work..."
              />
            </div>

            <Select value={selectedOutlet} onValueChange={setSelectedOutlet}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {branchOptions.map((item) => (
                  <SelectItem key={item} value={item}>{item}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedRole} onValueChange={setSelectedRole}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {["Outlet Manager", "Kitchen", "Cashier", "All Roles"].map((item) => (
                  <SelectItem key={item} value={item}>{item}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
          {summaryCards.map((item) => (
            <Card key={item.label}>
              <CardContent className="flex items-center justify-between gap-3 p-3">
                <div>
                  <div className="text-xs text-muted-foreground">{item.label}</div>
                  <div className="text-2xl font-semibold">{item.value}</div>
                  <div className="text-xs text-muted-foreground">{item.description}</div>
                </div>
                <div className="rounded-xl border bg-muted/20 p-2 text-muted-foreground">
                  {item.icon}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <StaffViewTabs activeView={activeView} onChange={setActiveView} />

        {selectedWorkItem ? (
          <StaffReaderPanel item={selectedWorkItem} onClose={() => setSelectedWorkItem(undefined)} />
        ) : null}

        {activeView === "today" ? (
          <TodayFocus
            items={timelineItems}
            inboxItems={inboxItems}
            onOpen={setSelectedWorkItem}
          />
        ) : null}

        {activeView === "calendar" ? (
          <MonthCalendarView
            items={timelineItems}
            onOpen={setSelectedWorkItem}
          />
        ) : null}

        {activeView === "inbox" ? (
          <InboxView
            items={inboxItems}
            onOpen={setSelectedWorkItem}
          />
        ) : null}

        {activeView === "library" ? (
          <LibraryView
            training={filteredTraining}
            sopLibrary={filteredSops}
            onOpen={setSelectedWorkItem}
          />
        ) : null}

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <CheckCircle2 className="h-4 w-4" />
              Simple Outlet Flow
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Staff should always know the next action without opening manager modules.
            </p>
          </CardHeader>
          <CardContent className="grid gap-3 text-sm md:grid-cols-4">
            {[
              { label: "Check Today", icon: <Clock3 className="h-4 w-4" /> },
              { label: "Read / Do", icon: <BookOpen className="h-4 w-4" /> },
              { label: "Checklist", icon: <ClipboardCheck className="h-4 w-4" /> },
              { label: "Upload Proof", icon: <UploadCloud className="h-4 w-4" /> },
            ].map((step, index) => (
              <div key={step.label} className="rounded-xl border bg-muted/10 p-3">
                <div className="mb-2 flex items-center justify-between">
                  <div className="text-xs text-muted-foreground">Step {index + 1}</div>
                  {step.icon}
                </div>
                <div className="font-medium">{step.label}</div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </ErpShell>
  );
}
