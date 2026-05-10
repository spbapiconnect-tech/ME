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

export default function PsiInventoryRoute() {
  const [data, setData] = useState<PsiInventoryWorkspacePageData | null>(null);
  const [viewKey, setViewKey] = useState("all");
  const [selectedRowIds, setSelectedRowIds] = useState<Set<string>>(new Set());
  const [focusedSkuId, setFocusedSkuId] = useState<string | null>(null);
  const [density, setDensity] = useState<"compact" | "standard" | "comfortable">("compact");
  const [rowActionPreview, setRowActionPreview] = useState<string | null>(null);
  const locale = useUiPreferencesStore((state) => state.locale);
  const isZh = locale === "zh";

  useEffect(() => {
    getPsiInventoryWorkspacePageData().then(setData);
  }, []);

  const pageData = data?.pageData;
  const skus = useMemo(() => pageData?.skus ?? [], [pageData]);
  const movements = useMemo(() => pageData?.stockMovements ?? [], [pageData]);
  const suggestions = useMemo(() => pageData?.replenishmentSuggestions ?? [], [pageData]);
  const inventoryIssues = useMemo(() => pageData?.issues ?? [], [pageData]);

  const lowStockSkus = useMemo(
    () => skus.filter((item) => (pageData?.storeStocks.find((stockItem) => stockItem.skuId === item.skuId)?.availableQty.value ?? 0) < item.safetyStock),
    [pageData, skus]
  );

  const viewTabs = useMemo(
    () => [
      { key: "all", label: isZh ? "全部 SKU" : "All SKU", count: skus.length },
      { key: "low", label: isZh ? "低库存" : "Low Stock", count: lowStockSkus.length },
      { key: "expiry", label: isZh ? "效期预警" : "Expiry Watch", count: 2 },
      { key: "reorder", label: isZh ? "需补货" : "Reorder Needed", count: suggestions.length },
      { key: "nomove", label: isZh ? "无移动" : "No Movement", count: skus.filter((item) => !movements.some((mov) => mov.skuId === item.skuId)).length },
      { key: "variance", label: isZh ? "移动差异" : "Movement Variance", count: inventoryIssues.length },
      { key: "branch", label: isZh ? "按分支" : "By Branch", count: new Set((pageData?.storeStocks ?? []).map((item) => item.warehouseId)).size },
      { key: "storage", label: isZh ? "按存储" : "By Storage", count: new Set((pageData?.warehouses ?? []).map((item) => item.type)).size },
    ],
    [inventoryIssues.length, isZh, lowStockSkus.length, movements, pageData?.storeStocks, pageData?.warehouses, skus, suggestions.length]
  );

  const filteredSkus = useMemo(() => {
    switch (viewKey) {
      case "low":
        return lowStockSkus;
      case "expiry":
        return skus.slice(0, 2);
      case "reorder":
        return skus.filter((item) => suggestions.some((suggestion) => suggestion.skuId === item.skuId));
      case "nomove":
        return skus.filter((item) => !movements.some((mov) => mov.skuId === item.skuId));
      case "variance":
        return skus.filter((item) => inventoryIssues.some((issue) => issue.skuId === item.skuId));
      case "branch":
        return skus.filter((item) => (pageData?.storeStocks.find((stock) => stock.skuId === item.skuId)?.warehouseId ?? "").includes("WH"));
      case "storage":
        return skus.filter((item) => {
          const warehouseId = pageData?.storeStocks.find((stock) => stock.skuId === item.skuId)?.warehouseId;
          return warehouseId ? pageData?.warehouses.find((wh) => wh.warehouseId === warehouseId)?.type === "warehouse" : false;
        });
      default:
        return skus;
    }
  }, [inventoryIssues, lowStockSkus, movements, pageData?.storeStocks, pageData?.warehouses, skus, suggestions, viewKey]);

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
    { key: "item", label: isZh ? "Item Name" : "Item Name", width: "220px", render: (row) => <p className={moduleVisual.title}>{row.productName}</p> },
    { key: "category", label: isZh ? "Category" : "Category", width: "120px", render: (row) => <p className={moduleVisual.body}>{pageData?.products.find((item) => item.productId === row.productId)?.category ?? "-"}</p> },
    { key: "branch", label: isZh ? "Branch" : "Branch", width: "110px", render: (row) => <p className={moduleVisual.body}>{pageData?.warehouses.find((item) => item.warehouseId === pageData?.storeStocks.find((stock) => stock.skuId === row.skuId)?.warehouseId)?.warehouseCode ?? "-"}</p> },
    { key: "storage", label: isZh ? "Storage" : "Storage", width: "95px", render: (row) => <p className={moduleVisual.body}>{pageData?.warehouses.find((item) => item.warehouseId === pageData?.storeStocks.find((stock) => stock.skuId === row.skuId)?.warehouseId)?.type ?? "-"}</p> },
    { key: "current", label: isZh ? "Current Stock" : "Current Stock", width: "110px", render: (row) => <p className={cn(moduleVisual.title, (pageData?.storeStocks.find((item) => item.skuId === row.skuId)?.availableQty.value ?? 0) < row.safetyStock && "text-destructive")}>{pageData?.storeStocks.find((item) => item.skuId === row.skuId)?.availableQty.value ?? 0}</p> },
    { key: "uom", label: "UOM", width: "75px", render: (row) => <p className={moduleVisual.body}>{row.unit}</p> },
    { key: "safety", label: isZh ? "Safety Stock" : "Safety Stock", width: "95px", render: (row) => <p className={moduleVisual.body}>{row.safetyStock}</p> },
    { key: "coverage", label: isZh ? "Coverage Days" : "Coverage Days", width: "95px", render: (row) => <p className={moduleVisual.body}>{(pageData?.storeStocks.find((item) => item.skuId === row.skuId)?.availableQty.value ?? 0) < row.safetyStock ? "0.8d" : "12.5d"}</p> },
    { key: "expiry", label: isZh ? "Expiry Status" : "Expiry Status", width: "110px", render: () => <TableFieldChip label={isZh ? "正常" : "Normal"} tone="success" /> },
    { key: "supplier", label: isZh ? "Supplier" : "Supplier", width: "100px", render: () => <p className={moduleVisual.body}>-</p> },
    { key: "movement", label: isZh ? "Last Movement" : "Last Movement", width: "120px", render: (row) => <p className={moduleVisual.body}>{movements.find((item) => item.skuId === row.skuId)?.movementAt.split("T")[0] ?? "-"}</p> },
    { key: "reorder", label: isZh ? "Reorder Status" : "Reorder Status", width: "110px", render: (row) => <TableFieldChip label={suggestions.some((item) => item.skuId === row.skuId) ? (isZh ? "建议补货" : "Suggested") : (isZh ? "稳定" : "Stable")} tone={suggestions.some((item) => item.skuId === row.skuId) ? "warning" : "muted"} /> },
    {
      key: "action",
      label: isZh ? "Action" : "Action",
      width: "70px",
      render: () => (
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={(event) => {
            event.stopPropagation();
            setRowActionPreview("View item preview opened from row action.");
          }}
        >
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
          subtitle={isZh ? "SKU 库存矩阵与补货判断。" : "SKU stock matrix and replenishment workspace."}
          actions={
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline" className="hidden md:inline-flex">
                <FileDown className="mr-2 h-4 w-4" />
                {isZh ? "导出记录" : "Export"}
              </Button>
              <Button size="sm">
                <Plus className="mr-2 h-4 w-4" />
                {isZh ? "新增品项" : "Add SKU"}
              </Button>
            </div>
          }
        />

        <TableViewTabs title={isZh ? "已保存视图" : "Saved Views"} tabs={viewTabs} value={viewKey} onChange={setViewKey} />

        <CompactStatStrip
          items={[
            { label: isZh ? "Total SKU" : "Total SKU", value: pageData.stats.totalSkus },
            { label: isZh ? "Low Stock" : "Low Stock", value: lowStockSkus.length, tone: "danger" },
            { label: isZh ? "Reorder Needed" : "Reorder Needed", value: suggestions.length, tone: "warning" },
            { label: isZh ? "Movement Variance" : "Movement Variance", value: inventoryIssues.length, tone: "warning" },
          ]}
        />

        <TableActionBar
          searchPlaceholder={isZh ? "搜索 SKU / 品项名称..." : "Search SKU / item name..."}
          selectedCount={selectedRowIds.size}
          bulkActionLabel={isZh ? "创建 PR 预览" : "Create PR Preview"}
          bulkActionKey="inventory.create_pr_preview"
          density={density}
          onDensityChange={setDensity}
          onClearSelection={() => setSelectedRowIds(new Set())}
          columns={["SKU", "Item Name", "Category", "Branch", "Storage", "Current Stock", "Coverage Days", "Supplier", "Reorder Status"]}
          sortOptions={["Current Stock", "Coverage Days", "Last Movement", "Supplier"]}
          advancedFilters={[
            { title: "Inventory", items: ["Branch", "Storage", "Category", "Supplier", "Stock Status", "Expiry Range", "Coverage Days", "BOM Usage", "Price Range"] },
          ]}
          filters={
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="h-7 px-2 font-normal border-dashed">{isZh ? "分支: 全部" : "Branch: All"}</Badge>
              <Badge variant="outline" className="h-7 px-2 font-normal border-dashed">{isZh ? "存储: 全部" : "Storage: All"}</Badge>
              <Badge variant="outline" className="h-7 px-2 font-normal border-dashed">{isZh ? "分类: 全部" : "Category: All"}</Badge>
              <Badge variant="outline" className="h-7 px-2 font-normal border-dashed">{isZh ? "供应商: 全部" : "Supplier: All"}</Badge>
              <Badge variant="outline" className="h-7 px-2 font-normal border-dashed">{isZh ? "库存状态: 低库存" : "Stock: Low"}</Badge>
              <Badge variant="outline" className="h-7 px-2 font-normal border-dashed">{isZh ? "效期: 本周" : "Expiry: This Week"}</Badge>
              <Badge variant="outline" className="h-7 px-2 font-normal border-dashed">{isZh ? "覆盖天数: < 3d" : "Coverage: < 3d"}</Badge>
              <Badge variant="outline" className="h-7 px-2 font-normal border-dashed text-primary border-primary/30 bg-primary/5">{isZh ? "更多筛选" : "More Filters"}</Badge>
            </div>
          }
        />

        <ModuleTwoColumn className="xl:grid-cols-[minmax(0,1fr)_18.5rem]">
          <div className="space-y-3">
            <ModuleSection title={isZh ? "库存 SKU 矩阵" : "Inventory SKU Matrix"} className="p-3">
              <MultidimensionalTable
                columns={columns}
                rows={filteredSkus}
                rowIdKey="skuId"
                selectedRowIds={selectedRowIds}
                onToggleRow={toggleRow}
                onToggleAll={toggleAll}
                selectedRecordId={focusedSku?.skuId}
                onRowFocus={setFocusedSkuId}
                pageLabel={isZh ? "显示 1–20 / 共 872" : "Showing 1–20 of 872"}
                rowsPerPageLabel={isZh ? "每页 20 / 50 / 100" : "Rows per page 20 / 50 / 100"}
                minWidth="1500px"
                density={density}
              />
            </ModuleSection>
          </div>

          <div className="xl:sticky xl:top-4 self-start">
            <RecordDetailPanel
              title={isZh ? "选中 SKU" : "Selected SKU"}
              subtitle={focusedSku ? `${focusedSku.productName} / ${focusedSku.skuCode}` : "-"}
              fields={[
                { label: "SKU", value: focusedSku?.skuCode ?? "-" },
                { label: isZh ? "Item Name" : "Item Name", value: focusedSku?.productName ?? "-" },
                { label: isZh ? "Category" : "Category", value: focusedSku ? pageData?.products.find((item) => item.productId === focusedSku.productId)?.category ?? "-" : "-" },
                { label: isZh ? "Status" : "Status", value: focusedSku?.status ?? "-" },
                { label: isZh ? "Branch / Storage" : "Branch / Storage", value: focusedWarehouse ? `${focusedWarehouse.warehouseCode} / ${focusedWarehouse.type}` : "-" },
                { label: isZh ? "当前库存" : "Current Stock", value: focusedStock ? `${focusedStock.availableQty.value} ${focusedStock.availableQty.unit}` : "-" },
                { label: isZh ? "安全库存" : "Safety Stock", value: focusedSku?.safetyStock ?? "-" },
                { label: isZh ? "Reorder Point" : "Reorder Point", value: focusedSku?.safetyStock ?? "-" },
                { label: isZh ? "覆盖天数" : "Coverage Days", value: focusedStock && focusedSku ? (focusedStock.availableQty.value < focusedSku.safetyStock ? "0.8d" : "12.5d") : "-" },
                { label: isZh ? "Stock Risk" : "Stock Risk", value: focusedStock && focusedSku && focusedStock.availableQty.value < focusedSku.safetyStock ? "high" : "stable" },
                { label: isZh ? "Purchase UOM" : "Purchase UOM", value: focusedSku?.unit ?? "-" },
                { label: isZh ? "Unit Cost" : "Unit Cost", value: "36.40 MYR" },
                { label: isZh ? "BOM Usage" : "BOM Usage", value: "8 recipes / 14 menu items" },
                { label: isZh ? "效期批次" : "Expiry Batch", value: "-" },
                { label: isZh ? "关联供应商" : "Linked Supplier", value: "-" },
                { label: isZh ? "关联采购" : "Linked Procurement", value: focusedReorder?.sourceRef.recordId ?? "-" },
                { label: isZh ? "补货建议" : "Reorder Suggestion", value: focusedReorder?.suggestedQty.value ? `${focusedReorder.suggestedQty.value} ${focusedReorder.suggestedQty.unit}` : "-" },
              ]}
              sections={[
                {
                  title: isZh ? "Supplier & Purchase" : "Supplier & Purchase",
                  items: [
                    <div key="supplier-purchase">
                      <p className={moduleVisual.title}>Primary Supplier: SUP-Dairy</p>
                      <p className={moduleVisual.muted}>Supplier Code: SD-011 / Lead Time: 3d / Last Purchase: 2026-05-08</p>
                    </div>,
                  ],
                },
                {
                  title: isZh ? "UOM & Costing" : "UOM & Costing",
                  items: [
                    <div key="uom-cost">
                      <p className={moduleVisual.title}>Base UOM: kg | Stock UOM: kg | Purchase UOM: carton</p>
                      <p className={moduleVisual.muted}>Conversion: 1 carton = 24 kg | Last Cost: 36.40 | Average Cost: 35.85 | List Price: 39.00</p>
                    </div>,
                  ],
                },
                {
                  title: isZh ? "Usage / BOM" : "Usage / BOM",
                  items: [
                    <div key="usage-bom">
                      <p className={moduleVisual.title}>Daily Usage Estimate: 21.5 kg</p>
                      <p className={moduleVisual.muted}>Wastage Watch: Normal</p>
                    </div>,
                  ],
                },
                {
                  title: isZh ? "最近移动" : "Recent Movement",
                  items: focusedMovement.map((item) => (
                    <div key={item.movementId}>
                      <p className={moduleVisual.title}>{item.movementType}</p>
                      <p className={moduleVisual.muted}>{item.quantity.value} {item.quantity.unit}</p>
                    </div>
                  )),
                },
                {
                  title: isZh ? "公式预览（元数据）" : "Formula Preview (Metadata)",
                  items: [
                    <div key="coverage">{isZh ? "Coverage Days" : "Coverage Days"}</div>,
                    <div key="risk">{isZh ? "Stock Risk" : "Stock Risk"}</div>,
                    <div key="reorder">{isZh ? "Reorder Suggestion" : "Reorder Suggestion"}</div>,
                  ],
                },
                {
                  title: isZh ? "关联问题" : "Linked Issues",
                  items: focusedSkuIssues.map((item) => (
                    <div key={item.issueId}>
                      <p className={moduleVisual.title}>{item.title[locale]}</p>
                      <p className={moduleVisual.muted}>{item.status}</p>
                    </div>
                  )),
                },
                {
                  title: isZh ? "Row Action Preview" : "Row Action Preview",
                  items: rowActionPreview ? [<div key="row-preview">{rowActionPreview}</div>] : [],
                },
              ]}
              actions={[
                { label: isZh ? "查看品项" : "View Item", controlKey: "table.export" },
                { label: isZh ? "创建 PR 预览" : "Create PR Preview", controlKey: "inventory.create_pr_preview" },
                { label: isZh ? "添加备注" : "Add Note", controlKey: "supplier.add_note_preview" },
                { label: isZh ? "盘点预览" : "Count Stock Preview", controlKey: "inventory.count_stock_preview" },
                { label: isZh ? "查看 BOM 用量" : "View BOM Usage", controlKey: "table.export" },
              ]}
              statusLabel={focusedSku?.status}
            />
          </div>
        </ModuleTwoColumn>
      </ModulePageStack>
    </ErpShell>
  );
}
