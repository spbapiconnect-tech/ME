"use client";

import { useEffect, useMemo, useState } from "react";
import { CalendarDays, Camera, CheckCircle2, Clock, Store, Trash2 } from "lucide-react";

import { ErpShell } from "@/components/erp";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useMeRuntimeStore } from "@/stores/me-runtime";

type TaskForm = {
  title: string;
  taskType: string;
  dueDate: string;
  dueTime: string;
  triggerType: string;
  repeatRule: string;
  checklist: string;
  completionStandard: string;
  photoRequired: string;
  note: string;
  outlets: string[];
};

const taskTypes = ["Opening Check", "Closing Check", "Cleaning", "Food Safety", "Stock Count", "Equipment", "Manager Follow-up"];
const triggerTypes = ["Manual", "Daily Opening", "Daily Closing", "Before Expiry", "After Issue", "After Inspection", "Weekly Schedule"];
const repeatRules = ["Once", "Daily", "Weekdays", "Weekly", "Monthly"];

function todayIso() {
  return formatLocalDate(new Date());
}

function formatLocalDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function monthDays(anchor: Date) {
  const year = anchor.getFullYear();
  const month = anchor.getMonth();
  const first = new Date(year, month, 1);
  const start = new Date(first);
  start.setDate(first.getDate() - first.getDay());
  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(start);
    date.setDate(start.getDate() + index);
    return date;
  });
}

function detailValue(row: { detailItems?: Array<{ label: string; value: string }> }, label: string) {
  return row.detailItems?.find((item) => item.label === label)?.value ?? "";
}

function splitList(value: string) {
  return value.split(",").map((item) => item.trim()).filter(Boolean);
}

function completionTone(rate: number) {
  if (rate >= 1) return "bg-emerald-500";
  if (rate >= 0.6) return "bg-lime-500";
  if (rate > 0) return "bg-amber-500";
  return "bg-red-500";
}

