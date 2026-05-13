"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  AlertCircle,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Inbox,
  MessageSquare,
  Search,
  ShieldAlert,
  UploadCloud,
  UsersRound,
} from "lucide-react";

import { ErpShell } from "@/components/erp/erp-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UploadAssetPreview } from "@/components/uploads/upload-asset-preview";
import { serializeUploadAsset, uploadAssetLabel, uploadLocalPreviewAsset } from "@/lib/uploads/upload-provider";
import { cn } from "@/lib/utils";
import { useMeRuntimeStore } from "@/stores/me-runtime";
import {
  buildOutletStaffWorkItems,
  getOutletInboxItems,
  getOutletTrainingItems,
  type OutletInboxGroup,
  type OutletStaffWorkItem,
} from "@/lib/store-operations/outlet-staff-workspace";

type StaffTab = "today" | "calendar" | "inbox" | "sop";

type RuntimeDetail = {
  label: string;
  value?: string;
};

type RuntimeRow = {
  id: string;
  title?: string;
  status?: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
  detailItems?: RuntimeDetail[];
};

type ShiftItem = {
  id: string;
  title: string;
  staff: string;
  role: string;
  branch: string;
  date: string;
  startTime: string;
  endTime: string;
  status: string;
};

function detailValue(row: RuntimeRow, label: string) {
  return row.detailItems?.find((item) => item.label === label)?.value || "";
}

function upsertDetail(items: RuntimeDetail[] | undefined, label: string, value: string) {
  const next = [...(items || [])].map((item) => ({ label: item.label, value: item.value || "" }));
  const index = next.findIndex((item) => item.label === label);

  if (index >= 0) next[index] = { label, value };
  else next.push({ label, value });

  return next;
}

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function normalizeDate(value: string) {
  if (!value) return todayISO();
  const date = new Date(value);
  if (!Number.isNaN(date.getTime())) return date.toISOString().slice(0, 10);
  const match = value.match(/\d{4}-\d{2}-\d{2}/);
  return match?.[0] || todayISO();
}

function normalizeTime(value: string, fallback = "09:00") {
  if (!value) return fallback;

  const date = new Date(value);
  if (!Number.isNaN(date.getTime())) {
    return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
  }

  const match = value.match(/(\d{1,2})(?::(\d{2}))?\s*(am|pm)?/i);
  if (!match) return fallback;

  let hour = Number(match[1]);
  const minute = match[2] || "00";
  const meridiem = match[3]?.toLowerCase();

  if (meridiem === "pm" && hour < 12) hour += 12;
  if (meridiem === "am" && hour === 12) hour = 0;

  return `${String(hour).padStart(2, "0")}:${minute}`;
}

function itemDateTime(item: OutletStaffWorkItem) {
  return new Date(`${item.date}T${item.startTime || "00:00"}`);
}

function isDone(item: OutletStaffWorkItem) {
  const value = `${item.status} ${item.reviewState || ""}`.toLowerCase();
  return value.includes("done") || value.includes("complete") || value.includes("accepted") || value.includes("acknowledged") || value.includes("resolved");
}

function isWaitingReview(item: OutletStaffWorkItem) {
  const value = `${item.status} ${item.reviewState || ""}`.toLowerCase();
  return value.includes("pending review") || value.includes("waiting");
}

function isOverdue(item: OutletStaffWorkItem) {
  return itemDateTime(item).getTime() < Date.now() && !isDone(item) && !isWaitingReview(item);
}

function isNow(item: OutletStaffWorkItem) {
  const diff = itemDateTime(item).getTime() - Date.now();
  return diff >= -30 * 60 * 1000 && diff <= 90 * 60 * 1000 && !isDone(item) && !isWaitingReview(item);
}

function itemColor(item: OutletStaffWorkItem) {
  if (isOverdue(item) || item.priority === "urgent") return "bg-red-500";
  if (item.type === "inspection") return "bg-amber-500";
  if (item.type === "training" || item.type === "sop") return "bg-emerald-500";
  if (isWaitingReview(item)) return "bg-violet-500";
  return "bg-blue-500";
}

function itemBorder(item: OutletStaffWorkItem) {
  if (isOverdue(item) || item.priority === "urgent") return "border-red-300 bg-red-50/50";
  if (item.type === "inspection") return "border-amber-300 bg-amber-50/50";
  if (item.type === "training" || item.type === "sop") return "border-emerald-300 bg-emerald-50/50";
  if (isWaitingReview(item)) return "border-violet-300 bg-violet-50/50";
  return "border-primary/20 bg-primary/[0.03]";
}

function statusVariant(item: OutletStaffWorkItem) {
  if (isOverdue(item) || item.priority === "urgent") return "destructive" as const;
  if (isWaitingReview(item)) return "outline" as const;
  return "secondary" as const;
}

