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
import { FileDown, Plus, MoreHorizontal } from "lucide-react";

export default function PsiProcurementPage() {
  const [data, setData] = useState<PsiProcurementWorkspacePageData | null>(null);
  const [viewKey, setViewKey] = useState("all");
  const [selectedRowIds, setSelectedRowIds] = useState<Set<string>>(new Set());
  const [focusedRequestId, setFocusedRequestId] = useState<string | null>(null);
  const locale = useUiPreferencesStore((state) => state.locale);
  const isZh = locale === "zh";

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
      { key: "all", label: isZh ? "全部 PR / PO" : "All PR / PO", count: requests.length },
      { key: "draft", label: isZh ? "PR 草稿" : "PR Draft", count: requests.filter((item) => item.status === "draft").length },
      { key: "pending", label: isZh ? "待审批" : "Waiting Approval", count: requests.filter((item) => item.status === "pending" || item.status === "review").length },
      { key: "approved", label: isZh ? "已审批" : "Approved", count: requests.filter((item) => item.status === "approved").length },
      { key: "po", label: isZh ? "PO 已下达" : "PO Issued", count: orders.length },
      { key: "supplier", label: isZh ? "供应商待确认" : "Supplier Pending", count: issues.filter((item) => item.status === "pending").length },
      { key: "receiving", label: isZh ? "待收货" : "Receiving Pending", count: orders.filter((item) => !receivingRecords.some((receiving) => receiving.orderId === item.orderId)).length },
      { key: "rejected", label: isZh ? "驳回" : "Rejected", count: requests.filter((item) => item.status === "rejected").length },
    ],
    [isZh, issues, orders, receivingRecords, requests]
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

  const columns: MultiDimColumn<(typeof filteredRequests)[number]>[] = [
    { key: "requestNo", label: "PR No", width: "120px", render: (row) => <p className={moduleVisual.title}>{row.requestNo}</p> },
    { key: "poNo", label: "PO No", width: "120px", render: (row) => <p className={moduleVisual.body}>{orders.find((item) => item.requestId === row.requestId)?.orderNo ?? "-"}</p> },
    { key: "branch", label: isZh ? "Branch" : "Branch", width: "95px", render: (row) => <p className={moduleVisual.body}>{row.storeId}</p> },
    { key: "requester", label: isZh ? "Requester" : "Requester", width: "110px", render: (row) => <p className={moduleVisual.body}>{row.audit.createdBy || "-"}</p> },
    { key: "supplier", label: isZh ? "Supplier" : "Supplier", width: "150px", render: (row) => <p className={moduleVisual.body}>{row.supplierId || "-"}</p> },
    { key: "items", label: isZh ? "Items" : "Items", width: "70px", render: (row) => <p className={moduleVisual.body}>{row.lines.length}</p> },
    { key: "amount", label: isZh ? "Total Amount" : "Total Amount", width: "115px", render: (row) => <p className={moduleVisual.title}>{row.totalAmount.amount}</p> },
    { key: "needBy", label: isZh ? "Need By" : "Need By", width: "110px", render: (row) => <p className={moduleVisual.body}>{row.neededBy || "-"}</p> },
    {
      key: "approval",
      label: isZh ? "Approval" : "Approval",
      width: "110px",
      render: (row) => <TableFieldChip label={row.status} tone={row.status === "approved" ? "success" : row.status === "rejected" ? "danger" : "warning"} />,
    },
    {
      key: "poStatus",
      label: isZh ? "PO Status" : "PO Status",
      width: "105px",
      render: (row) => {
        const po = orders.find((item) => item.requestId === row.requestId);
        return <TableFieldChip label={po?.status ?? "pending"} tone={po ? "success" : "warning"} />;
      },
    },
    {
      key: "supplierConfirm",
      label: isZh ? "Supplier Confirm" : "Supplier Confirm",
      width: "130px",
      render: (row) => <TableFieldChip label={issues.some((item) => item.requestId === row.requestId && item.status === "pending") ? "pending" : "confirmed"} tone="muted" />,
    },
    {
      key: "receiving",
      label: isZh ? "Receiving Status" : "Receiving Status",
      width: "120px",
      render: (row) => {
        const po = orders.find((item) => item.requestId === row.requestId);
        const receiving = po ? receivingRecords.find((item) => item.orderId === po.orderId) : null;
        return <TableFieldChip label={receiving?.status ?? "pending"} tone={receiving ? "success" : "warning"} />;
      },
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
    <ErpShell activeHref="/psi/procurement" compactSidebar>
      <ModulePageStack className="space-y-3">
        <ErpPageHeader
          breadcrumbs={["ME", "PSI", isZh ? "采购" : "Procurement"]}
          title={isZh ? "ME PSI 采购" : "ME PSI Procurement"}
          subtitle={isZh ? "PR、PO、供应商确认与收货关联。" : "PR, PO, supplier confirmation, and receiving linkage."}
          actions={
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline" className="hidden md:inline-flex">
                <FileDown className="mr-2 h-4 w-4" />
                {isZh ? "导出" : "Export"}
              </Button>
              <Button size="sm">
                <Plus className="mr-2 h-4 w-4" />
                {isZh ? "新建 PR" : "Create PR"}
              </Button>
            </div>
          }
        />

        <TableViewTabs title={isZh ? "已保存视图" : "Saved Views"} tabs={viewTabs} value={viewKey} onChange={setViewKey} />

        <CompactStatStrip
          items={[
            { label: isZh ? "PR Open" : "PR Open", value: pageData.stats.totalRequests },
            { label: isZh ? "Waiting Approval" : "Waiting Approval", value: requests.filter((item) => item.status === "pending" || item.status === "review").length, tone: "warning" },
            { label: isZh ? "PO Issued" : "PO Issued", value: pageData.stats.totalOrders, tone: "success" },
            { label: isZh ? "Receiving Pending" : "Receiving Pending", value: orders.filter((item) => !receivingRecords.some((record) => record.orderId === item.orderId)).length, tone: "danger" },
          ]}
        />

        <TableActionBar
          searchPlaceholder={isZh ? "搜索 PR / PO No..." : "Search PR / PO no..."}
          selectedCount={selectedRowIds.size}
          bulkActionLabel={isZh ? "批量动作（预览）" : "Bulk Action (Preview)"}
          filters={
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="h-7 px-2 font-normal border-dashed">{isZh ? "分支: 全部" : "Branch: All"}</Badge>
              <Badge variant="outline" className="h-7 px-2 font-normal border-dashed">{isZh ? "供应商: 全部" : "Supplier: All"}</Badge>
              <Badge variant="outline" className="h-7 px-2 font-normal border-dashed">{isZh ? "申请人: 全部" : "Requester: All"}</Badge>
              <Badge variant="outline" className="h-7 px-2 font-normal border-dashed">{isZh ? "优先级: 全部" : "Priority: All"}</Badge>
              <Badge variant="outline" className="h-7 px-2 font-normal border-dashed">{isZh ? "审批: 待审批" : "Approval: Pending"}</Badge>
              <Badge variant="outline" className="h-7 px-2 font-normal border-dashed">{isZh ? "PO: 已下达" : "PO: Issued"}</Badge>
              <Badge variant="outline" className="h-7 px-2 font-normal border-dashed">{isZh ? "Need By: 本周" : "Need By: This Week"}</Badge>
              <Badge variant="outline" className="h-7 px-2 font-normal border-dashed text-primary border-primary/30 bg-primary/5">{isZh ? "更多筛选" : "More Filters"}</Badge>
            </div>
          }
        />

        <ModuleTwoColumn className="xl:grid-cols-[minmax(0,1fr)_18.5rem]">
          <div className="space-y-3">
            <ModuleSection title={isZh ? "PR / PO 操作列表" : "PR / PO Operations List"} className="p-3">
              <MultidimensionalTable
                columns={columns}
                rows={filteredRequests}
                rowIdKey="requestId"
                selectedRowIds={selectedRowIds}
                onToggleRow={toggleRow}
                onToggleAll={toggleAll}
                selectedRecordId={focusedRequest?.requestId}
                onRowFocus={setFocusedRequestId}
                pageLabel={isZh ? "显示 1–50 / 共 248" : "Showing 1–50 of 248"}
                rowsPerPageLabel={isZh ? "每页 50 / 100 / 200" : "Rows per page 50 / 100 / 200"}
              />
            </ModuleSection>
          </div>

          <div className="xl:sticky xl:top-4 self-start">
            <RecordDetailPanel
              title={isZh ? "选中 PR / PO" : "Selected PR / PO"}
              subtitle={focusedRequest?.requestNo ?? "-"}
              fields={[
                { label: "Branch", value: focusedRequest?.storeId ?? "-" },
                { label: isZh ? "申请人" : "Requester", value: focusedRequest?.audit.createdBy ?? "-" },
                { label: isZh ? "供应商" : "Supplier", value: focusedRequest?.supplierId ?? "-" },
                { label: isZh ? "品项" : "Items", value: focusedRequest?.lines.length ?? "-" },
                { label: isZh ? "金额" : "Total", value: focusedRequest ? `${focusedRequest.totalAmount.amount} ${focusedRequest.totalAmount.currency}` : "-" },
                { label: isZh ? "审批" : "Approval", value: focusedRequest?.status ?? "-" },
                { label: "PO", value: linkedOrder?.status ?? "-" },
                { label: isZh ? "供应商确认" : "Supplier Confirm", value: linkedIssues.some((item) => item.status === "pending") ? "pending" : "confirmed" },
                { label: isZh ? "收货 / GRN" : "Receiving / GRN", value: linkedReceiving?.receivingNo ?? "-" },
                { label: isZh ? "关联差异" : "Linked Variance", value: linkedIssues.length },
              ]}
              sections={[
                {
                  title: isZh ? "最近品项" : "Recent Items",
                  items: (focusedRequest?.lines ?? []).slice(0, 3).map((line) => (
                    <div key={line.lineId}>
                      <p className={moduleVisual.title}>{line.productName}</p>
                      <p className={moduleVisual.muted}>{line.requestedQty.value} {line.requestedQty.unit}</p>
                    </div>
                  )),
                },
              ]}
              actionLabels={[
                isZh ? "查看 PR" : "View PR",
                isZh ? "审批预览" : "Approve Preview",
                isZh ? "下达 PO 预览" : "Issue PO Preview",
                isZh ? "关联收货预览" : "Link Receiving Preview",
                isZh ? "添加备注" : "Add Note",
              ]}
              statusLabel={focusedRequest?.status}
            />
          </div>
        </ModuleTwoColumn>
      </ModulePageStack>
    </ErpShell>
  );
}
