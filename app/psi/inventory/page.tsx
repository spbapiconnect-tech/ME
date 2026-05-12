"use client";

import { useLayoutEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Eye,
  FileText,
  PackageSearch,
  Plus,
  Search,
} from "lucide-react";
import { ErpShell } from "@/components/erp/erp-shell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type InventoryItem = {
  sku: string;
  itemName: string;
  category: string;
  status: string;
  risk: string;
  branch: string;
  storage: string;
  currentStock: string;
  safetyStock: string;
  reorderPoint: string;
  reorderSuggestion: string;
  coverageDays: string;
  primarySupplier: string;
  supplierCode: string;
  purchaseUom: string;
  stockUom: string;
  baseUom: string;
  conversion: string;
  purchasePrice: string;
  unitCost: string;
  lastCost: string;
  averageCost: string;
  originalPrice: string;
  leadTime: string;
  lastPurchaseDate: string;
  bomUsage: string;
  usedIn: string;
  dailyUsage: string;
  wastageWatch: string;
  expiryBatch: string;
  lastMovement: string;
  linkedSupplier: string;
  linkedPr: string;
  linkedPo: string;
  linkedReceiving: string;
};

const inventoryItems: InventoryItem[] = [
  {
    sku: "SKU-1001",
    itemName: "Fresh Milk 1L",
    category: "Dairy",
    status: "active",
    risk: "high",
    branch: "ST-001",
    storage: "store",
    currentStock: "18 pcs",
    safetyStock: "60",
    reorderPoint: "60",
    reorderSuggestion: "140 pcs",
    coverageDays: "0.8d",
    primarySupplier: "SUP-Dairy",
    supplierCode: "SUP-1001",
    purchaseUom: "carton",
    stockUom: "pcs",
    baseUom: "pcs",
    conversion: "1 carton = 12 pcs",
    purchasePrice: "436.80 MYR / carton",
    unitCost: "36.40 MYR",
    lastCost: "35.90 MYR",
    averageCost: "36.12 MYR",
    originalPrice: "38.00 MYR",
    leadTime: "2 days",
    lastPurchaseDate: "2026-05-01",
    bomUsage: "8 recipes / 14 menu items",
    usedIn: "Milkshake, Cream Sauce, Breakfast Set",
    dailyUsage: "22 pcs / day",
    wastageWatch: "Low expiry buffer",
    expiryBatch: "B-MILK-0526",
    lastMovement: "Inbound 120 pcs · 2026-05-04",
    linkedSupplier: "SUP-1001",
    linkedPr: "RPL-1001",
    linkedPo: "PO-1001",
    linkedReceiving: "RCV-1001",
  },
  {
    sku: "SKU-1002",
    itemName: "Bakery Flour 2kg",
    category: "Baking",
    status: "active",
    risk: "normal",
    branch: "ST-001",
    storage: "store",
    currentStock: "35 bags",
    safetyStock: "24",
    reorderPoint: "30",
    reorderSuggestion: "0",
    coverageDays: "12.5d",
    primarySupplier: "SUP-Bakery",
    supplierCode: "SUP-1002",
    purchaseUom: "bag",
    stockUom: "bags",
    baseUom: "kg",
    conversion: "1 bag = 2kg",
    purchasePrice: "42.00 MYR / bag",
    unitCost: "21.00 MYR / kg",
    lastCost: "42.00 MYR",
    averageCost: "41.80 MYR",
    originalPrice: "45.00 MYR",
    leadTime: "3 days",
    lastPurchaseDate: "2026-05-02",
    bomUsage: "5 recipes / 9 menu items",
    usedIn: "Buns, Batter, Fried Chicken Coating",
    dailyUsage: "3 bags / day",
    wastageWatch: "Normal",
    expiryBatch: "B-FLOUR-0626",
    lastMovement: "Stock count confirmed",
    linkedSupplier: "SUP-1002",
    linkedPr: "-",
    linkedPo: "PO-1003",
    linkedReceiving: "-",
  },
  {
    sku: "SKU-1003",
    itemName: "Mineral Water 550ml",
    category: "Beverage",
    status: "active",
    risk: "high",
    branch: "ST-002",
    storage: "store",
    currentStock: "90 bottles",
    safetyStock: "120",
    reorderPoint: "120",
    reorderSuggestion: "220 bottles",
    coverageDays: "0.8d",
    primarySupplier: "SUP-Beverage",
    supplierCode: "SUP-1003",
    purchaseUom: "carton",
    stockUom: "bottles",
    baseUom: "bottles",
    conversion: "1 carton = 24 bottles",
    purchasePrice: "26.40 MYR / carton",
    unitCost: "1.10 MYR",
    lastCost: "1.08 MYR",
    averageCost: "1.09 MYR",
    originalPrice: "1.20 MYR",
    leadTime: "2 days",
    lastPurchaseDate: "2026-05-05",
    bomUsage: "0 recipes / 1 menu item",
    usedIn: "Set drink",
    dailyUsage: "80 bottles / day",
    wastageWatch: "Fast moving",
    expiryBatch: "-",
    lastMovement: "Inbound 170 bottles · 2026-05-05",
    linkedSupplier: "SUP-1003",
    linkedPr: "RPL-1003",
    linkedPo: "PO-1002",
    linkedReceiving: "RCV-1002",
  },
  {
    sku: "SKU-1004",
    itemName: "Yogurt Cup",
    category: "Dairy",
    status: "active",
    risk: "high",
    branch: "ST-002",
    storage: "store",
    currentStock: "40 cups",
    safetyStock: "80",
    reorderPoint: "80",
    reorderSuggestion: "120 cups",
    coverageDays: "0.8d",
    primarySupplier: "SUP-Dairy",
    supplierCode: "SUP-1001",
    purchaseUom: "carton",
    stockUom: "cups",
    baseUom: "cups",
    conversion: "1 carton = 48 cups",
    purchasePrice: "96.00 MYR / carton",
    unitCost: "2.00 MYR",
    lastCost: "1.95 MYR",
    averageCost: "1.98 MYR",
    originalPrice: "2.20 MYR",
    leadTime: "2 days",
    lastPurchaseDate: "2026-05-03",
    bomUsage: "3 recipes / 6 menu items",
    usedIn: "Dessert, Breakfast Set",
    dailyUsage: "38 cups / day",
    wastageWatch: "Expiry watch",
    expiryBatch: "YOG-0526",
    lastMovement: "Outbound trend high",
    linkedSupplier: "SUP-1001",
    linkedPr: "RPL-1004",
    linkedPo: "-",
    linkedReceiving: "-",
  },
  {
    sku: "SKU-1005",
    itemName: "Coffee Beans 1kg",
    category: "Beverage",
    status: "active",
    risk: "high",
    branch: "ST-001",
    storage: "store",
    currentStock: "0 bags",
    safetyStock: "20",
    reorderPoint: "20",
    reorderSuggestion: "40 bags",
    coverageDays: "0d",
    primarySupplier: "SUP-Coffee",
    supplierCode: "SUP-1005",
    purchaseUom: "bag",
    stockUom: "bags",
    baseUom: "kg",
    conversion: "1 bag = 1kg",
    purchasePrice: "68.00 MYR / bag",
    unitCost: "68.00 MYR",
    lastCost: "66.50 MYR",
    averageCost: "67.20 MYR",
    originalPrice: "72.00 MYR",
    leadTime: "5 days",
    lastPurchaseDate: "2026-04-28",
    bomUsage: "4 recipes / 10 menu items",
    usedIn: "Coffee, Latte, Mocha",
    dailyUsage: "5 bags / day",
    wastageWatch: "Out of stock",
    expiryBatch: "-",
    lastMovement: "No movement after stockout",
    linkedSupplier: "SUP-1005",
    linkedPr: "RPL-1005",
    linkedPo: "-",
    linkedReceiving: "-",
  },
  {
    sku: "SKU-1006",
    itemName: "Frozen Fries 2.5kg",
    category: "Frozen",
    status: "active",
    risk: "high",
    branch: "WH-1001",
    storage: "warehouse",
    currentStock: "22 packs",
    safetyStock: "50",
    reorderPoint: "50",
    reorderSuggestion: "90 packs",
    coverageDays: "0.8d",
    primarySupplier: "SUP-Frozen",
    supplierCode: "SUP-1006",
    purchaseUom: "carton",
    stockUom: "packs",
    baseUom: "kg",
    conversion: "1 carton = 6 packs",
    purchasePrice: "210.00 MYR / carton",
    unitCost: "35.00 MYR / pack",
    lastCost: "34.50 MYR",
    averageCost: "34.82 MYR",
    originalPrice: "38.00 MYR",
    leadTime: "4 days",
    lastPurchaseDate: "2026-05-05",
    bomUsage: "6 recipes / 12 menu items",
    usedIn: "Fries, Set Meals, PWP",
    dailyUsage: "28 packs / day",
    wastageWatch: "Frozen campaign demand",
    expiryBatch: "FRZ-0826",
    lastMovement: "Transfer -20 packs · 2026-05-05",
    linkedSupplier: "SUP-1006",
    linkedPr: "RPL-1006",
    linkedPo: "PO-1006",
    linkedReceiving: "RCV-1006",
  },
  {
    sku: "SKU-1007",
    itemName: "Tomato Sauce 500g",
    category: "Sauce",
    status: "active",
    risk: "high",
    branch: "ST-001",
    storage: "store",
    currentStock: "0 jars",
    safetyStock: "36",
    reorderPoint: "36",
    reorderSuggestion: "72 jars",
    coverageDays: "0d",
    primarySupplier: "SUP-Sauce",
    supplierCode: "SUP-1007",
    purchaseUom: "carton",
    stockUom: "jars",
    baseUom: "g",
    conversion: "1 carton = 24 jars",
    purchasePrice: "144.00 MYR / carton",
    unitCost: "6.00 MYR",
    lastCost: "5.80 MYR",
    averageCost: "5.92 MYR",
    originalPrice: "6.50 MYR",
    leadTime: "3 days",
    lastPurchaseDate: "2026-05-01",
    bomUsage: "7 recipes / 16 menu items",
    usedIn: "Burger Sauce, Pasta, Dips",
    dailyUsage: "12 jars / day",
    wastageWatch: "Out of stock",
    expiryBatch: "-",
    lastMovement: "No movement",
    linkedSupplier: "SUP-1007",
    linkedPr: "RPL-1007",
    linkedPo: "-",
    linkedReceiving: "-",
  },
  {
    sku: "SKU-1008",
    itemName: "Paper Cup 16oz",
    category: "Packaging",
    status: "active",
    risk: "high",
    branch: "ST-001",
    storage: "store",
    currentStock: "0 packs",
    safetyStock: "40",
    reorderPoint: "40",
    reorderSuggestion: "80 packs",
    coverageDays: "0d",
    primarySupplier: "SUP-Packaging",
    supplierCode: "SUP-1008",
    purchaseUom: "carton",
    stockUom: "packs",
    baseUom: "pcs",
    conversion: "1 carton = 20 packs",
    purchasePrice: "180.00 MYR / carton",
    unitCost: "9.00 MYR / pack",
    lastCost: "8.80 MYR",
    averageCost: "8.95 MYR",
    originalPrice: "9.50 MYR",
    leadTime: "2 days",
    lastPurchaseDate: "2026-04-30",
    bomUsage: "0 recipes / 8 packaging usages",
    usedIn: "Drinks, Takeaway",
    dailyUsage: "18 packs / day",
    wastageWatch: "Packaging critical",
    expiryBatch: "-",
    lastMovement: "No movement",
    linkedSupplier: "SUP-1008",
    linkedPr: "RPL-1008",
    linkedPo: "-",
    linkedReceiving: "-",
  },
];

