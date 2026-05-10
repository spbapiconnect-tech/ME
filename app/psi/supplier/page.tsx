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
import { getPsiSupplierWorkspacePageData } from "@/lib/page-data/psi";
import { useUiPreferencesStore } from "@/stores/ui-preferences";
import { useEffect, useState } from "react";
import type { PsiSupplierWorkspacePageData } from "@/lib/page-data/psi";
import { cn } from "@/lib/utils";
import { Plus, FileDown, MoreHorizontal, Star } from "lucide-react";

export default function PsiSupplierPage() {
  const [data, setData] = useState<PsiSupplierWorkspacePageData | null>(null);
  const locale = useUiPreferencesStore((state) => state.locale);
  const isZh = locale === "zh";

  useEffect(() => {
    getPsiSupplierWorkspacePageData().then(setData);
  }, []);

  if (!data) return null;

  const pageData = data.pageData;
  const suppliers = pageData?.suppliers ?? [];
  const issues = pageData?.issues ?? [];
  const contracts = pageData?.contracts ?? [];
  const contractExpiring = contracts.filter((item) => item.status === "review");

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

        <CompactStatStrip
          items={[
            { label: isZh ? "Total Suppliers" : "Total Suppliers", value: pageData?.stats.totalSuppliers ?? 0 },
            { label: isZh ? "Active Suppliers" : "Active Suppliers", value: pageData?.stats.activeSuppliers ?? 0, tone: "success" },
            { label: isZh ? "Contract Expiring" : "Contract Expiring", value: contractExpiring.length, tone: "warning" },
            { label: isZh ? "Issues Open" : "Issues Open", value: issues.length, tone: "danger" },
          ]}
        />

        <ListToolbar
          searchPlaceholder={isZh ? "搜索供应商名称 / 编码..." : "Search supplier name / code..."}
          filters={
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="h-8 px-2.5 font-normal border-dashed">
                {isZh ? "分类: 全部" : "Category: All"}
              </Badge>
              <Badge variant="outline" className="h-8 px-2.5 font-normal border-dashed">
                {isZh ? "区域: 全部" : "Region: All"}
              </Badge>
              <Badge variant="outline" className="h-8 px-2.5 font-normal border-dashed">
                {isZh ? "合同: 全部" : "Contract: All"}
              </Badge>
              <Badge variant="outline" className="h-8 px-2.5 font-normal border-dashed text-success border-success/30 bg-success/5">
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
              <ModuleMatrixTable
                gridTemplateColumns="100px 1.5fr 100px 100px 100px 80px 100px 100px 100px 80px 80px 80px"
                columns={[
                  isZh ? "编码" : "Supplier Code",
                  isZh ? "供应商名称" : "Supplier Name",
                  isZh ? "分类" : "Category",
                  isZh ? "区域" : "Region",
                  isZh ? "联系人" : "Contact",
                  isZh ? "提前期" : "Lead Time",
                  isZh ? "合同" : "Contract",
                  isZh ? "最后订单" : "Last Order",
                  isZh ? "异常" : "Issues",
                  isZh ? "评分" : "Rating",
                  isZh ? "风险" : "Risk",
                  isZh ? "操作" : "Action",
                ]}
              >
                {suppliers.map((sup) => {
                  const rating = pageData?.ratings.find(r => r.supplierId === sup.supplierId);
                  const contact = pageData?.contacts.find(c => c.supplierId === sup.supplierId);
                  const contract = pageData?.contracts.find(c => c.supplierId === sup.supplierId);
                  
                  return (
                    <ModuleMatrixRow
                      key={sup.supplierId}
                      href={`/psi/supplier/${sup.supplierId}`}
                      gridTemplateColumns="100px 1.5fr 100px 100px 100px 80px 100px 100px 100px 80px 80px 80px"
                    >
                      <p className={moduleVisual.title}>{sup.supplierCode}</p>
                      <p className={moduleVisual.title}>{sup.name}</p>
                      <p className={moduleVisual.body}>{sup.category}</p>
                      <p className={moduleVisual.body}>{sup.serviceRegion}</p>
                      <p className={moduleVisual.body}>{contact?.name || "-"}</p>
                      <p className={moduleVisual.body}>{sup.leadTimeDays}d</p>
                    <Badge variant={contract?.status === "active" ? "outline" : "secondary"} className="text-[10px] w-fit">
                        {contract?.status || "None"}
                      </Badge>
                      <p className={moduleVisual.body}>-</p>
                    <p className={moduleVisual.body}>{issues.filter((item) => item.supplierId === sup.supplierId).length}</p>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span className={moduleVisual.title}>{rating?.grade || "N/A"}</span>
                      </div>
                    <p className={moduleVisual.body}>{issues.some((item) => item.supplierId === sup.supplierId) ? "Watch" : "Low"}</p>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </ModuleMatrixRow>
                  );
                })}
              </ModuleMatrixTable>
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

          <div className="space-y-3 xl:sticky xl:top-4 self-start">
            <ContextQueuePanel title={isZh ? "Supplier Pulse" : "Supplier Pulse"}>
              {suppliers.slice(0, 3).map((supplierItem) => (
                <div key={supplierItem.supplierId} className="rounded-md border border-border/60 px-2.5 py-2">
                  <p className={moduleVisual.title}>{supplierItem.name}</p>
                  <p className={moduleVisual.muted}>{supplierItem.supplierCode} · {supplierItem.status}</p>
                </div>
              ))}
            </ContextQueuePanel>
            <ContextQueuePanel title={isZh ? "Contract Expiry" : "Contract Expiry"}>
              {contractExpiring.map((contractItem) => (
                <div key={contractItem.contractId} className="rounded-md border border-border/60 px-2.5 py-2">
                  <p className={moduleVisual.title}>{contractItem.contractNo}</p>
                  <p className={moduleVisual.muted}>{contractItem.effectiveTo ?? "-"}</p>
                </div>
              ))}
            </ContextQueuePanel>
            <ContextQueuePanel title={isZh ? "Quality Issues" : "Quality Issues"}>
              {issues.map((issue) => (
                <div key={issue.issueId} className="rounded-md border border-destructive/30 bg-destructive/5 px-2.5 py-2">
                  <p className={cn(moduleVisual.title, "text-destructive")}>{issue.title[locale]}</p>
                  <p className={moduleVisual.muted}>{issue.supplierId}</p>
                </div>
              ))}
            </ContextQueuePanel>
            <ContextQueuePanel title={isZh ? "Late Response" : "Late Response"}>
              <p className={moduleVisual.muted}>{isZh ? "当前无超时回复供应商。" : "No suppliers currently beyond response SLA."}</p>
            </ContextQueuePanel>
          </div>
        </ModuleTwoColumn>
      </ModulePageStack>
    </ErpShell>
  );
}
