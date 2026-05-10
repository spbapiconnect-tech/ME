"use client";

import Link from "next/link";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}


import { ErpPageHeader, ErpShell } from "@/components/erp";
import { Button } from "@/components/ui/button";
import type { PsiLocale } from "@/config/psi-language-copy";
import { getPsiOverviewPageData } from "@/lib/page-data/psi/overview-page-data";
import { useUiPreferencesStore } from "@/stores/ui-preferences";
import {
  ModulePageStack,
  ModuleKpiGrid,
  ModuleKpiCard,
  ModuleSection,
  ModuleCompareGrid,
  ModuleCompareCard,
  ModuleMatrixTable,
  ModuleMatrixRow,
  ModuleTwoColumn,
  ModuleSidePanel,
  ModuleActivityList,
  ModuleShortcutGrid,
  ModuleShortcutCard,
  ModuleStatusPill,
  moduleVisual,
} from "@/components/erp/module-shell";

export function PsiHomePage() {
  const rawLocale = useUiPreferencesStore((state) => state.locale);
  const currentLocale: PsiLocale = rawLocale === "zh" ? "zh" : "en";
  const isZh = currentLocale === "zh";
  const pageData = getPsiOverviewPageData(currentLocale);

  return (
    <ErpShell activeHref="/psi">
      <ModulePageStack>
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
            <div className="flex items-center gap-2">
              {pageData.quickActions.map((action) => (
                <Button key={action.href} asChild size="sm" variant={action.variant}>
                  <Link href={action.href}>{action.label}</Link>
                </Button>
              ))}
            </div>
          }
        />

        {/* KPI Grid */}
        <ModuleKpiGrid>
          {pageData.snapshot.map((item) => (
            <ModuleKpiCard
              key={item.label}
              label={item.label}
              value={item.value}
              hint={item.hint}
              href={item.href}
            />
          ))}
        </ModuleKpiGrid>

        {/* Operating Compare View */}
        <ModuleSection
          title={isZh ? "运营对比视图" : "Operating Compare View"}
          description={
            isZh
              ? "用图形先判断库存、采购、GRN 与供应商风险，再进入表格细节。"
              : "Visual comparison for stock, purchase, GRN, and supplier risk before opening record details."
          }
        >
          <ModuleCompareGrid>
            {pageData.compareCards.map((card) => (
              <ModuleCompareCard
                key={card.label}
                label={card.label}
                value={card.value}
                target={card.target}
                percent={card.percent}
                note={card.note}
                href={card.href}
              />
            ))}
          </ModuleCompareGrid>
        </ModuleSection>

        {/* Main Matrix and Watch Panel */}
        <ModuleTwoColumn>
          <ModuleSection
            title={isZh ? "PSI 多维运营表" : "PSI Operating Matrix"}
            description={
              isZh
                ? "把 SKU、库存水位、库存流动、采购进度、GRN / 收货、供应商与下一步动作放在同一张表。"
                : "A single operating table for SKU, stock level, stock movement, purchase flow, GRN / receiving, supplier, and next action."
            }
          >
            <ModuleMatrixTable
              gridTemplateColumns="1.35fr 0.95fr 0.95fr 1.1fr 1.1fr 1.15fr 0.8fr"
              columns={[
                "SKU / ITEM",
                isZh ? "库存水位" : "STOCK LEVEL",
                isZh ? "库存流动" : "MOVEMENT",
                isZh ? "采购进度" : "PURCHASE FLOW",
                isZh ? "GRN / 收货" : "GRN / RECEIVING",
                isZh ? "供应商" : "SUPPLIER",
                isZh ? "动作" : "ACTION",
              ]}
            >
              {pageData.matrixRows.map((row) => (
                <ModuleMatrixRow
                  key={row.sku}
                  href={row.href}
                  gridTemplateColumns="1.35fr 0.95fr 0.95fr 1.1fr 1.1fr 1.15fr 0.8fr"
                >
                  <div>
                    <p className={moduleVisual.title}>{row.sku}</p>
                    <p className={moduleVisual.body}>{row.item}</p>
                  </div>
                  <p className={moduleVisual.metric.replace("text-[1.55rem]", "text-sm font-semibold")}>{row.stock}</p>
                  <p className={moduleVisual.metric.replace("text-[1.55rem]", "text-sm font-semibold")}>{row.movement}</p>
                  <p className={moduleVisual.metric.replace("text-[1.55rem]", "text-sm font-semibold")}>{row.purchase}</p>
                  <p className={moduleVisual.metric.replace("text-[1.55rem]", "text-sm font-semibold")}>{row.grn}</p>
                  <p className={moduleVisual.metric.replace("text-[1.55rem]", "text-sm font-semibold")}>{row.supplier}</p>
                  <div>
                    <ModuleStatusPill>{row.status}</ModuleStatusPill>
                  </div>
                </ModuleMatrixRow>
              ))}
            </ModuleMatrixTable>
          </ModuleSection>

          <ModuleSidePanel
            title={isZh ? "GRN / 收货观察" : "GRN / Receiving Watch"}
            description={isZh ? "只显示影响库存入账的收货事项。" : "Receiving items that affect stock posting."}
          >
            <ModuleActivityList>
              {pageData.grnWatch.map((item) => (
                <Link
                  key={item.title}
                  href={item.href}
                  className={cn(moduleVisual.card, moduleVisual.cardHover)}
                >
                  <p className={moduleVisual.title}>{item.title}</p>
                  <p className={cn("mt-1", moduleVisual.body)}>{item.desc}</p>
                </Link>
              ))}
            </ModuleActivityList>
          </ModuleSidePanel>
        </ModuleTwoColumn>

        {/* Activity and Risk Panel */}
        <ModuleTwoColumn>
          <ModuleSection
            title={isZh ? "今日 PSI 活动" : "Today PSI Activity"}
            description={isZh ? "显示采购、库存、收货之间的最新联动。" : "Latest activity across purchase, inventory, and receiving."}
          >
            <ModuleActivityList>
              {pageData.activity.map((item) => (
                <Link
                  key={`${item.time}-${item.title}`}
                  href={item.href}
                  className={cn(moduleVisual.card, moduleVisual.cardHover)}
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className={moduleVisual.title}>{item.title}</p>
                      <p className={cn("mt-1", moduleVisual.body)}>{item.desc}</p>
                    </div>
                    <span className="text-xs font-medium text-muted-foreground">{item.time}</span>
                  </div>
                </Link>
              ))}
            </ModuleActivityList>
          </ModuleSection>

          <ModuleSidePanel
            title={isZh ? "风险摘要" : "Risk Summary"}
            description={isZh ? "经理今天应该优先看的 PSI 风险。" : "PSI risks managers should review first today."}
          >
            <ModuleActivityList>
              {pageData.riskSummary.map((item) => (
                <Link
                  key={item.title}
                  href={item.href}
                  className={cn(moduleVisual.card, moduleVisual.cardHover)}
                >
                  <p className={moduleVisual.title}>{item.title}</p>
                  <p className={cn("mt-1", moduleVisual.body)}>{item.desc}</p>
                </Link>
              ))}
            </ModuleActivityList>
          </ModuleSidePanel>
        </ModuleTwoColumn>

        {/* Module Shortcuts */}
        <ModuleSection
          title={isZh ? "模块入口" : "Module Shortcuts"}
          description={
            isZh
              ? "进入单据级工作台；PSI 总览只保留运营判断，不在这里处理全部明细。"
              : "Open record-level workspaces. PSI overview keeps operating judgement here, not every detail."
          }
        >
          <ModuleShortcutGrid>
            {pageData.moduleShortcuts.map((item) => (
              <ModuleShortcutCard
                key={item.href}
                href={item.href}
                title={item.title}
                description={item.description}
                metric={item.metric}
              />
            ))}
          </ModuleShortcutGrid>
        </ModuleSection>
      </ModulePageStack>
    </ErpShell>
  );
}
