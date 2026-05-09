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
      title: currentLocale === "zh" ? "收货" : "Receiving",
      description:
        currentLocale === "zh"
          ? "供应商到货、数量差异、入库交接与收货检查。"
          : "Supplier receiving, variance review, inventory handoff, and delivery checks.",
      href: "/psi/receiving",
      metric: currentLocale === "zh" ? "3 条待验证" : "3 awaiting verification",
    },
  ];

  const kpis = [
    [psiCopy.shared.procurement, "12", currentLocale === "zh" ? "待处理采购事项" : "Open procurement work"],
    [psiCopy.shared.supplier, "4", currentLocale === "zh" ? "供应商关注事项" : "Supplier watch items"],
    [psiCopy.shared.inventory, "8", currentLocale === "zh" ? "库存风险项目" : "Inventory watch items"],
    [psiCopy.shared.issues, "6", currentLocale === "zh" ? "跨模块问题" : "Cross-module issues"],
  ];

  const operatingQueue = [
    {
      title: "PR-KCH-0001",
      label: psiCopy.overview.procurementRequest,
      meta: "ABC Food Supply · KCH · High",
      href: "/psi/procurement/PR-1001",
    },
    {
      title: "SKU-KCH-0007",
      label: currentLocale === "zh" ? "库存低于安全线" : "Low-stock watch",
      meta: "Coated Fries · Freezer · 2.1 days",
      href: "/psi/inventory/SKU-KCH-0007",
    },
    {
      title: "RCV-KCH-240507",
      label: currentLocale === "zh" ? "收货待验证" : "Receiving verification",
      meta: "PO-KCH-0098 · ABC Food Supply · Today",
      href: "/psi/receiving",
    },
  ];

  const activity = [
    ["09:26", currentLocale === "zh" ? "供应商报价已关联" : "Supplier quote attached", "ABC Food Supply quotation linked for procurement reference."],
    ["09:35", currentLocale === "zh" ? "库存风险已关联" : "Inventory risk linked", "KCH broth coverage risk attached to procurement request."],
    ["14:22", currentLocale === "zh" ? "等待经理复核" : "Awaiting manager review", "Procurement request is queued for branch review."],
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
                <Link href="/psi/procurement">{psiCopy.overview.openProcurement}</Link>
              </Button>
              <Button asChild size="sm" variant="outline">
                <Link href="/reports">{psiCopy.overview.openPsiReports}</Link>
              </Button>
              <Button asChild size="sm" variant="outline">
                <Link href="/psi/issues">{psiCopy.overview.openIssues}</Link>
              </Button>
            </>
          }
        />

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

        <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {kpis.map(([label, value, hint]) => (
            <PsiSoftCard key={label}>
              <p className={psiVisual.eyebrow}>{label}</p>
              <p className={psiVisual.metric}>{value}</p>
              <p className={`mt-1 ${psiVisual.muted}`}>{hint}</p>
            </PsiSoftCard>
          ))}
        </section>

        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_20rem]">
          <PsiSection
            title={currentLocale === "zh" ? "当前 PSI 队列" : "Current PSI Queue"}
            description={
              currentLocale === "zh"
                ? "只显示需要跨采购、供应商、库存、收货协调的事项。"
                : "Only cross-module work that needs procurement, supplier, inventory, or receiving coordination."
            }
          >
            <div className="grid gap-3">
              {operatingQueue.map((item) => (
                <Link key={item.title} href={item.href} className={`${psiVisual.card} ${psiVisual.cardHover}`}>
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className={psiVisual.title}>{item.title}</p>
                      <p className={`mt-1 ${psiVisual.body}`}>{item.label}</p>
                    </div>
                    <span className={psiVisual.pill}>{item.meta}</span>
                  </div>
                </Link>
              ))}
            </div>
          </PsiSection>

          <PsiSection
            title={currentLocale === "zh" ? "PSI 健康检查" : "PSI Health Check"}
            description={
              currentLocale === "zh"
                ? "用于经理快速判断今天要先处理什么。"
                : "Manager-facing snapshot for what needs attention first today."
            }
          >
            <div className="grid gap-3">
              {[
                currentLocale === "zh" ? "采购请求仍有 12 条待处理" : "12 procurement requests still open",
                currentLocale === "zh" ? "4 个供应商需要跟进" : "4 suppliers need follow-up",
                currentLocale === "zh" ? "8 个库存项目低于关注线" : "8 inventory items are under watch",
                currentLocale === "zh" ? "3 条收货记录等待验证" : "3 receiving records awaiting verification",
              ].map((item) => (
                <PsiSoftCard key={item}>
                  <p className={psiVisual.value}>{item}</p>
                </PsiSoftCard>
              ))}
            </div>
          </PsiSection>
        </div>

        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_20rem]">
          <PsiSection
            title={currentLocale === "zh" ? "今日活动" : "Today Activity"}
            description={
              currentLocale === "zh"
                ? "显示 PSI dashboard 层面的最新联动，不进入单据明细。"
                : "Latest PSI coordination signals without turning this dashboard into a record detail page."
            }
          >
            <div className="grid gap-3">
              {activity.map(([time, title, description]) => (
                <PsiSoftCard key={`${time}-${title}`}>
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className={psiVisual.title}>{title}</p>
                      <p className={`mt-1 ${psiVisual.body}`}>{description}</p>
                    </div>
                    <span className="text-xs font-medium text-muted-foreground">{time}</span>
                  </div>
                </PsiSoftCard>
              ))}
            </div>
          </PsiSection>

          <PsiSection
            title={currentLocale === "zh" ? "工作区说明" : "Workspace Note"}
            description={
              currentLocale === "zh"
                ? "PSI 总览只负责跨模块判断；单据级操作保留在采购、供应商、库存、收货页面。"
                : "PSI overview is for cross-module triage. Record-level work stays inside Procurement, Supplier, Inventory, and Receiving."
            }
            className="min-h-0"
          >
            <div className="grid gap-3">
              <PsiSoftCard>
                <p className={psiVisual.eyebrow}>{currentLocale === "zh" ? "页面定位" : "Page Role"}</p>
                <p className={psiVisual.value}>
                  {currentLocale === "zh" ? "总览 / 判断 / 入口" : "Overview / triage / entry point"}
                </p>
              </PsiSoftCard>

              <div className="flex flex-wrap gap-2">
                <Button asChild size="sm">
                  <Link href="/system-foundation">{currentLocale === "zh" ? "打开系统中心" : "Open System Center"}</Link>
                </Button>
                <Button asChild size="sm" variant="outline">
                  <Link href="/psi/procurement">{currentLocale === "zh" ? "打开采购工作台" : "Open Procurement Workspace"}</Link>
                </Button>
              </div>
            </div>
          </PsiSection>
        </div>
      </div>
    </ErpShell>
  );
}
