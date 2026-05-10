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
  const ratings = useMemo(() => pageData?.ratings ?? [], [pageData]);
  const quotations = useMemo(() => pageData?.quotations ?? [], [pageData]);

  const viewTabs = useMemo(
    () => [
      { key: "all", label: isZh ? "全部供应商" : "All Suppliers", count: suppliers.length },
      { key: "active", label: isZh ? "活跃" : "Active", count: suppliers.filter((item) => item.status === "active").length },
      { key: "expiring", label: isZh ? "合同将到期" : "Contract Expiring", count: contracts.filter((item) => item.status === "review").length },
      { key: "quality", label: isZh ? "质量异常" : "Quality Issues", count: issues.length },
      { key: "late", label: isZh ? "响应延迟" : "Late Response", count: issues.filter((item) => item.priority === "high" || item.priority === "critical").length },
      { key: "blocked", label: isZh ? "已阻断" : "Blocked", count: suppliers.filter((item) => item.status === "blocked").length },
      { key: "category", label: isZh ? "按分类" : "By Category", count: new Set(suppliers.map((item) => item.category)).size },
    ],
    [contracts, isZh, issues, suppliers]
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
        return suppliers.filter((item) => ["Dairy", "Dry Goods", "Beverage"].includes(item.category));
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
  const linkedOrders = focusedSupplier ? quotations.filter((item) => item.supplierId === focusedSupplier.supplierId).slice(0, 2) : [];

  const columns: MultiDimColumn<(typeof filteredSuppliers)[number]>[] = [
    { key: "code", label: isZh ? "Supplier Code" : "Supplier Code", width: "115px", render: (row) => <p className={moduleVisual.title}>{row.supplierCode}</p> },
    { key: "name", label: isZh ? "Supplier Name" : "Supplier Name", width: "220px", render: (row) => <p className={moduleVisual.title}>{row.name}</p> },
    { key: "category", label: isZh ? "Category" : "Category", width: "110px", render: (row) => <p className={moduleVisual.body}>{row.category}</p> },
    { key: "region", label: isZh ? "Region" : "Region", width: "130px", render: (row) => <p className={moduleVisual.body}>{row.serviceRegion}</p> },
    { key: "contact", label: isZh ? "Contact" : "Contact", width: "100px", render: (row) => <p className={moduleVisual.body}>{pageData?.contacts.find((item) => item.supplierId === row.supplierId)?.name ?? "-"}</p> },
    { key: "lead", label: isZh ? "Lead Time" : "Lead Time", width: "90px", render: (row) => <p className={moduleVisual.body}>{row.leadTimeDays}d</p> },
    { key: "contract", label: isZh ? "Contract Status" : "Contract Status", width: "115px", render: (row) => <TableFieldChip label={contracts.find((item) => item.supplierId === row.supplierId)?.status ?? "-"} tone="muted" /> },
    { key: "lastOrder", label: isZh ? "Last Order" : "Last Order", width: "110px", render: (row) => <p className={moduleVisual.body}>{quotations.find((item) => item.supplierId === row.supplierId)?.effectiveFrom ?? "-"}</p> },
    { key: "issues", label: isZh ? "Open Issues" : "Open Issues", width: "95px", render: (row) => <p className={moduleVisual.body}>{issues.filter((item) => item.supplierId === row.supplierId).length}</p> },
    {
      key: "rating",
      label: isZh ? "Rating" : "Rating",
      width: "90px",
      render: (row) => (
        <div className="flex items-center gap-1">
          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
          <span className={moduleVisual.title}>{ratings.find((item) => item.supplierId === row.supplierId)?.grade ?? "N/A"}</span>
        </div>
      ),
    },
    {
      key: "risk",
      label: isZh ? "Risk" : "Risk",
      width: "90px",
      render: (row) => (
        <TableFieldChip
          label={issues.some((item) => item.supplierId === row.supplierId) ? "watch" : "low"}
          tone={issues.some((item) => item.supplierId === row.supplierId) ? "warning" : "success"}
        />
      ),
    },
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
          title={isZh ? "ME PSI 供应商" : "ME PSI Supplier"}
          subtitle={isZh ? "供应商主数据与风险管理工作台。" : "Supplier master list and risk management workspace."}
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

        <TableViewTabs title={isZh ? "已保存视图" : "Saved Views"} tabs={viewTabs} value={viewKey} onChange={setViewKey} />

        <CompactStatStrip
          items={[
            { label: isZh ? "Total Suppliers" : "Total Suppliers", value: pageData.stats.totalSuppliers },
            { label: isZh ? "Active" : "Active", value: pageData.stats.activeSuppliers, tone: "success" },
            { label: isZh ? "Contract Expiring" : "Contract Expiring", value: contracts.filter((item) => item.status === "review").length, tone: "warning" },
            { label: isZh ? "Risk / Issues" : "Risk / Issues", value: issues.length, tone: "danger" },
          ]}
        />

        <TableActionBar
          searchPlaceholder={isZh ? "搜索供应商名称 / 编码..." : "Search supplier name / code..."}
          selectedCount={selectedRowIds.size}
          bulkActionLabel={isZh ? "批量动作（预览）" : "Bulk Action (Preview)"}
          filters={
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="h-7 px-2 font-normal border-dashed">{isZh ? "分类: 全部" : "Category: All"}</Badge>
              <Badge variant="outline" className="h-7 px-2 font-normal border-dashed">{isZh ? "区域: 全部" : "Region: All"}</Badge>
              <Badge variant="outline" className="h-7 px-2 font-normal border-dashed">{isZh ? "合同: 全部" : "Contract: All"}</Badge>
              <Badge variant="outline" className="h-7 px-2 font-normal border-dashed">{isZh ? "评级: 全部" : "Rating: All"}</Badge>
              <Badge variant="outline" className="h-7 px-2 font-normal border-dashed">{isZh ? "风险: 关注" : "Risk: Watch"}</Badge>
              <Badge variant="outline" className="h-7 px-2 font-normal border-dashed">{isZh ? "状态: 活跃" : "Status: Active"}</Badge>
              <Badge variant="outline" className="h-7 px-2 font-normal border-dashed text-primary border-primary/30 bg-primary/5">{isZh ? "更多筛选" : "More Filters"}</Badge>
            </div>
          }
        />

        <ModuleTwoColumn className="xl:grid-cols-[minmax(0,1fr)_18.5rem]">
          <div className="space-y-3">
            <ModuleSection title={isZh ? "供应商主数据列表" : "Supplier Master List"} className="p-3">
              <MultidimensionalTable
                columns={columns}
                rows={filteredSuppliers}
                rowIdKey="supplierId"
                selectedRowIds={selectedRowIds}
                onToggleRow={toggleRow}
                onToggleAll={toggleAll}
                selectedRecordId={focusedSupplier?.supplierId}
                onRowFocus={setFocusedSupplierId}
                pageLabel={isZh ? "显示 1–50 / 共 126" : "Showing 1–50 of 126"}
                rowsPerPageLabel={isZh ? "每页 50 / 100 / 200" : "Rows per page 50 / 100 / 200"}
              />
            </ModuleSection>
          </div>

          <div className="xl:sticky xl:top-4 self-start">
            <RecordDetailPanel
              title={isZh ? "选中供应商" : "Selected Supplier"}
              subtitle={focusedSupplier ? `${focusedSupplier.name} / ${focusedSupplier.supplierCode}` : "-"}
              fields={[
                { label: isZh ? "联系人" : "Contact", value: focusedContact?.name ?? "-" },
                { label: isZh ? "分类" : "Category", value: focusedSupplier?.category ?? "-" },
                { label: isZh ? "区域" : "Region", value: focusedSupplier?.serviceRegion ?? "-" },
                { label: isZh ? "交期" : "Lead Time", value: focusedSupplier ? `${focusedSupplier.leadTimeDays}d` : "-" },
                { label: isZh ? "合同" : "Contract", value: focusedContract?.status ?? "-" },
                { label: isZh ? "最近下单" : "Last Order", value: linkedOrders[0]?.effectiveFrom ?? "-" },
                { label: isZh ? "开放问题" : "Open Issues", value: focusedIssues.length },
                { label: isZh ? "评分" : "Rating", value: focusedRating?.grade ?? "N/A" },
              ]}
              sections={[
                {
                  title: isZh ? "关联 PR / PO" : "Linked PR / PO",
                  items: linkedOrders.map((order) => (
                    <div key={order.quotationId}>
                      <p className={moduleVisual.title}>{order.skuId}</p>
                      <p className={moduleVisual.muted}>{order.effectiveFrom}</p>
                    </div>
                  )),
                },
                {
                  title: isZh ? "质量备注" : "Quality Notes",
                  items: focusedIssues.slice(0, 3).map((issue) => (
                    <div key={issue.issueId}>
                      <p className={moduleVisual.title}>{issue.title[locale]}</p>
                      <p className={moduleVisual.muted}>{issue.status}</p>
                    </div>
                  )),
                },
              ]}
              actionLabels={[
                isZh ? "查看供应商" : "View Supplier",
                isZh ? "创建 PR 预览" : "Create PR Preview",
                isZh ? "新增问题" : "Add Issue",
                isZh ? "添加备注" : "Add Note",
              ]}
              statusLabel={focusedSupplier?.status}
            />
          </div>
        </ModuleTwoColumn>
      </ModulePageStack>
    </ErpShell>
  );
}
