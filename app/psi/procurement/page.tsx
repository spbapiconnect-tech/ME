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
      { key: "all", label: isZh ? "全部 PR" : "All PR", count: requests.length },
      { key: "draft", label: isZh ? "草稿" : "Draft", count: requests.filter((item) => item.status === "draft").length },
      { key: "pending", label: isZh ? "待审批" : "Pending Approval", count: requests.filter((item) => item.status === "pending" || item.status === "review").length },
      { key: "approved", label: isZh ? "已审批" : "Approved", count: requests.filter((item) => item.status === "approved").length },
      { key: "po", label: isZh ? "PO 已下达" : "PO Issued", count: orders.length },
      { key: "supplier", label: isZh ? "供应商待确认" : "Supplier Pending", count: issues.filter((item) => item.status === "pending").length },
      { key: "receiving", label: isZh ? "收货中" : "Receiving", count: receivingRecords.filter((item) => item.status !== "completed").length },
      { key: "exception", label: isZh ? "异常" : "Exception", count: issues.filter((item) => item.status === "disputed" || item.status === "blocked" || item.status === "rejected").length },
    ],
    [isZh, issues, orders.length, receivingRecords, requests]
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
        return requests.filter((item) => receivingRecords.some((record) => record.orderId && orders.some((order) => order.orderId === record.orderId && order.requestId === item.requestId)));
      case "exception":
        return requests.filter((item) =>
          issues.some(
            (issue) =>
              issue.requestId === item.requestId &&
              (issue.status === "disputed" || issue.status === "blocked" || issue.status === "rejected")
          )
        );
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
    { key: "requestNo", label: isZh ? "PR No" : "PR No", width: "120px", render: (row) => <p className={moduleVisual.title}>{row.requestNo}</p> },
    { key: "branch", label: isZh ? "Branch" : "Branch", width: "95px", render: (row) => <p className={moduleVisual.body}>{row.storeId}</p> },
    { key: "requester", label: isZh ? "Requester" : "Requester", width: "110px", render: (row) => <p className={moduleVisual.body}>{row.audit.createdBy || "-"}</p> },
    { key: "supplier", label: isZh ? "Supplier" : "Supplier", width: "130px", render: (row) => <p className={moduleVisual.body}>{row.supplierId || "-"}</p> },
    { key: "items", label: isZh ? "Items" : "Items", width: "70px", render: (row) => <p className={moduleVisual.body}>{row.lines.length}</p> },
    { key: "amount", label: isZh ? "Total Amount" : "Total Amount", width: "115px", render: (row) => <p className={moduleVisual.title}>{row.totalAmount.amount}</p> },
    { key: "needBy", label: isZh ? "Need By" : "Need By", width: "110px", render: (row) => <p className={moduleVisual.body}>{row.neededBy || "-"}</p> },
    {
      key: "approval",
      label: isZh ? "Approval" : "Approval",
      width: "120px",
      render: (row) => <TableFieldChip label={row.status} tone={row.status === "approved" ? "success" : row.status === "rejected" ? "danger" : "warning"} />,
    },
    { key: "poStatus", label: isZh ? "PO Status" : "PO Status", width: "110px", render: (row) => <TableFieldChip label={orders.some((item) => item.requestId === row.requestId) ? "Issued" : "Pending"} tone="muted" /> },
    { key: "supplierConfirm", label: isZh ? "Supplier Confirm" : "Supplier Confirm", width: "130px", render: (row) => <TableFieldChip label={issues.some((item) => item.requestId === row.requestId && item.status === "pending") ? "Pending" : "Confirmed"} tone="muted" /> },
    { key: "receiving", label: isZh ? "Receiving Status" : "Receiving Status", width: "130px", render: (row) => <TableFieldChip label={receivingRecords.some((record) => orders.some((order) => order.orderId === record.orderId && order.requestId === row.requestId)) ? "Linked" : "-"} tone="muted" /> },
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
    <ErpShell activeHref="/psi/procurement">
      <ModulePageStack className="space-y-3">
        <ErpPageHeader
          breadcrumbs={["ME", "PSI", isZh ? "采购" : "Procurement"]}
          title={isZh ? "ME PSI 采购" : "ME PSI Procurement"}
          subtitle={
            isZh
              ? "采购申请、订单状态、供应商确认与收货衔接。"
              : "Purchase requests, order status, supplier confirmation, and receiving linkage."
          }
          actions={
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline" className="hidden md:inline-flex">
                <FileDown className="mr-2 h-4 w-4" />
                {isZh ? "导出" : "Export"}
              </Button>
              <Button size="sm">
                <Plus className="mr-2 h-4 w-4" />
                {isZh ? "新建申请" : "Create PR"}
              </Button>
            </div>
          }
        />

        <TableViewTabs tabs={viewTabs} value={viewKey} onChange={setViewKey} />

        <CompactStatStrip
          items={[
            { label: isZh ? "PR Open" : "PR Open", value: pageData?.stats.totalRequests ?? 0 },
            { label: isZh ? "Waiting Approval" : "Waiting Approval", value: requests.filter((item) => item.status === "pending" || item.status === "review").length, tone: "warning" },
            { label: isZh ? "PO Issued" : "PO Issued", value: pageData?.stats.totalOrders ?? 0, tone: "success" },
            { label: isZh ? "Supplier Pending" : "Supplier Pending", value: issues.filter((item) => item.status === "pending").length, tone: "danger" },
          ]}
        />

        <TableActionBar
          searchPlaceholder={isZh ? "搜索 PR / PO 单号..." : "Search PR / PO No..."}
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
                {isZh ? "优先级: 全部" : "Priority: All"}
              </Badge>
              <Badge variant="outline" className="h-7 px-2 font-normal border-dashed text-primary border-primary/30 bg-primary/5">
                {isZh ? "状态: 待审批" : "Status: Pending"}
              </Badge>
            </div>
          }
        />

        <ModuleTwoColumn className="xl:grid-cols-[minmax(0,1fr)_20rem]">
          <div className="space-y-3">
            <ModuleSection
              title={isZh ? "采购申请与订单列表" : "Procurement Request / PO List"}
              className="p-3"
            >
              <MultidimensionalTable
                columns={columns}
                rows={filteredRequests}
                rowIdKey="requestId"
                selectedRowIds={selectedRowIds}
                onToggleRow={toggleRow}
                onToggleAll={toggleAll}
                selectedRecordId={focusedRequest?.requestId}
                onRowFocus={setFocusedRequestId}
              />
            </ModuleSection>

            <ModuleSection
              title={isZh ? "采购流转记录" : "Purchase Order Flow / Activity Log"}
              className="p-3"
            >
              <div className="space-y-2">
                {orders.map(po => (
                  <div key={po.orderId} className="flex items-start gap-3 rounded-lg border border-border/60 px-3 py-2.5">
                    <div className="flex-1">
                      <p className={moduleVisual.title}>{po.orderNo} {isZh ? "订单已生成" : "Order Issued"}</p>
                      <p className={moduleVisual.body}>
                        {isZh ? `关联申请: ${po.requestId} · 供应商: ${po.supplierId}` : `Linked PR: ${po.requestId} · Supplier: ${po.supplierId}`}
                      </p>
                    </div>
                    <p className={moduleVisual.muted}>{po.orderDate}</p>
                  </div>
                ))}
              </div>
            </ModuleSection>
          </div>

          <div className="xl:sticky xl:top-4 self-start">
            <RecordDetailPanel
              title={isZh ? "选中采购申请" : "Selected PR"}
              subtitle={focusedRequest?.requestNo ?? "-"}
              fields={[
                { label: isZh ? "PR No" : "PR No", value: focusedRequest?.requestNo ?? "-" },
                { label: isZh ? "供应商" : "Supplier", value: focusedRequest?.supplierId ?? "-" },
                { label: isZh ? "分支" : "Branch", value: focusedRequest?.storeId ?? "-" },
                { label: isZh ? "金额" : "Amount", value: focusedRequest ? `${focusedRequest.totalAmount.amount} ${focusedRequest.totalAmount.currency}` : "-" },
                { label: isZh ? "审批状态" : "Approval", value: focusedRequest?.status ?? "-" },
                { label: isZh ? "PO 状态" : "PO Status", value: linkedOrder?.status ?? "-" },
                { label: isZh ? "收货状态" : "Receiving", value: linkedReceiving?.status ?? "-" },
                { label: isZh ? "关联差异" : "Linked Variance", value: linkedIssues.length },
              ]}
              sections={[
                {
                  title: isZh ? "审批时间线" : "Approval Timeline",
                  items: focusedRequest
                    ? [
                        <div key="audit-created">
                          <p className={moduleVisual.title}>{isZh ? "创建" : "Created"}</p>
                          <p className={moduleVisual.muted}>{focusedRequest.audit.createdAt}</p>
                        </div>,
                        <div key="audit-updated">
                          <p className={moduleVisual.title}>{isZh ? "更新" : "Updated"}</p>
                          <p className={moduleVisual.muted}>{focusedRequest.audit.updatedAt}</p>
                        </div>,
                        <div key="audit-owner">
                          <p className={moduleVisual.title}>{isZh ? "创建人" : "Owner"}</p>
                          <p className={moduleVisual.muted}>{focusedRequest.audit.createdBy ?? "-"}</p>
                        </div>,
                      ]
                    : [
                    <div key="audit-empty">
                      <p className={moduleVisual.muted}>-</p>
                    </div>
                  ],
                },
                {
                  title: isZh ? "品项汇总" : "Item Summary",
                  items: (focusedRequest?.lines ?? []).slice(0, 3).map((line) => (
                    <div key={line.lineId}>
                      <p className={moduleVisual.title}>{line.productName}</p>
                      <p className={moduleVisual.muted}>{line.requestedQty.value} {line.requestedQty.unit}</p>
                    </div>
                  )),
                },
              ]}
              actionLabels={[isZh ? "审核" : "Review", isZh ? "创建 PO" : "Create PO", isZh ? "添加备注" : "Add Note"]}
            />
          </div>
        </ModuleTwoColumn>
      </ModulePageStack>
    </ErpShell>
  );
}
