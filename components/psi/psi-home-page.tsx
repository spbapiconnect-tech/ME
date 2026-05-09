"use client";

import Link from "next/link";

import { ErpPageHeader, ErpShell } from "@/components/erp";
import { Button } from "@/components/ui/button";
import { getPsiCopy, type PsiLocale } from "@/config/psi-language-copy";
import { PsiModuleCard, PsiSection, PsiSoftCard, psiVisual } from "@/components/psi/psi-visual";
import { useUiPreferencesStore } from "@/stores/ui-preferences";

export function PsiHomePage() {
  const rawLocale = useUiPreferencesStore((state) => state.locale);
  const currentLocale: PsiLocale = rawLocale === "zh" ? "zh" : "en";
  const psiCopy = getPsiCopy(currentLocale);
  const isZh = currentLocale === "zh";

  const snapshot = [
    {
      label: isZh ? "库存水位" : "Stock Level",
      value: "8",
      hint: isZh ? "SKU 低于关注线" : "SKUs below watch level",
      href: "/psi/inventory",
    },
    {
      label: isZh ? "库存流动" : "Stock Movement",
      value: "24",
      hint: isZh ? "今日出入库 / 调整记录" : "Stock in / out / adjustment today",
      href: "/psi/inventory",
    },
    {
      label: isZh ? "采购进度" : "Purchase Flow",
      value: "12",
      hint: isZh ? "PR / PO 等待处理" : "PR / PO awaiting action",
      href: "/psi/procurement",
    },
    {
      label: isZh ? "GRN / 收货" : "GRN / Receiving",
      value: "3",
      hint: isZh ? "收货差异待验证" : "Receiving variances awaiting check",
      href: "/psi/receiving",
    },
  ];

  const stockPurchaseFlow = [
    {
      sku: "SKU-KCH-0007",
      item: isZh ? "Coated Fries" : "Coated Fries",
      stock: "42 / 60 bags",
      movement: isZh ? "今日 -18 bags" : "-18 bags today",
      purchase: isZh ? "PR-KCH-0001 已关联" : "PR-KCH-0001 linked",
      grn: isZh ? "等待 PO 收货" : "Awaiting PO receiving",
      status: isZh ? "低库存" : "Low Stock",
      href: "/psi/inventory/SKU-KCH-0007",
    },
    {
      sku: "SKU-KCH-0012",
      item: isZh ? "Chicken Broth Base" : "Chicken Broth Base",
      stock: "12 carton",
      movement: isZh ? "今日 -4 carton" : "-4 carton today",
      purchase: isZh ? "供应商已确认" : "Supplier confirmed",
      grn: isZh ? "明日预计到货" : "ETA tomorrow",
      status: isZh ? "需跟进" : "Follow-up",
      href: "/psi/procurement/PR-1001",
    },
    {
      sku: "SKU-KCH-0021",
      item: isZh ? "Burger Sauce Cup" : "Burger Sauce Cup",
      stock: "600 pcs",
      movement: isZh ? "今日 -120 pcs" : "-120 pcs today",
      purchase: isZh ? "PO-KCH-0098" : "PO-KCH-0098",
      grn: isZh ? "数量待验证" : "Qty variance",
      status: isZh ? "GRN 差异" : "GRN Variance",
      href: "/psi/receiving",
    },
  ];

  const grnWatch = [
    {
      title: "RCV-KCH-240507",
      desc: isZh ? "PO-KCH-0098 · Burger Sauce Cup · 数量差异 1 line" : "PO-KCH-0098 · Burger Sauce Cup · 1 variance line",
    },
    {
      title: "RCV-KCH-240508",
      desc: isZh ? "ABC Food Supply · 到货时间待确认" : "ABC Food Supply · delivery time pending",
    },
    {
      title: "RCV-KCH-240509",
      desc: isZh ? "Freezer stock 入库前复核" : "Freezer stock check before posting",
    },
  ];

  const riskSummary = [
    isZh ? "3 个 SKU 覆盖天数低于目标" : "3 SKUs below coverage target",
    isZh ? "2 个 PO 等待供应商确认 ETA" : "2 POs awaiting supplier ETA confirmation",
    isZh ? "3 条 GRN / 收货记录待验证" : "3 GRN / receiving records awaiting verification",
    isZh ? "1 个采购请求需要经理复核" : "1 purchase request needs manager review",
  ];

  const activity = [
    {
      time: "09:26",
      title: isZh ? "采购请求已连接库存风险" : "Purchase request linked to stock risk",
      desc: isZh ? "PR-KCH-0001 由 SKU-KCH-0007 低库存触发。" : "PR-KCH-0001 was triggered by SKU-KCH-0007 low stock.",
    },
    {
      time: "09:35",
      title: isZh ? "供应商报价已加入" : "Supplier quote attached",
      desc: isZh ? "ABC Food Supply 报价已可用于采购复核。" : "ABC Food Supply quote is available for procurement review.",
    },
    {
      time: "14:22",
      title: isZh ? "收货差异等待验证" : "Receiving variance awaiting verification",
      desc: isZh ? "PO-KCH-0098 有 1 条数量差异待确认。" : "PO-KCH-0098 has 1 quantity variance pending check.",
    },
  ];

  const moduleShortcuts = [
    {
      title: psiCopy.shared.procurement,
      description: isZh ? "PR / PO / 供应商确认 / 采购复核。" : "PR, PO, supplier confirmation, and purchase review.",
      href: "/psi/procurement",
      metric: isZh ? "12 项待复核" : "12 pending review",
    },
    {
      title: psiCopy.shared.supplier,
      description: isZh ? "供应商交期、报价、问题与沟通状态。" : "Supplier ETA, quote, issue, and communication status.",
      href: "/psi/supplier",
      metric: isZh ? "4 项供应商问题" : "4 vendor issues",
    },
    {
      title: psiCopy.shared.inventory,
      description: isZh ? "库存水位、覆盖天数、移动与补货上下文。" : "Stock level, coverage, movement, and replenishment context.",
      href: "/psi/inventory",
      metric: isZh ? "8 项观察库存" : "8 watch items",
    },
    {
      title: isZh ? "收货" : "Receiving",
      description: isZh ? "GRN、数量差异、入库确认与收货交接。" : "GRN, quantity variance, posting check, and receiving handoff.",
      href: "/psi/receiving",
      metric: isZh ? "3 条待验证" : "3 awaiting verification",
    },
  ];

  return (
    <ErpShell activeHref="/psi">
      <div className={psiVisual.pageStack}>
        <ErpPageHeader
          breadcrumbs={["ME", "PSI", isZh ? "运营总览" : "Operations Overview"]}
          title={isZh ? "PSI 运营总览" : "PSI Operations Overview"}
          zhTitle="采购 · 库存 · 收货"
          subtitle={
            isZh
              ? "集中查看库存水位、库存流动、采购进度、GRN / 收货差异与供应商风险。"
              : "Central view for stock level, stock movement, purchase flow, GRN / receiving variance, and supplier risk."
          }
          actions={
            <>
              <Button asChild size="sm">
                <Link href="/psi/procurement">{isZh ? "新建采购" : "Create Request"}</Link>
              </Button>
              <Button asChild size="sm" variant="outline">
                <Link href="/psi/receiving">{isZh ? "查看 GRN" : "Open GRN"}</Link>
              </Button>
              <Button asChild size="sm" variant="outline">
                <Link href="/reports">{isZh ? "查看 PSI 报表" : "View PSI Report"}</Link>
              </Button>
            </>
          }
        />

        <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {snapshot.map((item) => (
            <Link key={item.label} href={item.href} className={`${psiVisual.card} ${psiVisual.cardHover}`}>
              <p className={psiVisual.eyebrow}>{item.label}</p>
              <p className={psiVisual.metric}>{item.value}</p>
              <p className={`mt-1 ${psiVisual.muted}`}>{item.hint}</p>
            </Link>
          ))}
        </section>

        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_21rem]">
          <PsiSection
            title={isZh ? "库存 · 采购 · GRN 联动表" : "Stock · Purchase · GRN Flow"}
            description={
              isZh
                ? "把 stock level、stock movement、PR / PO、GRN 状态放在同一张 PSI 运营视图。"
                : "One PSI operating view for stock level, stock movement, PR / PO, and GRN status."
            }
          >
            <div className="grid gap-3">
              {stockPurchaseFlow.map((row) => (
                <Link key={row.sku} href={row.href} className={`${psiVisual.card} ${psiVisual.cardHover}`}>
                  <div className="grid gap-3 xl:grid-cols-[1.2fr_1fr_1fr_1fr_auto] xl:items-center">
                    <div>
                      <p className={psiVisual.title}>{row.sku}</p>
                      <p className={`mt-1 ${psiVisual.body}`}>{row.item}</p>
                    </div>
                    <div>
                      <p className={psiVisual.eyebrow}>{isZh ? "库存水位" : "Stock Level"}</p>
                      <p className={psiVisual.value}>{row.stock}</p>
                    </div>
                    <div>
                      <p className={psiVisual.eyebrow}>{isZh ? "库存流动" : "Movement"}</p>
                      <p className={psiVisual.value}>{row.movement}</p>
                    </div>
                    <div>
                      <p className={psiVisual.eyebrow}>{isZh ? "采购 / GRN" : "Purchase / GRN"}</p>
                      <p className={psiVisual.value}>{row.purchase}</p>
                      <p className={`mt-1 ${psiVisual.muted}`}>{row.grn}</p>
                    </div>
                    <span className={psiVisual.pill}>{row.status}</span>
                  </div>
                </Link>
              ))}
            </div>
          </PsiSection>

          <PsiSection
            title={isZh ? "GRN / 收货观察" : "GRN / Receiving Watch"}
            description={isZh ? "只显示影响库存入账的收货事项。" : "Receiving items that affect stock posting."}
          >
            <div className="grid gap-3">
              {grnWatch.map((item) => (
                <PsiSoftCard key={item.title}>
                  <p className={psiVisual.title}>{item.title}</p>
                  <p className={`mt-1 ${psiVisual.body}`}>{item.desc}</p>
                </PsiSoftCard>
              ))}
            </div>
          </PsiSection>
        </div>

        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_21rem]">
          <PsiSection
            title={isZh ? "今日 PSI 活动" : "Today PSI Activity"}
            description={isZh ? "显示采购、库存、收货之间的最新联动。" : "Latest activity across purchase, inventory, and receiving."}
          >
            <div className="grid gap-3">
              {activity.map((item) => (
                <PsiSoftCard key={`${item.time}-${item.title}`}>
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className={psiVisual.title}>{item.title}</p>
                      <p className={`mt-1 ${psiVisual.body}`}>{item.desc}</p>
                    </div>
                    <span className="text-xs font-medium text-muted-foreground">{item.time}</span>
                  </div>
                </PsiSoftCard>
              ))}
            </div>
          </PsiSection>

          <PsiSection
            title={isZh ? "风险摘要" : "Risk Summary"}
            description={isZh ? "经理今天应该优先看的 PSI 风险。" : "PSI risks managers should review first today."}
          >
            <div className="grid gap-3">
              {riskSummary.map((item) => (
                <PsiSoftCard key={item}>
                  <p className={psiVisual.value}>{item}</p>
                </PsiSoftCard>
              ))}
            </div>
          </PsiSection>
        </div>

        <PsiSection
          title={isZh ? "模块入口" : "Module Shortcuts"}
          description={
            isZh
              ? "进入单据级工作台；PSI 总览只保留运营判断，不在这里处理全部明细。"
              : "Open record-level workspaces. PSI overview keeps operating judgement here, not every detail."
          }
        >
          <div className={psiVisual.moduleGrid}>
            {moduleShortcuts.map((item) => (
              <PsiModuleCard
                key={item.href}
                href={item.href}
                title={item.title}
                description={item.description}
                metric={item.metric}
              />
            ))}
          </div>
        </PsiSection>
      </div>
    </ErpShell>
  );
}
