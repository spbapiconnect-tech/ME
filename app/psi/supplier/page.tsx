"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Eye, FileDown, Plus, Star } from "lucide-react";
import { ErpShell } from "@/components/erp/erp-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TableActionBar } from "@/components/operations/table-action-bar";
import { TableFieldChip } from "@/components/operations/table-field-chip";
import { TableViewTabs } from "@/components/operations/table-view-tabs";
import { MultidimensionalTable, type MultiDimColumn } from "@/components/operations/multidimensional-table";
import { CompactStatStrip } from "@/components/operations/compact-stat-strip";
import { getPsiSupplierWorkspacePageData, type PsiSupplierWorkspacePageData } from "@/lib/page-data/psi";

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

export default function PsiSupplierPage() {
  const [data, setData] = useState<PsiSupplierWorkspacePageData | null>(null);
  const [viewKey, setViewKey] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "detail">("grid");
  const [selectedRowIds, setSelectedRowIds] = useState<Set<string>>(new Set());
  const [focusedSupplierId, setFocusedSupplierId] = useState<string | null>(null);
  const [density, setDensity] = useState<"compact" | "standard" | "comfortable">("compact");
  const [previewMessage, setPreviewMessage] = useState("Ready.");
  const [editingSupplier, setEditingSupplier] = useState(false);
  const [supplierForm, setSupplierForm] = useState({
    supplierCode: "",
    supplierName: "",
    category: "",
    contactPerson: "",
    phone: "",
    email: "",
    region: "",
    leadTime: "",
    paymentTerm: "NET 30",
    status: "",
    rating: "",
  });

  useEffect(() => {
    getPsiSupplierWorkspacePageData().then(setData);
  }, []);

  const pageData = data?.pageData;
  const suppliers = useMemo(() => pageData?.suppliers ?? [], [pageData]);
  const issues = useMemo(() => pageData?.issues ?? [], [pageData]);
  const contracts = useMemo(() => pageData?.contracts ?? [], [pageData]);
  const ratings = useMemo(() => pageData?.ratings ?? [], [pageData]);
  const quotations = useMemo(() => pageData?.quotations ?? [], [pageData]);

  const viewTabs = useMemo(
    () => [
      { key: "all", label: "All Suppliers", count: suppliers.length },
      { key: "active", label: "Active", count: suppliers.filter((item) => item.status === "active").length },
      { key: "expiring", label: "Contract Expiring", count: contracts.filter((item) => item.status === "review").length },
      { key: "quality", label: "Quality Issues", count: issues.length },
      { key: "late", label: "Late Response", count: issues.filter((item) => item.priority === "high" || item.priority === "critical").length },
      { key: "blocked", label: "Blocked", count: suppliers.filter((item) => item.status === "blocked").length },
      { key: "category", label: "By Category", count: new Set(suppliers.map((item) => item.category)).size },
    ],
    [contracts, issues, suppliers]
  );

  const filteredSuppliers = useMemo(() => {
    switch (viewKey) {
      case "active":
        return suppliers.filter((item) => item.status === "active");
      case "expiring":
        return suppliers.filter((item) => contracts.some((contract) => contract.supplierId === item.supplierId && contract.status === "review"));
      case "quality":
        return suppliers.filter((item) => issues.some((issue) => issue.supplierId === item.supplierId));
      case "late":
        return suppliers.filter((item) => issues.some((issue) => issue.supplierId === item.supplierId && (issue.priority === "high" || issue.priority === "critical")));
      case "blocked":
        return suppliers.filter((item) => item.status === "blocked");
      case "category":
        return suppliers;
      default:
        return suppliers;
    }
  }, [contracts, issues, suppliers, viewKey]);

  const focusedSupplier = useMemo(() => {
    if (!filteredSuppliers.length) return null;
    return filteredSuppliers.find((item) => item.supplierId === focusedSupplierId) ?? filteredSuppliers[0];
  }, [filteredSuppliers, focusedSupplierId]);

  const focusedContact = focusedSupplier ? pageData?.contacts.find((item) => item.supplierId === focusedSupplier.supplierId) : null;
  const focusedContract = focusedSupplier ? contracts.find((item) => item.supplierId === focusedSupplier.supplierId) : null;
  const focusedRating = focusedSupplier ? ratings.find((item) => item.supplierId === focusedSupplier.supplierId) : null;
  const focusedIssues = focusedSupplier ? issues.filter((item) => item.supplierId === focusedSupplier.supplierId) : [];
  const linkedOrders = focusedSupplier ? quotations.filter((item) => item.supplierId === focusedSupplier.supplierId).slice(0, 3) : [];

  const loadSupplierForm = (supplierId: string) => {
    const supplier = suppliers.find((item) => item.supplierId === supplierId);
    if (!supplier) return;
    const contact = pageData?.contacts.find((item) => item.supplierId === supplierId);
    const rating = ratings.find((item) => item.supplierId === supplierId);
    setSupplierForm({
      supplierCode: supplier.supplierCode,
      supplierName: supplier.name,
      category: supplier.category,
      contactPerson: contact?.name ?? "",
      phone: contact?.phone ?? "",
      email: contact?.email ?? "",
      region: supplier.serviceRegion,
      leadTime: `${supplier.leadTimeDays}`,
      paymentTerm: "NET 30",
      status: supplier.status,
      rating: rating?.grade ?? "",
    });
  };

  const emptyRows = Array.from({ length: Math.max(0, 20 - filteredSuppliers.length) });

  const openDetail = (id: string) => {
    setFocusedSupplierId(id);
    setSelectedRowIds(new Set([id]));
    setViewMode("detail");
  };

  const showPreview = (label: string) => setPreviewMessage(`${label} opened.`);

  const columns: MultiDimColumn<(typeof filteredSuppliers)[number]>[] = [
    { key: "code", label: "Supplier Code", width: "120px", render: (row) => <p className="font-semibold">{row.supplierCode}</p> },
    { key: "name", label: "Supplier Name", width: "220px", render: (row) => <p className="font-semibold">{row.name}</p> },
    { key: "category", label: "Category", width: "120px", render: (row) => <p>{row.category}</p> },
    { key: "region", label: "Region", width: "120px", render: (row) => <p>{row.serviceRegion}</p> },
    { key: "contact", label: "Contact", width: "130px", render: (row) => <p>{pageData?.contacts.find((item) => item.supplierId === row.supplierId)?.name ?? "-"}</p> },
    { key: "lead", label: "Lead Time", width: "90px", render: (row) => <p>{row.leadTimeDays}d</p> },
    { key: "contract", label: "Contract Status", width: "130px", render: (row) => <TableFieldChip label={contracts.find((item) => item.supplierId === row.supplierId)?.status ?? "-"} tone="muted" /> },
    { key: "lastOrder", label: "Last Order", width: "110px", render: (row) => <p>{quotations.find((item) => item.supplierId === row.supplierId)?.effectiveFrom ?? "-"}</p> },
    { key: "issues", label: "Open Issues", width: "90px", render: (row) => <p>{issues.filter((item) => item.supplierId === row.supplierId).length}</p> },
    { key: "rating", label: "Rating", width: "90px", render: (row) => <div className="flex items-center gap-1"><Star className="h-3 w-3 fill-yellow-400 text-yellow-400" /><span className="font-semibold">{ratings.find((item) => item.supplierId === row.supplierId)?.grade ?? "N/A"}</span></div> },
    { key: "risk", label: "Risk", width: "95px", render: (row) => <TableFieldChip label={issues.some((item) => item.supplierId === row.supplierId) ? "watch" : "low"} tone={issues.some((item) => item.supplierId === row.supplierId) ? "warning" : "success"} /> },
    {
      key: "action",
      label: "Action",
      width: "80px",
      render: (row) => (
        <Button type="button" variant="ghost" size="icon" className="h-7 w-7" onClick={(event) => { event.stopPropagation(); openDetail(row.supplierId); }} title="View Detail">
          <Eye className="h-4 w-4" />
        </Button>
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

  if (!data || !pageData || !focusedSupplier) return null;

  return (
    <ErpShell activeHref="/psi/supplier">
      <div className="space-y-4 pb-24 md:pb-0">
        <header className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="hidden text-xs text-muted-foreground md:block">ME / PSI / Supplier</div>
            <h1 className="mt-1 text-lg font-semibold tracking-tight text-foreground md:mt-3 md:text-2xl">ME PSI Supplier</h1>
            <p className="mt-1 hidden text-sm text-muted-foreground md:block">{viewMode === "grid" ? "Normal View: wide supplier master grid with compact selected supplier summary." : "Detail View: 40% quick supplier list and 60% full supplier detail."}</p>
          </div>
          <div className="flex items-center gap-2">
            {viewMode === "detail" ? (
              <Button variant="outline" size="sm" onClick={() => setViewMode("grid")}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to List
              </Button>
            ) : null}
            <Button variant="outline" size="sm" className="hidden md:inline-flex" onClick={() => showPreview("Export")}> 
              <FileDown className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button size="sm" onClick={() => {
              setEditingSupplier(true);
              setSupplierForm({
                supplierCode: "",
                supplierName: "",
                category: "",
                contactPerson: "",
                phone: "",
                email: "",
                region: "",
                leadTime: "",
                paymentTerm: "NET 30",
                status: "active",
                rating: "",
              });
            }}>
              <Plus className="mr-2 h-4 w-4" />
              Add Supplier
            </Button>
          </div>
        </header>

        <div className="md:hidden rounded-xl border border-border bg-card p-3 space-y-2">
          <div className="h-10 rounded-lg border border-border bg-background px-3 text-sm text-muted-foreground flex items-center">
            Search supplier name / code...
          </div>
          <div className="flex flex-wrap gap-2">
            {["All", "Active", "Expiring", "Risk"].map((chip) => (
              <Badge key={chip} variant="outline" className="text-xs">{chip}</Badge>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" className="h-8 text-xs" onClick={() => showPreview("Sort")}>Sort</Button>
            <Button size="sm" variant="outline" className="h-8 text-xs" onClick={() => showPreview("More Filters")}>Filters</Button>
          </div>
        </div>

        <div className="hidden md:block">
          <TableViewTabs title="Saved Views" tabs={viewTabs} value={viewKey} onChange={setViewKey} />
        </div>

        <div className="hidden md:block">
        <CompactStatStrip
          items={[
            { label: "Total Suppliers", value: pageData.stats.totalSuppliers },
            { label: "Active", value: pageData.stats.activeSuppliers, tone: "success" },
            { label: "Contract Expiring", value: contracts.filter((item) => item.status === "review").length, tone: "warning" },
            { label: "Risk / Issues", value: issues.length, tone: "danger" },
          ]}
        />
        </div>

        <div className="hidden md:block">
        <TableActionBar
          searchPlaceholder="Search supplier name / code..."
          selectedCount={selectedRowIds.size}
          bulkActionLabel="Create PR"
          bulkActionKey="supplier.create_pr_preview"
          density={density}
          onDensityChange={setDensity}
          onClearSelection={() => setSelectedRowIds(new Set())}
          columns={["Supplier Code", "Supplier Name", "Category", "Region", "Contact", "Lead Time", "Contract Status", "Last Order", "Open Issues", "Rating", "Risk"]}
          sortOptions={["Supplier Name", "Lead Time", "Open Issues", "Rating"]}
          advancedFilters={[{ title: "Supplier", items: ["Category", "Region", "Contract Status", "Rating", "Risk", "Status", "Lead Time"] }]}
          filters={
            <div className="flex items-center gap-2">
              {[
                "Category: All",
                "Region: All",
                "Contract: All",
                "Rating: All",
                "Risk: Watch",
                "Status: Active",
              ].map((item) => (
                <Badge key={item} variant="outline" className="h-7 px-2 font-normal border-dashed">{item}</Badge>
              ))}
              <Badge variant="outline" className="h-7 px-2 font-normal border-dashed text-primary border-primary/30 bg-primary/5">More Filters</Badge>
            </div>
          }
        />
        </div>

        <div className="hidden md:block rounded-lg border border-border/60 bg-secondary/10 px-3 py-2 text-xs text-muted-foreground">{previewMessage}</div>

        {editingSupplier ? (
          <section className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold">Supplier File</h2>
              <Button variant="outline" size="sm" onClick={() => setEditingSupplier(false)}>Close</Button>
            </div>
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              {[
                ["Supplier Code", "supplierCode"],
                ["Supplier Name", "supplierName"],
                ["Category", "category"],
                ["Contact Person", "contactPerson"],
                ["Phone", "phone"],
                ["Email", "email"],
                ["Region", "region"],
                ["Lead Time (days)", "leadTime"],
                ["Payment Term", "paymentTerm"],
                ["Status", "status"],
                ["Rating", "rating"],
              ].map(([label, key]) => (
                <div key={key} className="space-y-1">
                  <Label className="text-xs text-muted-foreground">{label}</Label>
                  <Input
                    value={supplierForm[key as keyof typeof supplierForm]}
                    onChange={(event) => setSupplierForm((prev) => ({ ...prev, [key]: event.target.value }))}
                  />
                </div>
              ))}
            </div>
            <div className="mt-4 flex gap-2">
              <Button size="sm" onClick={() => { setPreviewMessage("Supplier file updated."); setEditingSupplier(false); }}>Save</Button>
              <Button size="sm" variant="outline" onClick={() => setEditingSupplier(false)}>Cancel</Button>
            </div>
          </section>
        ) : null}

        {viewMode === "detail" ? (
          <>
          <section className="space-y-3 md:hidden">
            <div className="rounded-xl border border-border bg-card p-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-xs text-muted-foreground">Selected Supplier</p>
                  <h2 className="text-lg font-semibold">{focusedSupplier.name}</h2>
                  <p className="text-xs text-muted-foreground">{focusedSupplier.supplierCode}</p>
                </div>
                <Badge variant="outline">{focusedSupplier.status}</Badge>
              </div>
              <div className="mt-3 space-y-4">
                <DetailSection title="Supplier Header">
                  <FactRow label="Supplier Code" value={focusedSupplier.supplierCode} />
                  <FactRow label="Supplier Name" value={focusedSupplier.name} />
                  <FactRow label="Status" value={focusedSupplier.status} />
                  <FactRow label="Category" value={focusedSupplier.category} />
                  <FactRow label="Region" value={focusedSupplier.serviceRegion} />
                  <FactRow label="Risk" value={focusedIssues.length > 0 ? "watch" : "low"} />
                </DetailSection>
                <DetailSection title="Contact & Contract">
                  <FactRow label="Contact Person" value={focusedContact?.name ?? "-"} />
                  <FactRow label="Phone" value={focusedContact?.phone ?? "-"} />
                  <FactRow label="Email" value={focusedContact?.email ?? "-"} />
                  <FactRow label="Contract Status" value={focusedContract?.status ?? "-"} />
                  <FactRow label="Contract No" value={focusedContract?.contractId ?? "-"} />
                  <FactRow label="Expiry Date" value={focusedContract?.effectiveTo ?? "-"} />
                </DetailSection>
                <DetailSection title="Procurement / Quality">
                  <FactRow label="Open Issues" value={String(focusedIssues.length)} />
                  <FactRow label="Rating" value={focusedRating?.grade ?? "N/A"} />
                  <FactRow label="Lead Time" value={`${focusedSupplier.leadTimeDays}d`} />
                  <FactRow label="Last Order" value={linkedOrders[0]?.effectiveFrom ?? "-"} />
                  <FactRow label="Linked PR" value={linkedOrders[0]?.quotationId ?? "-"} />
                  <FactRow label="Linked Inventory SKU" value={linkedOrders[0]?.skuId ?? "-"} />
                </DetailSection>
              </div>
              <Button size="sm" className="mt-3 w-full" onClick={() => showPreview("View Supplier")}>View Supplier</Button>
            </div>
          </section>
          <section className="hidden gap-4 md:grid xl:grid-cols-[minmax(360px,0.4fr)_minmax(620px,0.6fr)]">
            <div className="rounded-xl border border-border bg-card">
              <div className="flex items-center justify-between border-b border-border p-4">
                <div>
                  <h2 className="text-base font-semibold">Quick Supplier List</h2>
                  <p className="mt-1 text-xs text-muted-foreground">Fixed 20-row speed list · Supplier Code and Supplier Name only.</p>
                </div>
              </div>
              <div className="overflow-hidden px-3 pt-3">
                <div className="grid h-10 grid-cols-[140px_minmax(170px,1fr)_42px] items-center rounded-t-lg border border-border bg-secondary/30 px-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  <div>Supplier Code</div>
                  <div>Supplier Name</div>
                  <div />
                </div>
                <div className="h-[760px] border-x border-border">
                  {filteredSuppliers.map((item) => (
                    <div key={item.supplierId} className={["grid h-[38px] grid-cols-[140px_minmax(170px,1fr)_42px] items-center border-b border-border px-3", focusedSupplier.supplierId === item.supplierId ? "bg-primary/12" : "hover:bg-secondary/30"].join(" ")}>
                      <button type="button" className="truncate text-left font-semibold" onClick={() => setFocusedSupplierId(item.supplierId)}>{item.supplierCode}</button>
                      <button type="button" className="truncate text-left" onClick={() => setFocusedSupplierId(item.supplierId)}>{item.name}</button>
                      <Button type="button" variant="ghost" size="icon" className="h-7 w-7" onClick={() => openDetail(item.supplierId)} title="View Detail"><Eye className="h-4 w-4" /></Button>
                    </div>
                  ))}
                  {emptyRows.map((_, index) => (
                    <div key={`empty-${index}`} className="grid h-[38px] grid-cols-[140px_minmax(170px,1fr)_42px] items-center border-b border-border px-3 text-muted-foreground/35">
                      <div>—</div><div>Empty row slot</div><div />
                    </div>
                  ))}
                </div>
                <div className="flex h-12 flex-wrap items-center justify-between gap-2 rounded-b-lg border border-border bg-secondary/10 px-3 text-xs text-muted-foreground">
                  <div className="flex flex-wrap items-center gap-3"><span>Showing 1–20 of 126</span><span>Selected {selectedRowIds.size}</span><span>Rows per page 20 / 50 / 100</span><span>Page 1 of 7</span></div>
                  <div className="flex items-center gap-2"><Button variant="outline" size="sm" className="h-8">Prev</Button><Button variant="outline" size="sm" className="h-8">Next</Button></div>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card">
              <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border p-4">
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">Supplier Detail Workspace</div>
                  <h2 className="mt-2 text-2xl font-semibold">{focusedSupplier.name}</h2>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <Badge variant="secondary">{focusedSupplier.supplierCode}</Badge>
                    <Badge variant="outline">{focusedSupplier.category}</Badge>
                    <Badge variant="outline">{focusedSupplier.serviceRegion}</Badge>
                    <Badge variant="outline">{focusedSupplier.status}</Badge>
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={() => setViewMode("grid")}><ArrowLeft className="mr-2 h-4 w-4" />Back to Grid</Button>
              </div>
              <div className="max-h-[calc(100vh-230px)] space-y-5 overflow-y-auto p-4">
                <DetailSection title="Supplier Header">
                  <FactRow label="Supplier Code" value={focusedSupplier.supplierCode} />
                  <FactRow label="Supplier Name" value={focusedSupplier.name} />
                  <FactRow label="Status" value={focusedSupplier.status} />
                  <FactRow label="Risk" value={focusedIssues.length > 0 ? "watch" : "low"} />
                  <FactRow label="Category" value={focusedSupplier.category} />
                  <FactRow label="Region" value={focusedSupplier.serviceRegion} />
                </DetailSection>
                <DetailSection title="Contact & Account">
                  <FactRow label="Contact Person" value={focusedContact?.name ?? "-"} />
                  <FactRow label="Phone" value={focusedContact?.phone ?? "-"} />
                  <FactRow label="Email" value={focusedContact?.email ?? "-"} />
                  <FactRow label="Region" value={focusedSupplier.serviceRegion} />
                  <FactRow label="Service Area" value={focusedSupplier.serviceRegion} />
                  <FactRow label="Payment Terms" value="30 days" />
                </DetailSection>
                <DetailSection title="Contract">
                  <FactRow label="Contract Status" value={focusedContract?.status ?? "-"} />
                  <FactRow label="Contract No" value={focusedContract?.contractId ?? "-"} />
                  <FactRow label="Start Date" value={focusedContract?.effectiveFrom ?? "-"} />
                  <FactRow label="Expiry Date" value={focusedContract?.effectiveTo ?? "-"} />
                  <FactRow label="Renewal Status" value={focusedContract?.status ?? "-"} />
                  <FactRow label="Credit Terms" value="NET 30" />
                </DetailSection>
                <DetailSection title="Procurement Link">
                  <FactRow label="Active PR" value={String(linkedOrders.length)} />
                  <FactRow label="Active PO" value={String(linkedOrders.length)} />
                  <FactRow label="Last Order" value={linkedOrders[0]?.effectiveFrom ?? "-"} />
                  <FactRow label="Average Lead Time" value={`${focusedSupplier.leadTimeDays}d`} />
                  <FactRow label="Delivery Reliability" value={focusedIssues.length > 0 ? "watch" : "stable"} />
                </DetailSection>
                <DetailSection title="Quality / Risk">
                  <FactRow label="Open Issues" value={String(focusedIssues.length)} />
                  <FactRow label="Late Dispatch" value={focusedIssues.some((item) => item.priority === "high" || item.priority === "critical") ? "yes" : "no"} />
                  <FactRow label="Contract Dispute" value={focusedIssues.some((item) => item.status === "disputed") ? "yes" : "no"} />
                  <FactRow label="Certification Review" value={focusedContract?.status === "review" ? "required" : "ok"} />
                  <FactRow label="Rating" value={focusedRating?.grade ?? "N/A"} />
                  <FactRow label="Risk Level" value={focusedIssues.length > 0 ? "watch" : "low"} />
                </DetailSection>
                <DetailSection title="Linked Records">
                  <FactRow label="Linked PR" value={linkedOrders[0]?.quotationId ?? "-"} />
                  <FactRow label="Linked PO" value={linkedOrders[0]?.quotationId ?? "-"} />
                  <FactRow label="Linked Receiving" value="RCV-1001" />
                  <FactRow label="Linked Inventory SKU" value={linkedOrders[0]?.skuId ?? "-"} />
                </DetailSection>
                <section className="rounded-xl border border-border bg-secondary/10 p-3">
                  <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">Actions</div>
                  <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
                    {[
                      "View Supplier",
                      "Create PR",
                      "Add Issue",
                      "Add Note",
                      "View Purchase History",
                    ].map((action) => (
                      <Button key={action} variant="outline" size="sm" onClick={() => showPreview(action)}>{action}</Button>
                    ))}
                  </div>
                </section>
              </div>
            </div>
          </section>
          </>
        ) : (
          <>
          <section className="space-y-3 md:hidden">
            {filteredSuppliers.map((row) => {
              const active = focusedSupplier.supplierId === row.supplierId;
              const contact = pageData.contacts.find((item) => item.supplierId === row.supplierId);
              const rating = ratings.find((item) => item.supplierId === row.supplierId);
              return (
                <div key={row.supplierId} className={["rounded-xl border p-3", active ? "border-primary/50 bg-primary/10" : "border-border bg-card"].join(" ")}>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-semibold">{row.name}</p>
                      <p className="text-xs text-muted-foreground">{row.supplierCode} · {row.category}</p>
                    </div>
                    <Badge variant="outline">{row.status}</Badge>
                  </div>
                  <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                    <div>Region: <span className="text-foreground">{row.serviceRegion}</span></div>
                    <div>Contact: <span className="text-foreground">{contact?.name ?? "-"}</span></div>
                    <div>Lead Time: <span className="text-foreground">{row.leadTimeDays}d</span></div>
                    <div>Rating: <span className="text-foreground">{rating?.grade ?? "N/A"}</span></div>
                  </div>
                  <Button size="sm" variant="outline" className="mt-3 w-full" onClick={() => openDetail(row.supplierId)}>
                    <Eye className="mr-2 h-4 w-4" />
                    View
                  </Button>
                  <Button size="sm" variant="outline" className="mt-2 w-full" onClick={() => { setFocusedSupplierId(row.supplierId); loadSupplierForm(row.supplierId); setEditingSupplier(true); }}>
                    Edit
                  </Button>
                </div>
              );
            })}
          </section>
          <section className="hidden gap-4 md:grid xl:grid-cols-[minmax(0,1fr)_320px]">
            <MultidimensionalTable
              columns={columns}
              rows={filteredSuppliers}
              rowIdKey="supplierId"
              selectedRowIds={selectedRowIds}
              onToggleRow={toggleRow}
              onToggleAll={toggleAll}
              selectedRecordId={focusedSupplier.supplierId}
              onRowFocus={setFocusedSupplierId}
              pageLabel="Showing 1–50 of 126"
              rowsPerPageLabel="Rows per page 50 / 100 / 200"
              density={density}
            />

            <aside className="rounded-xl border border-border bg-card p-4">
              <div className="flex items-start justify-between gap-3 border-b border-border pb-4">
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">Selected Supplier</div>
                  <h2 className="mt-2 text-lg font-semibold">{focusedSupplier.name}</h2>
                  <p className="text-sm text-muted-foreground">{focusedSupplier.supplierCode}</p>
                </div>
                <Badge variant="outline">{focusedSupplier.status}</Badge>
              </div>
              <div className="mt-4 space-y-2">
                <FactRow label="Category" value={focusedSupplier.category} />
                <FactRow label="Region" value={focusedSupplier.serviceRegion} />
                <FactRow label="Contact" value={focusedContact?.name ?? "-"} />
                <FactRow label="Contract Status" value={focusedContract?.status ?? "-"} />
                <FactRow label="Open Issues" value={String(focusedIssues.length)} />
                <FactRow label="Rating" value={focusedRating?.grade ?? "N/A"} />
              </div>
              <div className="mt-4 grid gap-2">
                <Button onClick={() => setViewMode("detail")}><Eye className="mr-2 h-4 w-4" />View Detail</Button>
                <Button variant="outline" onClick={() => { loadSupplierForm(focusedSupplier.supplierId); setEditingSupplier(true); }}>Edit Supplier</Button>
                <Button variant="outline" onClick={() => showPreview("Create PR")}>Create PR</Button>
              </div>
            </aside>
          </section>
          </>
        )}
      </div>
    </ErpShell>
  );
}
