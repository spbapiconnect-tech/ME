"use client";

import Link from "next/link";

import { ErpPageHeader, ErpShell } from "@/components/erp";
import { Button } from "@/components/ui/button";
import type { PsiLocale } from "@/config/psi-language-copy";
import { getPsiOverviewPageData } from "@/lib/page-data/psi/overview-page-data";
import { PsiModuleCard, PsiSection, psiVisual } from "@/components/psi/psi-visual";
import { useUiPreferencesStore } from "@/stores/ui-preferences";

export function PsiHomePage() {
  const rawLocale = useUiPreferencesStore((state) => state.locale);
  const currentLocale: PsiLocale = rawLocale === "zh" ? "zh" : "en";
  const isZh = currentLocale === "zh";
  const pageData = getPsiOverviewPageData(currentLocale);

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
              {pageData.quickActions.map((action) => (
                <Button key={action.href} asChild size="sm" variant={action.variant}>
                  <Link href={action.href}>{action.label}</Link>
                </Button>
              ))}
            </>
          }
        />

        <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {pageData.snapshot.map((item) => (
            <Link key={item.label} href={item.href} className={`${psiVisual.card} ${psiVisual.cardHover}`}>
              <p className={psiVisual.eyebrow}>{item.label}</p>
              <p className={psiVisual.metric}>{item.value}</p>
              <p className={`mt-1 ${psiVisual.muted}`}>{item.hint}</p>
            </Link>
          ))}
        </section>

        <PsiSection
          title={isZh ? "运营对比视图" : "Operating Compare View"}
          description={
            isZh
              ? "用图形先判断库存、采购、GRN 与供应商风险，再进入表格细节。"
              : "Visual comparison for stock, purchase, GRN, and supplier risk before opening record details."
          }
        >
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {pageData.compareCards.map((card) => (
              <Link key={card.label} href={card.href} className={`${psiVisual.card} ${psiVisual.cardHover}`}>
                <p className={psiVisual.eyebrow}>{card.label}</p>
                <div className="mt-3 flex items-end justify-between gap-3">
                  <p className={psiVisual.metric}>{card.value}</p>
                  <p className={psiVisual.muted}>{card.target}</p>
                </div>
                <div className="mt-4 h-2 overflow-hidden rounded-full bg-muted">
                  <div className="h-full rounded-full bg-primary" style={{ width: `${card.percent}%` }} />
                </div>
                <p className={`mt-3 ${psiVisual.body}`}>{card.note}</p>
              </Link>
            ))}
          </div>
        </PsiSection>

        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_21rem]">
          <PsiSection
            title={isZh ? "PSI 多维运营表" : "PSI Operating Matrix"}
            description={
              isZh
                ? "把 SKU、库存水位、库存流动、采购进度、GRN / 收货、供应商与下一步动作放在同一张表。"
                : "A single operating table for SKU, stock level, stock movement, purchase flow, GRN / receiving, supplier, and next action."
            }
          >
            <div className="overflow-hidden rounded-xl border border-border bg-card">
              <div className="overflow-x-auto">
                <div className="max-h-[420px] min-w-[1120px] overflow-y-auto">
                  <div className="sticky top-0 z-10 grid grid-cols-[1.15fr_1fr_1fr_1.15fr_1.15fr_1fr_0.9fr] border-b border-border bg-muted/80 px-4 py-3 backdrop-blur">
                    {[
                      "SKU / ITEM",
                      isZh ? "库存水位" : "STOCK LEVEL",
                      isZh ? "库存流动" : "MOVEMENT",
                      isZh ? "采购进度" : "PURCHASE FLOW",
                      isZh ? "GRN / 收货" : "GRN / RECEIVING",
                      isZh ? "供应商" : "SUPPLIER",
                      isZh ? "动作" : "ACTION",
                    ].map((head) => (
                      <div key={head} className={psiVisual.eyebrow}>{head}</div>
                    ))}
                  </div>

                  {pageData.matrixRows.map((row) => (
                    <Link
                      key={row.sku}
                      href={row.href}
                      className="grid grid-cols-[1.15fr_1fr_1fr_1.15fr_1.15fr_1fr_0.9fr] items-center border-b border-border/70 px-4 py-4 transition hover:bg-muted/30 last:border-b-0"
                    >
                      <div>
                        <p className={psiVisual.title}>{row.sku}</p>
                        <p className={`mt-1 ${psiVisual.body}`}>{row.item}</p>
                      </div>
                      <p className={psiVisual.value}>{row.stock}</p>
                      <p className={psiVisual.value}>{row.movement}</p>
                      <p className={psiVisual.value}>{row.purchase}</p>
                      <p className={psiVisual.value}>{row.grn}</p>
                      <p className={psiVisual.value}>{row.supplier}</p>
                      <span className={psiVisual.pill}>{row.status}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </PsiSection>

          <PsiSection
            title={isZh ? "GRN / 收货观察" : "GRN / Receiving Watch"}
            description={isZh ? "只显示影响库存入账的收货事项。" : "Receiving items that affect stock posting."}
          >
            <div className="grid gap-3">
              {pageData.grnWatch.map((item) => (
                <Link key={item.title} href={item.href} className={`${psiVisual.card} ${psiVisual.cardHover}`}>
                  <p className={psiVisual.title}>{item.title}</p>
                  <p className={`mt-1 ${psiVisual.body}`}>{item.desc}</p>
                </Link>
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
              {pageData.activity.map((item) => (
                <Link key={`${item.time}-${item.title}`} href={item.href} className={`${psiVisual.card} ${psiVisual.cardHover}`}>
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className={psiVisual.title}>{item.title}</p>
                      <p className={`mt-1 ${psiVisual.body}`}>{item.desc}</p>
                    </div>
                    <span className="text-xs font-medium text-muted-foreground">{item.time}</span>
                  </div>
                </Link>
              ))}
            </div>
          </PsiSection>

          <PsiSection
            title={isZh ? "风险摘要" : "Risk Summary"}
            description={isZh ? "经理今天应该优先看的 PSI 风险。" : "PSI risks managers should review first today."}
          >
            <div className="grid gap-3">
              {pageData.riskSummary.map((item) => (
                <Link key={item.title} href={item.href} className={`${psiVisual.card} ${psiVisual.cardHover}`}>
                  <p className={psiVisual.title}>{item.title}</p>
                  <p className={`mt-1 ${psiVisual.body}`}>{item.desc}</p>
                </Link>
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
            {pageData.moduleShortcuts.map((item) => (
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
