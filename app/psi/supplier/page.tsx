"use client";

import { ErpPageHeader, ErpShell } from "@/components/erp";
import { ModulePageStack, ModuleSection, ModuleTwoColumn, moduleVisual } from "@/components/erp/module-shell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CompactStatStrip } from "@/components/operations/compact-stat-strip";
import { TableActionBar } from "@/components/operations/table-action-bar";
import { TableFieldChip } from "@/components/operations/table-field-chip";
import { TableViewTabs } from "@/components/operations/table-view-tabs";
import { MultidimensionalTable, type MultiDimColumn } from "@/components/operations/multidimensional-table";
import { RecordDetailPanel } from "@/components/operations/record-detail-panel";
import { getPsiSupplierWorkspacePageData } from "@/lib/page-data/psi";
import { useUiPreferencesStore } from "@/stores/ui-preferences";
import { useEffect, useMemo, useState } from "react";
import type { PsiSupplierWorkspacePageData } from "@/lib/page-data/psi";
import { Plus, FileDown, MoreHorizontal, Star } from "lucide-react";

export default function PsiSupplierPage() {
  const [data, setData] = useState<PsiSupplierWorkspacePageData | null>(null);
  const [viewKey, setViewKey] = useState("all");
  const [selectedRowIds, setSelectedRowIds] = useState<Set<string>>(new Set());
  const [focusedSupplierId, setFocusedSupplierId] = useState<string | null>(null);
  const locale = useUiPreferencesStore((state) => state.locale);
  const isZh = locale === "zh";

  useEffect(() => {
    getPsiSupplierWorkspacePageData().then(setData);
  }, []);

  const pageData = data?.pageData;
  const suppliers = useMemo(() => pageData?.suppliers ?? [], [pageData]);
  const issues = useMemo(() => pageData?.issues ?? [], [pageData]);
  const contracts = useMemo(() => pageData?.contracts ?? [], [pageData]);
  const contractExpiring = contracts.filter((item) => item.status === "review");

  const viewTabs = useMemo(
    () => [
      { key: "all", label: isZh ? "全部供应商" : "All Suppliers", count: suppliers.length },
      { key: "active", label: isZh ? "活跃" : "Active", count: suppliers.filter((item) => item.status === "active").length },
      { key: "expiring", label: isZh ? "合同将到期" : "Contract Expiring", count: contractExpiring.length },
      { key: "quality", label: isZh ? "质量异常" : "Quality Issues", count: issues.length },
      { key: "review", label: isZh ? "待复核" : "Review Needed", count: suppliers.filter((item) => item.status === "review").length },
    ],
    [contractExpiring.length, isZh, issues.length, suppliers]
  );

  const filteredSuppliers = useMemo(() => {
    switch (viewKey) {
      case "active":
        return suppliers.filter((item) => item.status === "active");
      case "expiring":
        return suppliers.filter((item) => contracts.some((contract) => contract.supplierId === item.supplierId && contract.status === "review"));
      case "quality":
        return suppliers.filter((item) => issues.some((issue) => issue.supplierId === item.supplierId));
      case "review":
        return suppliers.filter((item) => item.status === "review");
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
  const focusedRating = focusedSupplier ? pageData?.ratings.find((item) => item.supplierId === focusedSupplier.supplierId) : null;
  const focusedIssues = focusedSupplier ? issues.filter((item) => item.supplierId === focusedSupplier.supplierId) : [];
  const focusedProducts = focusedSupplier ? (pageData?.products ?? []).filter((item) => item.supplierId === focusedSupplier.supplierId) : [];

  const columns: MultiDimColumn<(typeof filteredSuppliers)[number]>[] = [
    { key: "code", label: isZh ? "Supplier Code" : "Supplier Code", width: "110px", render: (row) => <p className={moduleVisual.title}>{row.supplierCode}</p> },
    { key: "name", label: isZh ? "Supplier Name" : "Supplier Name", width: "1.4fr", render: (row) => <p className={moduleVisual.title}>{row.name}</p> },
    { key: "category", label: isZh ? "Category" : "Category", width: "100px", render: (row) => <p className={moduleVisual.body}>{row.category}</p> },
    { key: "region", label: isZh ? "Region/Coverage" : "Region/Coverage", width: "130px", render: (row) => <p className={moduleVisual.body}>{row.serviceRegion}</p> },
    { key: "contact", label: isZh ? "Contact" : "Contact", width: "100px", render: (row) => <p className={moduleVisual.body}>{(pageData?.contacts.find((item) => item.supplierId === row.supplierId)?.name) ?? "-"}</p> },
    { key: "phone", label: isZh ? "Phone" : "Phone", width: "120px", render: (row) => <p className={moduleVisual.body}>{(pageData?.contacts.find((item) => item.supplierId === row.supplierId)?.phone) ?? "-"}</p> },
    { key: "lead", label: isZh ? "Lead Time" : "Lead Time", width: "90px", render: (row) => <p className={moduleVisual.body}>{row.leadTimeDays}d</p> },
    { key: "contract", label: isZh ? "Contract" : "Contract", width: "110px", render: (row) => <TableFieldChip label={contracts.find((item) => item.supplierId === row.supplierId)?.status ?? "-"} tone="muted" /> },
    { key: "lastOrder", label: isZh ? "Last Order" : "Last Order", width: "110px", render: () => <p className={moduleVisual.body}>-</p> },
    { key: "issues", label: isZh ? "Open Issues" : "Open Issues", width: "95px", render: (row) => <p className={moduleVisual.body}>{issues.filter((item) => item.supplierId === row.supplierId).length}</p> },
    {
      key: "rating",
      label: isZh ? "Rating" : "Rating",
      width: "85px",
      render: (row) => (
        <div className="flex items-center gap-1">
          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
          <span className={moduleVisual.title}>{pageData?.ratings.find((item) => item.supplierId === row.supplierId)?.grade ?? "N/A"}</span>
        </div>
      ),
    },
    { key: "risk", label: isZh ? "Risk" : "Risk", width: "90px", render: (row) => <TableFieldChip label={issues.some((item) => item.supplierId === row.supplierId) ? "Watch" : "Low"} tone={issues.some((item) => item.supplierId === row.supplierId) ? "warning" : "success"} /> },
    {
      key: "action",
      label: isZh ? "Action" : "Action",
      width: "70px",
      render: () => (
        <Button variant="ghost" size="icon" className="h-7 w-7">
          <MoreHorizontal className="h-4 w-4" />
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

  if (!data || !pageData) return null;

  return (
    <ErpShell activeHref="/psi/supplier">
      <ModulePageStack className="space-y-3">
        <ErpPageHeader
          breadcrumbs={["ME", "PSI", isZh ? "供应商" : "Supplier"]}
          title={isZh ? "ME PSI 供应商主数据" : "ME PSI Supplier Master"}
          subtitle={
            isZh
              ? "供应商主数据、履约质量、合同和风险概览。"
              : "Supplier master records, performance quality, contract, and risk overview."
          }
          actions={
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline" className="hidden md:inline-flex">
                <FileDown className="mr-2 h-4 w-4" />
                {isZh ? "导出" : "Export"}
              </Button>
              <Button size="sm">
                <Plus className="mr-2 h-4 w-4" />
                {isZh ? "新增供应商" : "Add Supplier"}
              </Button>
            </div>
          }
        />

        <TableViewTabs tabs={viewTabs} value={viewKey} onChange={setViewKey} />

        <CompactStatStrip
          items={[
            { label: isZh ? "Total Suppliers" : "Total Suppliers", value: pageData?.stats.totalSuppliers ?? 0 },
            { label: isZh ? "Active Suppliers" : "Active Suppliers", value: pageData?.stats.activeSuppliers ?? 0, tone: "success" },
            { label: isZh ? "Contract Expiring" : "Contract Expiring", value: contractExpiring.length, tone: "warning" },
            { label: isZh ? "Issues Open" : "Issues Open", value: issues.length, tone: "danger" },
          ]}
        />

        <TableActionBar
          searchPlaceholder={isZh ? "搜索供应商名称 / 编码..." : "Search supplier name / code..."}
          selectedCount={selectedRowIds.size}
          filters={
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="h-7 px-2 font-normal border-dashed">
                {isZh ? "分类: 全部" : "Category: All"}
              </Badge>
              <Badge variant="outline" className="h-7 px-2 font-normal border-dashed">
                {isZh ? "区域: 全部" : "Region: All"}
              </Badge>
              <Badge variant="outline" className="h-7 px-2 font-normal border-dashed">
                {isZh ? "合同: 全部" : "Contract: All"}
              </Badge>
              <Badge variant="outline" className="h-7 px-2 font-normal border-dashed text-emerald-400 border-emerald-500/30 bg-emerald-500/5">
                {isZh ? "状态: 活跃" : "Status: Active"}
              </Badge>
            </div>
          }
        />

        <ModuleTwoColumn className="xl:grid-cols-[minmax(0,1fr)_20rem]">
          <div className="space-y-3">
            <ModuleSection
              title={isZh ? "供应商名录" : "Supplier Master List"}
              className="p-3"
            >
              <MultidimensionalTable
                columns={columns}
                rows={filteredSuppliers}
                rowIdKey="supplierId"
                selectedRowIds={selectedRowIds}
                onToggleRow={toggleRow}
                onToggleAll={toggleAll}
                selectedRecordId={focusedSupplier?.supplierId}
                onRowFocus={setFocusedSupplierId}
              />
            </ModuleSection>

            <ModuleSection
              title={isZh ? "最近采购活动" : "Supplier Activity / Recent Orders"}
              className="p-3"
            >
              <div className="space-y-2">
                {suppliers.slice(0, 4).map((supplierItem) => (
                  <div key={supplierItem.supplierId} className="rounded-md border border-border/60 px-2.5 py-2">
                    <p className={moduleVisual.title}>{supplierItem.name}</p>
                    <p className={moduleVisual.muted}>{supplierItem.supplierCode} · {supplierItem.serviceRegion}</p>
                  </div>
                ))}
              </div>
            </ModuleSection>
          </div>

          <div className="xl:sticky xl:top-4 self-start">
            <RecordDetailPanel
              title={isZh ? "选中供应商" : "Selected Supplier"}
              subtitle={focusedSupplier ? `${focusedSupplier.name} / ${focusedSupplier.supplierCode}` : "-"}
              fields={[
                { label: isZh ? "分类" : "Category", value: focusedSupplier?.category ?? "-" },
                { label: isZh ? "联系人" : "Contact", value: focusedContact?.name ?? "-" },
                { label: isZh ? "电话" : "Phone", value: focusedContact?.phone ?? "-" },
                { label: isZh ? "覆盖区域" : "Branch Coverage", value: focusedSupplier?.serviceRegion ?? "-" },
                { label: isZh ? "合同状态" : "Contract", value: focusedContract?.status ?? "-" },
                { label: isZh ? "质量问题数" : "Quality Issues", value: focusedIssues.length },
                { label: isZh ? "评分" : "Rating", value: focusedRating?.grade ?? "N/A" },
              ]}
              sections={[
                {
                  title: isZh ? "最近订单" : "Recent Orders",
                  items: focusedProducts.slice(0, 3).map((item) => (
                    <div key={item.productLinkId}>
                      <p className={moduleVisual.title}>{item.productName}</p>
                      <p className={moduleVisual.muted}>MOQ {item.moq}</p>
                    </div>
                  )),
                },
                {
                  title: isZh ? "证照/文档" : "Documents / Certificates",
                  items: [
                    <div key="doc-status">
                      <p className={moduleVisual.title}>{isZh ? "营业执照" : "Business License"}</p>
                      <p className={moduleVisual.muted}>{isZh ? "有效（预览）" : "Valid (Preview)"}</p>
                    </div>,
                  ],
                },
                {
                  title: isZh ? "活动" : "Activity",
                  items: focusedIssues.slice(0, 3).map((issue) => (
                    <div key={issue.issueId}>
                      <p className={moduleVisual.title}>{issue.title[locale]}</p>
                      <p className={moduleVisual.muted}>{issue.status}</p>
                    </div>
                  )),
                },
              ]}
              actionLabels={[isZh ? "查看档案" : "View Profile", isZh ? "添加备注" : "Add Note", isZh ? "关联 PR" : "Link PR"]}
            />
          </div>
        </ModuleTwoColumn>
      </ModulePageStack>
    </ErpShell>
  );
}
