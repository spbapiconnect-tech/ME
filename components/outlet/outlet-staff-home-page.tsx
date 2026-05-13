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
import { UploadAssetPreview } from "@/components/uploads/upload-asset-preview";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
type StationFilter = "All" | "Kitchen" | "Front" | "Manager";

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
  station: StationFilter;
  branch: string;
  date: string;
  startTime: string;
  endTime: string;
  status: string;
};

type ShiftSummary = {
  total: number;
  kitchen: number;
  front: number;
  manager: number;
  support: number;
};

function detailValue(row: RuntimeRow, label: string) {
  return row.detailItems?.find((item) => item.label === label)?.value || "";
}

function upsertDetail(items: RuntimeDetail[] | undefined, label: string, value: string) {
  const next: Array<{ label: string; value: string }> = (items || []).map((item) => ({
    label: item.label,
    value: item.value || "",
  }));

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

function shouldSurfaceTraining(item: OutletStaffWorkItem) {
  if (item.inboxGroup !== "Training / SOP") return false;
  if (isDone(item)) return false;

  const value = `${item.title} ${item.description} ${item.status} ${item.reviewState || ""} ${item.primaryAction}`.toLowerCase();

  const isAssignedTraining =
    value.includes("training") ||
    value.includes("acknowledgement required") ||
    value.includes("acknowledge required") ||
    value.includes("must read") ||
    value.includes("new product") ||
    value.includes("launch") ||
    value.includes("briefing") ||
    value.includes("assigned");

  return isAssignedTraining;
}

function stationOfItem(item: OutletStaffWorkItem): StationFilter {
  const source = `${item.title} ${item.description} ${item.inboxGroup}`.toLowerCase();

  if (
    source.includes("rework") ||
    source.includes("proof") ||
    source.includes("corrective") ||
    source.includes("review") ||
    source.includes("approval") ||
    source.includes("follow-up") ||
    source.includes("issue")
  ) return "Manager";

  if (source.includes("cashier") || source.includes("customer") || source.includes("grab") || source.includes("front") || source.includes("service")) return "Front";
  if (source.includes("manager")) return "Manager";
  if (source.includes("kitchen") || source.includes("grill") || source.includes("fryer") || source.includes("prep") || source.includes("food") || source.includes("storage")) return "Kitchen";

  return "All";
}

function itemRailClass(item: OutletStaffWorkItem) {
  if (isOverdue(item) || item.priority === "urgent") return "bg-red-500";
  if (item.type === "inspection") return "bg-amber-500";
  if (item.inboxGroup === "Training / SOP") return "bg-emerald-500";
  if (isWaitingReview(item)) return "bg-violet-500";
  return "bg-primary";
}

function itemDotClass(item: OutletStaffWorkItem) {
  return itemRailClass(item);
}

function itemBorderClass(item: OutletStaffWorkItem) {
  if (isOverdue(item) || item.priority === "urgent") return "border-red-500/60";
  if (item.type === "inspection") return "border-amber-500/50";
  if (item.inboxGroup === "Training / SOP") return "border-emerald-500/50";
  if (isWaitingReview(item)) return "border-violet-500/50";
  return "border-border";
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

function stationFromRole(role: string): StationFilter {
  const value = role.toLowerCase();

  if (value.includes("cashier") || value.includes("front") || value.includes("service") || value.includes("foh")) return "Front";
  if (value.includes("manager") || value.includes("leader") || value.includes("supervisor")) return "Manager";
  if (value.includes("kitchen") || value.includes("grill") || value.includes("fryer") || value.includes("packaging") || value.includes("chef")) return "Kitchen";

  return "All";
}

function buildShiftItems(rows: RuntimeRow[], outlet: string): ShiftItem[] {
  return rows
    .filter((row) => matchOutlet(row, outlet))
    .map((row) => {
      const start = detailValue(row, "Start Time") || detailValue(row, "Start") || detailValue(row, "Clock In") || "";
      const end = detailValue(row, "End Time") || detailValue(row, "End") || detailValue(row, "Clock Out") || "";
      const date = detailValue(row, "Date") || detailValue(row, "Shift Date") || detailValue(row, "Work Date") || row.createdAt || "";
      const role = detailValue(row, "Role") || detailValue(row, "Duty") || detailValue(row, "Position") || "Outlet Staff";

      return {
        id: row.id,
        title: row.title || "Shift",
        staff: detailValue(row, "Staff") || detailValue(row, "Staff Name") || row.title || "Staff",
        role,
        station: stationFromRole(role),
        branch: detailValue(row, "Branch") || detailValue(row, "Outlet") || outlet,
        date: normalizeDate(date),
        startTime: normalizeTime(start, "09:00"),
        endTime: normalizeTime(end, "18:00"),
        status: row.status || detailValue(row, "Status") || "Planned",
      };
    });
}

function summarizeShifts(shifts: ShiftItem[]): ShiftSummary {
  const kitchen = shifts.filter((shift) => shift.station === "Kitchen").length;
  const front = shifts.filter((shift) => shift.station === "Front").length;
  const manager = shifts.filter((shift) => shift.station === "Manager").length;

  return {
    total: shifts.length,
    kitchen,
    front,
    manager,
    support: Math.max(0, shifts.length - kitchen - front - manager),
  };
}

function sectionItems(items: OutletStaffWorkItem[], station: StationFilter) {
  if (station === "All") return items;

  return items.filter((item) => stationOfItem(item) === station);
}

function WorkCard({
  item,
  onOpen,
  compact = false,
  label,
}: {
  item: OutletStaffWorkItem;
  onOpen: (item: OutletStaffWorkItem) => void;
  compact?: boolean;
  label?: string;
}) {
  return (
    <button
      type="button"
      onClick={() => onOpen(item)}
      className={cn(
        "relative w-full overflow-hidden rounded-2xl border bg-card p-4 pl-5 text-left text-card-foreground transition hover:bg-muted/30",
        itemBorderClass(item),
        compact && "rounded-xl p-3 pl-4",
      )}
    >
      <span className={cn("absolute inset-y-0 left-0 w-1", itemRailClass(item))} />

      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          {label ? <div className="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</div> : null}
          <div className={cn("truncate font-semibold", compact && "text-sm")}>{item.title}</div>
          <div className="mt-1 line-clamp-2 text-sm text-muted-foreground">{item.description}</div>
        </div>
        <Badge variant={statusVariant(item)}>{isOverdue(item) ? "Overdue" : item.status}</Badge>
      </div>

      <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted-foreground">
        <span className="flex items-center gap-1 rounded-full border bg-background px-2 py-1">
          <span className={cn("h-2 w-2 rounded-full", itemDotClass(item))} />
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
    <div className="rounded-2xl border bg-card p-1">
      <div className="grid grid-cols-2 gap-1 sm:flex sm:overflow-x-auto">
        {tabs.map((tab) => (
          <Button
            key={tab.key}
            variant={activeTab === tab.key ? "secondary" : "ghost"}
            className="h-10 w-full gap-2 sm:w-auto sm:min-w-[92px] sm:shrink-0"
            onClick={() => onChange(tab.key)}
          >
            {tab.icon}
            <span>{tab.label}</span>
            {counts[tab.key] ? <span className="rounded-full bg-muted px-1.5 text-[10px]">{counts[tab.key]}</span> : null}
          </Button>
        ))}
      </div>
    </div>
  );
}


function StationFilterBar({
  value,
  onChange,
}: {
  value: StationFilter;
  onChange: (value: StationFilter) => void;
}) {
  const filters: Array<{ value: StationFilter; label: string }> = [
    { value: "All", label: "All" },
    { value: "Kitchen", label: "Kitchen" },
    { value: "Front", label: "Front" },
    { value: "Manager", label: "Manager" },
  ];

  return (
    <div className="min-w-0">
      <details className="relative sm:hidden">
        <summary className="flex h-10 list-none items-center justify-between rounded-xl border bg-card px-3 text-sm font-medium [&::-webkit-details-marker]:hidden">
          <span>Filter: {value}</span>
          <span className="text-muted-foreground">⌄</span>
        </summary>
        <div className="absolute right-0 top-11 z-30 w-44 rounded-xl border bg-popover p-1 shadow-xl">
          {filters.map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => onChange(item.value)}
              className={cn(
                "w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-muted",
                value === item.value && "bg-muted font-medium",
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
      </details>

      <div className="hidden flex-wrap gap-2 sm:flex">
        {filters.map((item) => (
          <Button
            key={item.value}
            size="sm"
            variant={value === item.value ? "secondary" : "outline"}
            onClick={() => onChange(item.value)}
          >
            {item.label}
          </Button>
        ))}
      </div>
    </div>
  );
}

function ShiftSummaryCard({ shifts }: { shifts: ShiftItem[] }) {
  const summary = summarizeShifts(shifts);

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <UsersRound className="h-4 w-4 text-primary" />
            Today Shift Summary
          </CardTitle>
          <Badge variant="outline">{summary.total} staff</Badge>
        </div>
      </CardHeader>
      <CardContent>
        {summary.total ? (
          <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
            {[
              ["Kitchen", summary.kitchen],
              ["Front", summary.front],
              ["Manager", summary.manager],
              ["Support", summary.support],
            ].map(([label, value]) => (
              <div key={label} className="rounded-xl border bg-background p-3">
                <div className="text-xs uppercase tracking-wide text-muted-foreground">{label}</div>
                <div className="mt-1 text-2xl font-semibold">{value}</div>
                <div className="text-xs text-muted-foreground">on duty</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed px-4 py-3 text-sm text-muted-foreground">
            No shift data connected for today.
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function RedLightCard({
  overdue,
  missed,
  waiting,
}: {
  overdue: OutletStaffWorkItem[];
  missed: OutletStaffWorkItem[];
  waiting: OutletStaffWorkItem[];
}) {
  const hasIssue = overdue.length || missed.length;

  return (
    <Card className={cn(hasIssue ? "border-red-500/60" : "border-primary/40")}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-3">
          <CardTitle className="flex items-center gap-2 text-base">
            {hasIssue ? <AlertCircle className="h-4 w-4 text-red-500" /> : <CheckCircle2 className="h-4 w-4 text-primary" />}
            Red Light
          </CardTitle>
          <Badge variant={hasIssue ? "destructive" : "outline"}>{hasIssue ? "Needs action" : "Clear"}</Badge>
        </div>
      </CardHeader>
      <CardContent className="grid grid-cols-3 gap-3">
        <div className="rounded-xl border bg-background p-3">
          <div className="text-2xl font-semibold">{overdue.length}</div>
          <div className="text-xs text-muted-foreground">Overdue</div>
        </div>
        <div className="rounded-xl border bg-background p-3">
          <div className="text-2xl font-semibold">{missed.length}</div>
          <div className="text-xs text-muted-foreground">Missed</div>
        </div>
        <div className="rounded-xl border bg-background p-3">
          <div className="text-2xl font-semibold">{waiting.length}</div>
          <div className="text-xs text-muted-foreground">Review</div>
        </div>
      </CardContent>
    </Card>
  );
}

function DoFirstCard({
  item,
  onOpen,
}: {
  item?: OutletStaffWorkItem;
  onOpen: (item: OutletStaffWorkItem) => void;
}) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <AlertCircle className="h-4 w-4 text-primary" />
            Do First
          </CardTitle>
          {item ? <Badge variant={statusVariant(item)}>{isOverdue(item) ? "High priority" : "Now"}</Badge> : null}
        </div>
      </CardHeader>
      <CardContent>
        {item ? (
          <WorkCard item={item} onOpen={onOpen} label={isOverdue(item) ? "Fix first" : "Start now"} />
        ) : (
          <div className="rounded-xl border border-dashed p-4 text-sm text-muted-foreground">Nothing urgent right now.</div>
        )}
      </CardContent>
    </Card>
  );
}


function NextUpCard({
  items,
  onOpen,
}: {
  items: OutletStaffWorkItem[];
  onOpen: (item: OutletStaffWorkItem) => void;
}) {
  return (
    <Card className="flex h-auto min-h-[240px] flex-col xl:h-[320px]">
      <CardHeader className="shrink-0 pb-3">
        <CardTitle className="text-base">Next Up</CardTitle>
        <p className="text-sm text-muted-foreground">The next few things staff should prepare for.</p>
      </CardHeader>
      <CardContent className="max-h-none min-h-0 flex-1 space-y-2 overflow-visible pr-1 xl:max-h-[240px] xl:overflow-y-auto xl:[scrollbar-width:none] xl:[&::-webkit-scrollbar]:hidden">
        {!items.length ? (
          <div className="rounded-xl border border-dashed px-4 py-3 text-sm text-muted-foreground">No upcoming task after current item.</div>
        ) : items.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onOpen(item)}
            className="flex w-full items-center justify-between gap-3 rounded-xl border bg-card px-3 py-2 text-left hover:bg-muted/30"
          >
            <div className="min-w-0">
              <div className="truncate text-sm font-medium">{item.title}</div>
              <div className="text-xs text-muted-foreground">{item.startTime} · {item.inboxGroup}</div>
            </div>
            <Badge variant={statusVariant(item)}>{isOverdue(item) ? "Overdue" : item.status}</Badge>
          </button>
        ))}
      </CardContent>
    </Card>
  );
}


function InboxSummaryCard({
  items,
  onOpen,
}: {
  items: OutletStaffWorkItem[];
  onOpen: (item: OutletStaffWorkItem) => void;
}) {
  return (
    <Card className="flex h-auto min-h-[240px] flex-col xl:h-[320px]">
      <CardHeader className="shrink-0 pb-3">
        <div className="flex items-center justify-between gap-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Inbox className="h-4 w-4 text-primary" />
            Management Inbox
          </CardTitle>
          <Badge variant="outline">{items.length}</Badge>
        </div>
        <p className="text-sm text-muted-foreground">Messages, complaints, rework, and review items.</p>
      </CardHeader>
      <CardContent className="max-h-none min-h-0 flex-1 space-y-2 overflow-visible pr-1 xl:max-h-[240px] xl:overflow-y-auto xl:[scrollbar-width:none] xl:[&::-webkit-scrollbar]:hidden">
        {!items.length ? (
          <div className="rounded-xl border border-dashed p-4 text-sm text-muted-foreground">No urgent management message now.</div>
        ) : items.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onOpen(item)}
            className="relative w-full overflow-hidden rounded-xl border bg-card p-3 pl-4 text-left hover:bg-muted/30"
          >
            <span className={cn("absolute inset-y-0 left-0 w-1", itemRailClass(item))} />
            <div className="flex items-center justify-between gap-2">
              <div className="truncate text-sm font-medium">{item.title}</div>
              <Badge variant={statusVariant(item)}>{isOverdue(item) ? "Overdue" : item.status}</Badge>
            </div>
            <div className="mt-1 truncate text-xs text-muted-foreground">{item.inboxGroup} · {item.startTime}</div>
          </button>
        ))}
      </CardContent>
    </Card>
  );
}


function CompactTimeline({
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

  const usedHours = todayItems
    .map((item) => Number(item.startTime.slice(0, 2)))
    .filter((hour) => !Number.isNaN(hour));

  const shiftHours = todayShifts.flatMap((shift) => {
    const startHour = Number(shift.startTime.slice(0, 2));
    const endHour = Number(shift.endTime.slice(0, 2));

    if (Number.isNaN(startHour) || Number.isNaN(endHour)) return [];

    return Array.from({ length: Math.max(1, endHour - startHour) }).map((_, index) => startHour + index);
  });

  const hours = Array.from(new Set([...usedHours, ...shiftHours]))
    .filter((hour) => hour >= 6 && hour <= 23)
    .sort((a, b) => a - b);

  const visibleHours = hours.length ? hours : [9, 12, 15, 18];

  return (
    <Card className="flex h-auto min-h-[240px] flex-col xl:h-[320px]">
      <CardHeader className="shrink-0 pb-3">
        <div className="flex items-center justify-between gap-3">
          <div>
            <CardTitle className="flex items-center gap-2 text-base">
              <Clock3 className="h-4 w-4 text-primary" />
              Today Timeline
            </CardTitle>
            <p className="text-sm text-muted-foreground">Only useful time blocks, not empty 00:00 walls.</p>
          </div>
          <Badge variant="outline">{todayItems.length} items</Badge>
        </div>
      </CardHeader>

      <CardContent className="max-h-none min-h-0 flex-1 space-y-2 overflow-visible pr-1 xl:max-h-[240px] xl:overflow-y-auto xl:[scrollbar-width:none] xl:[&::-webkit-scrollbar]:hidden">
        {visibleHours.map((hour) => {
          const label = `${String(hour).padStart(2, "0")}:00`;
          const slotItems = todayItems.filter((item) => Number(item.startTime.slice(0, 2)) === hour);
          const slotShifts = todayShifts.filter((shift) => {
            const startHour = Number(shift.startTime.slice(0, 2));
            const endHour = Number(shift.endTime.slice(0, 2));
            return hour >= startHour && hour < endHour;
          });

          return (
            <div key={hour} className="grid grid-cols-[68px_1fr] gap-3 border-b py-2 last:border-b-0">
              <div className="text-xs font-medium text-muted-foreground">{label}</div>

              <div className="space-y-2">
                {slotShifts.length ? (
                  <div className="rounded-lg border border-dashed bg-muted/20 px-3 py-1 text-xs text-muted-foreground">
                    Shift · {slotShifts.length} staff on duty
                  </div>
                ) : null}

                {!slotItems.length && !slotShifts.length ? (
                  <div className="h-6 rounded-lg bg-muted/10" />
                ) : null}

                {slotItems.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onOpen(item)}
                    className={cn("relative w-full overflow-hidden rounded-xl border bg-card p-3 pl-4 text-left hover:bg-muted/30", itemBorderClass(item))}
                  >
                    <span className={cn("absolute inset-y-0 left-0 w-1", itemRailClass(item))} />
                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <div className="truncate text-sm font-medium">{item.title}</div>
                        <div className="truncate text-xs text-muted-foreground">{item.inboxGroup} · {item.description}</div>
                      </div>
                      <Badge variant={statusVariant(item)}>{isOverdue(item) ? "Overdue" : item.status}</Badge>
                    </div>
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

function TodayHome({
  workItems,
  shifts,
  station,
  onOpen,
}: {
  workItems: OutletStaffWorkItem[];
  shifts: ShiftItem[];
  station: StationFilter;
  onOpen: (item: OutletStaffWorkItem) => void;
}) {
  const today = todayISO();
  const surfaced = sectionItems(workItems, station).filter((item) => item.inboxGroup !== "Training / SOP" || shouldSurfaceTraining(item));
  const todayItems = surfaced.filter((item) => item.date === today);
  const overdue = surfaced.filter(isOverdue);
  const missed = overdue.filter((item) => item.proofRequired);
  const waiting = surfaced.filter(isWaitingReview);

  const now = todayItems.filter(isNow);
  const next = todayItems
    .filter((item) => !isOverdue(item) && !isNow(item) && !isWaitingReview(item) && !isDone(item))
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  const doFirst = overdue[0] || now[0] || next[0];
  const inboxPreview = [...overdue, ...waiting];

  const stationGroups = (["Kitchen", "Front", "Manager"] as StationFilter[]).map((group) => ({
    group,
    items: sectionItems(workItems, group)
      .filter((item) => item.inboxGroup !== "Training / SOP" || shouldSurfaceTraining(item))
      .filter((item) => item.date === today || isOverdue(item))
      .slice(0, 8),
  }));

  const activeMobileQueue = stationGroups
    .flatMap(({ group, items }) => items.map((item) => ({ group, item })))
    .slice(0, 8);

  return (
    <div className="space-y-4">
      <div className="grid min-w-0 items-stretch gap-3 md:grid-cols-2 md:gap-4 xl:grid-cols-[1.1fr_0.8fr_1fr]">
        <ShiftSummaryCard shifts={shifts.filter((shift) => shift.date === today)} />
        <RedLightCard overdue={overdue} missed={missed} waiting={waiting} />
        <DoFirstCard item={doFirst} onOpen={onOpen} />
      </div>

      <div className="grid min-w-0 items-stretch gap-3 md:gap-4 lg:grid-cols-2 xl:grid-cols-[0.9fr_1.2fr_0.9fr]">
        <NextUpCard items={next} onOpen={onOpen} />
        <CompactTimeline items={surfaced} shifts={shifts} onOpen={onOpen} />
        <InboxSummaryCard items={inboxPreview} onOpen={onOpen} />
      </div>

      <Card className="block md:hidden">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <CardTitle className="text-base">Active Queue</CardTitle>
              <p className="text-sm text-muted-foreground">Mobile shows only active station work.</p>
            </div>
            <Badge variant="outline">{activeMobileQueue.length}</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          {!activeMobileQueue.length ? (
            <div className="rounded-xl border border-dashed px-4 py-3 text-sm text-muted-foreground">
              No active station queue.
            </div>
          ) : activeMobileQueue.map(({ group, item }) => (
            <button
              key={`${group}-${item.id}`}
              type="button"
              onClick={() => onOpen(item)}
              className="relative w-full overflow-hidden rounded-xl border bg-card p-3 pl-4 text-left hover:bg-muted/30"
            >
              <span className={cn("absolute inset-y-0 left-0 w-1", itemRailClass(item))} />
              <div className="flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <div className="truncate text-sm font-medium">{item.title}</div>
                  <div className="truncate text-xs text-muted-foreground">
                    {group} · {item.startTime} · {item.inboxGroup}
                  </div>
                </div>
                <Badge variant={statusVariant(item)}>{isOverdue(item) ? "Overdue" : item.status}</Badge>
              </div>
            </button>
          ))}
        </CardContent>
      </Card>

      <Card className="hidden max-h-[380px] overflow-hidden md:block">
        <CardHeader className="shrink-0 pb-3">
          <div className="flex items-center justify-between gap-3">
            <div>
              <CardTitle className="text-base">Station Queue</CardTitle>
              <p className="text-sm text-muted-foreground">Kitchen / Front / Manager work stays separated so staff do not see irrelevant tasks.</p>
            </div>
            <Badge variant="outline">{station}</Badge>
          </div>
        </CardHeader>

        <CardContent className="grid max-h-[290px] items-start gap-3 overflow-y-auto pr-1 [scrollbar-width:none] md:grid-cols-2 xl:grid-cols-3 [&::-webkit-scrollbar]:hidden">
          {stationGroups.map(({ group, items }) => (
            <div key={group} className="max-h-[250px] overflow-y-auto rounded-2xl border bg-background p-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <div className="mb-2 flex items-center justify-between">
                <div className="font-medium">{group}</div>
                <Badge variant="outline">{items.length}</Badge>
              </div>
              <div className="space-y-2">
                {!items.length ? (
                  <div className="rounded-xl border border-dashed px-3 py-2 text-xs text-muted-foreground">No active queue.</div>
                ) : items.map((item) => (
                  <button key={item.id} type="button" onClick={() => onOpen(item)} className="w-full rounded-xl border bg-card px-3 py-2 text-left hover:bg-muted/30">
                    <div className="truncate text-sm font-medium">{item.title}</div>
                    <div className="text-xs text-muted-foreground">{item.startTime} · {item.inboxGroup}</div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

function CalendarView({
  workItems,
  shifts,
  onOpen,
}: {
  workItems: OutletStaffWorkItem[];
  shifts: ShiftItem[];
  onOpen: (item: OutletStaffWorkItem) => void;
}) {
  const [selectedDate, setSelectedDate] = useState(todayISO());
  const selected = new Date(`${selectedDate}T00:00:00`);
  const year = selected.getFullYear();
  const month = selected.getMonth();
  const monthLabel = new Date(year, month, 1).toLocaleString(undefined, { month: "long", year: "numeric" });

  const firstOfMonth = new Date(year, month, 1);
  const startOfGrid = new Date(firstOfMonth);
  startOfGrid.setDate(firstOfMonth.getDate() - firstOfMonth.getDay());

  const calendarDays = Array.from({ length: 42 }).map((_, index) => {
    const date = new Date(startOfGrid);
    date.setDate(startOfGrid.getDate() + index);

    return {
      date,
      iso: date.toISOString().slice(0, 10),
      day: date.getDate(),
      isCurrentMonth: date.getMonth() === month,
    };
  });

  const calendarItems = workItems.filter((item) => item.inboxGroup !== "Training / SOP" || shouldSurfaceTraining(item));
  const itemsByDate = (date: string) => calendarItems.filter((item) => item.date === date);
  const shiftsByDate = (date: string) => shifts.filter((shift) => shift.date === date);
  const selectedItems = itemsByDate(selectedDate);
  const selectedShifts = shiftsByDate(selectedDate);
  const selectedSummary = summarizeShifts(selectedShifts);

  return (
    <div className="grid min-w-0 items-stretch gap-4 lg:grid-cols-[1.2fr_0.8fr]">
      <Card className="flex h-full min-h-[720px] flex-col">
        <CardHeader className="shrink-0 pb-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <CardTitle className="flex items-center gap-2 text-base">
                <CalendarDays className="h-4 w-4 text-primary" />
                Outlet Calendar
              </CardTitle>
              <p className="text-sm text-muted-foreground">Planning and awareness. Red means missed or overdue.</p>
            </div>
            <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
              {[
                ["Task", "bg-primary"],
                ["Inspection", "bg-amber-500"],
                ["Complaint / Rework", "bg-red-500"],
                ["Training", "bg-emerald-500"],
              ].map(([label, color]) => (
                <span key={label} className="flex items-center gap-1 rounded-full border px-2 py-1">
                  <span className={cn("h-2 w-2 rounded-full", color)} />
                  {label}
                </span>
              ))}
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex min-h-0 flex-1 flex-col">
          <div className="mb-3 font-medium">{monthLabel}</div>

          <div className="grid grid-cols-7 gap-1 text-center text-xs text-muted-foreground">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => <div key={day} className="py-1">{day}</div>)}
          </div>

          <div className="grid flex-1 grid-cols-7 grid-rows-6 gap-1">
            {calendarDays.map((day) => {
              const dayItems = itemsByDate(day.iso);
              const dayShifts = shiftsByDate(day.iso);
              const hasRed = dayItems.some(isOverdue);

              return (
                <button
                  key={day.iso}
                  type="button"
                  onClick={() => setSelectedDate(day.iso)}
                  className={cn(
                    "min-h-[72px] rounded-xl border bg-card p-2 text-left transition hover:bg-muted/30 md:min-h-[92px]",
                    selectedDate === day.iso && "border-primary ring-1 ring-primary/30",
                    !day.isCurrentMonth && "opacity-40",
                    dayShifts.length && "bg-muted/20",
                    hasRed && "border-red-500/70 ring-1 ring-red-500/20",
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{day.day}</span>
                    {dayShifts.length ? <span className="text-[10px] text-muted-foreground">{dayShifts.length} staff</span> : null}
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {dayItems.slice(0, 5).map((item) => (
                      <span key={item.id} className={cn("h-2 w-2 rounded-full", itemDotClass(item))} />
                    ))}
                  </div>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <div className="grid min-h-[720px] min-w-0 grid-rows-[auto_minmax(0,1fr)] gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">{selectedDate}</CardTitle>
            <p className="text-sm text-muted-foreground">Day summary before staff open task details.</p>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {[
              ["Staff", selectedSummary.total],
              ["Kitchen", selectedSummary.kitchen],
              ["Front", selectedSummary.front],
              ["Manager", selectedSummary.manager],
            ].map(([label, value]) => (
              <div key={label} className="rounded-xl border bg-background p-3">
                <div className="text-xl font-semibold">{value}</div>
                <div className="text-xs text-muted-foreground">{label}</div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="flex min-h-0 flex-col">
          <CardHeader className="shrink-0 pb-3">
            <CardTitle className="text-base">Scheduled Work</CardTitle>
            <p className="text-sm text-muted-foreground">{selectedItems.length} item(s)</p>
          </CardHeader>
          <CardContent className="min-h-0 flex-1 space-y-3 overflow-y-auto pr-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {!selectedItems.length ? (
              <div className="rounded-xl border border-dashed p-4 text-sm text-muted-foreground">No timed work on this day.</div>
            ) : selectedItems.map((item) => (
              <WorkCard key={item.id} item={item} onOpen={onOpen} compact />
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
    <div className="space-y-3">
      {groups.map((group) => {
        const groupItems = items.filter((item) => item.inboxGroup === group);

        return (
          <Card key={group}>
            <CardHeader className="border-b py-3">
              <div className="flex items-center justify-between gap-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  {group.includes("Complaint") ? <ShieldAlert className="h-4 w-4 text-red-500" /> : group.includes("Rework") ? <UploadCloud className="h-4 w-4 text-violet-500" /> : <MessageSquare className="h-4 w-4 text-primary" />}
                  {group}
                </CardTitle>
                <Badge variant="outline">{groupItems.length}</Badge>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {!groupItems.length ? (
                <div className="p-4 text-sm text-muted-foreground">Nothing here.</div>
              ) : groupItems.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onOpen(item)}
                  className="grid w-full gap-3 border-b px-4 py-3 text-left last:border-b-0 hover:bg-muted/30 md:grid-cols-[minmax(0,1fr)_120px_110px_110px] md:items-center xl:grid-cols-[minmax(0,1fr)_160px_140px_120px]"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={cn("h-2 w-2 rounded-full", itemDotClass(item))} />
                      <span className="truncate font-medium">{item.title}</span>
                    </div>
                    <div className="mt-1 truncate text-sm text-muted-foreground">{item.description}</div>
                  </div>
                  <div className="text-sm text-muted-foreground md:block">{item.sourceRecordId}</div>
                  <Badge variant={statusVariant(item)}>{isOverdue(item) ? "Overdue" : item.status}</Badge>
                  <span className="inline-flex h-9 w-full items-center justify-center rounded-md bg-secondary px-3 text-sm font-medium text-secondary-foreground md:w-auto">
                    {item.primaryAction}
                  </span>
                </button>
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
      title: "No SOP selected",
      body: "Choose a document from the left list. If there is only one assigned SOP, it will open automatically.",
      type: "text",
    }];
  }

  const pages: SopReaderPage[] = [];

  if (item.contentJson) {
    try {
      const parsed = JSON.parse(item.contentJson);
      const parsedPages: ParsedSopContentPage[] = Array.isArray(parsed?.pages) ? parsed.pages : [];

      parsedPages.forEach((page, pageIndex) => {
        pages.push({
          id: String(page.id || `page-${pageIndex}`),
          title: page.title || `Page ${pageIndex + 1}`,
          body: Array.isArray(page.blocks)
            ? page.blocks
                .map((block) => {
                  if (block.checklistItems?.length) return `${block.title || "Checklist"}\n${block.checklistItems.map((check) => `• ${check}`).join("\n")}`;
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
      title: item.title,
      body: item.description || "Read this SOP carefully before acknowledging.",
      type: "text",
    });
  }

  if (item.mediaUrl) {
    pages.push({
      id: "media",
      title: "Training Media",
      body: "Watch the media before continuing.",
      type: "media",
      asset: item.mediaUrl,
    });
  }

  if (item.pdfUrl) {
    pages.push({
      id: "pdf",
      title: "PDF Document",
      body: "Read the attached PDF like a handbook.",
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
  const safePage = Math.min(page, pages.length - 1);
  const active = pages[safePage] || pages[0];
  const progress = Math.round(((safePage + 1) / pages.length) * 100);

  function goPrevious() {
    setPage((value) => Math.max(0, value - 1));
  }

  function goNext() {
    setPage((value) => Math.min(pages.length - 1, value + 1));
  }

  function renderPageBody() {
    if (active.type === "media" && active.asset) {
      return <UploadAssetPreview value={active.asset} label="Training Media" />;
    }

    if (active.type === "pdf" && active.asset) {
      return <UploadAssetPreview value={active.asset} label="PDF Document" />;
    }

    if (active.type === "checklist") {
      return (
        <div className="space-y-3">
          {(active.checklist || []).map((check) => (
            <div key={check} className="rounded-2xl border bg-card px-4 py-3 text-sm">
              {check}
            </div>
          ))}
          <p className="pt-2 text-sm leading-7 text-muted-foreground">{active.body}</p>
        </div>
      );
    }

    return (
      <div className="whitespace-pre-wrap text-base leading-8 text-muted-foreground">
        {active.body}
      </div>
    );
  }

  return (
    <Card className={cn(
      "overflow-hidden border-0 bg-background shadow-none xl:min-h-[620px] xl:border xl:shadow-sm",
      fullscreen && "fixed inset-0 z-50 overflow-y-auto rounded-none bg-background shadow-2xl xl:inset-4 xl:rounded-2xl",
    )}>
      <div className="flex min-h-[100dvh] flex-col bg-background xl:hidden">
        <div className="sticky top-0 z-20 border-b bg-background/95 px-4 py-3 backdrop-blur">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                SOP Reader
              </div>
              <div className="truncate text-lg font-semibold">{item?.title || "SOP Reader"}</div>
              <div className="mt-1 text-xs text-muted-foreground">
                Page {safePage + 1} of {pages.length}
              </div>
            </div>
            {onClose ? (
              <Button size="sm" variant="outline" onClick={onClose}>
                Close
              </Button>
            ) : null}
          </div>

          <div className="mt-3 space-y-2">
            <select
              value={String(safePage)}
              onChange={(event) => setPage(Number(event.target.value))}
              className="h-10 w-full rounded-xl border bg-background px-3 text-sm"
            >
              {pages.map((readerPage, index) => (
                <option key={readerPage.id} value={String(index)}>
                  {index + 1}. {readerPage.title}
                </option>
              ))}
            </select>

            <div className="h-1.5 overflow-hidden rounded-full bg-muted">
              <div className="h-full rounded-full bg-primary" style={{ width: `${progress}%` }} />
            </div>
          </div>
        </div>

        <main className="min-h-0 flex-1 overflow-y-auto px-5 py-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <article className="mx-auto max-w-[68ch]">
            <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Page {safePage + 1}
            </div>
            <h1 className="mt-2 text-2xl font-semibold leading-tight tracking-tight">
              {active.title}
            </h1>
            <div className="mt-6">
              {renderPageBody()}
            </div>
          </article>
        </main>

        <div className="sticky bottom-0 z-20 border-t bg-background/95 px-4 py-3 backdrop-blur">
          <div className="flex gap-2">
            <Button className="flex-1" variant="outline" disabled={safePage === 0} onClick={goPrevious}>
              Previous
            </Button>
            {safePage === pages.length - 1 ? (
              <Button className="flex-1">
                Mark understood
              </Button>
            ) : (
              <Button className="flex-1" onClick={goNext}>
                Next
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="hidden xl:block">
        <CardHeader className="border-b">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <CardTitle className="text-xl">{item?.title || "SOP Reader"}</CardTitle>
              <p className="text-sm text-muted-foreground">Read like a handbook. SOP library stays separate from daily timeline unless assigned.</p>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => setFullscreen((value) => !value)}>
                {fullscreen ? "Exit" : "Full Screen"}
              </Button>
              {onClose ? <Button size="sm" variant="ghost" onClick={onClose}>Close</Button> : null}
            </div>
          </div>
        </CardHeader>

        <CardContent className="grid min-w-0 gap-0 p-0 xl:grid-cols-[240px_minmax(0,1fr)_220px]">
          <aside className="border-b p-4 xl:border-b-0 xl:border-r">
            <div className="mb-3 text-xs font-medium uppercase text-muted-foreground">Pages</div>
            <div className="space-y-1">
              {pages.map((readerPage, index) => (
                <button
                  key={readerPage.id}
                  type="button"
                  onClick={() => setPage(index)}
                  className={cn("w-full rounded-xl px-3 py-2 text-left text-sm hover:bg-muted", safePage === index && "bg-muted font-medium")}
                >
                  {index + 1}. {readerPage.title}
                </button>
              ))}
            </div>
          </aside>

          <main className="mx-auto w-full min-w-0 max-w-4xl p-4 md:p-6">
            <div className="mb-3 text-xs font-medium uppercase text-muted-foreground">
              Page {safePage + 1} of {pages.length}
            </div>
            <h2 className="text-3xl font-semibold tracking-tight">{active.title}</h2>

            <div className="mt-5">
              {renderPageBody()}
            </div>

            <div className="mt-8 flex items-center justify-between border-t pt-4">
              <Button variant="outline" disabled={safePage === 0} onClick={goPrevious}>Previous</Button>
              {safePage === pages.length - 1 ? (
                <Button>Mark as understood</Button>
              ) : (
                <Button onClick={goNext}>Next</Button>
              )}
            </div>
          </main>

          <aside className="border-t p-4 xl:border-l xl:border-t-0">
            <div className="mb-3 text-xs font-medium uppercase text-muted-foreground">Progress</div>
            <div className="text-2xl font-semibold">{progress}%</div>
            <p className="mt-2 text-sm text-muted-foreground">Acknowledge only at the end.</p>
          </aside>
        </CardContent>
      </div>
    </Card>
  );
}

function SopView({
  items,
  selected,
  onSelect,
  onOpenReader,
}: {
  items: OutletStaffWorkItem[];
  selected?: OutletStaffWorkItem;
  onSelect: (item: OutletStaffWorkItem | undefined) => void;
  onOpenReader: (item: OutletStaffWorkItem) => void;
}) {
  const activeSop = selected || items[0];

  return (
    <>
      <div className="xl:hidden">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <BookOpen className="h-4 w-4 text-primary" />
              SOP Library
            </CardTitle>
            <p className="text-sm text-muted-foreground">Tap one document to enter focused reading mode.</p>
          </CardHeader>
          <CardContent className="space-y-3">
            {!items.length ? (
              <div className="rounded-xl border border-dashed p-4 text-sm text-muted-foreground">No SOP assigned.</div>
            ) : items.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  onSelect(item);
                  onOpenReader(item);
                }}
                className="w-full rounded-xl border bg-card p-4 text-left hover:bg-muted/30"
              >
                <div className="font-medium">{item.title}</div>
                <div className="mt-1 text-xs text-muted-foreground">{item.description}</div>
                <div className="mt-3 text-sm font-medium text-primary">Read SOP</div>
              </button>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="hidden min-w-0 gap-4 xl:grid xl:grid-cols-[360px_minmax(0,1fr)]">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <BookOpen className="h-4 w-4 text-primary" />
              SOP Library
            </CardTitle>
            <p className="text-sm text-muted-foreground">Long-term SOPs stay here. Only assigned training appears in Today.</p>
          </CardHeader>
          <CardContent className="space-y-3">
            {!items.length ? (
              <div className="rounded-xl border border-dashed p-4 text-sm text-muted-foreground">No SOP assigned.</div>
            ) : items.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelect(item)}
                className={cn("w-full rounded-xl border bg-card p-3 text-left hover:bg-muted/30", activeSop?.id === item.id && "border-primary bg-muted/30")}
              >
                <div className="font-medium">{item.title}</div>
                <div className="text-xs text-muted-foreground">{item.description}</div>
              </button>
            ))}
          </CardContent>
        </Card>

        <SopReader item={activeSop} />
      </div>
    </>
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

  const isReader = item.type === "sop" || item.type === "training";

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-background/70 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className={cn(
          "w-full overflow-hidden rounded-none border bg-background shadow-2xl sm:rounded-2xl",
          isReader ? "h-[100dvh] max-w-7xl sm:h-auto sm:max-h-[92dvh]" : "h-[100dvh] max-w-4xl sm:h-auto sm:max-h-[86dvh]",
        )}
        onClick={(event) => event.stopPropagation()}
      >
        {isReader ? (
          <div className="h-[100dvh] overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:h-auto sm:max-h-[92dvh]">
            <SopReader item={item} onClose={onClose} />
          </div>
        ) : (
          <Card className="border-0 shadow-none">
            <CardHeader className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-xs font-medium uppercase text-muted-foreground">{item.inboxGroup}</div>
                  <CardTitle className="truncate text-xl">{item.title}</CardTitle>
                  <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <Badge variant={statusVariant(item)}>{isOverdue(item) ? "Overdue" : item.status}</Badge>
                  
                </div>
              </div>
            </CardHeader>

            <CardContent className="max-h-[calc(100dvh-96px)] space-y-4 overflow-y-auto p-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:max-h-[calc(86dvh-96px)] sm:p-5">
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

              <div className="rounded-2xl border bg-card p-4">
                <div className="font-medium">Work Detail</div>
                <div className="mt-2 whitespace-pre-wrap text-sm leading-7 text-muted-foreground">
                  {item.description || "No extra detail provided."}
                </div>
              </div>

              {item.proofRequired ? (
                <div className="rounded-2xl border bg-card p-4">
                  <div className="font-medium">Upload photo / video proof</div>
                  <Input
                    className="mt-3"
                    type="file"
                    accept="image/*,video/*"
                    onChange={async (event) => {
                      const file = event.target.files?.[0];
                      if (!file) return;

                      const uploadScope: "task" | "inspection" | "incident" =
                        item.sourceModule === "issues" ? "incident" :
                        item.sourceModule === "inspection" ? "inspection" :
                        "task";

                      const asset = await uploadLocalPreviewAsset(file, uploadScope);
                      const serialized = serializeUploadAsset(asset);
                      setProofAsset(serialized);
                      setProofName(uploadAssetLabel(serialized));
                    }}
                  />
                  {proofName ? <div className="mt-2 text-xs text-muted-foreground">Selected: {proofName}</div> : null}
                  {proofAsset ? <div className="mt-3"><UploadAssetPreview value={proofAsset} compact /></div> : null}
                </div>
              ) : null}

              <div className="sticky bottom-0 -mx-4 flex flex-col gap-2 border-t bg-background/95 px-4 py-4 backdrop-blur sm:-mx-5 sm:flex-row sm:flex-wrap sm:px-5">
                <Button
                  className="w-full sm:w-auto"
                  disabled={item.proofRequired && !proofAsset}
                  onClick={async () => {
                    if (proofAsset) await onSubmitProof(item, proofAsset);
                  }}
                >
                  {item.proofRequired ? "Submit Proof" : isOverdue(item) ? "Fix and submit" : item.primaryAction}
                </Button>
                <Button className="w-full sm:w-auto" variant="outline">Save progress</Button>
                <Button className="w-full sm:w-auto" variant="ghost" onClick={onClose}>Cancel</Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
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
  const [station, setStation] = useState<StationFilter>("All");
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

  const allWorkItems = useMemo(() => {
    const items = buildOutletStaffWorkItems(filteredRuntimeRows);
    const search = query.trim().toLowerCase();

    if (!search) return items;

    return items.filter((item) => `${item.title} ${item.description} ${item.status} ${item.inboxGroup}`.toLowerCase().includes(search));
  }, [filteredRuntimeRows, query]);

  const workItems = useMemo(() => sectionItems(allWorkItems, station), [allWorkItems, station]);
  const shiftItems = useMemo(() => buildShiftItems(scheduleRows, selectedOutlet), [scheduleRows, selectedOutlet]);
  const inboxItems = getOutletInboxItems(workItems);
  const trainingItems = getOutletTrainingItems(allWorkItems);
  const surfacedTodayItems = workItems.filter((item) => item.inboxGroup !== "Training / SOP" || shouldSurfaceTraining(item));

  const counts: Record<StaffTab, number> = {
    today: surfacedTodayItems.filter((item) => item.date === todayISO() || isOverdue(item)).length,
    calendar: surfacedTodayItems.length,
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

    let nextDetails = upsertDetail(source.detailItems, "Last Proof Asset", asset);

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
      <div className="min-w-0 space-y-4 p-3 pb-24 sm:p-4 md:space-y-5 md:p-6">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Outlet Staff App</p>
            <div>
              <h1 className="text-3xl font-semibold tracking-tight">Today Home</h1>
              <p className="max-w-3xl text-muted-foreground">
                Staff-first view for shift, red light, do-first task, station queues, inbox, calendar, and SOP reading.
              </p>
            </div>
          </div>

          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:flex-wrap">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input className="w-full pl-9 sm:w-[260px]" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search work..." />
            </div>

            <Select value={selectedOutlet} onValueChange={setSelectedOutlet}>
              <SelectTrigger className="w-full sm:w-[190px]">
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

        <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <StaffTabs activeTab={activeTab} onChange={(tab) => {
            setActiveTab(tab);
            setSelectedItem(undefined);
          }} counts={counts} />

          <StationFilterBar value={station} onChange={setStation} />
        </div>

        {selectedItem ? (
          <WorkItemSheet item={selectedItem} onClose={() => setSelectedItem(undefined)} onSubmitProof={submitStaffProof} />
        ) : null}

        {activeTab === "today" ? <TodayHome workItems={workItems} shifts={shiftItems} station={station} onOpen={setSelectedItem} /> : null}
        {activeTab === "calendar" ? <CalendarView workItems={workItems} shifts={shiftItems} onOpen={setSelectedItem} /> : null}
        {activeTab === "inbox" ? <InboxView items={inboxItems} onOpen={setSelectedItem} /> : null}
        {activeTab === "sop" ? <SopView items={trainingItems} selected={selectedSop} onSelect={setSelectedSop} onOpenReader={setSelectedItem} /> : null}
      </div>
    </ErpShell>
  );
}
