"use client";

import { ErpPageHeader, ErpShell } from "@/components/erp";
import {
  ModulePageStack,
  ModuleSection,
  ModuleMatrixTable,
  ModuleMatrixRow,
  ModuleTwoColumn,
  moduleVisual,
} from "@/components/erp/module-shell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CompactStatStrip } from "@/components/operations/compact-stat-strip";
import { ListToolbar } from "@/components/operations/list-toolbar";
import { ContextQueuePanel } from "@/components/operations/context-queue-panel";
import { getPsiProcurementWorkspacePageData } from "@/lib/page-data/psi";
import { useUiPreferencesStore } from "@/stores/ui-preferences";
import { useEffect, useState } from "react";
import type { PsiProcurementWorkspacePageData } from "@/lib/page-data/psi";
import { cn } from "@/lib/utils";
import { FileDown, Plus, MoreHorizontal } from "lucide-react";

export default function PsiProcurementPage() {
  const [data, setData] = useState<PsiProcurementWorkspacePageData | null>(null);
  const locale = useUiPreferencesStore((state) => state.locale);
  const isZh = locale === "zh";

  useEffect(() => {
    getPsiProcurementWorkspacePageData().then(setData);
  }, []);

  if (!data) return null;

  const pageData = data.pageData;
  const requests = pageData?.purchaseRequests ?? [];
  const orders = pageData?.purchaseOrders ?? [];
  const issues = pageData?.purchaseIssues ?? [];
  const waitingApproval = requests.filter((item) => item.status === "pending" || item.status === "review");

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

        <CompactStatStrip
          items={[
            { label: isZh ? "PR Open" : "PR Open", value: pageData?.stats.totalRequests ?? 0 },
            { label: isZh ? "Waiting Approval" : "Waiting Approval", value: waitingApproval.length, tone: "warning" },
            { label: isZh ? "PO Issued" : "PO Issued", value: pageData?.stats.totalOrders ?? 0, tone: "success" },
            { label: isZh ? "Supplier Pending" : "Supplier Pending", value: issues.filter((item) => item.status === "pending").length, tone: "danger" },
          ]}
        />

        <ListToolbar
          searchPlaceholder={isZh ? "搜索 PR / PO 单号..." : "Search PR / PO No..."}
          filters={
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="h-8 px-2.5 font-normal border-dashed">
                {isZh ? "分支: 全部" : "Branch: All"}
              </Badge>
              <Badge variant="outline" className="h-8 px-2.5 font-normal border-dashed">
                {isZh ? "供应商: 全部" : "Supplier: All"}
              </Badge>
              <Badge variant="outline" className="h-8 px-2.5 font-normal border-dashed">
                {isZh ? "优先级: 全部" : "Priority: All"}
              </Badge>
              <Badge variant="outline" className="h-8 px-2.5 font-normal border-dashed text-primary border-primary/30 bg-primary/5">
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
              <ModuleMatrixTable
                gridTemplateColumns="100px 80px 100px 120px 80px 100px 100px 100px 100px 120px 120px 80px 80px"
                columns={[
                  isZh ? "单号" : "PR No",
                  isZh ? "分支" : "Branch",
                  isZh ? "申请人" : "Requester",
                  isZh ? "供应商" : "Supplier",
                  isZh ? "品项" : "Items",
                  isZh ? "总金额" : "Total Amount",
                  isZh ? "需求日期" : "Need By",
                  isZh ? "审批" : "Approval",
                  isZh ? "PO 状态" : "PO Status",
                  isZh ? "供应商确认" : "Supplier Confirm",
                  isZh ? "收货状态" : "Receiving Status",
                  isZh ? "操作" : "Action",
                ]}
              >
                {requests.map((pr) => (
                  <ModuleMatrixRow
                    key={pr.requestId}
                    href={`/psi/procurement/${pr.requestId}`}
                    gridTemplateColumns="100px 80px 100px 120px 80px 100px 100px 100px 100px 120px 120px 80px 80px"
                  >
                    <p className={moduleVisual.title}>{pr.requestNo}</p>
                    <p className={moduleVisual.body}>{pr.storeId}</p>
                    <p className={moduleVisual.body}>{pr.audit.createdBy || "-"}</p>
                    <p className={moduleVisual.body}>{pr.supplierId || "-"}</p>
                    <p className={moduleVisual.body}>{pr.lines.length}</p>
                    <p className={moduleVisual.title}>{pr.totalAmount.amount}</p>
                    <p className={moduleVisual.body}>{pr.neededBy || "-"}</p>
                    <Badge variant={pr.status === "approved" ? "outline" : pr.status === "rejected" ? "destructive" : "secondary"} className="text-[10px] w-fit">
                      {pr.status}
                    </Badge>
                    <p className={moduleVisual.body}>-</p>
                    <p className={moduleVisual.body}>-</p>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </ModuleMatrixRow>
                ))}
              </ModuleMatrixTable>
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

          <div className="space-y-3 xl:sticky xl:top-4 self-start">
            <ContextQueuePanel title={isZh ? "Approval Queue" : "Approval Queue"}>
              {waitingApproval.map((pr) => (
                <div key={pr.requestId} className="rounded-md border border-border/60 px-2.5 py-2">
                  <div className="flex items-center justify-between gap-2">
                    <p className={moduleVisual.title}>{pr.requestNo}</p>
                    <Badge variant="outline" className="text-[10px]">{pr.priority}</Badge>
                  </div>
                  <p className={moduleVisual.muted}>{pr.totalAmount.amount} {pr.totalAmount.currency}</p>
                </div>
              ))}
            </ContextQueuePanel>
            <ContextQueuePanel title={isZh ? "Overdue PO" : "Overdue PO"}>
              <p className={moduleVisual.muted}>{isZh ? "暂无逾期订单" : "No overdue purchase orders."}</p>
            </ContextQueuePanel>
            <ContextQueuePanel title={isZh ? "Linked Variance" : "Linked Variance"}>
              {issues.map((issue) => (
                <div key={issue.issueId} className="rounded-md border border-destructive/30 bg-destructive/5 px-2.5 py-2">
                  <p className={cn(moduleVisual.title, "text-destructive")}>{issue.title[locale]}</p>
                  <p className={moduleVisual.muted}>{issue.issueId}</p>
                </div>
              ))}
            </ContextQueuePanel>
          </div>
        </ModuleTwoColumn>
      </ModulePageStack>
    </ErpShell>
  );
}
