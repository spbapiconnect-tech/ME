"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Eye, FileDown, Plus } from "lucide-react";
import { ErpShell } from "@/components/erp/erp-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CompactStatStrip } from "@/components/operations/compact-stat-strip";
import { MultidimensionalTable, type MultiDimColumn } from "@/components/operations/multidimensional-table";
import { TableActionBar } from "@/components/operations/table-action-bar";
import { TableFieldChip } from "@/components/operations/table-field-chip";
import { TableViewTabs } from "@/components/operations/table-view-tabs";
import { getPsiProcurementWorkspacePageData, type PsiProcurementWorkspacePageData } from "@/lib/page-data/psi";

function FactRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[145px_1fr] gap-3 rounded-lg border border-border/70 bg-secondary/20 px-3 py-2 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-foreground">{value}</span>
    </div>
  );
}

function DetailSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-2">
      <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">{title}</div>
      <div className="grid gap-2 md:grid-cols-2">{children}</div>
    </section>
  );
}

export default function ReceivingPage() {
  const [data, setData] = useState<PsiProcurementWorkspacePageData | null>(null);
  const [viewKey, setViewKey] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "detail">("grid");
  const [selectedRowIds, setSelectedRowIds] = useState<Set<string>>(new Set());
  const [focusedReceivingId, setFocusedReceivingId] = useState<string | null>(null);
  const [density, setDensity] = useState<"compact" | "standard" | "comfortable">("compact");
  const [previewMessage, setPreviewMessage] = useState("Ready.");

  useEffect(() => {
    getPsiProcurementWorkspacePageData().then(setData);
  }, []);

  const pageData = data?.pageData;
  const receiving = useMemo(() => pageData?.receivingRecords ?? [], [pageData]);
  const orders = useMemo(() => pageData?.purchaseOrders ?? [], [pageData]);
  const issues = useMemo(() => (pageData?.purchaseIssues ?? []).filter((item) => item.issueType === "receiving"), [pageData]);

  const viewTabs = useMemo(
    () => [
      { key: "all", label: "All Receiving", count: receiving.length },
      { key: "awaiting", label: "Awaiting Arrival", count: Math.max(orders.length - receiving.length, 0) },
      { key: "today", label: "Received Today", count: receiving.filter((item) => item.status === "completed").length },
      { key: "variance", label: "Variance Found", count: receiving.filter((item) => item.status === "disputed").length },
      { key: "pending", label: "Pending Posting", count: receiving.filter((item) => item.status === "pending").length },
      { key: "inspection", label: "Inspection Required", count: receiving.filter((item) => item.status === "review").length },
      { key: "disputed", label: "Disputed", count: receiving.filter((item) => item.status === "disputed").length },
    ],
    [orders.length, receiving]
  );

  const filteredReceiving = useMemo(() => {
    switch (viewKey) {
      case "awaiting":
        return receiving.filter((item) => item.status === "pending");
      case "today":
        return receiving.filter((item) => item.status === "completed");
      case "variance":
        return receiving.filter((item) => item.status === "disputed");
      case "pending":
        return receiving.filter((item) => item.status === "pending");
      case "inspection":
        return receiving.filter((item) => item.status === "review");
      case "disputed":
        return receiving.filter((item) => item.status === "disputed");
      default:
        return receiving;
    }
  }, [receiving, viewKey]);

  const focusedReceiving = useMemo(() => {
    if (!filteredReceiving.length) return null;
    return filteredReceiving.find((item) => item.receivingId === focusedReceivingId) ?? filteredReceiving[0];
  }, [filteredReceiving, focusedReceivingId]);

  const focusedOrder = focusedReceiving ? orders.find((item) => item.orderId === focusedReceiving.orderId) : null;
  const focusedIssues = focusedReceiving ? issues.filter((item) => item.orderId === focusedReceiving.orderId) : [];
  const emptyRows = Array.from({ length: Math.max(0, 20 - filteredReceiving.length) });

  const openDetail = (id: string) => {
    setFocusedReceivingId(id);
    setSelectedRowIds(new Set([id]));
    setViewMode("detail");
  };

  const showPreview = (label: string) => setPreviewMessage(`${label} preview only.`);

  const columns: MultiDimColumn<(typeof filteredReceiving)[number]>[] = [
    { key: "grn", label: "GRN No", width: "120px", render: (row) => <p className="font-semibold">{row.receivingNo}</p> },
    { key: "po", label: "PO No", width: "120px", render: (row) => <p>{orders.find((item) => item.orderId === row.orderId)?.orderNo ?? row.orderId}</p> },
    { key: "supplier", label: "Supplier", width: "120px", render: (row) => <p>{row.supplierId}</p> },
    { key: "branch", label: "Branch", width: "90px", render: (row) => <p>{row.warehouseId}</p> },
    { key: "warehouse", label: "Warehouse", width: "100px", render: (row) => <p>{row.warehouseId}</p> },
    { key: "expected", label: "Expected Date", width: "110px", render: (row) => <p>{orders.find((item) => item.orderId === row.orderId)?.expectedReceivingDate?.split("T")[0] ?? "-"}</p> },
    { key: "received", label: "Received Date", width: "110px", render: (row) => <p>{row.receivedAt.split("T")[0]}</p> },
    { key: "receivedBy", label: "Received By", width: "110px", render: (row) => <p>{row.audit.updatedBy ?? row.audit.createdBy ?? "-"}</p> },
    { key: "items", label: "Items", width: "70px", render: (row) => <p>{row.lines.length}</p> },
    { key: "variance", label: "Variance", width: "95px", render: (row) => <TableFieldChip label={row.status === "disputed" ? "found" : "none"} tone={row.status === "disputed" ? "danger" : "success"} /> },
    { key: "inspection", label: "Inspection", width: "95px", render: (row) => <TableFieldChip label={row.status === "review" ? "required" : "ok"} tone={row.status === "review" ? "warning" : "success"} /> },
    { key: "posting", label: "Posting", width: "100px", render: (row) => <TableFieldChip label={row.status} tone={row.status === "completed" ? "success" : row.status === "disputed" ? "danger" : "warning"} /> },
    {
      key: "action",
      label: "Action",
      width: "80px",
      render: (row) => (
        <Button type="button" variant="ghost" size="icon" className="h-7 w-7" onClick={(event) => { event.stopPropagation(); openDetail(row.receivingId); }} title="View Detail"><Eye className="h-4 w-4" /></Button>
      ),
    },
  ];

  const toggleRow = (id: string) => {
    setSelectedRowIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAll = (checked: boolean, ids: string[]) => {
    setSelectedRowIds((prev) => {
      const next = new Set(prev);
      if (checked) ids.forEach((id) => next.add(id));
      else ids.forEach((id) => next.delete(id));
      return next;
    });
  };

  if (!data || !pageData || !focusedReceiving) return null;

  return (
    <ErpShell activeHref="/psi/receiving">
      <div className="space-y-4">
        <header className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="text-xs text-muted-foreground">ME / PSI / Receiving</div>
            <h1 className="mt-3 text-2xl font-semibold tracking-tight text-foreground">ME PSI Receiving</h1>
            <p className="mt-1 text-sm text-muted-foreground">{viewMode === "grid" ? "Normal View: wide GRN / receiving grid with compact selected GRN summary." : "Detail View: 40% quick GRN list and 60% full receiving detail."}</p>
          </div>
          <div className="flex items-center gap-2">
            {viewMode === "detail" ? (
              <Button variant="outline" size="sm" onClick={() => setViewMode("grid")}><ArrowLeft className="mr-2 h-4 w-4" />Back to Grid</Button>
            ) : null}
            <Button variant="outline" size="sm" onClick={() => showPreview("Export")}><FileDown className="mr-2 h-4 w-4" />Export</Button>
            <Button size="sm" onClick={() => showPreview("New Receiving")}><Plus className="mr-2 h-4 w-4" />New Receiving</Button>
          </div>
        </header>

        <TableViewTabs title="Saved Views" tabs={viewTabs} value={viewKey} onChange={setViewKey} />

        <CompactStatStrip
          items={[
            { label: "Awaiting Arrival", value: Math.max(orders.length - receiving.length, 0), tone: "warning" },
            { label: "Received Today", value: pageData.stats.receivingToday, tone: "success" },
            { label: "Variance Found", value: receiving.filter((item) => item.status === "disputed").length, tone: "danger" },
            { label: "Pending Posting", value: receiving.filter((item) => item.status === "pending").length, tone: "warning" },
          ]}
        />

        <TableActionBar
          searchPlaceholder="Search GRN / PO no..."
          selectedCount={selectedRowIds.size}
          bulkActionLabel="Review Variance"
          bulkActionKey="receiving.review_variance_preview"
          density={density}
          onDensityChange={setDensity}
          onClearSelection={() => setSelectedRowIds(new Set())}
          columns={["GRN No", "PO No", "Supplier", "Branch", "Warehouse", "Expected Date", "Received Date", "Received By", "Items", "Variance", "Inspection", "Posting"]}
          sortOptions={["Received Date", "Variance", "Posting Status", "Supplier"]}
          advancedFilters={[{ title: "Receiving", items: ["Branch", "Supplier", "Warehouse", "Variance", "Posting Status", "Received Date"] }]}
          filters={
            <div className="flex items-center gap-2">
              {[
                "Branch: All",
                "Supplier: All",
                "Warehouse: All",
                "Variance: All",
                "Posting: Pending",
                "Received Date: This Week",
              ].map((item) => (
                <Badge key={item} variant="outline" className="h-7 px-2 font-normal border-dashed">{item}</Badge>
              ))}
              <Badge variant="outline" className="h-7 px-2 font-normal border-dashed text-primary border-primary/30 bg-primary/5">More Filters</Badge>
            </div>
          }
        />

        <div className="rounded-lg border border-border/60 bg-secondary/10 px-3 py-2 text-xs text-muted-foreground">{previewMessage}</div>

        {viewMode === "detail" ? (
          <section className="grid gap-4 xl:grid-cols-[minmax(360px,0.4fr)_minmax(620px,0.6fr)]">
            <div className="rounded-xl border border-border bg-card">
              <div className="flex items-center justify-between border-b border-border p-4">
                <div>
                  <h2 className="text-base font-semibold">Quick GRN List</h2>
                  <p className="mt-1 text-xs text-muted-foreground">Fixed 20-row speed list · GRN No and PO No / Supplier.</p>
                </div>
              </div>
              <div className="overflow-hidden px-3 pt-3">
                <div className="grid h-10 grid-cols-[130px_minmax(180px,1fr)_42px] items-center rounded-t-lg border border-border bg-secondary/30 px-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground"><div>GRN No</div><div>PO / Supplier</div><div /></div>
                <div className="h-[760px] border-x border-border">
                  {filteredReceiving.map((item) => (
                    <div key={item.receivingId} className={["grid h-[38px] grid-cols-[130px_minmax(180px,1fr)_42px] items-center border-b border-border px-3", focusedReceiving.receivingId === item.receivingId ? "bg-primary/12" : "hover:bg-secondary/30"].join(" ")}>
                      <button type="button" className="truncate text-left font-semibold" onClick={() => setFocusedReceivingId(item.receivingId)}>{item.receivingNo}</button>
                      <button type="button" className="truncate text-left" onClick={() => setFocusedReceivingId(item.receivingId)}>{orders.find((order) => order.orderId === item.orderId)?.orderNo ?? item.orderId} · {item.supplierId}</button>
                      <Button type="button" variant="ghost" size="icon" className="h-7 w-7" onClick={() => openDetail(item.receivingId)} title="View Detail"><Eye className="h-4 w-4" /></Button>
                    </div>
                  ))}
                  {emptyRows.map((_, index) => <div key={`empty-${index}`} className="grid h-[38px] grid-cols-[130px_minmax(180px,1fr)_42px] items-center border-b border-border px-3 text-muted-foreground/35"><div>—</div><div>Empty row slot</div><div /></div>)}
                </div>
                <div className="flex h-12 flex-wrap items-center justify-between gap-2 rounded-b-lg border border-border bg-secondary/10 px-3 text-xs text-muted-foreground">
                  <div className="flex flex-wrap items-center gap-3"><span>Showing 1–20 of 184</span><span>Selected {selectedRowIds.size}</span><span>Rows per page 20 / 50 / 100</span><span>Page 1 of 10</span></div>
                  <div className="flex items-center gap-2"><Button variant="outline" size="sm" className="h-8">Prev</Button><Button variant="outline" size="sm" className="h-8">Next</Button></div>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card">
              <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border p-4">
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">Receiving Detail Workspace</div>
                  <h2 className="mt-2 text-2xl font-semibold">{focusedReceiving.receivingNo}</h2>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <Badge variant="secondary">{focusedOrder?.orderNo ?? focusedReceiving.orderId}</Badge>
                    <Badge variant="outline">{focusedReceiving.supplierId}</Badge>
                    <Badge variant="outline">{focusedReceiving.status}</Badge>
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={() => setViewMode("grid")}><ArrowLeft className="mr-2 h-4 w-4" />Back to Grid</Button>
              </div>
              <div className="max-h-[calc(100vh-230px)] space-y-5 overflow-y-auto p-4">
                <DetailSection title="GRN Header">
                  <FactRow label="GRN No" value={focusedReceiving.receivingNo} />
                  <FactRow label="PO No" value={focusedOrder?.orderNo ?? focusedReceiving.orderId} />
                  <FactRow label="Status" value={focusedReceiving.status} />
                  <FactRow label="Supplier" value={focusedReceiving.supplierId} />
                  <FactRow label="Branch" value={focusedReceiving.warehouseId} />
                  <FactRow label="Warehouse" value={focusedReceiving.warehouseId} />
                </DetailSection>
                <DetailSection title="Receiving Info">
                  <FactRow label="Expected Date" value={focusedOrder?.expectedReceivingDate?.split("T")[0] ?? "-"} />
                  <FactRow label="Received Date" value={focusedReceiving.receivedAt.split("T")[0]} />
                  <FactRow label="Received By" value={focusedReceiving.audit.updatedBy ?? focusedReceiving.audit.createdBy ?? "-"} />
                  <FactRow label="Items Count" value={String(focusedReceiving.lines.length)} />
                  <FactRow label="Receiving Remark" value="-" />
                </DetailSection>
                <DetailSection title="Inspection">
                  <FactRow label="Inspection Status" value={focusedReceiving.status === "review" ? "required" : "ok"} />
                  <FactRow label="Checked By" value={focusedReceiving.audit.updatedBy ?? "-"} />
                  <FactRow label="Quality Result" value={focusedReceiving.status === "disputed" ? "watch" : "pass"} />
                  <FactRow label="Damage / Missing" value={focusedReceiving.status === "disputed" ? "yes" : "no"} />
                  <FactRow label="Photo Attachment Preview" value="available" />
                </DetailSection>
                <DetailSection title="Variance">
                  <FactRow label="Variance Status" value={focusedReceiving.status === "disputed" ? "found" : "none"} />
                  <FactRow label="Expected Qty" value={String((focusedOrder?.lines ?? []).reduce((sum, line) => sum + line.orderedQty.value, 0))} />
                  <FactRow label="Received Qty" value={String(focusedReceiving.lines.reduce((sum, line) => sum + line.receivedQty.value, 0))} />
                  <FactRow label="Difference" value={focusedReceiving.status === "disputed" ? "variance" : "0"} />
                  <FactRow label="Variance Reason" value={focusedIssues[0]?.title.en ?? "-"} />
                  <FactRow label="Linked Issue" value={focusedIssues[0]?.issueId ?? "-"} />
                </DetailSection>
                <DetailSection title="Posting">
                  <FactRow label="Posting Status" value={focusedReceiving.status} />
                  <FactRow label="Stock Movement Link" value={focusedReceiving.lines[0]?.skuId ?? "-"} />
                  <FactRow label="Posting Block Reason" value={focusedReceiving.status === "pending" ? "pending review" : "-"} />
                  <FactRow label="Posting Preview" value="available" />
                </DetailSection>
                <section className="space-y-2">
                  <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">Receiving Lines</div>
                  <div className="overflow-hidden rounded-lg border border-border">
                    <div className="grid grid-cols-[110px_minmax(180px,1fr)_90px_90px_70px_90px_130px] bg-secondary/30 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                      <div>SKU</div><div>Item Name</div><div>Expected Qty</div><div>Received Qty</div><div>UOM</div><div>Variance</div><div>Batch / Expiry</div>
                    </div>
                    {focusedReceiving.lines.map((line) => {
                      const poLine = focusedOrder?.lines.find((item) => item.skuId === line.skuId);
                      const diff = line.receivedQty.value - (poLine?.orderedQty.value ?? 0);
                      return (
                        <div key={line.lineId} className="grid grid-cols-[110px_minmax(180px,1fr)_90px_90px_70px_90px_130px] border-t border-border px-3 py-2 text-sm">
                          <div>{line.skuId}</div><div className="truncate">{line.skuId}</div><div>{poLine?.orderedQty.value ?? 0}</div><div>{line.receivedQty.value}</div><div>{line.receivedQty.unit}</div><div>{diff}</div><div>-</div>
                        </div>
                      );
                    })}
                  </div>
                </section>
                <DetailSection title="Linked Records">
                  <FactRow label="Linked Supplier" value={focusedReceiving.supplierId} />
                  <FactRow label="Linked PO" value={focusedOrder?.orderNo ?? focusedReceiving.orderId} />
                  <FactRow label="Linked Inventory Movement" value={focusedReceiving.lines[0]?.skuId ?? "-"} />
                  <FactRow label="Linked Issue" value={focusedIssues[0]?.issueId ?? "-"} />
                </DetailSection>
                <section className="rounded-xl border border-border bg-secondary/10 p-3">
                  <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">Preview Actions</div>
                  <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
                    {["View GRN", "Review Variance", "Post Stock Preview", "Attach Document", "Add Note"].map((action) => (
                      <Button key={action} variant="outline" size="sm" onClick={() => showPreview(action)}>{action}</Button>
                    ))}
                  </div>
                </section>
              </div>
            </div>
          </section>
        ) : (
          <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
            <MultidimensionalTable
              columns={columns}
              rows={filteredReceiving}
              rowIdKey="receivingId"
              selectedRowIds={selectedRowIds}
              onToggleRow={toggleRow}
              onToggleAll={toggleAll}
              selectedRecordId={focusedReceiving.receivingId}
              onRowFocus={setFocusedReceivingId}
              pageLabel="Showing 1–50 of 184"
              rowsPerPageLabel="Rows per page 50 / 100 / 200"
              density={density}
            />

            <aside className="rounded-xl border border-border bg-card p-4">
              <div className="flex items-start justify-between gap-3 border-b border-border pb-4">
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">Selected GRN</div>
                  <h2 className="mt-2 text-lg font-semibold">{focusedReceiving.receivingNo}</h2>
                  <p className="text-sm text-muted-foreground">{focusedOrder?.orderNo ?? focusedReceiving.orderId}</p>
                </div>
                <Badge variant="outline">{focusedReceiving.status}</Badge>
              </div>
              <div className="mt-4 space-y-2">
                <FactRow label="Supplier" value={focusedReceiving.supplierId} />
                <FactRow label="Branch" value={focusedReceiving.warehouseId} />
                <FactRow label="Variance" value={focusedReceiving.status === "disputed" ? "found" : "none"} />
                <FactRow label="Inspection" value={focusedReceiving.status === "review" ? "required" : "ok"} />
                <FactRow label="Posting Status" value={focusedReceiving.status} />
                <FactRow label="Items" value={String(focusedReceiving.lines.length)} />
              </div>
              <div className="mt-4 grid gap-2">
                <Button onClick={() => setViewMode("detail")}><Eye className="mr-2 h-4 w-4" />View Detail</Button>
                <Button variant="outline" onClick={() => showPreview("Review Variance")}>Review Variance</Button>
              </div>
            </aside>
          </section>
        )}
      </div>
    </ErpShell>
  );
}
