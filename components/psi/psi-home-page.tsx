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

  const psiModules = [
    {
      title: psiCopy.shared.procurement,
      description: psiCopy.overview.procurementDescription,
      href: "/psi/procurement",
      metric: psiCopy.overview.procurementMetric,
    },
    {
      title: psiCopy.shared.supplier,
      description: psiCopy.overview.supplierDescription,
      href: "/psi/supplier",
      metric: psiCopy.overview.supplierMetric,
    },
    {
      title: psiCopy.shared.inventory,
      description: psiCopy.overview.inventoryDescription,
      href: "/psi/inventory",
      metric: psiCopy.overview.inventoryMetric,
    },
    {
      title: isZh ? "收货" : "Receiving",
      description: isZh
        ? "供应商到货、数量差异、入库交接与收货检查。"
        : "Supplier receiving, variance review, inventory handoff, and delivery checks.",
      href: "/psi/receiving",
      metric: isZh ? "3 条待验证" : "3 awaiting verification",
    },
  ];

  const kpis = [
    {
      label: isZh ? "待处理采购" : "Pending Procurement",
      value: "12",
      hint: isZh ? "需要经理或采购复核" : "Need manager or purchasing review",
    },
    {
      label: isZh ? "供应商问题" : "Supplier Issues",
      value: "4",
      hint: isZh ? "价格、交期或沟通待跟进" : "Pricing, lead time, or communication follow-up",
    },
    {
      label: isZh ? "低库存项目" : "Low Stock Items",
      value: "8",
      hint: isZh ? "低于安全库存或覆盖天数不足" : "Below safety stock or coverage target",
    },
    {
      label: isZh ? "收货差异" : "Receiving Variance",
      value: "3",
      hint: isZh ? "数量或入库验证待处理" : "Quantity or posting verification pending",
    },
  ];

  const attentionQueue = [
    {
      id: "PR-KCH-0001",
      type: isZh ? "采购请求" : "Procurement Request",
      subject: "ABC Food Supply",
      risk: isZh ? "高风险" : "High Risk",
      next: isZh ? "下一步：经理复核" : "Next: Manager Review",
      href: "/psi/procurement/PR-1001",
    },
    {
      id: "SKU-KCH-0007",
      type: isZh ? "低库存" : "Low Stock",
      subject: isZh ? "Coated Fries · 2.1 天覆盖" : "Coated Fries · 2.1 days coverage",
      risk: isZh ? "库存风险" : "Inventory Risk",
      next: isZh ? "下一步：关联采购请求" : "Next: Link Purchase Request",
      href: "/psi/inventory/SKU-KCH-0007",
    },
    {
      id: "RCV-KCH-240507",
      type: isZh ? "收货差异" : "Receiving Variance",
      subject: "PO-KCH-0098 · ABC Food Supply",
      risk: isZh ? "待验证" : "Awaiting Verification",
      next: isZh ? "下一步：确认数量" : "Next: Verify Quantity",
      href: "/psi/receiving",
    },
  ];

  const riskSummary = [
    isZh ? "3 个高风险事项需要今天处理" : "3 high-risk items need action today",
    isZh ? "2 个供应商交期需要确认" : "2 supplier lead times need confirmation",
    isZh ? "8 个库存项目低于关注线" : "8 stock items are below watch level",
    isZh ? "3 条收货记录等待验证" : "3 receiving records are awaiting verification",
  ];

  const activity = [
    {
      time: "09:26",
      title: isZh ? "供应商报价已关联" : "Supplier quote attached",
      description: isZh
        ? "ABC Food Supply 报价已关联到采购请求。"
        : "ABC Food Supply quotation linked to procurement request.",
    },
    {
      time: "09:35",
      title: isZh ? "库存风险已关联" : "Inventory risk linked",
      description: isZh
        ? "KCH 库存覆盖风险已加入 PSI 队列。"
        : "KCH stock coverage risk added to PSI queue.",
    },
    {
      time: "14:22",
      title: isZh ? "等待经理复核" : "Awaiting manager review",
      description: isZh
        ? "采购请求已进入门店经理复核。"
        : "Procurement request moved into branch manager review.",
    },
  ];

  const quickActions = [
    {
      label: isZh ? "新建采购请求" : "Create Request",
      href: "/psi/procurement",
      variant: "default" as const,
    },
    {
      label: isZh ? "查看低库存" : "Review Low Stock",
      href: "/psi/inventory",
      variant: "outline" as const,
    },
    {
      label: isZh ? "处理收货差异" : "Open Receiving Variance",
      href: "/psi/receiving",
      variant: "outline" as const,
    },
    {
      label: isZh ? "查看 PSI 报表" : "View PSI Report",
      href: "/reports",
      variant: "outline" as const,
    },
  ];

  return (
    <ErpShell activeHref="/psi">
      <div className={psiVisual.pageStack}>
        <ErpPageHeader
          breadcrumbs={["ME", "PSI", psiCopy.overview.eyebrow]}
          title={psiCopy.overview.title}
          zhTitle="PSI 工作台"
          subtitle={psiCopy.overview.description}
          actions={
            <>
              <Button asChild size="sm">
                <Link href="/psi/procurement">{isZh ? "新建采购" : "Create Request"}</Link>
              </Button>
              <Button asChild size="sm" variant="outline">
                <Link href="/reports">{isZh ? "查看 PSI 报表" : "View PSI Report"}</Link>
              </Button>
              <Button asChild size="sm" variant="outline">
                <Link href="/psi/issues">{isZh ? "打开问题" : "Open Issues"}</Link>
              </Button>
            </>
          }
        />

        <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {kpis.map((item) => (
            <PsiSoftCard key={item.label}>
              <p className={psiVisual.eyebrow}>{item.label}</p>
              <p className={psiVisual.metric}>{item.value}</p>
              <p className={`mt-1 ${psiVisual.muted}`}>{item.hint}</p>
            </PsiSoftCard>
          ))}
        </section>

        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_20rem]">
          <PsiSection
            title={isZh ? "需要处理的 PSI 队列" : "Attention Queue"}
            description={
              isZh
                ? "跨采购、供应商、库存与收货的优先事项。"
                : "Priority work across procurement, supplier, inventory, and receiving."
            }
          >
            <div className="grid gap-3">
              {attentionQueue.map((item) => (
                <Link key={item.id} href={item.href} className={`${psiVisual.card} ${psiVisual.cardHover}`}>
                  <div className="grid gap-3 md:grid-cols-[1fr_auto] md:items-center">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <p className={psiVisual.title}>{item.id}</p>
                        <span className="rounded-full border border-border bg-muted px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">
                          {item.type}
                        </span>
                      </div>
                      <p className={`mt-1 ${psiVisual.body}`}>{item.subject}</p>
                    </div>

                    <div className="flex flex-wrap gap-2 md:justify-end">
                      <span className={psiVisual.pill}>{item.risk}</span>
                      <span className={psiVisual.pill}>{item.next}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </PsiSection>

          <PsiSection
            title={isZh ? "风险摘要" : "Risk Summary"}
            description={isZh ? "今天优先处理的 PSI 风险。" : "PSI risks that should be reviewed first today."}
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

        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_20rem]">
          <PsiSection
            title={isZh ? "今日活动" : "Today Activity"}
            description={isZh ? "PSI 工作区今日最新联动。" : "Latest PSI coordination events today."}
          >
            <div className="grid gap-3">
              {activity.map((item) => (
                <PsiSoftCard key={`${item.time}-${item.title}`}>
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className={psiVisual.title}>{item.title}</p>
                      <p className={`mt-1 ${psiVisual.body}`}>{item.description}</p>
                    </div>
                    <span className="text-xs font-medium text-muted-foreground">{item.time}</span>
                  </div>
                </PsiSoftCard>
              ))}
            </div>
          </PsiSection>

          <PsiSection
            title={isZh ? "快速操作" : "Quick Actions"}
            description={isZh ? "直接进入常用 PSI 操作。" : "Jump into common PSI operating actions."}
          >
            <div className="grid gap-2">
              {quickActions.map((action) => (
                <Button key={action.href} asChild size="sm" variant={action.variant}>
                  <Link href={action.href}>{action.label}</Link>
                </Button>
              ))}
            </div>
          </PsiSection>
        </div>

        <PsiSection
          title={psiCopy.overview.operationModules}
          description={psiCopy.overview.operationModulesDescription}
        >
          <div className={psiVisual.moduleGrid}>
            {psiModules.map((item) => (
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