const emptyRows = Array.from({ length: Math.max(0, 20 - inventoryItems.length) });

function FactRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[145px_1fr] gap-3 rounded-lg border border-border/70 bg-secondary/20 px-3 py-2 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-foreground">{value}</span>
    </div>
  );
}

function DetailSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-2">
      <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">{title}</div>
      <div className="grid gap-2 md:grid-cols-2">{children}</div>
    </section>
  );
}


function InventoryActionControls({ onPreview }: { onPreview: (label: string) => void }) {
  return (
    <div className="ml-auto flex flex-wrap items-center gap-2">
      {["Columns", "Density", "Sort", "Export", "More"].map((label) => (
        <Button
          key={label}
          type="button"
          variant="outline"
          size="sm"
          className="h-9 text-xs"
          onClick={() => onPreview(label)}
        >
          {label}
        </Button>
      ))}
    </div>
  );
}

function QuickList({
  selectedSku,
  selectedRows,
  onSelect,
  onToggleRow,
  onOpenDetail,
}: {
  selectedSku: string;
  selectedRows: string[];
  onSelect: (sku: string) => void;
  onToggleRow: (sku: string) => void;
  onOpenDetail: (sku: string) => void;
}) {
  return (
    <div className="rounded-xl border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border p-4">
        <div>
          <h2 className="text-base font-semibold">Quick SKU List</h2>
          <p className="mt-1 text-xs text-muted-foreground">Fixed 20-row speed list · SKU and item name only.</p>
        </div>
        <PackageSearch className="h-4 w-4 text-primary" />
      </div>

      <div className="overflow-hidden px-3 pt-3">
        <div className="grid h-9 grid-cols-[42px_110px_minmax(160px,1fr)_42px] items-center rounded-t-lg border border-border bg-secondary/30 text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          <div className="flex w-[52px] min-w-[52px] items-center justify-center px-0">
            <span className="h-4 w-4 rounded border border-primary/70" />
          </div>
          <div>SKU</div>
          <div>Item Name</div>
          <div />
        </div>

        <div className="h-[760px] border-x border-border">
          {inventoryItems.map((item) => {
            const active = selectedSku === item.sku;
            const checked = selectedRows.includes(item.sku);

            return (
              <div
                key={item.sku}
                role="button"
                tabIndex={0}
                onClick={() => onSelect(item.sku)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") onSelect(item.sku);
                }}
                className={[
                  "grid h-9 cursor-pointer grid-cols-[42px_110px_minmax(160px,1fr)_42px] items-center border-b border-border text-xs transition",
                  active ? "bg-primary/12 text-foreground" : "hover:bg-secondary/30",
                ].join(" ")}
              >
                <div className="flex w-[52px] min-w-[52px] items-center justify-center px-0">
                  <button
                    type="button"
                    aria-label={`Select ${item.sku}`}
                    onClick={(event) => {
                      event.stopPropagation();
                      onToggleRow(item.sku);
                    }}
                    className={[
                      "h-4 w-4 rounded border",
                      checked ? "border-primary bg-primary/20" : "border-primary/70",
                    ].join(" ")}
                  />
                </div>
                <div className="font-semibold text-foreground">{item.sku}</div>
                <div className="truncate font-medium">{item.itemName}</div>
                <div className="flex w-[52px] min-w-[52px] items-center justify-center px-0">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 p-0"
                    onClick={(event) => {
                      event.stopPropagation();
                      onOpenDetail(item.sku);
                    }}
                    title={`Open ${item.sku} detail`}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            );
          })}

          {emptyRows.map((_, index) => (
            <div
              key={`empty-${index}`}
              className="grid h-9 grid-cols-[42px_110px_minmax(160px,1fr)_42px] items-center border-b border-border text-sm text-muted-foreground/35"
            >
              <div className="flex w-[52px] min-w-[52px] items-center justify-center px-0">
                <span className="h-4 w-4 rounded border border-border/70" />
              </div>
              <div>—</div>
              <div>Empty row slot</div>
              <div />
            </div>
          ))}
        </div>

        <div className="flex h-11 flex-wrap items-center justify-between gap-2 rounded-b-lg border border-t-0 border-border bg-secondary/10 px-3 text-xs text-muted-foreground">
          <div className="flex flex-wrap items-center gap-3">
            <span>Showing 1–20 of 872</span>
            <span>Selected {selectedRows.length}</span>
            <span>Rows per page 20 / 50 / 100</span>
            <span>Page 1 of 44</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-8">Prev</Button>
            <Button variant="outline" size="sm" className="h-8">Next</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function FullItemDetail({
  item,
  onBack,
  onPreview,
}: {
  item: InventoryItem;
  onBack?: () => void;
  onPreview: (label: string) => void;
}) {
  return (
    <div className="rounded-xl border border-border bg-card">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border p-4">
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">Item Detail Workspace</div>
          <h2 className="mt-2 text-2xl font-semibold">{item.itemName}</h2>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <Badge variant="secondary">{item.sku}</Badge>
            <Badge variant="outline">{item.category}</Badge>
            <Badge variant={item.risk === "high" ? "destructive" : "outline"}>{item.risk} risk</Badge>
            <Badge variant="outline">{item.status}</Badge>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {onBack ? (
            <Button variant="outline" size="sm" onClick={onBack}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Grid
            </Button>
          ) : null}
          <Button variant="outline" size="sm" onClick={() => onPreview("Open item detail route")}>
            <Eye className="mr-2 h-4 w-4" />
            Open Detail
          </Button>
        </div>
      </div>

      <div className="max-h-[calc(100vh-230px)] space-y-5 overflow-y-auto p-4">
        <DetailSection title="Stock Snapshot">
          <FactRow label="Current Stock" value={item.currentStock} />
          <FactRow label="Safety Stock" value={item.safetyStock} />
          <FactRow label="Reorder Point" value={item.reorderPoint} />
          <FactRow label="Reorder Suggestion" value={item.reorderSuggestion} />
          <FactRow label="Coverage Days" value={item.coverageDays} />
          <FactRow label="Stock Risk" value={item.risk} />
        </DetailSection>

        <DetailSection title="Supplier & Purchase">
          <FactRow label="Primary Supplier" value={item.primarySupplier} />
          <FactRow label="Supplier Code" value={item.supplierCode} />
          <FactRow label="Purchase UOM" value={item.purchaseUom} />
          <FactRow label="Purchase Price" value={item.purchasePrice} />
          <FactRow label="Lead Time" value={item.leadTime} />
          <FactRow label="Last Purchase Date" value={item.lastPurchaseDate} />
        </DetailSection>

        <DetailSection title="UOM & Costing">
          <FactRow label="Base UOM" value={item.baseUom} />
          <FactRow label="Stock UOM" value={item.stockUom} />
          <FactRow label="Purchase UOM" value={item.purchaseUom} />
          <FactRow label="Conversion" value={item.conversion} />
          <FactRow label="Unit Cost" value={item.unitCost} />
          <FactRow label="Last Cost" value={item.lastCost} />
          <FactRow label="Average Cost" value={item.averageCost} />
          <FactRow label="Original Price / List Price" value={item.originalPrice} />
        </DetailSection>

        <DetailSection title="BOM Usage">
          <FactRow label="BOM Usage" value={item.bomUsage} />
          <FactRow label="Used In Recipes / Menu Items" value={item.usedIn} />
          <FactRow label="Daily Usage Estimate" value={item.dailyUsage} />
          <FactRow label="Wastage Watch" value={item.wastageWatch} />
        </DetailSection>

        <DetailSection title="Storage / Batch">
          <FactRow label="Branch" value={item.branch} />
          <FactRow label="Storage" value={item.storage} />
          <FactRow label="Expiry Batch" value={item.expiryBatch} />
          <FactRow label="Last Movement" value={item.lastMovement} />
        </DetailSection>

        <DetailSection title="Linked Records">
          <FactRow label="Linked Supplier" value={item.linkedSupplier} />
          <FactRow label="Linked PR" value={item.linkedPr} />
          <FactRow label="Linked PO" value={item.linkedPo} />
          <FactRow label="Linked Receiving / GRN" value={item.linkedReceiving} />
        </DetailSection>

        <section className="rounded-xl border border-border bg-secondary/10 p-3">
          <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">Actions</div>
          <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
            {["View Item", "Create PR", "Count Stock", "Add Note", "View BOM Usage"].map((action) => (
              <Button key={action} variant="outline" size="sm" onClick={() => onPreview(action)}>
                {action}
              </Button>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function GridSummaryDetail({
  item,
  onViewDetail,
  onPreview,
}: {
  item: InventoryItem;
  onViewDetail: () => void;
  onPreview: (label: string) => void;
}) {
  return (
    <aside className="rounded-xl border border-border bg-card p-4">
      <div className="flex items-start justify-between gap-3 border-b border-border pb-4">
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">Selected SKU</div>
          <h2 className="mt-2 text-lg font-semibold">{item.itemName}</h2>
          <p className="text-sm text-muted-foreground">{item.sku}</p>
        </div>
        <Badge variant={item.risk === "high" ? "destructive" : "outline"}>{item.risk}</Badge>
      </div>

      <div className="mt-4 space-y-2">
        <FactRow label="Current Stock" value={item.currentStock} />
        <FactRow label="Safety Stock" value={item.safetyStock} />
        <FactRow label="Reorder Point" value={item.reorderPoint} />
        <FactRow label="Coverage Days" value={item.coverageDays} />
        <FactRow label="Purchase UOM" value={item.purchaseUom} />
        <FactRow label="Unit Cost" value={item.unitCost} />
        <FactRow label="BOM Usage" value={item.bomUsage} />
      </div>

      <div className="mt-4 rounded-lg border border-border bg-secondary/10 p-3 text-sm text-muted-foreground">
        <div className="font-medium text-foreground">Record Notice</div>
        <div className="mt-1">Full item master data opens in Detail View. No API/database/write executed.</div>
      </div>

      <div className="mt-4 grid gap-2">
        <Button onClick={onViewDetail}>
          <Eye className="mr-2 h-4 w-4" />
          View Detail
        </Button>
        <Button variant="outline" onClick={() => onPreview("Edit Product")}>Edit Product</Button>
        <Button variant="outline" onClick={() => onPreview("Create PR")}>Create PR</Button>
        <Button variant="outline" onClick={() => onPreview("Count Stock")}>Count Stock</Button>
      </div>
    </aside>
  );
}

export default function InventoryPage() {
  const inventoryGridColumns = "52px 104px 210px 110px 90px 96px 124px 70px 92px 100px 126px 128px 72px";
  const [viewMode, setViewMode] = useState<"grid" | "detail">("grid");
  const [selectedSku, setSelectedSku] = useState("SKU-1001");
  const [selectedRows, setSelectedRows] = useState<string[]>(["SKU-1001"]);
  const [previewMessage, setPreviewMessage] = useState("Inventory workspace ready.");
  const [editingSku, setEditingSku] = useState(false);
  const [skuForm, setSkuForm] = useState({
    sku: "SKU-1001",
    itemName: "Fresh Milk 1L",
    category: "Dairy",
    branch: "ST-001",
    storage: "store",
    supplier: "SUP-Dairy",
    currentStock: "18 pcs",
    safetyStock: "60",
    reorderPoint: "60",
    purchaseUom: "carton",
    stockUom: "pcs",
    unitCost: "36.40 MYR",
    status: "active",
    lastPurchaseDate: "2026-05-01",
    linkedSupplier: "SUP-1001",
  });
  const gridScrollRef = useRef<HTMLDivElement | null>(null);

  const selectedItem = useMemo(
    () => inventoryItems.find((item) => item.sku === selectedSku) || inventoryItems[0],
    [selectedSku]
  );

  const loadSkuForm = (item: InventoryItem) => {
    setSkuForm({
      sku: item.sku,
      itemName: item.itemName,
      category: item.category,
      branch: item.branch,
      storage: item.storage,
      supplier: item.primarySupplier,
      currentStock: item.currentStock,
      safetyStock: item.safetyStock,
      reorderPoint: item.reorderPoint,
      purchaseUom: item.purchaseUom,
      stockUom: item.stockUom,
      unitCost: item.unitCost,
      status: item.status,
      lastPurchaseDate: item.lastPurchaseDate,
      linkedSupplier: item.linkedSupplier,
    });
  };

  useLayoutEffect(() => {
    if (viewMode !== "grid") return;

    const resetGridScroll = () => {
      if (gridScrollRef.current) {
        gridScrollRef.current.scrollLeft = 0;
      }
    };

    resetGridScroll();
    const frameOne = requestAnimationFrame(resetGridScroll);
    const frameTwo = requestAnimationFrame(() => requestAnimationFrame(resetGridScroll));
    const timeout = window.setTimeout(resetGridScroll, 80);

    return () => {
      cancelAnimationFrame(frameOne);
      cancelAnimationFrame(frameTwo);
      window.clearTimeout(timeout);
    };
  }, [viewMode]);

  const selectRow = (sku: string) => {
    setSelectedSku(sku);
    if (!selectedRows.includes(sku)) setSelectedRows([sku]);
  };

  const toggleRow = (sku: string) => {
    setSelectedRows((current) =>
      current.includes(sku) ? current.filter((item) => item !== sku) : [...current, sku]
    );
  };

  const openDetail = (sku: string) => {
    setSelectedSku(sku);
    setSelectedRows([sku]);
    setViewMode("detail");
    setPreviewMessage(`Detail opened for ${sku}.`);
  };

  const showPreview = (label: string) => {
    setPreviewMessage(`${label} opened.`);
  };

  return (
    <ErpShell activeHref="/psi/inventory">
      <div className="space-y-4 pb-24 md:pb-0">
        <header className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="hidden text-xs text-muted-foreground md:block">ME / PSI / Inventory</div>
            <h1 className="mt-1 text-lg font-semibold tracking-tight text-foreground md:mt-3 md:text-2xl">ME PSI Inventory</h1>
            <p className="mt-1 hidden text-sm text-muted-foreground md:block">
              {viewMode === "grid"
                ? "Normal View: wide inventory data grid with compact selected SKU summary."
                : "Detail View: 40% quick SKU list and 60% full item master detail."}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {viewMode === "detail" ? (
              <Button variant="outline" size="sm" onClick={() => setViewMode("grid")}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to List
              </Button>
            ) : null}
            <Button variant="outline" size="sm" className="hidden md:inline-flex" onClick={() => showPreview("Export")}>
              <FileText className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button size="sm" onClick={() => {
              setEditingSku(true);
              setSkuForm({
                sku: "",
                itemName: "",
                category: "",
                branch: "",
                storage: "",
                supplier: "",
                currentStock: "",
                safetyStock: "",
                reorderPoint: "",
                purchaseUom: "",
                stockUom: "",
                unitCost: "",
                status: "active",
                lastPurchaseDate: "",
                linkedSupplier: "",
              });
            }}>
              <Plus className="mr-2 h-4 w-4" />
              Add SKU
            </Button>
          </div>
        </header>

        <section className="hidden rounded-xl border border-border bg-card p-3 md:block">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <Badge variant="secondary" className="bg-primary/10 text-primary">All SKU 8</Badge>
            <Badge variant="outline">Low Stock 7</Badge>
            <Badge variant="outline">Expiry Watch 2</Badge>
            <Badge variant="outline">Reorder Needed 3</Badge>
            <Badge variant="outline">No Movement 5</Badge>
            <Badge variant="outline">Movement Variance 3</Badge>
            <Badge variant="outline">By Branch 3</Badge>
            <Badge variant="outline">By Storage 2</Badge>
          </div>
        </section>

        <section className="rounded-xl border border-border bg-card p-3 md:hidden">
          <div className="space-y-2">
            <div className="flex h-10 w-full items-center gap-2 rounded-lg border border-border bg-background px-3 text-sm text-muted-foreground">
              <Search className="h-4 w-4" />
              Search SKU / item name...
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {["All SKU", "Low Stock", "Expiring", "Reorder"].map((item, idx) => (
                <Badge key={item} variant={idx === 0 ? "secondary" : "outline"} className={idx === 0 ? "bg-primary/10 text-primary" : ""}>
                  {item}
                </Badge>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="h-8 px-3 text-xs" onClick={() => showPreview("Sort")}>Sort</Button>
              <Button variant="outline" size="sm" className="h-8 px-3 text-xs" onClick={() => showPreview("More Filters")}>More Filters</Button>
            </div>
          </div>
        </section>

        <section className="hidden rounded-xl border border-border bg-card p-3 md:block">
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex h-10 min-w-[260px] items-center gap-2 rounded-lg border border-border bg-background px-3 text-sm text-muted-foreground">
              <Search className="h-4 w-4" />
              Search SKU / item name...
            </div>
            {["Branch: All", "Storage: All", "Category: All", "Supplier: All", "Stock: Low", "Expiry: This Week", "Coverage: < 3d"].map((item) => (
              <Button key={item} variant="outline" size="sm" className="h-9 rounded-full border-dashed text-xs" onClick={() => showPreview(item)}>
                {item}
              </Button>
            ))}
            <Button variant="outline" size="sm" className="h-9 rounded-full border-primary/50 text-primary" onClick={() => showPreview("More Filters")}>
              More Filters
            </Button>
            <InventoryActionControls onPreview={showPreview} />
          </div>

          <div className="mt-3 rounded-lg border border-border bg-secondary/10 px-3 py-2 text-xs text-muted-foreground">
            {previewMessage}
          </div>
        </section>

        {editingSku ? (
          <section className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold">Product / SKU File</h2>
              <Button variant="outline" size="sm" onClick={() => setEditingSku(false)}>Close</Button>
            </div>
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              {[
                ["SKU Code", "sku"],
                ["Product Name", "itemName"],
                ["Category", "category"],
                ["Branch", "branch"],
                ["Storage", "storage"],
                ["Supplier", "supplier"],
                ["Current Stock", "currentStock"],
                ["Safety Stock", "safetyStock"],
                ["Reorder Point", "reorderPoint"],
                ["Purchase UOM", "purchaseUom"],
                ["Usage UOM", "stockUom"],
                ["Unit Cost", "unitCost"],
                ["Status", "status"],
                ["Last Purchase Date", "lastPurchaseDate"],
                ["Linked Supplier", "linkedSupplier"],
              ].map(([label, key]) => (
                <div key={key} className="space-y-1">
                  <Label className="text-xs text-muted-foreground">{label}</Label>
                  <Input
                    value={skuForm[key as keyof typeof skuForm]}
                    onChange={(event) => setSkuForm((prev) => ({ ...prev, [key]: event.target.value }))}
                  />
                </div>
              ))}
            </div>
            <div className="mt-4 flex gap-2">
              <Button size="sm" onClick={() => { setPreviewMessage("Product file updated."); setEditingSku(false); }}>Save</Button>
              <Button size="sm" variant="outline" onClick={() => setEditingSku(false)}>Cancel</Button>
            </div>
          </section>
        ) : null}

        {viewMode === "detail" ? (
          <>
          <section className="space-y-3 md:hidden">
            <div className="rounded-xl border border-border bg-card p-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-xs text-muted-foreground">Selected SKU</p>
                  <h2 className="text-lg font-semibold">{selectedItem.itemName}</h2>
                  <p className="text-xs text-muted-foreground">{selectedItem.sku}</p>
                </div>
                <Badge variant={selectedItem.risk === "high" ? "destructive" : "outline"}>{selectedItem.risk}</Badge>
              </div>
              <div className="mt-3 space-y-4">
                <DetailSection title="Stock Snapshot">
                  <FactRow label="Current Stock" value={selectedItem.currentStock} />
                  <FactRow label="Safety Stock" value={selectedItem.safetyStock} />
                  <FactRow label="Reorder Point" value={selectedItem.reorderPoint} />
                  <FactRow label="Reorder Suggestion" value={selectedItem.reorderSuggestion} />
                  <FactRow label="Coverage Days" value={selectedItem.coverageDays} />
                  <FactRow label="Stock Risk" value={selectedItem.risk} />
                </DetailSection>
                <DetailSection title="Supplier & Purchase">
                  <FactRow label="Primary Supplier" value={selectedItem.primarySupplier} />
                  <FactRow label="Supplier Code" value={selectedItem.supplierCode} />
                  <FactRow label="Purchase UOM" value={selectedItem.purchaseUom} />
                  <FactRow label="Unit Cost" value={selectedItem.unitCost} />
                  <FactRow label="Last Purchase Date" value={selectedItem.lastPurchaseDate} />
                  <FactRow label="Lead Time" value={selectedItem.leadTime} />
                </DetailSection>
                <DetailSection title="Usage / Linkage">
                  <FactRow label="BOM Usage" value={selectedItem.bomUsage} />
                  <FactRow label="Branch" value={selectedItem.branch} />
                  <FactRow label="Storage" value={selectedItem.storage} />
                  <FactRow label="Linked PR" value={selectedItem.linkedPr} />
                  <FactRow label="Linked PO" value={selectedItem.linkedPo} />
                  <FactRow label="Linked Receiving / GRN" value={selectedItem.linkedReceiving} />
                </DetailSection>
              </div>
              <Button size="sm" className="mt-3 w-full" onClick={() => showPreview("View Item")}>View Item</Button>
            </div>
          </section>
          <section className="hidden gap-4 md:grid xl:grid-cols-[minmax(360px,0.4fr)_minmax(620px,0.6fr)]">
            <QuickList
              selectedSku={selectedSku}
              selectedRows={selectedRows}
              onSelect={selectRow}
              onToggleRow={toggleRow}
              onOpenDetail={openDetail}
            />
            <FullItemDetail item={selectedItem} onBack={() => setViewMode("grid")} onPreview={showPreview} />
          </section>
          </>
        ) : (
          <>
          <section className="space-y-3 md:hidden">
            {inventoryItems.map((item) => {
              const active = selectedSku === item.sku;
              return (
                <div key={item.sku} className={["rounded-xl border p-3", active ? "border-primary/50 bg-primary/10" : "border-border bg-card"].join(" ")}>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-semibold">{item.itemName}</p>
                      <p className="text-xs text-muted-foreground">{item.sku} · {item.category}</p>
                    </div>
                    <Badge variant={item.risk === "high" ? "destructive" : "outline"}>{item.risk}</Badge>
                  </div>
                  <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                    <div>Stock: <span className="text-foreground">{item.currentStock}</span></div>
                    <div>Unit Cost: <span className="text-foreground">{item.unitCost}</span></div>
                    <div>Branch: <span className="text-foreground">{item.branch}</span></div>
                    <div>Supplier: <span className="text-foreground">{item.primarySupplier}</span></div>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1" onClick={() => selectRow(item.sku)}>
                      Select
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1" onClick={() => { selectRow(item.sku); loadSkuForm(item); setEditingSku(true); }}>
                      Edit
                    </Button>
                    <Button size="sm" className="flex-1" onClick={() => openDetail(item.sku)}>
                      <Eye className="mr-2 h-4 w-4" />
                      View
                    </Button>
                  </div>
                </div>
              );
            })}
          </section>
          <section className="hidden gap-4 md:grid xl:grid-cols-[minmax(0,1fr)_320px]">
            <div className="rounded-xl border border-border bg-card">
              <div className="flex items-center justify-between border-b border-border p-4">
                <div>
                  <h2 className="text-base font-semibold">Inventory SKU Matrix</h2>
                  <p className="mt-1 text-xs text-muted-foreground">Normal View · wide data grid for scanning and filtering inventory.</p>
                </div>
                <Button variant="outline" size="sm" onClick={() => openDetail(selectedSku)}>
                  View Detail
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>

              <div
                ref={(node) => {
                  gridScrollRef.current = node;
                  if (node) node.scrollLeft = 0;
                }}
                className="overflow-x-auto p-3"
              >
                <div className="w-max min-w-[1374px] overflow-hidden rounded-lg border border-border">
                  <div
                    className="grid h-9 items-center bg-secondary/30 text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground [&>div]:h-full [&>div]:border-r [&>div]:border-border/45 [&>div]:px-3 [&>div]:flex [&>div]:items-center [&>div:last-child]:border-r-0"
                    style={{ gridTemplateColumns: inventoryGridColumns }}
                  >
                    {["", "SKU", "Item Name", "Category", "Branch", "Storage", "Current Stock", "UOM", "Safety", "Coverage", "Supplier", "Unit Cost", ""].map((head, index) => (
                      <div
                        key={`${head}-${index}`}
                        className={index === 12 ? "justify-center px-0 text-center" : index === 0 ? "justify-center px-0" : "justify-start"}
                      >
                        {index === 12 ? "Action" : head}
                      </div>
                    ))}
                  </div>

                  <div className="min-h-[760px]">
                    {inventoryItems.map((item) => {
                      const active = selectedSku === item.sku;
                      const checked = selectedRows.includes(item.sku);

                      return (
                        <div
                          key={item.sku}
                          role="button"
                          tabIndex={0}
                          onClick={() => selectRow(item.sku)}
                          onKeyDown={(event) => {
                            if (event.key === "Enter" || event.key === " ") selectRow(item.sku);
                          }}
                          className={[
                            "grid h-9 cursor-pointer items-center border-b border-border text-xs transition [&>div]:h-full [&>div]:border-r [&>div]:border-border/45 [&>div]:px-3 [&>div]:flex [&>div]:items-center [&>div:last-child]:border-r-0",
                            active ? "bg-primary/12 text-foreground" : "hover:bg-secondary/30",
                          ].join(" ")}
                          style={{ gridTemplateColumns: inventoryGridColumns }}
                        >
                          <div className="justify-center px-0">
                            <button
                              type="button"
                              aria-label={`Select ${item.sku}`}
                              onClick={(event) => {
                                event.stopPropagation();
                                toggleRow(item.sku);
                              }}
                              className={[
                                "h-4 w-4 rounded border",
                                checked ? "border-primary bg-primary/20" : "border-primary/70",
                              ].join(" ")}
                            />
                          </div>
                          <div className="justify-start font-semibold text-foreground">{item.sku}</div>
                          <div className="justify-start truncate font-medium">{item.itemName}</div>
                          <div className="justify-start text-muted-foreground">{item.category}</div>
                          <div className="justify-start text-muted-foreground">{item.branch}</div>
                          <div className="justify-start text-muted-foreground">{item.storage}</div>
                          <div className={["justify-start font-semibold", item.risk === "high" ? "text-destructive" : "text-foreground"].join(" ")}>{item.currentStock}</div>
                          <div className="justify-start text-muted-foreground">{item.stockUom}</div>
                          <div className="justify-start text-muted-foreground">{item.safetyStock}</div>
                          <div className="justify-start text-muted-foreground">{item.coverageDays}</div>
                          <div className="justify-start truncate text-muted-foreground">{item.primarySupplier}</div>
                          <div className="justify-start whitespace-nowrap text-muted-foreground">{item.unitCost}</div>
                          <div className="justify-center px-0">
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 p-0"
                              onClick={(event) => {
                                event.stopPropagation();
                                openDetail(item.sku);
                              }}
                              title={`View ${item.sku} detail`}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex h-11 flex-wrap items-center justify-between gap-2 border-t border-border bg-secondary/10 px-3 text-xs text-muted-foreground">
                    <div className="flex flex-wrap items-center gap-3">
                      <span>Showing 1–20 of 872</span>
                      <span>Selected {selectedRows.length}</span>
                      <span>Rows per page 20 / 50 / 100</span>
                      <span>Page 1 of 44</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" className="h-8">Prev</Button>
                      <Button variant="outline" size="sm" className="h-8">Next</Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <GridSummaryDetail
              item={selectedItem}
              onViewDetail={() => openDetail(selectedItem.sku)}
              onPreview={showPreview}
            />
          </section>
          </>
        )}

      </div>
    </ErpShell>
  );
}
