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

export default function PsiProcurementPage() {
  const [data, setData] = useState<PsiProcurementWorkspacePageData | null>(null);
  const [viewKey, setViewKey] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "detail">("grid");
  const [selectedRowIds, setSelectedRowIds] = useState<Set<string>>(new Set());
  const [focusedRequestId, setFocusedRequestId] = useState<string | null>(null);
  const [density, setDensity] = useState<"compact" | "standard" | "comfortable">("compact");
  const [previewMessage, setPreviewMessage] = useState("Ready.");

  useEffect(() => {
    getPsiProcurementWorkspacePageData().then(setData);
  }, []);

  const pageData = data?.pageData;
  const requests = useMemo(() => pageData?.purchaseRequests ?? [], [pageData]);
  const orders = useMemo(() => pageData?.purchaseOrders ?? [], [pageData]);
  const issues = useMemo(() => pageData?.purchaseIssues ?? [], [pageData]);
  const receivingRecords = useMemo(() => pageData?.receivingRecords ?? [], [pageData]);

  const viewTabs = useMemo(
    () => [
      { key: "all", label: "All PR / PO", count: requests.length },
      { key: "draft", label: "PR Draft", count: requests.filter((item) => item.status === "draft").length },
      { key: "pending", label: "Waiting Approval", count: requests.filter((item) => item.status === "pending" || item.status === "review").length },
      { key: "approved", label: "Approved", count: requests.filter((item) => item.status === "approved").length },
      { key: "po", label: "PO Issued", count: orders.length },
      { key: "supplier", label: "Supplier Pending", count: issues.filter((item) => item.status === "pending").length },
      { key: "receiving", label: "Receiving Pending", count: orders.filter((item) => !receivingRecords.some((record) => record.orderId === item.orderId)).length },
      { key: "rejected", label: "Rejected", count: requests.filter((item) => item.status === "rejected").length },
    ],
    [issues, orders, receivingRecords, requests]
  );

  const filteredRequests = useMemo(() => {
    switch (viewKey) {
      case "draft":
        return requests.filter((item) => item.status === "draft");
      case "pending":
        return requests.filter((item) => item.status === "pending" || item.status === "review");
      case "approved":
        return requests.filter((item) => item.status === "approved");
      case "po":
        return requests.filter((item) => orders.some((order) => order.requestId === item.requestId));
      case "supplier":
        return requests.filter((item) => issues.some((issue) => issue.requestId === item.requestId && issue.status === "pending"));
      case "receiving":
        return requests.filter((item) => {
          const po = orders.find((order) => order.requestId === item.requestId);
          return po ? !receivingRecords.some((record) => record.orderId === po.orderId) : false;
        });
      case "rejected":
        return requests.filter((item) => item.status === "rejected");
      default:
        return requests;
    }
  }, [issues, orders, receivingRecords, requests, viewKey]);

  const focusedRequest = useMemo(() => {
    if (!filteredRequests.length) return null;
    return filteredRequests.find((item) => item.requestId === focusedRequestId) ?? filteredRequests[0];
  }, [filteredRequests, focusedRequestId]);

  const linkedOrder = focusedRequest ? orders.find((item) => item.requestId === focusedRequest.requestId) : null;
  const linkedReceiving = linkedOrder ? receivingRecords.find((item) => item.orderId === linkedOrder.orderId) : null;
  const linkedIssues = focusedRequest ? issues.filter((item) => item.requestId === focusedRequest.requestId) : [];

  const emptyRows = Array.from({ length: Math.max(0, 20 - filteredRequests.length) });

  const openDetail = (id: string) => {
    setFocusedRequestId(id);
    setSelectedRowIds(new Set([id]));
    setViewMode("detail");
  };

  const showPreview = (label: string) => setPreviewMessage(`${label} preview only.`);

  const columns: MultiDimColumn<(typeof filteredRequests)[number]>[] = [
    { key: "requestNo", label: "PR No", width: "120px", render: (row) => <p className="font-semibold">{row.requestNo}</p> },
    { key: "poNo", label: "PO No", width: "120px", render: (row) => <p>{orders.find((item) => item.requestId === row.requestId)?.orderNo ?? "-"}</p> },
    { key: "branch", label: "Branch", width: "95px", render: (row) => <p>{row.storeId}</p> },
    { key: "requester", label: "Requester", width: "110px", render: (row) => <p>{row.audit.createdBy || "-"}</p> },
    { key: "supplier", label: "Supplier", width: "150px", render: (row) => <p>{row.supplierId || "-"}</p> },
    { key: "items", label: "Items", width: "70px", render: (row) => <p>{row.lines.length}</p> },
    { key: "amount", label: "Total Amount", width: "120px", render: (row) => <p className="font-semibold">{row.totalAmount.amount}</p> },
    { key: "needBy", label: "Need By", width: "110px", render: (row) => <p>{row.neededBy || "-"}</p> },
    { key: "approval", label: "Approval", width: "110px", render: (row) => <TableFieldChip label={row.status} tone={row.status === "approved" ? "success" : row.status === "rejected" ? "danger" : "warning"} /> },
    { key: "poStatus", label: "PO Status", width: "110px", render: (row) => <TableFieldChip label={orders.find((item) => item.requestId === row.requestId)?.status ?? "pending"} tone="muted" /> },
    { key: "supplierConfirm", label: "Supplier Confirm", width: "130px", render: (row) => <TableFieldChip label={issues.some((item) => item.requestId === row.requestId && item.status === "pending") ? "pending" : "confirmed"} tone="muted" /> },
    { key: "receiving", label: "Receiving Status", width: "125px", render: (row) => <TableFieldChip label={receivingRecords.find((record) => record.orderId === (orders.find((item) => item.requestId === row.requestId)?.orderId ?? ""))?.status ?? "pending"} tone="warning" /> },
    { key: "variance", label: "Variance", width: "95px", render: (row) => <TableFieldChip label={issues.some((item) => item.requestId === row.requestId && item.issueType === "receiving") ? "found" : "none"} tone={issues.some((item) => item.requestId === row.requestId && item.issueType === "receiving") ? "danger" : "success"} /> },
    {
      key: "action",
      label: "Action",
      width: "80px",
      render: (row) => (
        <Button type="button" variant="ghost" size="icon" className="h-7 w-7" onClick={(event) => { event.stopPropagation(); openDetail(row.requestId); }} title="View Detail"><Eye className="h-4 w-4" /></Button>
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

  if (!data || !pageData || !focusedRequest) return null;

  return (
    <ErpShell activeHref="/psi/procurement">
      <div className="space-y-4">
        <header className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="text-xs text-muted-foreground">ME / PSI / Procurement</div>
            <h1 className="mt-3 text-2xl font-semibold tracking-tight text-foreground">ME PSI Procurement</h1>
            <p className="mt-1 text-sm text-muted-foreground">{viewMode === "grid" ? "Normal View: wide PR / PO operations grid with compact selected summary." : "Detail View: 40% quick request list and 60% full procurement detail."}</p>
          </div>
          <div className="flex items-center gap-2">
            {viewMode === "detail" ? (
              <Button variant="outline" size="sm" onClick={() => setViewMode("grid")}><ArrowLeft className="mr-2 h-4 w-4" />Back to Grid</Button>
            ) : null}
            <Button variant="outline" size="sm" onClick={() => showPreview("Export")}><FileDown className="mr-2 h-4 w-4" />Export</Button>
            <Button size="sm" onClick={() => showPreview("Create PR")}><Plus className="mr-2 h-4 w-4" />Create PR</Button>
          </div>
        </header>

        <TableViewTabs title="Saved Views" tabs={viewTabs} value={viewKey} onChange={setViewKey} />

        <CompactStatStrip
          items={[
            { label: "PR Open", value: pageData.stats.totalRequests },
            { label: "Waiting Approval", value: requests.filter((item) => item.status === "pending" || item.status === "review").length, tone: "warning" },
            { label: "PO Issued", value: pageData.stats.totalOrders, tone: "success" },
            { label: "Receiving Pending", value: orders.filter((item) => !receivingRecords.some((record) => record.orderId === item.orderId)).length, tone: "danger" },
          ]}
        />

        <TableActionBar
          searchPlaceholder="Search PR / PO no..."
          selectedCount={selectedRowIds.size}
          bulkActionLabel="Approve Preview"
          bulkActionKey="procurement.approve_preview"
          density={density}
          onDensityChange={setDensity}
          onClearSelection={() => setSelectedRowIds(new Set())}
          columns={["PR No", "PO No", "Branch", "Requester", "Supplier", "Items", "Total Amount", "Need By", "Approval", "PO Status", "Supplier Confirm", "Receiving Status", "Variance"]}
          sortOptions={["Need By Date", "Total Amount", "Approval Status", "PO Status"]}
          advancedFilters={[{ title: "Procurement", items: ["Branch", "Supplier", "Requester", "Priority", "Approval Status", "PO Status", "Need By Date"] }]}
          filters={
            <div className="flex items-center gap-2">
              {[
                "Branch: All",
                "Supplier: All",
                "Requester: All",
                "Priority: All",
                "Approval: Pending",
                "PO: Issued",
                "Need By: This Week",
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
                  <h2 className="text-base font-semibold">Quick Request List</h2>
                  <p className="mt-1 text-xs text-muted-foreground">Fixed 20-row speed list · PR No and Supplier / Need By.</p>
                </div>
              </div>
              <div className="overflow-hidden px-3 pt-3">
                <div className="grid h-10 grid-cols-[130px_minmax(180px,1fr)_42px] items-center rounded-t-lg border border-border bg-secondary/30 px-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground"><div>PR No</div><div>Supplier / Need By</div><div /></div>
                <div className="h-[760px] border-x border-border">
                  {filteredRequests.map((item) => (
                    <div key={item.requestId} className={["grid h-[38px] grid-cols-[130px_minmax(180px,1fr)_42px] items-center border-b border-border px-3", focusedRequest.requestId === item.requestId ? "bg-primary/12" : "hover:bg-secondary/30"].join(" ")}>
                      <button type="button" className="truncate text-left font-semibold" onClick={() => setFocusedRequestId(item.requestId)}>{item.requestNo}</button>
                      <button type="button" className="truncate text-left" onClick={() => setFocusedRequestId(item.requestId)}>{item.supplierId || "-"} · {item.neededBy || "-"}</button>
                      <Button type="button" variant="ghost" size="icon" className="h-7 w-7" onClick={() => openDetail(item.requestId)} title="View Detail"><Eye className="h-4 w-4" /></Button>
                    </div>
                  ))}
                  {emptyRows.map((_, index) => <div key={`empty-${index}`} className="grid h-[38px] grid-cols-[130px_minmax(180px,1fr)_42px] items-center border-b border-border px-3 text-muted-foreground/35"><div>—</div><div>Empty row slot</div><div /></div>)}
                </div>
                <div className="flex h-12 flex-wrap items-center justify-between gap-2 rounded-b-lg border border-border bg-secondary/10 px-3 text-xs text-muted-foreground">
                  <div className="flex flex-wrap items-center gap-3"><span>Showing 1–20 of 248</span><span>Selected {selectedRowIds.size}</span><span>Rows per page 20 / 50 / 100</span><span>Page 1 of 13</span></div>
                  <div className="flex items-center gap-2"><Button variant="outline" size="sm" className="h-8">Prev</Button><Button variant="outline" size="sm" className="h-8">Next</Button></div>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card">
              <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border p-4">
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">Procurement Detail Workspace</div>
                  <h2 className="mt-2 text-2xl font-semibold">{focusedRequest.requestNo}</h2>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <Badge variant="secondary">{linkedOrder?.orderNo ?? "No PO"}</Badge>
                    <Badge variant="outline">{focusedRequest.status}</Badge>
                    <Badge variant="outline">{focusedRequest.storeId}</Badge>
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={() => setViewMode("grid")}><ArrowLeft className="mr-2 h-4 w-4" />Back to Grid</Button>
              </div>
              <div className="max-h-[calc(100vh-230px)] space-y-5 overflow-y-auto p-4">
                <DetailSection title="PR / PO Header">
                  <FactRow label="PR No" value={focusedRequest.requestNo} />
                  <FactRow label="PO No" value={linkedOrder?.orderNo ?? "-"} />
                  <FactRow label="Status" value={focusedRequest.status} />
                  <FactRow label="Priority" value="normal" />
                  <FactRow label="Branch" value={focusedRequest.storeId} />
                  <FactRow label="Requester" value={focusedRequest.audit.createdBy ?? "-"} />
                </DetailSection>
                <DetailSection title="Request Details">
                  <FactRow label="Supplier" value={focusedRequest.supplierId || "-"} />
                  <FactRow label="Items" value={String(focusedRequest.lines.length)} />
                  <FactRow label="Total Amount" value={`${focusedRequest.totalAmount.amount} ${focusedRequest.totalAmount.currency}`} />
                  <FactRow label="Need By" value={focusedRequest.neededBy || "-"} />
                  <FactRow label="Request Date" value={focusedRequest.audit.createdAt.split("T")[0]} />
                  <FactRow label="Reason / Remark" value="-" />
                </DetailSection>
                <DetailSection title="Approval">
                  <FactRow label="Approval Status" value={focusedRequest.status} />
                  <FactRow label="Approver" value="-" />
                  <FactRow label="Approval Time" value="-" />
                  <FactRow label="Rejection Reason" value="-" />
                  <FactRow label="Approval Preview" value="Available" />
                </DetailSection>
                <DetailSection title="PO / Supplier Confirmation">
                  <FactRow label="PO Status" value={linkedOrder?.status ?? "-"} />
                  <FactRow label="Supplier Confirm" value={linkedIssues.some((item) => item.status === "pending") ? "pending" : "confirmed"} />
                  <FactRow label="PO Issued Date" value={linkedOrder?.audit.createdAt.split("T")[0] ?? "-"} />
                  <FactRow label="Supplier ETA" value={linkedOrder?.expectedReceivingDate?.split("T")[0] ?? "-"} />
                  <FactRow label="Linked Supplier" value={focusedRequest.supplierId || "-"} />
                </DetailSection>
                <DetailSection title="Receiving / Variance">
                  <FactRow label="Receiving Status" value={linkedReceiving?.status ?? "pending"} />
                  <FactRow label="Linked GRN" value={linkedReceiving?.receivingNo ?? "-"} />
                  <FactRow label="Receiving Variance" value={linkedIssues.some((item) => item.issueType === "receiving") ? "found" : "none"} />
                  <FactRow label="Pending Posting" value={linkedReceiving?.status === "pending" ? "yes" : "no"} />
                  <FactRow label="Issue Link" value={linkedIssues[0]?.issueId ?? "-"} />
                </DetailSection>
                <section className="space-y-2">
                  <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">Item Lines</div>
                  <div className="overflow-hidden rounded-lg border border-border">
                    <div className="grid grid-cols-[110px_minmax(200px,1fr)_80px_70px_110px_56px] bg-secondary/30 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                      <div>SKU</div><div>Item Name</div><div>Qty</div><div>UOM</div><div>Unit Price</div><div>Amount</div>
                    </div>
                    {focusedRequest.lines.map((line) => (
                      <div key={line.lineId} className="grid grid-cols-[110px_minmax(200px,1fr)_80px_70px_110px_56px] border-t border-border px-3 py-2 text-sm">
                        <div>{line.skuId}</div><div className="truncate">{line.productName}</div><div>{line.requestedQty.value}</div><div>{line.requestedQty.unit}</div><div>-</div><div>-</div>
                      </div>
                    ))}
                  </div>
                </section>
                <DetailSection title="Linked Records">
                  <FactRow label="Linked Supplier" value={focusedRequest.supplierId || "-"} />
                  <FactRow label="Linked Inventory" value={focusedRequest.lines[0]?.skuId ?? "-"} />
                  <FactRow label="Linked Receiving" value={linkedReceiving?.receivingNo ?? "-"} />
                  <FactRow label="Linked Issue" value={linkedIssues[0]?.issueId ?? "-"} />
                  <FactRow label="Linked Task" value="TASK-Preview" />
                </DetailSection>
                <section className="rounded-xl border border-border bg-secondary/10 p-3">
                  <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">Preview Actions</div>
                  <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
                    {["View PR", "Approve Preview", "Issue PO Preview", "Link Receiving Preview", "Add Note"].map((action) => (
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
              rows={filteredRequests}
              rowIdKey="requestId"
              selectedRowIds={selectedRowIds}
              onToggleRow={toggleRow}
              onToggleAll={toggleAll}
              selectedRecordId={focusedRequest.requestId}
              onRowFocus={setFocusedRequestId}
              pageLabel="Showing 1–50 of 248"
              rowsPerPageLabel="Rows per page 50 / 100 / 200"
              density={density}
            />

            <aside className="rounded-xl border border-border bg-card p-4">
              <div className="flex items-start justify-between gap-3 border-b border-border pb-4">
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">Selected PR / PO</div>
                  <h2 className="mt-2 text-lg font-semibold">{focusedRequest.requestNo}</h2>
                  <p className="text-sm text-muted-foreground">{linkedOrder?.orderNo ?? "No PO"}</p>
                </div>
                <Badge variant="outline">{focusedRequest.status}</Badge>
              </div>
              <div className="mt-4 space-y-2">
                <FactRow label="Branch" value={focusedRequest.storeId} />
                <FactRow label="Requester" value={focusedRequest.audit.createdBy ?? "-"} />
                <FactRow label="Supplier" value={focusedRequest.supplierId || "-"} />
                <FactRow label="Items" value={String(focusedRequest.lines.length)} />
                <FactRow label="Approval" value={focusedRequest.status} />
                <FactRow label="Receiving" value={linkedReceiving?.status ?? "pending"} />
              </div>
              <div className="mt-4 grid gap-2">
                <Button onClick={() => setViewMode("detail")}><Eye className="mr-2 h-4 w-4" />View Detail</Button>
                <Button variant="outline" onClick={() => showPreview("Approve Preview")}>Approve Preview</Button>
              </div>
            </aside>
          </section>
        )}
      </div>
    </ErpShell>
  );
}
