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
import { getPsiInventoryWorkspacePageData } from "@/lib/page-data/psi";
import { useUiPreferencesStore } from "@/stores/ui-preferences";
import { useEffect, useState } from "react";
import type { PsiInventoryWorkspacePageData } from "@/lib/page-data/psi";
import { cn } from "@/lib/utils";
import { Plus, FileDown, MoreHorizontal } from "lucide-react";

export default function PsiInventoryRoute() {
  const [data, setData] = useState<PsiInventoryWorkspacePageData | null>(null);
  const locale = useUiPreferencesStore((state) => state.locale);
  const isZh = locale === "zh";

  useEffect(() => {
    getPsiInventoryWorkspacePageData().then(setData);
  }, []);

  if (!data) return null;

  const pageData = data.pageData;
  const skus = pageData?.skus ?? [];
  const movements = pageData?.stockMovements ?? [];
  const suggestions = pageData?.replenishmentSuggestions ?? [];
  const lowStockSkus = skus.filter((item) => {
    const stock = pageData?.storeStocks.find((stockItem) => stockItem.skuId === item.skuId);
    return (stock?.availableQty.value ?? 0) < item.safetyStock;
  });

  return (
    <ErpShell activeHref="/psi/inventory">
      <ModulePageStack className="space-y-3">
        <ErpPageHeader
          breadcrumbs={["ME", "PSI", isZh ? "库存" : "Inventory"]}
          title={isZh ? "ME PSI 库存" : "ME PSI Inventory"}
          subtitle={
            isZh
              ? "库存品项列表、库存流动、效期观察与补货判断。"
              : "Stock item list, stock movement, expiry watch, and reorder review."
          }
          actions={
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline" className="hidden md:inline-flex">
                <FileDown className="mr-2 h-4 w-4" />
                {isZh ? "导出记录" : "Export Records"}
              </Button>
              <Button size="sm">
                <Plus className="mr-2 h-4 w-4" />
                {isZh ? "新增品项" : "Add SKU"}
              </Button>
            </div>
          }
        />

        <CompactStatStrip
          items={[
            { label: isZh ? "Total SKU" : "Total SKU", value: pageData?.stats.totalSkus ?? 0 },
            { label: isZh ? "Low Stock" : "Low Stock", value: lowStockSkus.length, tone: "danger" },
            { label: isZh ? "Expiry Watch" : "Expiry Watch", value: 2, tone: "warning" },
            { label: isZh ? "Reorder Needed" : "Reorder Needed", value: suggestions.length, tone: "warning" },
          ]}
        />

        <ListToolbar
          searchPlaceholder={isZh ? "搜索 SKU / 品项名称..." : "Search SKU / item name..."}
          filters={
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="h-8 px-2.5 font-normal border-dashed">
                {isZh ? "门店: 全部" : "Branch: All"}
              </Badge>
              <Badge variant="outline" className="h-8 px-2.5 font-normal border-dashed">
                {isZh ? "存储: 全部" : "Storage: All"}
              </Badge>
              <Badge variant="outline" className="h-8 px-2.5 font-normal border-dashed">
                {isZh ? "供应商: 全部" : "Supplier: All"}
              </Badge>
              <Badge variant="outline" className="h-8 px-2.5 font-normal border-dashed text-destructive border-destructive/30 bg-destructive/5">
                {isZh ? "状态: 低库存" : "Status: Low Stock"}
              </Badge>
            </div>
          }
        />

        <ModuleTwoColumn className="xl:grid-cols-[minmax(0,1fr)_20rem]">
          <div className="space-y-3">
            <ModuleSection
              title={isZh ? "库存品项列表" : "Inventory Item List"}
              className="p-3"
            >
              <ModuleMatrixTable
                gridTemplateColumns="120px 1.5fr 100px 100px 90px 110px 80px 100px 90px 120px 100px 110px 80px"
                columns={[
                  "SKU",
                  isZh ? "品项名称" : "Item Name",
                  isZh ? "分类" : "Category",
                  isZh ? "门店" : "Branch",
                  isZh ? "存储" : "Storage",
                  isZh ? "当前库存" : "Current Stock",
                  "UOM",
                  isZh ? "安全库存" : "Safety Stock",
                  isZh ? "覆盖" : "Coverage",
                  isZh ? "最后变动" : "Last Movement",
                  isZh ? "效期状态" : "Expiry",
                  isZh ? "补货状态" : "Reorder",
                  isZh ? "操作" : "Action",
                ]}
              >
                {skus.map((sku) => {
                  const product = pageData?.products.find(p => p.productId === sku.productId);
                  const stock = pageData?.storeStocks.find(s => s.skuId === sku.skuId);
                  const warehouse = pageData?.warehouses.find(w => w.warehouseId === stock?.warehouseId);
                  const lastMov = movements.find(m => m.skuId === sku.skuId);
                  
                  return (
                    <ModuleMatrixRow
                      key={sku.skuId}
                      href={`/psi/inventory/${sku.skuId}`}
                      gridTemplateColumns="120px 1.5fr 100px 100px 90px 110px 80px 100px 90px 120px 100px 110px 80px"
                      className="py-2.5"
                    >
                      <p className={moduleVisual.title}>{sku.skuCode}</p>
                      <p className={moduleVisual.title}>{sku.productName}</p>
                      <p className={moduleVisual.body}>{product?.category || "-"}</p>
                      <p className={moduleVisual.body}>{warehouse?.warehouseCode || "-"}</p>
                      <p className={moduleVisual.body}>{warehouse?.type === "warehouse" ? (isZh ? "仓库" : "WH") : (isZh ? "门店" : "Store")}</p>
                      <p className={cn(moduleVisual.title, (stock?.availableQty.value ?? 0) < sku.safetyStock ? "text-destructive" : "")}>
                        {stock?.availableQty.value ?? 0}
                      </p>
                      <p className={moduleVisual.body}>{sku.unit}</p>
                      <p className={moduleVisual.body}>{sku.safetyStock}</p>
                      <p className={cn("text-sm font-semibold", (stock?.availableQty.value ?? 0) < sku.safetyStock ? "text-destructive" : "text-success")}>
                        {(stock?.availableQty.value ?? 0) < sku.safetyStock ? "0.8d" : "12.5d"}
                      </p>
                      <p className={moduleVisual.muted}>{lastMov ? lastMov.movementAt.split('T')[0] : "-"}</p>
                      <Badge variant="outline" className="text-[10px] font-normal">
                        {isZh ? "正常" : "Normal"}
                      </Badge>
                      <Badge variant={(stock?.availableQty.value ?? 0) < sku.safetyStock ? "destructive" : "outline"} className="text-[10px] w-fit">
                        {(stock?.availableQty.value ?? 0) < sku.safetyStock ? (isZh ? "需补货" : "Reorder") : (isZh ? "稳定" : "Stable")}
                      </Badge>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </ModuleMatrixRow>
                  );
                })}
              </ModuleMatrixTable>
            </ModuleSection>

            <ModuleSection
              title={isZh ? "库存变动记录" : "Stock Movement Log"}
              className="p-3"
            >
              <ModuleMatrixTable
                gridTemplateColumns="150px 120px 1.3fr 100px 80px 80px 90px 110px 130px 90px"
                columns={[
                  isZh ? "时间" : "Date / Time",
                  "SKU",
                  isZh ? "品项" : "Item",
                  isZh ? "变动类型" : "Movement Type",
                  isZh ? "入库" : "Qty In",
                  isZh ? "出库" : "Qty Out",
                  isZh ? "余额" : "Balance",
                  isZh ? "来源" : "Source",
                  isZh ? "单据" : "Reference",
                  isZh ? "操作员" : "Staff",
                ]}
              >
                {movements.map((mov) => {
                  const sku = skus.find(s => s.skuId === mov.skuId);
                  return (
                    <ModuleMatrixRow
                      key={mov.movementId}
                      gridTemplateColumns="150px 120px 1.3fr 100px 80px 80px 90px 110px 130px 90px"
                      className="py-2.5"
                    >
                      <p className={moduleVisual.muted}>{new Date(mov.movementAt).toLocaleString()}</p>
                      <p className={moduleVisual.body}>{sku?.skuCode || "-"}</p>
                      <p className={moduleVisual.body}>{sku?.productName || "-"}</p>
                      <Badge variant={mov.movementType === "inbound" ? "outline" : "secondary"} className="text-[10px] w-fit">
                        {mov.movementType}
                      </Badge>
                      <p className={moduleVisual.title}>{mov.movementType === "inbound" ? mov.quantity.value : "-"}</p>
                      <p className={moduleVisual.title}>{mov.movementType === "outbound" ? mov.quantity.value : "-"}</p>
                      <p className={moduleVisual.body}>-</p>
                      <p className={moduleVisual.body}>{mov.sourceRef.moduleCode}</p>
                      <p className={moduleVisual.body}>{mov.sourceRef.recordId}</p>
                      <p className={moduleVisual.body}>System</p>
                    </ModuleMatrixRow>
                  );
                })}
              </ModuleMatrixTable>
            </ModuleSection>
          </div>

          <div className="space-y-3 xl:sticky xl:top-4 self-start">
            <ContextQueuePanel title={isZh ? "Low Stock Queue" : "Low Stock Queue"}>
              {lowStockSkus.map((sku) => (
                <div key={sku.skuId} className="rounded-md border border-destructive/30 bg-destructive/5 px-2.5 py-2">
                  <p className={cn(moduleVisual.title, "text-destructive")}>{sku.productName}</p>
                  <p className={moduleVisual.muted}>{sku.skuCode}</p>
                </div>
              ))}
            </ContextQueuePanel>
            <ContextQueuePanel title={isZh ? "Reorder Suggestions" : "Reorder Suggestions"}>
              {suggestions.map((item) => (
                <div key={item.suggestionId} className="rounded-md border border-border/60 px-2.5 py-2">
                  <p className={moduleVisual.title}>{item.skuId}</p>
                  <p className={moduleVisual.muted}>{item.suggestedQty.value} {item.suggestedQty.unit}</p>
                </div>
              ))}
            </ContextQueuePanel>
            <ContextQueuePanel title={isZh ? "Expiry Watch" : "Expiry Watch"}>
              <p className={moduleVisual.muted}>{isZh ? "暂无即将到期品项" : "No items expiring soon."}</p>
            </ContextQueuePanel>
          </div>
        </ModuleTwoColumn>
      </ModulePageStack>
    </ErpShell>
  );
}