export function TaskOperationsPage() {
  const hydrateFromFoundation = useMeRuntimeStore((state) => state.hydrateFromFoundation);
  const getRows = useMeRuntimeStore((state) => state.getRows);
  const createRecordWithPayload = useMeRuntimeStore((state) => state.createRecordWithPayload);
  const updateRecord = useMeRuntimeStore((state) => state.updateRecord);
  const deleteRecord = useMeRuntimeStore((state) => state.deleteRecord);
  const logAction = useMeRuntimeStore((state) => state.logAction);
  const syncStatus = useMeRuntimeStore((state) => state.syncStatus);
  const syncMessage = useMeRuntimeStore((state) => state.lastSyncMessage);

  const rows = getRows("tasks", []);
  const branchRows = getRows("branches", []);
  const outletOptions = useMemo(
    () =>
      branchRows.map((row) => {
        const code = detailValue(row, "Branch Code");
        return code ? `${code} · ${row.title}` : row.title;
      }),
    [branchRows],
  );
  const [selectedDate, setSelectedDate] = useState(todayIso());
  const [calendarAnchor, setCalendarAnchor] = useState(new Date());
  const [selectedId, setSelectedId] = useState<string | undefined>(rows[0]?.id);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState<TaskForm>({
    title: "",
    taskType: "Opening Check",
    dueDate: todayIso(),
    dueTime: "09:00",
    triggerType: "Daily Opening",
    repeatRule: "Once",
    checklist: "",
    completionStandard: "Upload clear outlet photo after completion.",
    photoRequired: "Required",
    note: "",
    outlets: [],
  });

  useEffect(() => {
    hydrateFromFoundation();
  }, [hydrateFromFoundation]);

  const days = useMemo(() => monthDays(calendarAnchor), [calendarAnchor]);
  const selectedRows = useMemo(
    () => rows.filter((row) => detailValue(row, "Due Date") === selectedDate),
    [rows, selectedDate],
  );
  const selected = rows.find((row) => row.id === selectedId) ?? selectedRows[0] ?? rows[0];

  const dayStats = useMemo(() => {
    const map = new Map<string, { total: number; done: number; count: number }>();
    rows.forEach((row) => {
      const date = detailValue(row, "Due Date");
      const outlets = splitList(detailValue(row, "Outlets"));
      const completed = splitList(detailValue(row, "Completed Outlets"));
      const current = map.get(date) ?? { total: 0, done: 0, count: 0 };
      current.total += outlets.length;
      current.done += completed.length;
      current.count += 1;
      map.set(date, current);
    });
    return map;
  }, [rows]);

  const todayRows = rows.filter((row) => detailValue(row, "Due Date") === todayIso());
  const outletExecutionTotal = rows.reduce((sum, row) => sum + splitList(detailValue(row, "Outlets")).length, 0);
  const outletDoneTotal = rows.reduce((sum, row) => sum + splitList(detailValue(row, "Completed Outlets")).length, 0);
  const proofPending = rows.reduce((sum, row) => {
    const outlets = splitList(detailValue(row, "Outlets"));
    const proofs = splitList(detailValue(row, "Photo Proofs"));
    return sum + Math.max(outlets.length - proofs.length, 0);
  }, 0);
  const completionRate = outletExecutionTotal ? Math.round((outletDoneTotal / outletExecutionTotal) * 100) : 0;

  function setOutlet(outlet: string, checked: boolean) {
    setForm((prev) => ({
      ...prev,
      outlets: checked ? [...prev.outlets, outlet] : prev.outlets.filter((item) => item !== outlet),
    }));
  }

  async function saveTask() {
    if (!form.title.trim() || !form.dueDate || !form.outlets.length) return;
    const dueAt = `${form.dueDate} ${form.dueTime}`;
    const created = await createRecordWithPayload("tasks", {
      title: form.title.trim(),
      subtitle: `${form.taskType} · ${form.outlets.length} outlet${form.outlets.length > 1 ? "s" : ""}`,
      status: "Open",
      owner: "Outlet Operations",
      detailItems: [
        { label: "Task Type", value: form.taskType },
        { label: "Outlets", value: form.outlets.join(", ") },
        { label: "Completed Outlets", value: "" },
        { label: "Photo Proofs", value: "" },
        { label: "Due Date", value: form.dueDate },
        { label: "Due Time", value: form.dueTime },
        { label: "Due At", value: dueAt },
        { label: "Time Trigger", value: form.triggerType },
        { label: "Repeat Rule", value: form.repeatRule },
        { label: "Photo Required", value: form.photoRequired },
        { label: "Checklist Items", value: form.checklist },
        { label: "Completion Standard", value: form.completionStandard },
      ],
      detailNote: form.note,
      nextAction: "Review Outlet Proof",
    });
    setSelectedDate(form.dueDate);
    setSelectedId(created.id);
    setDialogOpen(false);
    await logAction("tasks", "create-outlet-task", `Created outlet task: ${form.title}`);
  }

  async function markOutletDone(outlet: string) {
    if (!selected) return;
    const completed = new Set(splitList(detailValue(selected, "Completed Outlets")));
    completed.add(outlet);
    const outlets = splitList(detailValue(selected, "Outlets"));
    const nextDetails = (selected.detailItems ?? []).map((item) =>
      item.label === "Completed Outlets" ? { ...item, value: Array.from(completed).join(", ") } : item,
    );
    const nextStatus = completed.size >= outlets.length ? "Completed" : "In Progress";
    await updateRecord("tasks", selected.id, { status: nextStatus, detailItems: nextDetails });
    await logAction("tasks", "outlet-complete", `${outlet} completed ${selected.title}`);
  }

  async function attachPhoto(outlet: string, fileName: string) {
    if (!selected || !fileName) return;
    const proofs = new Set(splitList(detailValue(selected, "Photo Proofs")));
    proofs.add(`${outlet}: ${fileName}`);
    const nextDetails = (selected.detailItems ?? []).map((item) =>
      item.label === "Photo Proofs" ? { ...item, value: Array.from(proofs).join(", ") } : item,
    );
    await updateRecord("tasks", selected.id, { detailItems: nextDetails });
    await logAction("tasks", "photo-proof", `${outlet} uploaded proof for ${selected.title}`);
  }

  const selectedOutlets = selected ? splitList(detailValue(selected, "Outlets")) : [];
  const selectedCompleted = new Set(selected ? splitList(detailValue(selected, "Completed Outlets")) : []);
  const selectedProofs = selected ? splitList(detailValue(selected, "Photo Proofs")) : [];

  return (
    <ErpShell>
      <div className="space-y-5 pb-24 md:pb-6">
        <header className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Outlet Execution</h1>
            <p className="text-sm text-muted-foreground">Schedule outlet execution work, assign target outlets, track daily completion, and collect photo proof from store teams.</p>
          </div>
          <Button onClick={() => setDialogOpen(true)}>
            <Store className="h-4 w-4" />
            Schedule Outlet Execution
          </Button>
        </header>

        <section className="grid gap-3 md:grid-cols-4">
          {[
            ["Due Today", String(todayRows.length)],
            ["Outlet Executions", String(outletExecutionTotal)],
            ["Photo Proof Pending", String(proofPending)],
            ["Completion Rate", `${completionRate}%`],
          ].map(([label, value]) => (
            <Card key={label}>
              <CardHeader className="pb-1">
                <CardTitle className="text-xs font-medium text-muted-foreground">{label}</CardTitle>
              </CardHeader>
              <CardContent><p className="text-2xl font-semibold">{value}</p></CardContent>
            </Card>
          ))}
        </section>

        <section className="grid gap-4 xl:grid-cols-[360px_minmax(0,1fr)_420px]">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">Execution Calendar</CardTitle>
              <div className="flex gap-1">
                <Button variant="outline" size="sm" onClick={() => setCalendarAnchor(new Date(calendarAnchor.getFullYear(), calendarAnchor.getMonth() - 1, 1))}>Prev</Button>
                <Button variant="outline" size="sm" onClick={() => setCalendarAnchor(new Date(calendarAnchor.getFullYear(), calendarAnchor.getMonth() + 1, 1))}>Next</Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-medium">
                <CalendarDays className="h-4 w-4 text-primary" />
                {calendarAnchor.toLocaleDateString("en-MY", { month: "long", year: "numeric" })}
              </div>
              <div className="grid grid-cols-7 gap-1 text-center text-[11px] text-muted-foreground">
                {["S", "M", "T", "W", "T", "F", "S"].map((day, index) => <div key={`${day}-${index}`}>{day}</div>)}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {days.map((date) => {
                  const iso = formatLocalDate(date);
                  const stats = dayStats.get(iso);
                  const rate = stats?.total ? stats.done / stats.total : 0;
                  return (
                    <button
                      key={iso}
                      type="button"
                      onClick={() => setSelectedDate(iso)}
                      className={cn(
                        "min-h-12 rounded-md border p-1 text-left text-xs transition hover:border-primary",
                        iso === selectedDate && "border-primary bg-primary/10",
                        date.getMonth() !== calendarAnchor.getMonth() && "opacity-40",
                      )}
                    >
                      <span>{date.getDate()}</span>
                      {stats ? <span className={cn("mt-2 block h-1.5 rounded-full", completionTone(rate))} /> : null}
                    </button>
                  );
                })}
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                <span><i className="mr-1 inline-block h-2 w-2 rounded-full bg-red-500" />Not done</span>
                <span><i className="mr-1 inline-block h-2 w-2 rounded-full bg-amber-500" />Started</span>
                <span><i className="mr-1 inline-block h-2 w-2 rounded-full bg-lime-500" />Mostly done</span>
                <span><i className="mr-1 inline-block h-2 w-2 rounded-full bg-emerald-500" />Complete</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">{selectedDate} Outlet Work</CardTitle>
              <p className="text-sm text-muted-foreground">Outlet execution items scheduled for this day.</p>
            </CardHeader>
            <CardContent className="space-y-2">
              {selectedRows.length ? selectedRows.map((row) => {
                const outlets = splitList(detailValue(row, "Outlets"));
                const completed = splitList(detailValue(row, "Completed Outlets"));
                const rate = outlets.length ? completed.length / outlets.length : 0;
                return (
                  <button
                    key={row.id}
                    type="button"
                    onClick={() => setSelectedId(row.id)}
                    className={cn("w-full rounded-md border p-3 text-left transition hover:border-primary", selected?.id === row.id && "border-primary bg-primary/10")}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-medium">{row.title}</p>
                        <p className="text-xs text-muted-foreground">{detailValue(row, "Task Type")} · {detailValue(row, "Due At")}</p>
                      </div>
                      <Badge variant={row.status === "Completed" ? "outline" : "secondary"}>{row.status}</Badge>
                    </div>
                    <div className="mt-3 h-2 rounded-full bg-muted">
                      <div className={cn("h-2 rounded-full", completionTone(rate))} style={{ width: `${Math.round(rate * 100)}%` }} />
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground">{completed.length}/{outlets.length} outlets completed</p>
                  </button>
                );
              }) : (
                <div className="rounded-md border border-dashed p-6 text-sm text-muted-foreground">No outlet task scheduled for this day.</div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Outlet Execution Detail</CardTitle>
              <p className="text-sm text-muted-foreground">{selected?.title ?? "Select a task from the calendar day."}</p>
            </CardHeader>
            <CardContent className="space-y-4">
              {selected ? (
                <>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="rounded-md border p-2"><p className="text-xs text-muted-foreground">Trigger</p><p className="font-medium">{detailValue(selected, "Time Trigger")}</p></div>
                    <div className="rounded-md border p-2"><p className="text-xs text-muted-foreground">Repeat</p><p className="font-medium">{detailValue(selected, "Repeat Rule")}</p></div>
                    <div className="rounded-md border p-2"><p className="text-xs text-muted-foreground">Photo</p><p className="font-medium">{detailValue(selected, "Photo Required")}</p></div>
                    <div className="rounded-md border p-2"><p className="text-xs text-muted-foreground">Due</p><p className="font-medium">{detailValue(selected, "Due At")}</p></div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-semibold">Outlet Proof</p>
                    {selectedOutlets.map((outlet) => {
                      const done = selectedCompleted.has(outlet);
                      const proof = selectedProofs.find((item) => item.startsWith(`${outlet}:`));
                      return (
                        <div key={outlet} className="rounded-md border p-3">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="text-sm font-medium">{outlet}</p>
                              <p className="text-xs text-muted-foreground">{proof || "Photo proof not uploaded"}</p>
                            </div>
                            <Badge variant={done ? "outline" : "secondary"}>{done ? "Done" : "Pending"}</Badge>
                          </div>
                          <div className="mt-3 flex flex-wrap gap-2">
                            <Button variant="outline" size="sm" onClick={() => markOutletDone(outlet)} disabled={done}>
                              <CheckCircle2 className="h-4 w-4" />
                              Mark Done
                            </Button>
                            <Label className="inline-flex h-9 cursor-pointer items-center gap-2 rounded-md border px-3 text-sm">
                              <Camera className="h-4 w-4" />
                              Upload Photo
                              <Input className="hidden" type="file" accept="image/*" onChange={(event) => attachPhoto(outlet, event.target.files?.[0]?.name ?? "")} />
                            </Label>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="rounded-md border p-3 text-sm">
                    <p className="font-semibold">Checklist</p>
                    <p className="mt-1 whitespace-pre-wrap text-muted-foreground">{detailValue(selected, "Checklist Items") || "No checklist defined."}</p>
                  </div>

                  <Button variant="destructive" size="sm" onClick={() => deleteRecord("tasks", selected.id)}>
                    <Trash2 className="h-4 w-4" />
                    Delete Task
                  </Button>
                </>
              ) : (
                <div className="rounded-md border border-dashed p-6 text-sm text-muted-foreground">Create or select a task to review outlet execution.</div>
              )}
            </CardContent>
          </Card>
        </section>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[820px]">
          <DialogHeader>
            <DialogTitle>New Outlet Execution Task</DialogTitle>
            <DialogDescription>Select target outlets, schedule the trigger, and define photo proof requirements.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3 rounded-md border p-3 md:grid-cols-2">
              <div className="space-y-1.5 md:col-span-2">
                <Label>Task Title</Label>
                <Input value={form.title} onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))} placeholder="Opening food safety photo check" />
              </div>
              <div className="space-y-1.5">
                <Label>Task Type</Label>
                <Select value={form.taskType} onValueChange={(value) => setForm((prev) => ({ ...prev, taskType: value }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{taskTypes.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Photo Proof</Label>
                <Select value={form.photoRequired} onValueChange={(value) => setForm((prev) => ({ ...prev, photoRequired: value }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Required">Required</SelectItem>
                    <SelectItem value="Optional">Optional</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="rounded-md border p-3">
              <p className="text-sm font-semibold">Target Outlets</p>
              <div className="mt-3 grid gap-2 md:grid-cols-3">
                {outletOptions.map((outlet) => {
                  return (
                    <Label key={outlet} className="flex cursor-pointer items-center gap-2 rounded-md border p-2 text-sm">
                      <Checkbox checked={form.outlets.includes(outlet)} onCheckedChange={(checked) => setOutlet(outlet, Boolean(checked))} />
                      <span>{outlet}</span>
                    </Label>
                  );
                })}
                {!outletOptions.length ? (
                  <div className="rounded-md border border-dashed p-3 text-sm text-muted-foreground md:col-span-3">
                    No outlets registered yet. Add outlets in Branches first, then assign tasks here.
                  </div>
                ) : null}
              </div>
            </div>

            <div className="grid gap-3 rounded-md border p-3 md:grid-cols-3">
              <div className="space-y-1.5">
                <Label>Due Date</Label>
                <Input type="date" value={form.dueDate} onChange={(event) => setForm((prev) => ({ ...prev, dueDate: event.target.value }))} />
              </div>
              <div className="space-y-1.5">
                <Label>Due Time</Label>
                <Input value={form.dueTime} onChange={(event) => setForm((prev) => ({ ...prev, dueTime: event.target.value }))} />
              </div>
              <div className="space-y-1.5">
                <Label>Time Trigger</Label>
                <Select value={form.triggerType} onValueChange={(value) => setForm((prev) => ({ ...prev, triggerType: value }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{triggerTypes.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Repeat Rule</Label>
                <Select value={form.repeatRule} onValueChange={(value) => setForm((prev) => ({ ...prev, repeatRule: value }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{repeatRules.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5 md:col-span-2">
                <Label>Completion Standard</Label>
                <Input value={form.completionStandard} onChange={(event) => setForm((prev) => ({ ...prev, completionStandard: event.target.value }))} />
              </div>
            </div>

            <div className="grid gap-3 rounded-md border p-3 md:grid-cols-2">
              <div className="space-y-1.5">
                <Label>Checklist For Outlet</Label>
                <Textarea value={form.checklist} onChange={(event) => setForm((prev) => ({ ...prev, checklist: event.target.value }))} placeholder="One item per line for outlet staff to complete." />
              </div>
              <div className="space-y-1.5">
                <Label>Manager Note</Label>
                <Textarea value={form.note} onChange={(event) => setForm((prev) => ({ ...prev, note: event.target.value }))} placeholder="Instruction or escalation note." />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={saveTask} disabled={!form.title.trim() || !form.outlets.length || !form.dueDate}>
              <Clock className="h-4 w-4" />
              Schedule Task
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="sr-only">Sync: {syncStatus} {syncMessage}</div>
    </ErpShell>
  );
}
