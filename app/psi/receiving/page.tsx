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
import { Plus, FileDown, MoreHorizontal } from "lucide-react";

export default function ReceivingPage() {
  const [data, setData] = useState<PsiProcurementWorkspacePageData | null>(null);
  const locale = useUiPreferencesStore((state) => state.locale);
  const isZh = locale === "zh";

  useEffect(() => {
    getPsiProcurementWorkspacePageData().then(setData);
  }, []);

  if (!data) return null;

  const pageData = data.pageData;
  const receiving = pageData?.receivingRecords ?? [];
  const issues = pageData?.purchaseIssues.filter(i => i.issueType === "receiving") ?? [];
  const pendingPosting = receiving.filter((item) => item.status === "pending");

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

        <ListToolbar
          searchPlaceholder={isZh ? "搜索 GRN / PO 单号..." : "Search GRN / PO No..."}
          filters={
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="h-8 px-2.5 font-normal border-dashed">
                {isZh ? "分支: 全部" : "Branch: All"}
              </Badge>
              <Badge variant="outline" className="h-8 px-2.5 font-normal border-dashed">
                {isZh ? "供应商: 全部" : "Supplier: All"}
              </Badge>
              <Badge variant="outline" className="h-8 px-2.5 font-normal border-dashed">
                {isZh ? "差异: 仅有差异" : "Variance: Only Variance"}
              </Badge>
              <Badge variant="outline" className="h-8 px-2.5 font-normal border-dashed text-primary border-primary/30 bg-primary/5">
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
              <ModuleMatrixTable
                gridTemplateColumns="120px 120px 1.5fr 100px 120px 120px 120px 80px 100px 100px 100px 80px"
                columns={[
                  isZh ? "收货单号" : "GRN No",
                  isZh ? "PO 单号" : "PO No",
                  isZh ? "供应商" : "Supplier",
                  isZh ? "分支" : "Branch",
                  isZh ? "预计日期" : "Expected",
                  isZh ? "收货日期" : "Received",
                  isZh ? "收货人" : "Received By",
                  isZh ? "品项" : "Items",
                  isZh ? "数量差异" : "Variance",
                  isZh ? "验收状态" : "Inspection",
                  isZh ? "过账状态" : "Posting",
                  isZh ? "操作" : "Action",
                ]}
              >
                {receiving.map((rcv) => (
                  <ModuleMatrixRow
                    key={rcv.receivingId}
                    href={`/psi/receiving/${rcv.receivingId}`}
                    gridTemplateColumns="120px 120px 1.5fr 100px 120px 120px 120px 80px 100px 100px 100px 80px"
                    className="py-2.5"
                  >
                    <p className={moduleVisual.title}>{rcv.receivingNo}</p>
                    <p className={moduleVisual.body}>{rcv.orderId}</p>
                    <p className={moduleVisual.body}>{rcv.supplierId}</p>
                    <p className={moduleVisual.body}>{rcv.warehouseId}</p>
                    <p className={moduleVisual.body}>-</p>
                    <p className={moduleVisual.body}>{rcv.receivedAt.split('T')[0]}</p>
                    <p className={moduleVisual.body}>-</p>
                    <p className={moduleVisual.body}>{rcv.lines.length}</p>
                    <p className={cn(moduleVisual.title, rcv.status === "disputed" ? "text-destructive" : "text-success")}>
                      {rcv.status === "disputed" ? "Found" : "None"}
                    </p>
                    <p className={moduleVisual.body}>-</p>
                    <Badge variant={rcv.status === "completed" ? "outline" : "secondary"} className="text-[10px] w-fit">
                      {rcv.status}
                    </Badge>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </ModuleMatrixRow>
                ))}
              </ModuleMatrixTable>
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

          <div className="space-y-3 xl:sticky xl:top-4 self-start">
            <ContextQueuePanel title={isZh ? "Expected Arrivals" : "Expected Arrivals"}>
              <div className="rounded-md border border-border/60 px-2.5 py-2">
                <div className="flex items-center justify-between">
                  <p className={moduleVisual.title}>PO-1002</p>
                  <Badge variant="outline" className="text-[10px]">{isZh ? "今日" : "Today"}</Badge>
                </div>
                <p className={moduleVisual.muted}>SUP-1003 · 180 cups</p>
              </div>
            </ContextQueuePanel>
            <ContextQueuePanel title={isZh ? "Variance Queue" : "Variance Queue"}>
              {issues.map((issue) => (
                <div key={issue.issueId} className="rounded-md border border-destructive/30 bg-destructive/5 px-2.5 py-2">
                  <p className={cn(moduleVisual.title, "text-destructive")}>{issue.title[locale]}</p>
                  <p className={moduleVisual.muted}>{issue.orderId} · {issue.status}</p>
                </div>
              ))}
            </ContextQueuePanel>
            <ContextQueuePanel title={isZh ? "Posting Blocked" : "Posting Blocked"}>
              {pendingPosting.length ? (
                pendingPosting.map((item) => (
                  <div key={item.receivingId} className="rounded-md border border-border/60 px-2.5 py-2">
                    <p className={moduleVisual.title}>{item.receivingNo}</p>
                    <p className={moduleVisual.muted}>{item.orderId}</p>
                  </div>
                ))
              ) : (
                <p className={moduleVisual.muted}>{isZh ? "暂无过账阻塞" : "No posting blocked."}</p>
              )}
            </ContextQueuePanel>
          </div>
        </ModuleTwoColumn>
      </ModulePageStack>
    </ErpShell>
  );
}