function matchOutlet(row: RuntimeRow, outlet: string) {
  if (!outlet || outlet === "All Branches") return true;

  const target =
    detailValue(row, "Target Outlet") ||
    detailValue(row, "Target Branch") ||
    detailValue(row, "Branch") ||
    detailValue(row, "Outlet") ||
    detailValue(row, "Outlets") ||
    "";

  if (!target) return true;
  return target === outlet || target.includes(outlet) || target === "All Branches";
}

function buildShiftItems(rows: RuntimeRow[], outlet: string): ShiftItem[] {
  return rows
    .filter((row) => matchOutlet(row, outlet))
    .map((row) => {
      const start = detailValue(row, "Start Time") || detailValue(row, "Start") || detailValue(row, "Clock In") || "";
      const end = detailValue(row, "End Time") || detailValue(row, "End") || detailValue(row, "Clock Out") || "";
      const date = detailValue(row, "Date") || detailValue(row, "Shift Date") || detailValue(row, "Work Date") || row.createdAt || "";

      return {
        id: row.id,
        title: row.title || "Shift",
        staff: detailValue(row, "Staff") || detailValue(row, "Staff Name") || row.title || "Staff",
        role: detailValue(row, "Role") || detailValue(row, "Duty") || detailValue(row, "Position") || "Outlet Staff",
        branch: detailValue(row, "Branch") || detailValue(row, "Outlet") || outlet,
        date: normalizeDate(date),
        startTime: normalizeTime(start, "09:00"),
        endTime: normalizeTime(end, "18:00"),
        status: row.status || detailValue(row, "Status") || "Planned",
      };
    });
}

function StaffTabs({
  activeTab,
  onChange,
  counts,
}: {
  activeTab: StaffTab;
  onChange: (tab: StaffTab) => void;
  counts: Record<StaffTab, number>;
}) {
  const tabs: Array<{ key: StaffTab; label: string; icon: ReactNode }> = [
    { key: "today", label: "Today", icon: <Clock3 className="h-4 w-4" /> },
    { key: "calendar", label: "Calendar", icon: <CalendarDays className="h-4 w-4" /> },
    { key: "inbox", label: "Inbox", icon: <Inbox className="h-4 w-4" /> },
    { key: "sop", label: "SOP", icon: <BookOpen className="h-4 w-4" /> },
  ];

  return (
    <div className="sticky top-0 z-20 -mx-4 border-y bg-background/95 px-4 py-2 backdrop-blur md:mx-0 md:rounded-2xl md:border">
      <div className="grid grid-cols-4 gap-1">
        {tabs.map((tab) => (
          <Button
            key={tab.key}
            variant={activeTab === tab.key ? "secondary" : "ghost"}
            className="h-auto flex-col gap-1 px-2 py-2 md:h-10 md:flex-row md:gap-2"
            onClick={() => onChange(tab.key)}
          >
            {tab.icon}
            <span className="text-xs md:text-sm">{tab.label}</span>
            {counts[tab.key] ? <span className="rounded-full bg-muted px-1.5 text-[10px]">{counts[tab.key]}</span> : null}
          </Button>
        ))}
      </div>
    </div>
  );
}

function WorkCard({
  item,
  onOpen,
  label,
}: {
  item: OutletStaffWorkItem;
  onOpen: (item: OutletStaffWorkItem) => void;
  label?: string;
}) {
  return (
    <button
      type="button"
      onClick={() => onOpen(item)}
      className={cn("w-full rounded-2xl border p-4 text-left transition hover:bg-muted/30", itemBorder(item))}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          {label ? <div className="mb-1 text-xs font-medium uppercase text-muted-foreground">{label}</div> : null}
          <div className="truncate font-semibold">{item.title}</div>
          <div className="mt-1 line-clamp-2 text-sm text-muted-foreground">{item.description}</div>
        </div>
        <Badge variant={statusVariant(item)}>{isOverdue(item) ? "Overdue" : item.status}</Badge>
      </div>

      <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted-foreground">
        <span className="flex items-center gap-1 rounded-full border bg-background px-2 py-1">
          <span className={cn("h-2 w-2 rounded-full", itemColor(item))} />
          {item.inboxGroup}
        </span>
        <span className="rounded-full border bg-background px-2 py-1">{item.date} · {item.startTime}</span>
        {item.proofRequired ? <span className="rounded-full border bg-background px-2 py-1">Proof required</span> : null}
      </div>

      <div className="mt-4 flex items-center justify-between">
        <span className="text-sm font-medium">{isOverdue(item) ? "Fix now" : item.primaryAction}</span>
        <ChevronRight className="h-4 w-4 text-muted-foreground" />
      </div>
    </button>
  );
}

