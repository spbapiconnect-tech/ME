import type { PsiLocale } from "@/config/psi-language-copy";

type Variant = "default" | "outline";

export interface PsiOverviewSnapshot {
  label: string;
  value: string;
  hint: string;
  href: string;
}

export interface PsiOverviewCompareCard {
  label: string;
  value: string;
  target: string;
  percent: number;
  href: string;
  note: string;
}

export interface PsiOverviewMatrixRow {
  sku: string;
  item: string;
  stock: string;
  movement: string;
  purchase: string;
  grn: string;
  supplier: string;
  status: string;
  href: string;
}

export interface PsiOverviewLinkedRow {
  title: string;
  desc: string;
  href: string;
}

export interface PsiOverviewActivityRow {
  time: string;
  title: string;
  desc: string;
  href: string;
}

export interface PsiOverviewShortcut {
  title: string;
  description: string;
  href: string;
  metric: string;
}

export interface PsiOverviewQuickAction {
  label: string;
  href: string;
  variant: Variant;
}

export interface PsiOverviewPageData {
  snapshot: PsiOverviewSnapshot[];
  compareCards: PsiOverviewCompareCard[];
  matrixRows: PsiOverviewMatrixRow[];
  grnWatch: PsiOverviewLinkedRow[];
  riskSummary: PsiOverviewLinkedRow[];
  activity: PsiOverviewActivityRow[];
  moduleShortcuts: PsiOverviewShortcut[];
  quickActions: PsiOverviewQuickAction[];
}

