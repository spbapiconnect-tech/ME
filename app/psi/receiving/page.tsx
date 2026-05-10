"use client";

import { ErpPageHeader, ErpShell } from "@/components/erp";
import {
  ModulePageStack,
  ModuleSection,
  ModuleTwoColumn,
  moduleVisual,
} from "@/components/erp/module-shell";
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
  const pendingPosting = receiving.filter((item) => item.status === "pending");
  const disputedReceiving = receiving.filter((item) => item.status === "disputed");

  const viewTabs = useMemo(
    () => [
      { key: "all", label: isZh ? "全部收货" : "All Receiving", count: receiving.length },
      { key: "pending", label: isZh ? "待过账" : "Pending Posting", count: pendingPosting.length },
      { key: "disputed", label: isZh ? "差异异常" : "Variance Disputed", count: disputedReceiving.length },
      { key: "completed", label: isZh ? "已完成" : "Completed", count: receiving.filter((item) => item.status === "completed").length },
      { key: "issue", label: isZh ? "异常事项" : "Issue Linked", count: issues.length },
    ],
    [disputedReceiving.length, isZh, issues.length, pendingPosting.length, receiving]
  );

  const filteredReceiving = useMemo(() => {
    switch (viewKey) {
      case "pending":
        return receiving.filter((item) => item.status === "pending");
      case "disputed":
        return receiving.filter((item) => item.status === "disputed");
      case "completed":
        return receiving.filter((item) => item.status === "completed");
      case "issue":
        return receiving.filter((item) => issues.some((issue) => issue.orderId === item.orderId));
      default:
        return receiving;
    }
  }, [issues, receiving, viewKey]);

  const focusedReceiving = useMemo(() => {
    if (!filteredReceiving.length) return null;
    return filteredReceiving.find((item) => item.receivingId === focusedReceivingId) ?? filteredReceiving[0];
  }, [filteredReceiving, focusedReceivingId]);
  const focusedOrder = focusedReceiving ? orders.find((item) => item.orderId === focusedReceiving.orderId) : null;
  const focusedIssues = focusedReceiving ? issues.filter((item) => item.orderId === focusedReceiving.orderId) : [];

  const columns: MultiDimColumn<(typeof filteredReceiving)[number]>[] = [
    { key: "grn", label: isZh ? "GRN No" : "GRN No", width: "120px", render: (row) => <p className={moduleVisual.title}>{row.receivingNo}</p> },
    { key: "po", label: isZh ? "PO No" : "PO No", width: "120px", render: (row) => <p className={moduleVisual.body}>{row.orderId}</p> },
    { key: "supplier", label: isZh ? "Supplier" : "Supplier", width: "110px", render: (row) => <p className={moduleVisual.body}>{row.supplierId}</p> },
    { key: "branch", label: isZh ? "Branch" : "Branch", width: "95px", render: (row) => <p className={moduleVisual.body}>{row.warehouseId}</p> },
    { key: "receivedDate", label: isZh ? "Received At" : "Received At", width: "120px", render: (row) => <p className={moduleVisual.body}>{row.receivedAt.split("T")[0]}</p> },
    { key: "lines", label: isZh ? "Items" : "Items", width: "70px", render: (row) => <p className={moduleVisual.body}>{row.lines.length}</p> },
    {
      key: "variance",
      label: isZh ? "Variance" : "Variance",
      width: "95px",
      render: (row) => <TableFieldChip label={row.status === "disputed" ? (isZh ? "发现" : "Found") : (isZh ? "无" : "None")} tone={row.status === "disputed" ? "danger" : "success"} />,
    },
    { key: "inspection", label: isZh ? "Inspection" : "Inspection", width: "95px", render: (row) => <TableFieldChip label={row.status === "completed" ? (isZh ? "通过" : "Passed") : (isZh ? "待处理" : "Pending")} tone={row.status === "completed" ? "success" : "warning"} /> },
    { key: "posting", label: isZh ? "Posting" : "Posting", width: "95px", render: (row) => <TableFieldChip label={row.status} tone={row.status === "completed" ? "success" : row.status === "disputed" ? "danger" : "warning"} /> },
    { key: "issues", label: isZh ? "Linked Issues" : "Linked Issues", width: "100px", render: (row) => <p className={moduleVisual.body}>{issues.filter((item) => item.orderId === row.orderId).length}</p> },
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
          subtitle={
            isZh
              ? "收货记录、GRN、数量差异与过账状态查看。"
              : "Receiving records, GRN review, quantity variance, and posting status."
          }
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

        <CompactStatStrip
          items={[
            { label: isZh ? "Awaiting Receiving" : "Awaiting Receiving", value: pageData?.stats.totalOrders ?? 0, tone: "warning" },
            { label: isZh ? "Received Today" : "Received Today", value: pageData?.stats.receivingToday ?? 0, tone: "success" },
            { label: isZh ? "Variance Found" : "Variance Found", value: issues.length, tone: "danger" },
            { label: isZh ? "Pending Posting" : "Pending Posting", value: pendingPosting.length, tone: "warning" },
          ]}
        />

        <TableViewTabs tabs={viewTabs} value={viewKey} onChange={setViewKey} />

        <TableActionBar
          searchPlaceholder={isZh ? "搜索 GRN / PO 单号..." : "Search GRN / PO No..."}
          selectedCount={selectedRowIds.size}
          filters={
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="h-7 px-2 font-normal border-dashed">
                {isZh ? "分支: 全部" : "Branch: All"}
              </Badge>
              <Badge variant="outline" className="h-7 px-2 font-normal border-dashed">
                {isZh ? "供应商: 全部" : "Supplier: All"}
              </Badge>
              <Badge variant="outline" className="h-7 px-2 font-normal border-dashed">
                {isZh ? "差异: 仅有差异" : "Variance: Only Variance"}
              </Badge>
              <Badge variant="outline" className="h-7 px-2 font-normal border-dashed text-primary border-primary/30 bg-primary/5">
                {isZh ? "过账: 待过账" : "Posting: Pending"}
              </Badge>
            </div>
          }
        />

        <ModuleTwoColumn className="xl:grid-cols-[minmax(0,1fr)_20rem]">
          <div className="space-y-3">
            <ModuleSection
              title={isZh ? "收货记录与 GRN 列表" : "GRN / Receiving List"}
              className="p-3"
            >
              <MultidimensionalTable
                columns={columns}
                rows={filteredReceiving}
                rowIdKey="receivingId"
                selectedRowIds={selectedRowIds}
                onToggleRow={toggleRow}
                onToggleAll={toggleAll}
                selectedRecordId={focusedReceiving?.receivingId}
                onRowFocus={setFocusedReceivingId}
              />
            </ModuleSection>

            <ModuleSection
              title={isZh ? "收货活动日志" : "Receiving Activity Log"}
              className="p-3"
            >
              <div className="space-y-2">
                {receiving.map((rcv) => (
                  <div key={rcv.receivingId} className="flex items-start gap-3 rounded-lg border border-border/60 px-3 py-2.5">
                    <div className="flex-1">
                      <p className={moduleVisual.title}>{rcv.receivingNo} {isZh ? "收货完成" : "Received"}</p>
                      <p className={moduleVisual.body}>
                        {isZh ? `关联订单: ${rcv.orderId} · 验收状态: ${rcv.status}` : `Linked PO: ${rcv.orderId} · Status: ${rcv.status}`}
                      </p>
                    </div>
                    <p className={moduleVisual.muted}>{new Date(rcv.receivedAt).toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </ModuleSection>
          </div>

          <div className="xl:sticky xl:top-4 self-start">
            <RecordDetailPanel
              title={isZh ? "选中收货记录" : "Selected Receiving"}
              subtitle={focusedReceiving?.receivingNo ?? "-"}
              fields={[
                { label: isZh ? "PO No" : "PO No", value: focusedReceiving?.orderId ?? "-" },
                { label: isZh ? "供应商" : "Supplier", value: focusedReceiving?.supplierId ?? "-" },
                { label: isZh ? "分支/仓库" : "Branch / Warehouse", value: focusedReceiving?.warehouseId ?? "-" },
                { label: isZh ? "收货日期" : "Received Date", value: focusedReceiving?.receivedAt.split("T")[0] ?? "-" },
                { label: isZh ? "品项数" : "Items", value: focusedReceiving?.lines.length ?? "-" },
                { label: isZh ? "收货状态" : "Receiving Status", value: focusedReceiving?.status ?? "-" },
                { label: isZh ? "过账状态" : "Posting Status", value: focusedReceiving?.status ?? "-" },
                { label: isZh ? "关联异常" : "Linked Issues", value: focusedIssues.length },
              ]}
              sections={[
                {
                  title: isZh ? "收货明细摘要" : "Line Summary",
                  items: (focusedReceiving?.lines ?? []).slice(0, 3).map((line) => (
                    <div key={line.lineId}>
                      <p className={moduleVisual.title}>{line.skuId}</p>
                      <p className={moduleVisual.muted}>{line.receivedQty.value} {line.receivedQty.unit}</p>
                    </div>
                  )),
                },
                {
                  title: isZh ? "关联采购订单" : "Linked Purchase Order",
                  items: [
                    <div key={focusedOrder?.orderId ?? "no-order"}>
                      <p className={moduleVisual.title}>{focusedOrder?.orderNo ?? "-"}</p>
                      <p className={moduleVisual.muted}>{focusedOrder?.status ?? "-"}</p>
                    </div>,
                  ],
                },
                {
                  title: isZh ? "差异/异常事项" : "Variance / Issues",
                  items: focusedIssues.slice(0, 3).map((issue) => (
                    <div key={issue.issueId}>
                      <p className={moduleVisual.title}>{issue.title[locale]}</p>
                      <p className={moduleVisual.muted}>{issue.status}</p>
                    </div>
                  )),
                },
              ]}
              actionLabels={[isZh ? "查看 GRN" : "View GRN", isZh ? "添加备注" : "Add Note", isZh ? "关联问题" : "Link Issue"]}
            />
          </div>
        </ModuleTwoColumn>
      </ModulePageStack>
    </ErpShell>
  );
}