function ShiftStrip({ shifts }: { shifts: ShiftItem[] }) {
  const today = todayISO();
  const todayShifts = shifts.filter((shift) => shift.date === today);

  return (
    <Card className="border-primary/20 bg-primary/[0.03]">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <UsersRound className="h-4 w-4" />
          Today Shift
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {!todayShifts.length ? (
          <div className="rounded-xl border border-dashed bg-background p-4 text-sm text-muted-foreground">
            No shift data connected for today.
          </div>
        ) : todayShifts.slice(0, 4).map((shift) => (
          <div key={shift.id} className="rounded-xl border bg-background p-3">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="font-medium">{shift.staff}</div>
                <div className="text-sm text-muted-foreground">{shift.role}</div>
              </div>
              <Badge variant="outline">{shift.status}</Badge>
            </div>
            <div className="mt-2 text-sm font-medium">{shift.startTime} - {shift.endTime}</div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function RedLightPanel({
  overdue,
  waiting,
}: {
  overdue: OutletStaffWorkItem[];
  waiting: OutletStaffWorkItem[];
}) {
  const hasRedLight = overdue.length > 0;

  return (
    <Card className={cn(hasRedLight ? "border-red-300 bg-red-50/60" : "border-emerald-300 bg-emerald-50/60")}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          {hasRedLight ? <AlertCircle className="h-4 w-4 text-red-600" /> : <CheckCircle2 className="h-4 w-4 text-emerald-600" />}
          Red Light
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-semibold">{overdue.length}</div>
        <div className="text-sm text-muted-foreground">missed / overdue item(s)</div>
        <div className="mt-3 text-sm text-muted-foreground">{waiting.length} waiting manager review</div>
      </CardContent>
    </Card>
  );
}

function TodayTimeline({
  items,
  shifts,
  onOpen,
}: {
  items: OutletStaffWorkItem[];
  shifts: ShiftItem[];
  onOpen: (item: OutletStaffWorkItem) => void;
}) {
  const today = todayISO();
  const todayItems = items.filter((item) => item.date === today).sort((a, b) => a.startTime.localeCompare(b.startTime));
  const todayShifts = shifts.filter((shift) => shift.date === today);
  const hours = Array.from({ length: 24 }).map((_, index) => index);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <Clock3 className="h-4 w-4" />
          24h Timeline
        </CardTitle>
        <p className="text-sm text-muted-foreground">Shift background + timed tasks, proof, inspection, and complaint work.</p>
      </CardHeader>
      <CardContent>
        <div className="max-h-[520px] space-y-1 overflow-y-auto pr-1">
          {hours.map((hour) => {
            const label = `${String(hour).padStart(2, "0")}:00`;
            const slotItems = todayItems.filter((item) => item.startTime.startsWith(String(hour).padStart(2, "0")));
            const slotShift = todayShifts.find((shift) => {
              const startHour = Number(shift.startTime.slice(0, 2));
              const endHour = Number(shift.endTime.slice(0, 2));
              return hour >= startHour && hour < endHour;
            });

            return (
              <div key={hour} className="grid grid-cols-[60px_1fr] gap-3 border-b py-2 last:border-b-0">
                <div className="text-xs font-medium text-muted-foreground">{label}</div>
                <div className={cn("min-h-7 rounded-xl p-1", slotShift && "bg-primary/5")}>
                  {slotShift && !slotItems.length ? (
                    <div className="rounded-lg border border-dashed bg-background/70 px-3 py-1 text-xs text-muted-foreground">
                      Shift · {slotShift.staff}
                    </div>
                  ) : null}

                  <div className="space-y-2">
                    {slotItems.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => onOpen(item)}
                        className={cn("w-full rounded-xl border bg-background p-3 text-left hover:bg-muted/30", itemBorder(item))}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-2">
                            <span className={cn("h-2 w-2 rounded-full", itemColor(item))} />
                            <span className="font-medium">{item.title}</span>
                          </div>
                          <Badge variant={statusVariant(item)}>{isOverdue(item) ? "Overdue" : item.status}</Badge>
                        </div>
                        <div className="mt-1 text-xs text-muted-foreground">{item.inboxGroup} · {item.description}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

function TodayView({
  items,
  shifts,
  onOpen,
}: {
  items: OutletStaffWorkItem[];
  shifts: ShiftItem[];
  onOpen: (item: OutletStaffWorkItem) => void;
}) {
  const today = todayISO();
  const todayItems = items.filter((item) => item.date === today);
  const overdue = items.filter(isOverdue);
  const now = todayItems.filter(isNow);
  const waiting = todayItems.filter(isWaitingReview);
  const next = todayItems
    .filter((item) => !isOverdue(item) && !isNow(item) && !isWaitingReview(item) && !isDone(item))
    .sort((a, b) => a.startTime.localeCompare(b.startTime))
    .slice(0, 3);

  const heroItem = overdue[0] || now[0] || next[0];

  return (
    <div className="grid gap-4 xl:grid-cols-[360px_minmax(0,1fr)_360px]">
      <div className="space-y-4">
        <ShiftStrip shifts={shifts} />
        <RedLightPanel overdue={overdue} waiting={waiting} />
      </div>

      <div className="space-y-4">
        {heroItem ? (
          <WorkCard item={heroItem} onOpen={onOpen} label={isOverdue(heroItem) ? "Do first" : isNow(heroItem) ? "Now" : "Next"} />
        ) : (
          <Card>
            <CardContent className="p-6">
              <div className="text-lg font-semibold">Nothing urgent right now.</div>
              <p className="mt-1 text-sm text-muted-foreground">No current task due in this time window.</p>
            </CardContent>
          </Card>
        )}

        <TodayTimeline items={items} shifts={shifts} onOpen={onOpen} />
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <Inbox className="h-4 w-4" />
            Management Inbox
          </CardTitle>
          <p className="text-sm text-muted-foreground">Messages, complaints, inspection follow-up, and rework.</p>
        </CardHeader>
        <CardContent className="space-y-3">
          {[...overdue, ...waiting].slice(0, 5).map((item) => (
            <WorkCard key={item.id} item={item} onOpen={onOpen} />
          ))}
          {!overdue.length && !waiting.length ? (
            <div className="rounded-xl border border-dashed p-4 text-sm text-muted-foreground">No messages waiting.</div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}

function CalendarView({
  items,
  shifts,
  onOpen,
}: {
  items: OutletStaffWorkItem[];
  shifts: ShiftItem[];
  onOpen: (item: OutletStaffWorkItem) => void;
}) {
  const [selectedDate, setSelectedDate] = useState(todayISO());

  const now = new Date(selectedDate);
  const year = now.getFullYear();
  const month = now.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();
  const monthLabel = new Date(year, month, 1).toLocaleString(undefined, { month: "long", year: "numeric" });

  const itemsByDate = (date: string) => items.filter((item) => item.date === date);
  const shiftsByDate = (date: string) => shifts.filter((shift) => shift.date === date);
  const selectedItems = itemsByDate(selectedDate);

  return (
    <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <CalendarDays className="h-4 w-4" />
            Month Calendar
          </CardTitle>
          <p className="text-sm text-muted-foreground">Red means missed / overdue. Shift days are softly tinted.</p>
        </CardHeader>
        <CardContent>
          <div className="mb-3 flex items-center justify-between">
            <div className="font-medium">{monthLabel}</div>
            <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
              {[
                ["Task", "bg-blue-500"],
                ["Inspection", "bg-amber-500"],
                ["Complaint / Overdue", "bg-red-500"],
                ["Training", "bg-emerald-500"],
              ].map(([label, color]) => (
                <span key={label} className="flex items-center gap-1 rounded-full border px-2 py-1">
                  <span className={cn("h-2 w-2 rounded-full", color)} />
                  {label}
                </span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center text-xs text-muted-foreground">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => <div key={day} className="py-1">{day}</div>)}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: firstDay }).map((_, index) => <div key={`empty-${index}`} />)}
            {Array.from({ length: daysInMonth }).map((_, index) => {
              const day = index + 1;
              const date = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
              const dayItems = itemsByDate(date);
              const dayShifts = shiftsByDate(date);
              const hasRed = dayItems.some(isOverdue);

              return (
                <button
                  key={date}
                  type="button"
                  onClick={() => setSelectedDate(date)}
                  className={cn(
                    "min-h-[88px] rounded-xl border bg-background p-2 text-left transition hover:bg-muted/40",
                    selectedDate === date && "border-primary bg-primary/5",
                    dayShifts.length && "bg-primary/[0.03]",
                    hasRed && "border-red-300 bg-red-50/70",
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{day}</span>
                    {dayShifts.length ? <span className="text-[10px] text-muted-foreground">Shift</span> : null}
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {dayItems.slice(0, 5).map((item) => (
                      <span key={item.id} className={cn("h-2 w-2 rounded-full", itemColor(item))} />
                    ))}
                  </div>
                  {dayItems.length > 5 ? <div className="mt-1 text-[10px] text-muted-foreground">+{dayItems.length - 5}</div> : null}
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <ShiftStrip shifts={shifts.filter((shift) => shift.date === selectedDate)} />
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">{selectedDate}</CardTitle>
            <p className="text-sm text-muted-foreground">{selectedItems.length} scheduled item(s)</p>
          </CardHeader>
          <CardContent className="space-y-3">
            {!selectedItems.length ? (
              <div className="rounded-xl border border-dashed p-4 text-sm text-muted-foreground">No timed work on this day.</div>
            ) : selectedItems.map((item) => (
              <WorkCard key={item.id} item={item} onOpen={onOpen} />
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function InboxView({
  items,
  onOpen,
}: {
  items: OutletStaffWorkItem[];
  onOpen: (item: OutletStaffWorkItem) => void;
}) {
  const groups: OutletInboxGroup[] = [
    "Customer Complaint",
    "GrabFood Complaint",
    "Inspection Follow-up",
    "Rework / Proof",
    "Special Task",
  ];

  return (
    <div className="grid gap-4 xl:grid-cols-2">
      {groups.map((group) => {
        const groupItems = items.filter((item) => item.inboxGroup === group);

        return (
          <Card key={group}>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center justify-between gap-2 text-base">
                <span className="flex items-center gap-2">
                  {group.includes("Complaint") ? <ShieldAlert className="h-4 w-4" /> : group.includes("Rework") ? <UploadCloud className="h-4 w-4" /> : <MessageSquare className="h-4 w-4" />}
                  {group}
                </span>
                <Badge variant="outline">{groupItems.length}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {!groupItems.length ? (
                <div className="rounded-xl border border-dashed p-4 text-sm text-muted-foreground">Nothing here.</div>
              ) : groupItems.map((item) => (
                <WorkCard key={item.id} item={item} onOpen={onOpen} />
              ))}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}


type ParsedSopBlock = {
  title?: string;
  body?: string;
  instruction?: string;
  checklistItems?: string[];
};

type ParsedSopContentPage = {
  id?: string;
  title?: string;
  blocks?: ParsedSopBlock[];
};

type SopReaderPage = {
  id: string;
  title: string;
  body: string;
  type: "text" | "media" | "pdf" | "checklist";
  asset?: string;
  checklist?: string[];
};

function parseSopReaderPages(item?: OutletStaffWorkItem): SopReaderPage[] {
  if (!item) {
    return [{
      id: "empty",
      title: "Select SOP",
      body: "Select an SOP or training document to start reading.",
      type: "text",
    }];
  }

  const pages: SopReaderPage[] = [];

  if (item.contentJson) {
    try {
      const parsed = JSON.parse(item.contentJson);
      const parsedPages: ParsedSopContentPage[] = Array.isArray(parsed?.pages) ? parsed.pages : [];

      parsedPages.forEach((page: ParsedSopContentPage, pageIndex: number) => {
        pages.push({
          id: String(page.id || `page-${pageIndex}`),
          title: page.title || `Page ${pageIndex + 1}`,
          body: Array.isArray(page.blocks)
            ? page.blocks
                .map((block: ParsedSopBlock) => {
                  if (block.checklistItems?.length) return `${block.title || "Checklist"}\n${block.checklistItems.map((item) => `• ${item}`).join("\n")}`;
                  return [block.title, block.body, block.instruction].filter(Boolean).join("\n");
                })
                .filter(Boolean)
                .join("\n\n")
            : "",
          type: "text",
        });
      });
    } catch {
      pages.push({
        id: "content-json",
        title: "SOP Content",
        body: item.contentJson,
        type: "text",
      });
    }
  }

  if (!pages.length) {
    pages.push({
      id: "summary",
      title: "Overview",
      body: item.description || "Read this SOP carefully before acknowledging.",
      type: "text",
    });
  }

  if (item.mediaUrl) {
    pages.push({
      id: "media",
      title: "Training Media",
      body: "Watch the media before continuing to the next page.",
      type: "media",
      asset: item.mediaUrl,
    });
  }

  if (item.pdfUrl) {
    pages.push({
      id: "pdf",
      title: "PDF Document",
      body: "Read the attached PDF like a PRD / handbook.",
      type: "pdf",
      asset: item.pdfUrl,
    });
  }

  const checklist = (item.checklistText || "")
    .split(/\n|,/)
    .map((entry) => entry.trim())
    .filter(Boolean);

  pages.push({
    id: "acknowledgement",
    title: "Checklist / Acknowledgement",
    body: "Confirm only after reading and understanding the SOP.",
    type: "checklist",
    checklist: checklist.length ? checklist : ["I have read the SOP", "I understand the key steps", "I know when to ask manager"],
  });

  return pages;
}

function SopReader({
  item,
  onClose,
}: {
  item?: OutletStaffWorkItem;
  onClose?: () => void;
}) {
  const [page, setPage] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);

  const pages = parseSopReaderPages(item);
  const active = pages[Math.min(page, pages.length - 1)] || pages[0];

  return (
    <Card className={cn("min-h-[560px]", fullscreen && "fixed inset-4 z-50 overflow-y-auto bg-background shadow-2xl")}>
      <CardHeader className="border-b">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <CardTitle className="text-xl">{item?.title || "SOP Reader"}</CardTitle>
            <p className="text-sm text-muted-foreground">Read like a handbook / PRD. No manager controls here.</p>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => setFullscreen((value) => !value)}>
              {fullscreen ? "Exit" : "Full Screen"}
            </Button>
            {onClose ? <Button size="sm" variant="ghost" onClick={onClose}>Close</Button> : null}
          </div>
        </div>
      </CardHeader>

      <CardContent className="grid gap-6 p-0 md:grid-cols-[220px_minmax(0,1fr)_220px]">
        <aside className="border-r p-4">
          <div className="mb-3 text-xs font-medium uppercase text-muted-foreground">Pages</div>
          <div className="space-y-1">
            {pages.map((readerPage, index) => (
              <button
                key={readerPage.title}
                type="button"
                onClick={() => setPage(index)}
                className={cn("w-full rounded-xl px-3 py-2 text-left text-sm hover:bg-muted", page === index && "bg-muted font-medium")}
              >
                {index + 1}. {readerPage.title}
              </button>
            ))}
          </div>
        </aside>

        <main className="mx-auto w-full max-w-3xl p-6">
          <div className="mb-3 text-xs font-medium uppercase text-muted-foreground">Page {page + 1} of {pages.length}</div>
          <h2 className="text-2xl font-semibold tracking-tight">{active.title}</h2>

          {active.type === "media" && active.asset ? (
            <div className="mt-5">
              <UploadAssetPreview value={active.asset} label="Training Media" />
            </div>
          ) : active.type === "pdf" && active.asset ? (
            <div className="mt-5">
              <UploadAssetPreview value={active.asset} label="PDF Document" />
            </div>
          ) : active.type === "checklist" ? (
            <div className="mt-5 space-y-2">
              {(active.checklist || []).map((check) => (
                <div key={check} className="rounded-xl border px-4 py-3 text-sm">{check}</div>
              ))}
              <p className="pt-2 text-sm leading-7 text-muted-foreground">{active.body}</p>
            </div>
          ) : (
            <div className="mt-5 whitespace-pre-wrap text-base leading-8 text-muted-foreground">{active.body}</div>
          )}

          <div className="mt-8 flex items-center justify-between border-t pt-4">
            <Button variant="outline" disabled={page === 0} onClick={() => setPage((value) => Math.max(0, value - 1))}>Previous</Button>
            {page === pages.length - 1 ? (
              <Button>Mark as understood</Button>
            ) : (
              <Button onClick={() => setPage((value) => Math.min(pages.length - 1, value + 1))}>Next</Button>
            )}
          </div>
        </main>

        <aside className="border-l p-4">
          <div className="mb-3 text-xs font-medium uppercase text-muted-foreground">Progress</div>
          <div className="text-2xl font-semibold">{Math.round(((page + 1) / pages.length) * 100)}%</div>
          <p className="mt-2 text-sm text-muted-foreground">Acknowledge only at the end.</p>
        </aside>
      </CardContent>
    </Card>
  );
}

function SopView({
  items,
  selected,
  onSelect,
}: {
  items: OutletStaffWorkItem[];
  selected?: OutletStaffWorkItem;
  onSelect: (item: OutletStaffWorkItem | undefined) => void;
}) {
  return (
    <div className="grid gap-4 xl:grid-cols-[360px_minmax(0,1fr)]">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <BookOpen className="h-4 w-4" />
            Training / SOP
          </CardTitle>
          <p className="text-sm text-muted-foreground">Open one document and read like a book.</p>
        </CardHeader>
        <CardContent className="space-y-3">
          {!items.length ? (
            <div className="rounded-xl border border-dashed p-4 text-sm text-muted-foreground">No SOP assigned.</div>
          ) : items.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelect(item)}
              className={cn("w-full rounded-xl border p-3 text-left hover:bg-muted/30", selected?.id === item.id && "border-primary bg-primary/5")}
            >
              <div className="font-medium">{item.title}</div>
              <div className="text-xs text-muted-foreground">{item.description}</div>
            </button>
          ))}
        </CardContent>
      </Card>

      <SopReader item={selected} />
    </div>
  );
}

function WorkItemSheet({
  item,
  onClose,
  onSubmitProof,
}: {
  item?: OutletStaffWorkItem;
  onClose: () => void;
  onSubmitProof: (item: OutletStaffWorkItem, asset: string) => Promise<void>;
}) {
  const [proofName, setProofName] = useState("");
  const [proofAsset, setProofAsset] = useState("");

  if (!item) return null;

  if (item.type === "sop" || item.type === "training") {
    return <SopReader item={item} onClose={onClose} />;
  }

  return (
    <Card className="border-primary/30 bg-primary/[0.02]">
      <CardHeader className="border-b">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="text-xs font-medium uppercase text-muted-foreground">{item.inboxGroup}</div>
            <CardTitle className="text-xl">{item.title}</CardTitle>
            <p className="text-sm text-muted-foreground">{item.description}</p>
          </div>
          <div className="flex gap-2">
            <Badge variant={statusVariant(item)}>{isOverdue(item) ? "Overdue" : item.status}</Badge>
            <Button size="sm" variant="ghost" onClick={onClose}>Close</Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 p-5">
        <div className="grid gap-3 md:grid-cols-3">
          {[
            ["Time", `${item.date} · ${item.startTime}`],
            ["Action", isOverdue(item) ? "Fix now" : item.primaryAction],
            ["Review", item.reviewState || "Not submitted"],
          ].map(([label, value]) => (
            <div key={label} className="rounded-xl border bg-background p-3">
              <div className="text-xs text-muted-foreground">{label}</div>
              <div className="font-medium">{value}</div>
            </div>
          ))}
        </div>

        {item.proofRequired ? (
          <div className="rounded-2xl border bg-background p-4">
            <div className="font-medium">Upload photo / video proof</div>
            <Input
              className="mt-3"
              type="file"
              accept="image/*,video/*"
              onChange={async (event) => {
                const uploadScope = item.sourceModule === "issues" ? "incident" : item.sourceModule === "inspection" ? "inspection" : "task";
                const asset = await uploadLocalPreviewAsset(event.target.files?.[0], uploadScope);
                const serialized = serializeUploadAsset(asset);
                setProofAsset(serialized);
                setProofName(uploadAssetLabel(serialized));
              }}
            />
            {proofName ? <div className="mt-2 text-xs text-muted-foreground">Selected: {proofName}</div> : null}
            {proofAsset ? <UploadAssetPreview value={proofAsset} compact /> : null}
          </div>
        ) : null}

        <div className="flex flex-wrap gap-2">
          <Button
            disabled={item.proofRequired && !proofAsset}
            onClick={async () => {
              if (proofAsset) await onSubmitProof(item, proofAsset);
            }}
          >
            {item.proofRequired ? "Submit Proof" : isOverdue(item) ? "Fix and submit" : item.primaryAction}
          </Button>
          <Button variant="outline">Save progress</Button>
        </div>
      </CardContent>
    </Card>
  );
}

export function OutletStaffHomePage() {
  const hydrateFromFoundation = useMeRuntimeStore((state) => state.hydrateFromFoundation);
  const getRows = useMeRuntimeStore((state) => state.getRows);
  const updateRecord = useMeRuntimeStore((state) => state.updateRecord);
  const logAction = useMeRuntimeStore((state) => state.logAction);

  useEffect(() => {
    hydrateFromFoundation();
  }, [hydrateFromFoundation]);

  const branchRows = getRows("branches", []) as RuntimeRow[];
  const taskRows = getRows("tasks", []) as RuntimeRow[];
  const inspectionRows = getRows("inspection", []) as RuntimeRow[];
  const sopRows = getRows("sop", []) as RuntimeRow[];
  const issueRows = getRows("issues", []) as RuntimeRow[];
  const scheduleRows = getRows("schedule", []) as RuntimeRow[];

  const [activeTab, setActiveTab] = useState<StaffTab>("today");
  const [selectedOutlet, setSelectedOutlet] = useState("All Branches");
  const [query, setQuery] = useState("");
  const [selectedItem, setSelectedItem] = useState<OutletStaffWorkItem | undefined>();
  const [selectedSop, setSelectedSop] = useState<OutletStaffWorkItem | undefined>();

  const branchOptions = useMemo(() => {
    const names = branchRows
      .map((row) => row.title || detailValue(row, "Branch") || detailValue(row, "Outlet") || row.id)
      .filter(Boolean);

    return ["All Branches", ...Array.from(new Set(names))];
  }, [branchRows]);

  const filteredRuntimeRows = useMemo(() => ({
    taskRows: taskRows.filter((row) => matchOutlet(row, selectedOutlet)),
    inspectionRows: inspectionRows.filter((row) => matchOutlet(row, selectedOutlet)),
    sopRows: sopRows.filter((row) => matchOutlet(row, selectedOutlet)),
    issueRows: issueRows.filter((row) => matchOutlet(row, selectedOutlet)),
  }), [inspectionRows, issueRows, selectedOutlet, sopRows, taskRows]);

  const workItems = useMemo(() => {
    const items = buildOutletStaffWorkItems(filteredRuntimeRows);
    const search = query.trim().toLowerCase();

    if (!search) return items;

    return items.filter((item) => `${item.title} ${item.description} ${item.status} ${item.inboxGroup}`.toLowerCase().includes(search));
  }, [filteredRuntimeRows, query]);

  const shiftItems = useMemo(() => buildShiftItems(scheduleRows, selectedOutlet), [scheduleRows, selectedOutlet]);
  const inboxItems = getOutletInboxItems(workItems);
  const trainingItems = getOutletTrainingItems(workItems);

  const counts: Record<StaffTab, number> = {
    today: workItems.filter((item) => item.date === todayISO()).length,
    calendar: workItems.length,
    inbox: inboxItems.length,
    sop: trainingItems.length,
  };

  async function submitStaffProof(item: OutletStaffWorkItem, asset: string) {
    const sourceRows =
      item.sourceModule === "tasks" ? taskRows :
      item.sourceModule === "inspection" ? inspectionRows :
      item.sourceModule === "issues" ? issueRows :
      sopRows;

    const source = sourceRows.find((row) => row.id === item.sourceRecordId);
    if (!source) return;

    let nextDetails: Array<{ label: string; value: string }> = (source.detailItems || []).map((detail) => ({
      label: detail.label,
      value: detail.value || "",
    }));

    if (item.sourceModule === "tasks") {
      const existing = detailValue(source, "Photo Proofs");
      nextDetails = upsertDetail(nextDetails, "Photo Proofs", [existing, asset].filter(Boolean).join(", "));
      nextDetails = upsertDetail(nextDetails, "Photo Proof Status", "Submitted");
      nextDetails = upsertDetail(nextDetails, "Manager Review Status", "Pending Review");
    }

    if (item.sourceModule === "inspection") {
      const existing = detailValue(source, "Outlet Proofs") || detailValue(source, "Photo Proofs");
      nextDetails = upsertDetail(nextDetails, "Outlet Proofs", [existing, asset].filter(Boolean).join(", "));
      nextDetails = upsertDetail(nextDetails, "Required New Photo Proof", "Submitted");
      nextDetails = upsertDetail(nextDetails, "Corrective Action Status", "Submitted");
      nextDetails = upsertDetail(nextDetails, "Manager Review Status", "Pending Review");
    }

    if (item.sourceModule === "issues") {
      const existing = detailValue(source, "Resolution Evidence") || detailValue(source, "Photo Proofs");
      nextDetails = upsertDetail(nextDetails, "Resolution Evidence", [existing, asset].filter(Boolean).join(", "));
      nextDetails = upsertDetail(nextDetails, "Proof Status", "Submitted");
      nextDetails = upsertDetail(nextDetails, "Manager Review Status", "Pending Review");
    }

    await updateRecord(item.sourceModule, item.sourceRecordId, {
      status: "Pending Review",
      detailItems: nextDetails,
      nextAction: "Manager review proof",
    });

    await logAction(item.sourceModule, "outlet-submit-proof", `Outlet submitted proof for ${item.title}`);
    setSelectedItem(undefined);
  }

  return (
    <ErpShell>
      <div className="space-y-5 p-4 pb-24 md:p-6">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Outlet Staff App</p>
            <div>
              <h1 className="text-3xl font-semibold tracking-tight">Today</h1>
              <p className="max-w-3xl text-muted-foreground">
                Check shift, red light, now/next task, management inbox, calendar, and SOP reading.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input className="w-[260px] pl-9" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search work..." />
            </div>

            <Select value={selectedOutlet} onValueChange={setSelectedOutlet}>
              <SelectTrigger className="w-[190px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {branchOptions.map((item) => (
                  <SelectItem key={item} value={item}>{item}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <StaffTabs activeTab={activeTab} onChange={(tab) => {
          setActiveTab(tab);
          setSelectedItem(undefined);
        }} counts={counts} />

        {selectedItem ? (
          <WorkItemSheet item={selectedItem} onClose={() => setSelectedItem(undefined)} onSubmitProof={submitStaffProof} />
        ) : null}

        {activeTab === "today" ? <TodayView items={workItems} shifts={shiftItems} onOpen={setSelectedItem} /> : null}
        {activeTab === "calendar" ? <CalendarView items={workItems} shifts={shiftItems} onOpen={setSelectedItem} /> : null}
        {activeTab === "inbox" ? <InboxView items={inboxItems} onOpen={setSelectedItem} /> : null}
        {activeTab === "sop" ? <SopView items={trainingItems} selected={selectedSop} onSelect={setSelectedSop} /> : null}
      </div>
    </ErpShell>
  );
}