export function getPsiOverviewPageData(locale: PsiLocale): PsiOverviewPageData {
  const isZh = locale === "zh";

  return {
    snapshot: [
      {
        label: isZh ? "库存水位" : "Stock Level",
        value: "3",
        hint: isZh ? "SKU 低于安全库存" : "SKUs below safety stock",
        href: "/psi/inventory",
      },
      {
        label: isZh ? "库存流动" : "Stock Movement",
        value: "3",
        hint: isZh ? "今日出入库 / 调整记录" : "Stock movement records today",
        href: "/psi/inventory",
      },
      {
        label: isZh ? "采购进度" : "Purchase Flow",
        value: "5",
        hint: isZh ? "PR 等待处理" : "PRs awaiting action",
        href: "/psi/procurement",
      },
      {
        label: isZh ? "GRN / 收货" : "GRN / Receiving",
        value: "3",
        hint: isZh ? "收货记录需复核" : "Receiving records need review",
        href: "/psi/receiving",
      },
    ],

    compareCards: [
      {
        label: isZh ? "SKU-1001 库存覆盖" : "SKU-1001 Coverage",
        value: "18 pcs",
        target: isZh ? "安全库存 60 pcs" : "Safety stock 60 pcs",
        percent: 30,
        href: "/psi/inventory/SKU-1001",
        note: isZh ? "低于目标，需要补货判断" : "Below target; replenishment review needed",
      },
      {
        label: isZh ? "PR → PO 转换" : "PR → PO Conversion",
        value: "3 / 5",
        target: isZh ? "3 张 PR 已进入 PO" : "3 PRs converted to PO",
        percent: 60,
        href: "/psi/procurement",
        note: isZh ? "仍有采购请求等待复核" : "Some requests still need review",
      },
      {
        label: isZh ? "GRN 差异率" : "GRN Variance",
        value: "1 / 3",
        target: isZh ? "1 条收货有争议" : "1 receiving record disputed",
        percent: 33,
        href: "/psi/receiving",
        note: isZh ? "数量差异会影响库存入账" : "Quantity variance affects stock posting",
      },
      {
        label: isZh ? "供应商风险" : "Supplier Risk",
        value: "2",
        target: isZh ? "2 个供应商问题" : "2 supplier issues",
        percent: 40,
        href: "/psi/supplier",
        note: isZh ? "交期 / 合同 / 资质需要跟进" : "ETA, contract, or certification follow-up",
      },
    ],

    matrixRows: [
      {
        sku: "SKU-1001",
        item: "Fresh Milk 1L",
        stock: "18 / 60 pcs",
        movement: "+120 pcs inbound",
        purchase: "PR-1001 / PO-1001",
        grn: "RCV-1001 · 2 pcs variance",
        supplier: "Northwind Supply Co.",
        status: isZh ? "低库存" : "Low Stock",
        href: "/psi/inventory/SKU-1001",
      },
      {
        sku: "SKU-1002",
        item: "Bakery Flour 2kg",
        stock: "35 / 24 bags",
        movement: "+40 bags inbound",
        purchase: "PR-1001 / PO-1001",
        grn: "RCV-1001 · completed",
        supplier: "Northwind Supply Co.",
        status: isZh ? "正常" : "Healthy",
        href: "/psi/procurement/PR-1001",
      },
      {
        sku: "SKU-1003",
        item: "Mineral Water 550ml",
        stock: "90 / 120 bottles",
        movement: "+170 bottles review",
        purchase: "PR-1002 / PO-1003",
        grn: "RCV-1003 · disputed",
        supplier: "BlueRiver Trading",
        status: isZh ? "GRN 差异" : "GRN Variance",
        href: "/psi/receiving/RCV-1003",
      },
      {
        sku: "SKU-1006",
        item: "Frozen Fries 2.5kg",
        stock: "22 / 50 packs",
        movement: "20 packs transfer",
        purchase: "PR-1005 draft",
        grn: isZh ? "等待采购确认" : "Awaiting purchase confirmation",
        supplier: "FreshFoods Industrial",
        status: isZh ? "补货关注" : "Replenishment Watch",
        href: "/psi/inventory/SKU-1006",
      },
    ],

    grnWatch: [
      {
        title: "RCV-1001",
        desc: isZh ? "PO-1001 · Fresh Milk 1L · 2 pcs 差异" : "PO-1001 · Fresh Milk 1L · 2 pcs variance",
        href: "/psi/receiving/RCV-1001",
      },
      {
        title: "RCV-1002",
        desc: isZh ? "PO-1002 · Yogurt Cup · 待收货" : "PO-1002 · Yogurt Cup · pending receiving",
        href: "/psi/receiving/RCV-1002",
      },
      {
        title: "RCV-1003",
        desc: isZh ? "PO-1003 · Mineral Water · disputed" : "PO-1003 · Mineral Water · disputed",
        href: "/psi/receiving/RCV-1003",
      },
    ],

    riskSummary: [
      {
        title: isZh ? "低库存" : "Low stock",
        desc: isZh ? "SKU-1001、SKU-1006 低于安全库存" : "SKU-1001 and SKU-1006 below safety stock",
        href: "/psi/inventory",
      },
      {
        title: isZh ? "供应商延迟" : "Supplier delay",
        desc: isZh ? "SUP-1003 发货延迟需要跟进" : "SUP-1003 late dispatch needs follow-up",
        href: "/psi/supplier/SUP-1003",
      },
      {
        title: isZh ? "GRN 差异" : "GRN variance",
        desc: isZh ? "RCV-1001 / RCV-1003 有数量差异" : "RCV-1001 / RCV-1003 have quantity variance",
        href: "/psi/receiving",
      },
      {
        title: isZh ? "经理复核" : "Manager review",
        desc: isZh ? "PR-1001 需要复核低库存采购" : "PR-1001 needs low-stock purchase review",
        href: "/psi/procurement/PR-1001",
      },
    ],

    activity: [
      {
        time: "09:26",
        title: isZh ? "低库存触发采购请求" : "Low stock triggered purchase request",
        desc: isZh ? "SKU-1001 低于安全库存并关联 PR-1001。" : "SKU-1001 is below safety stock and linked to PR-1001.",
        href: "/psi/inventory/SKU-1001",
      },
      {
        time: "09:35",
        title: isZh ? "供应商报价可用" : "Supplier quote available",
        desc: isZh ? "SUP-1001 报价已用于 PO-1001。" : "SUP-1001 quote is available for PO-1001.",
        href: "/psi/supplier/SUP-1001",
      },
      {
        time: "14:22",
        title: isZh ? "收货差异待验证" : "Receiving variance awaiting verification",
        desc: isZh ? "RCV-1001 有 2 pcs 差异。" : "RCV-1001 has 2 pcs variance.",
        href: "/psi/receiving/RCV-1001",
      },
    ],

    moduleShortcuts: [
      {
        title: isZh ? "采购" : "Procurement",
        description: isZh ? "PR / PO / 供应商确认 / 采购复核。" : "PR, PO, supplier confirmation, and purchase review.",
        href: "/psi/procurement",
        metric: isZh ? "5 张 PR" : "5 PRs",
      },
      {
        title: isZh ? "供应商" : "Supplier",
        description: isZh ? "交期、报价、问题与沟通状态。" : "ETA, quote, issue, and communication status.",
        href: "/psi/supplier",
        metric: isZh ? "5 个供应商" : "5 suppliers",
      },
      {
        title: isZh ? "库存" : "Inventory",
        description: isZh ? "库存水位、覆盖天数、移动与补货上下文。" : "Stock level, coverage, movement, and replenishment context.",
        href: "/psi/inventory",
        metric: isZh ? "8 个 SKU" : "8 SKUs",
      },
      {
        title: isZh ? "收货" : "Receiving",
        description: isZh ? "GRN、数量差异、入库确认与收货交接。" : "GRN, quantity variance, posting check, and receiving handoff.",
        href: "/psi/receiving",
        metric: isZh ? "3 条收货记录" : "3 receiving records",
      },
    ],

    quickActions: [
      { label: isZh ? "新建采购" : "Create Request", href: "/psi/procurement", variant: "default" },
      { label: isZh ? "查看 GRN" : "Open GRN", href: "/psi/receiving", variant: "outline" },
      { label: isZh ? "查看 PSI 报表" : "View PSI Report", href: "/reports", variant: "outline" },
    ],
  };
}
