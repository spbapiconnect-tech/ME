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
import { getPsiProcurementWorkspacePageData } from "@/lib/page-data/psi";
import { useUiPreferencesStore } from "@/stores/ui-preferences";
import { useEffect, useMemo, useState } from "react";
import type { PsiProcurementWorkspacePageData } from "@/lib/page-data/psi";
import { Plus, FileDown, MoreHorizontal } from "lucide-react";

export default function ReceivingPage() {
  const [data, setData] = useState<PsiProcurementWorkspacePageData | null>(null);
  const [viewKey, setViewKey] = useState("all");
  const [selectedRowIds, setSelectedRowIds] = useState<Set<string>>(new Set());
  const [focusedReceivingId, setFocusedReceivingId] = useState<string | null>(null);
  const locale = useUiPreferencesStore((state) => state.locale);
  const isZh = locale === "zh";

  useEffect(() => {
    getPsiProcurementWorkspacePageData().then(setData);
  }, []);

  const pageData = data?.pageData;
  const receiving = useMemo(() => pageData?.receivingRecords ?? [], [pageData]);
  const orders = useMemo(() => pageData?.purchaseOrders ?? [], [pageData]);
  const issues = useMemo(() => (pageData?.purchaseIssues ?? []).filter((item) => item.issueType === "receiving"), [pageData]);

  const viewTabs = useMemo(
    () => [
      { key: "all", label: isZh ? "全部收货" : "All Receiving", count: receiving.length },
      { key: "awaiting", label: isZh ? "待到货" : "Awaiting Arrival", count: Math.max(orders.length - receiving.length, 0) },
      { key: "today", label: isZh ? "今日收货" : "Received Today", count: receiving.filter((item) => item.status === "completed").length },
      { key: "variance", label: isZh ? "发现差异" : "Variance Found", count: receiving.filter((item) => item.status === "disputed").length },
      { key: "pending", label: isZh ? "待过账" : "Pending Posting", count: receiving.filter((item) => item.status === "pending").length },
      { key: "inspection", label: isZh ? "待验收" : "Inspection Required", count: receiving.filter((item) => item.status === "review").length },
      { key: "disputed", label: isZh ? "争议" : "Disputed", count: receiving.filter((item) => item.status === "disputed").length },
    ],
    [isZh, orders.length, receiving]
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

  const columns: MultiDimColumn<(typeof filteredReceiving)[number]>[] = [
    { key: "grn", label: "GRN No", width: "120px", render: (row) => <p className={moduleVisual.title}>{row.receivingNo}</p> },
    { key: "po", label: "PO No", width: "120px", render: (row) => <p className={moduleVisual.body}>{orders.find((item) => item.orderId === row.orderId)?.orderNo ?? row.orderId}</p> },
    { key: "supplier", label: isZh ? "Supplier" : "Supplier", width: "130px", render: (row) => <p className={moduleVisual.body}>{row.supplierId}</p> },
    { key: "branch", label: isZh ? "Branch" : "Branch", width: "90px", render: (row) => <p className={moduleVisual.body}>{row.warehouseId}</p> },
    { key: "expected", label: isZh ? "Expected Date" : "Expected Date", width: "110px", render: (row) => <p className={moduleVisual.body}>{orders.find((item) => item.orderId === row.orderId)?.expectedReceivingDate?.split("T")[0] ?? "-"}</p> },
    { key: "received", label: isZh ? "Received Date" : "Received Date", width: "110px", render: (row) => <p className={moduleVisual.body}>{row.receivedAt.split("T")[0]}</p> },
    { key: "receivedBy", label: isZh ? "Received By" : "Received By", width: "100px", render: (row) => <p className={moduleVisual.body}>{row.audit.updatedBy ?? row.audit.createdBy ?? "-"}</p> },
    { key: "items", label: isZh ? "Items" : "Items", width: "70px", render: (row) => <p className={moduleVisual.body}>{row.lines.length}</p> },
    {
      key: "variance",
      label: isZh ? "Variance" : "Variance",
      width: "95px",
      render: (row) => <TableFieldChip label={row.status === "disputed" ? "found" : "none"} tone={row.status === "disputed" ? "danger" : "success"} />,
    },
    {
      key: "inspection",
      label: isZh ? "Inspection" : "Inspection",
      width: "95px",
      render: (row) => <TableFieldChip label={row.status === "review" ? "required" : "ok"} tone={row.status === "review" ? "warning" : "success"} />,
    },
    {
      key: "posting",
      label: isZh ? "Posting Status" : "Posting Status",
      width: "105px",
      render: (row) => <TableFieldChip label={row.status} tone={row.status === "completed" ? "success" : row.status === "disputed" ? "danger" : "warning"} />,
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
    <ErpShell activeHref="/psi/receiving">
      <ModulePageStack className="space-y-3">
        <ErpPageHeader
          breadcrumbs={["ME", "PSI", isZh ? "收货" : "Receiving"]}
          title={isZh ? "ME PSI 收货" : "ME PSI Receiving"}
          subtitle={isZh ? "GRN、差异、验收与过账就绪。" : "GRN, variance, inspection, and posting readiness."}
          actions={
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline" className="hidden md:inline-flex">
                <FileDown className="mr-2 h-4 w-4" />
                {isZh ? "导出" : "Export"}
              </Button>
              <Button size="sm">
                <Plus className="mr-2 h-4 w-4" />
                {isZh ? "新增收货" : "New Receiving"}
              </Button>
            </div>
          }
        />

        <TableViewTabs title={isZh ? "已保存视图" : "Saved Views"} tabs={viewTabs} value={viewKey} onChange={setViewKey} />

        <CompactStatStrip
          items={[
            { label: isZh ? "Awaiting Arrival" : "Awaiting Arrival", value: Math.max(orders.length - receiving.length, 0), tone: "warning" },
            { label: isZh ? "Received Today" : "Received Today", value: pageData.stats.receivingToday, tone: "success" },
            { label: isZh ? "Variance Found" : "Variance Found", value: receiving.filter((item) => item.status === "disputed").length, tone: "danger" },
            { label: isZh ? "Pending Posting" : "Pending Posting", value: receiving.filter((item) => item.status === "pending").length, tone: "warning" },
          ]}
        />

        <TableActionBar
          searchPlaceholder={isZh ? "搜索 GRN / PO no..." : "Search GRN / PO no..."}
          selectedCount={selectedRowIds.size}
          filters={
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="h-7 px-2 font-normal border-dashed">{isZh ? "分支: 全部" : "Branch: All"}</Badge>
              <Badge variant="outline" className="h-7 px-2 font-normal border-dashed">{isZh ? "供应商: 全部" : "Supplier: All"}</Badge>
              <Badge variant="outline" className="h-7 px-2 font-normal border-dashed">{isZh ? "仓储: 全部" : "Warehouse: All"}</Badge>
              <Badge variant="outline" className="h-7 px-2 font-normal border-dashed">{isZh ? "差异: 全部" : "Variance: All"}</Badge>
              <Badge variant="outline" className="h-7 px-2 font-normal border-dashed">{isZh ? "过账: 待过账" : "Posting: Pending"}</Badge>
              <Badge variant="outline" className="h-7 px-2 font-normal border-dashed">{isZh ? "收货日期: 本周" : "Received Date: This Week"}</Badge>
              <Badge variant="outline" className="h-7 px-2 font-normal border-dashed text-primary border-primary/30 bg-primary/5">{isZh ? "更多筛选" : "More Filters"}</Badge>
            </div>
          }
        />

        <ModuleTwoColumn className="xl:grid-cols-[minmax(0,1fr)_18.5rem]">
          <div className="space-y-3">
            <ModuleSection title={isZh ? "收货 / GRN 列表" : "Receiving / GRN List"} className="p-3">
              <MultidimensionalTable
                columns={columns}
                rows={filteredReceiving}
                rowIdKey="receivingId"
                selectedRowIds={selectedRowIds}
                onToggleRow={toggleRow}
                onToggleAll={toggleAll}
                selectedRecordId={focusedReceiving?.receivingId}
                onRowFocus={setFocusedReceivingId}
                pageLabel={isZh ? "显示 1–50 / 共 184" : "Showing 1–50 of 184"}
                rowsPerPageLabel={isZh ? "每页 50 / 100 / 200" : "Rows per page 50 / 100 / 200"}
              />
            </ModuleSection>
          </div>

          <div className="xl:sticky xl:top-4 self-start">
            <RecordDetailPanel
              title={isZh ? "选中 GRN" : "Selected GRN"}
              subtitle={focusedReceiving?.receivingNo ?? "-"}
              fields={[
                { label: "PO", value: focusedOrder?.orderNo ?? focusedReceiving?.orderId ?? "-" },
                { label: isZh ? "供应商" : "Supplier", value: focusedReceiving?.supplierId ?? "-" },
                { label: isZh ? "预计 / 实收" : "Expected / Received", value: focusedOrder?.expectedReceivingDate?.split("T")[0] ? `${focusedOrder?.expectedReceivingDate?.split("T")[0]} / ${focusedReceiving?.receivedAt.split("T")[0]}` : focusedReceiving?.receivedAt.split("T")[0] ?? "-" },
                { label: isZh ? "差异摘要" : "Variance", value: focusedReceiving?.status === "disputed" ? "found" : "none" },
                { label: isZh ? "验收状态" : "Inspection", value: focusedReceiving?.status === "review" ? "required" : "ok" },
                { label: isZh ? "过账状态" : "Posting", value: focusedReceiving?.status ?? "-" },
                { label: isZh ? "关联库存移动" : "Linked Movement", value: focusedReceiving?.lines[0]?.skuId ?? "-" },
              ]}
              sections={[
                {
                  title: isZh ? "收货行摘要" : "Receiving Lines",
                  items: (focusedReceiving?.lines ?? []).slice(0, 3).map((line) => (
                    <div key={line.lineId}>
                      <p className={moduleVisual.title}>{line.skuId}</p>
                      <p className={moduleVisual.muted}>{line.receivedQty.value} {line.receivedQty.unit}</p>
                    </div>
                  )),
                },
                {
                  title: isZh ? "关联异常" : "Linked Issues",
                  items: focusedIssues.map((issue) => (
                    <div key={issue.issueId}>
                      <p className={moduleVisual.title}>{issue.title[locale]}</p>
                      <p className={moduleVisual.muted}>{issue.status}</p>
                    </div>
                  )),
                },
              ]}
              actionLabels={[
                isZh ? "查看 GRN" : "View GRN",
                isZh ? "复核差异" : "Review Variance",
                isZh ? "过账预览" : "Post Stock Preview",
                isZh ? "添加备注" : "Add Note",
              ]}
              statusLabel={focusedReceiving?.status}
            />
          </div>
        </ModuleTwoColumn>
      </ModulePageStack>
    </ErpShell>
  );
}
