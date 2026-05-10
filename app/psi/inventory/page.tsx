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
import { getPsiInventoryWorkspacePageData } from "@/lib/page-data/psi";
import { useUiPreferencesStore } from "@/stores/ui-preferences";
import { useEffect, useMemo, useState } from "react";
import type { PsiInventoryWorkspacePageData } from "@/lib/page-data/psi";
import { cn } from "@/lib/utils";
import { Plus, FileDown, MoreHorizontal } from "lucide-react";
import { restaurantFormulas } from "@/config/restaurant-formulas";

export default function PsiInventoryRoute() {
  const [data, setData] = useState<PsiInventoryWorkspacePageData | null>(null);
  const [viewKey, setViewKey] = useState("all");
  const [selectedRowIds, setSelectedRowIds] = useState<Set<string>>(new Set());
  const [focusedSkuId, setFocusedSkuId] = useState<string | null>(null);
  const locale = useUiPreferencesStore((state) => state.locale);
  const isZh = locale === "zh";

  useEffect(() => {
    getPsiInventoryWorkspacePageData().then(setData);
  }, []);

  const pageData = data?.pageData;
  const skus = useMemo(() => pageData?.skus ?? [], [pageData]);
  const movements = useMemo(() => pageData?.stockMovements ?? [], [pageData]);
  const suggestions = useMemo(() => pageData?.replenishmentSuggestions ?? [], [pageData]);
  const lowStockSkus = skus.filter((item) => {
    const stock = pageData?.storeStocks.find((stockItem) => stockItem.skuId === item.skuId);
    return (stock?.availableQty.value ?? 0) < item.safetyStock;
  });
  const inventoryIssues = useMemo(() => pageData?.issues ?? [], [pageData]);

  const formulaPreviewLabels = restaurantFormulas
    .filter((formula) => ["stock-risk-score", "reorder-suggestion"].includes(formula.key))
    .map((formula) => (isZh ? formula.label.zh : formula.label.en));

  const viewTabs = useMemo(
    () => [
      { key: "all", label: isZh ? "全部 SKU" : "All SKU", count: skus.length },
      { key: "low", label: isZh ? "低库存" : "Low Stock", count: lowStockSkus.length },
      { key: "expiry", label: isZh ? "效期预警" : "Expiry Watch", count: 2 },
      { key: "reorder", label: isZh ? "需补货" : "Reorder Needed", count: suggestions.length },
      { key: "variance", label: isZh ? "移动差异" : "Movement Variance", count: inventoryIssues.length },
    ],
    [inventoryIssues.length, isZh, lowStockSkus.length, skus.length, suggestions.length]
  );

  const filteredSkus = useMemo(() => {
    switch (viewKey) {
      case "low":
        return lowStockSkus;
      case "expiry":
        return skus.slice(0, 2);
      case "reorder":
        return skus.filter((item) => suggestions.some((suggestion) => suggestion.skuId === item.skuId));
      case "variance":
        return skus.filter((item) => inventoryIssues.some((issue) => issue.skuId === item.skuId));
      default:
        return skus;
    }
  }, [inventoryIssues, lowStockSkus, skus, suggestions, viewKey]);

  const focusedSku = useMemo(() => {
    if (!filteredSkus.length) return null;
    return filteredSkus.find((item) => item.skuId === focusedSkuId) ?? filteredSkus[0];
  }, [filteredSkus, focusedSkuId]);
  const focusedStock = focusedSku ? pageData?.storeStocks.find((item) => item.skuId === focusedSku.skuId) : null;
  const focusedWarehouse = focusedStock ? pageData?.warehouses.find((item) => item.warehouseId === focusedStock.warehouseId) : null;
  const focusedMovement = focusedSku ? movements.filter((item) => item.skuId === focusedSku.skuId).slice(0, 3) : [];
  const focusedReorder = focusedSku ? suggestions.find((item) => item.skuId === focusedSku.skuId) : null;
  const focusedSkuIssues = focusedSku ? inventoryIssues.filter((item) => item.skuId === focusedSku.skuId) : [];

  const columns: MultiDimColumn<(typeof filteredSkus)[number]>[] = [
    { key: "sku", label: "SKU", width: "120px", render: (row) => <p className={moduleVisual.title}>{row.skuCode}</p> },
    { key: "item", label: isZh ? "Item Name" : "Item Name", width: "1.5fr", render: (row) => <p className={moduleVisual.title}>{row.productName}</p> },
    { key: "category", label: isZh ? "Category" : "Category", width: "100px", render: (row) => <p className={moduleVisual.body}>{pageData?.products.find((item) => item.productId === row.productId)?.category ?? "-"}</p> },
    { key: "branch", label: isZh ? "Branch" : "Branch", width: "100px", render: (row) => <p className={moduleVisual.body}>{pageData?.warehouses.find((item) => item.warehouseId === pageData?.storeStocks.find((stock) => stock.skuId === row.skuId)?.warehouseId)?.warehouseCode ?? "-"}</p> },
    { key: "storage", label: isZh ? "Storage" : "Storage", width: "90px", render: (row) => <p className={moduleVisual.body}>{pageData?.warehouses.find((item) => item.warehouseId === pageData?.storeStocks.find((stock) => stock.skuId === row.skuId)?.warehouseId)?.type ?? "-"}</p> },
    { key: "current", label: isZh ? "Current Stock" : "Current Stock", width: "110px", render: (row) => <p className={cn(moduleVisual.title, ((pageData?.storeStocks.find((item) => item.skuId === row.skuId)?.availableQty.value ?? 0) < row.safetyStock) && "text-destructive")}>{pageData?.storeStocks.find((item) => item.skuId === row.skuId)?.availableQty.value ?? 0}</p> },
    { key: "uom", label: "UOM", width: "75px", render: (row) => <p className={moduleVisual.body}>{row.unit}</p> },
    { key: "safety", label: isZh ? "Safety Stock" : "Safety Stock", width: "95px", render: (row) => <p className={moduleVisual.body}>{row.safetyStock}</p> },
    { key: "coverage", label: isZh ? "Coverage Days" : "Coverage Days", width: "95px", render: (row) => <p className={moduleVisual.body}>{(pageData?.storeStocks.find((item) => item.skuId === row.skuId)?.availableQty.value ?? 0) < row.safetyStock ? "0.8d" : "12.5d"}</p> },
    { key: "movement", label: isZh ? "Last Movement" : "Last Movement", width: "120px", render: (row) => <p className={moduleVisual.body}>{movements.find((item) => item.skuId === row.skuId)?.movementAt.split("T")[0] ?? "-"}</p> },
    { key: "expiry", label: isZh ? "Expiry Status" : "Expiry Status", width: "110px", render: () => <TableFieldChip label={isZh ? "正常" : "Normal"} tone="success" /> },
    { key: "reorder", label: isZh ? "Reorder Status" : "Reorder Status", width: "110px", render: (row) => <TableFieldChip label={suggestions.some((item) => item.skuId === row.skuId) ? (isZh ? "建议补货" : "Suggested") : (isZh ? "稳定" : "Stable")} tone={suggestions.some((item) => item.skuId === row.skuId) ? "warning" : "muted"} /> },
    { key: "supplier", label: isZh ? "Supplier" : "Supplier", width: "100px", render: () => <p className={moduleVisual.body}>-</p> },
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

        <TableViewTabs tabs={viewTabs} value={viewKey} onChange={setViewKey} />

        <CompactStatStrip
          items={[
            { label: isZh ? "Total SKU" : "Total SKU", value: pageData?.stats.totalSkus ?? 0 },
            { label: isZh ? "Low Stock" : "Low Stock", value: lowStockSkus.length, tone: "danger" },
            { label: isZh ? "Expiry Watch" : "Expiry Watch", value: 2, tone: "warning" },
            { label: isZh ? "Reorder Needed" : "Reorder Needed", value: suggestions.length, tone: "warning" },
          ]}
        />

        <TableActionBar
          searchPlaceholder={isZh ? "搜索 SKU / 品项名称..." : "Search SKU / item name..."}
          selectedCount={selectedRowIds.size}
          filters={
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="h-7 px-2 font-normal border-dashed">
                {isZh ? "门店: 全部" : "Branch: All"}
              </Badge>
              <Badge variant="outline" className="h-7 px-2 font-normal border-dashed">
                {isZh ? "存储: 全部" : "Storage: All"}
              </Badge>
              <Badge variant="outline" className="h-7 px-2 font-normal border-dashed">
                {isZh ? "供应商: 全部" : "Supplier: All"}
              </Badge>
              <Badge variant="outline" className="h-7 px-2 font-normal border-dashed text-destructive border-destructive/30 bg-destructive/5">
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
              <MultidimensionalTable
                columns={columns}
                rows={filteredSkus}
                rowIdKey="skuId"
                selectedRowIds={selectedRowIds}
                onToggleRow={toggleRow}
                onToggleAll={toggleAll}
                selectedRecordId={focusedSku?.skuId}
                onRowFocus={setFocusedSkuId}
              />
            </ModuleSection>

            <ModuleSection
              title={isZh ? "库存变动记录" : "Stock Movement Log"}
              className="p-3"
            >
              <div className="space-y-2">
                {movements.slice(0, 10).map((mov) => {
                  const sku = skus.find((item) => item.skuId === mov.skuId);
                  return (
                    <div key={mov.movementId} className="grid grid-cols-[150px_110px_minmax(0,1fr)_80px_80px_90px_1fr_80px] items-center gap-2 rounded-md border border-border/60 px-2.5 py-2 text-xs">
                      <p className={moduleVisual.muted}>{new Date(mov.movementAt).toLocaleString()}</p>
                      <p className={moduleVisual.body}>{sku?.skuCode ?? "-"}</p>
                      <p className={moduleVisual.body}>{sku?.productName ?? "-"}</p>
                      <TableFieldChip label={mov.movementType} tone="muted" />
                      <p className={moduleVisual.body}>{mov.movementType === "inbound" ? mov.quantity.value : "-"}</p>
                      <p className={moduleVisual.body}>{mov.movementType === "outbound" ? mov.quantity.value : "-"}</p>
                      <p className={moduleVisual.body}>{mov.sourceRef.recordId}</p>
                      <p className={moduleVisual.body}>System</p>
                    </div>
                  );
                })}
              </div>
            </ModuleSection>
          </div>

          <div className="xl:sticky xl:top-4 self-start">
            <RecordDetailPanel
              title={isZh ? "选中 SKU" : "Selected SKU"}
              subtitle={focusedSku ? `${focusedSku.productName} / ${focusedSku.skuCode}` : "-"}
              fields={[
                { label: isZh ? "分支/存储" : "Branch / Storage", value: focusedWarehouse ? `${focusedWarehouse.warehouseCode} / ${focusedWarehouse.type}` : "-" },
                { label: isZh ? "当前库存" : "Current Stock", value: focusedStock ? `${focusedStock.availableQty.value} ${focusedStock.availableQty.unit}` : "-" },
                { label: isZh ? "安全库存" : "Safety Stock", value: focusedSku?.safetyStock ?? "-" },
                { label: isZh ? "覆盖天数" : "Coverage Days", value: focusedStock && focusedSku ? ((focusedStock.availableQty.value < focusedSku.safetyStock) ? "0.8d" : "12.5d") : "-" },
                { label: isZh ? "效期批次" : "Expiry Batch", value: "-" },
                { label: isZh ? "关联供应商" : "Linked Supplier", value: "-" },
                { label: isZh ? "关联采购" : "Linked Procurement", value: focusedReorder?.sourceRef.recordId ?? "-" },
              ]}
              sections={[
                {
                  title: isZh ? "库存变动摘要" : "Movement Summary",
                  items: focusedMovement.map((item) => (
                    <div key={item.movementId}>
                      <p className={moduleVisual.title}>{item.movementType}</p>
                      <p className={moduleVisual.muted}>{item.quantity.value} {item.quantity.unit}</p>
                    </div>
                  )),
                },
                {
                  title: isZh ? "公式预览（仅元数据）" : "Formula Preview (Metadata Only)",
                  items: [
                    <div key="formula-cov">{isZh ? "Coverage Days" : "Coverage Days"}</div>,
                    <div key="formula-reorder">{isZh ? "Reorder Suggestion" : "Reorder Suggestion"}</div>,
                    <div key="formula-risk">{isZh ? "Stock Risk" : "Stock Risk"}</div>,
                    ...formulaPreviewLabels.map((label) => <div key={label}>{label}</div>),
                  ],
                },
                {
                  title: isZh ? "问题" : "Issues",
                  items: focusedSkuIssues.map((item) => (
                    <div key={item.issueId}>
                      <p className={moduleVisual.title}>{item.title[locale]}</p>
                      <p className={moduleVisual.muted}>{item.status}</p>
                    </div>
                  )),
                },
              ]}
              actionLabels={[isZh ? "查看品项" : "View Item", isZh ? "添加备注" : "Add Note", isZh ? "关联 PR" : "Link PR"]}
            />
          </div>
        </ModuleTwoColumn>
      </ModulePageStack>
    </ErpShell>
  );
}
