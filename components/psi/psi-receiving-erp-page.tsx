"use client";

import Link from "next/link";
import { ErpPageHeader, ErpShell } from "@/components/erp";
import { Button } from "@/components/ui/button";
import type { RestaurantModuleDefinition } from "@/config/restaurant-modules";
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
  ModuleShortcutCard,
  ModuleStatusPill,
  moduleVisual,
  ModuleShortcutGrid,
} from "@/components/erp/module-shell";
import { cn } from "@/lib/utils";

export function PsiReceivingErpPage({ module }: { module: RestaurantModuleDefinition }) {
  const preview = module.preview;
  const locale = useUiPreferencesStore((state) => state.locale);
  const isZh = locale === "zh";

  if (!preview) {
    throw new Error(`Missing preview config for module ${module.key}`);
  }

  return (
    <ErpShell activeHref="/psi/receiving">
      <ModulePageStack>
        <ErpPageHeader
          breadcrumbs={["ME", "PSI", module.label[locale]]}
          title={preview.title}
          zhTitle={module.label.zh}
          subtitle={preview.description}
          actions={
            <div className="flex items-center gap-2">
              {preview.pageActions.map((action, index) => (
                <Button
                  key={`${action.label}-${index}`}
                  asChild={Boolean(action.href && action.href.startsWith("/"))}
                  size="sm"
                  variant={action.variant ?? (index === 0 ? "default" : "outline")}
                >
                  {action.href && action.href.startsWith("/") ? (
                    <Link href={action.href}>{action.label}</Link>
                  ) : (
                    <span>{action.label}</span>
                  )}
                </Button>
              ))}
            </div>
          }
        />

        {/* KPI Row */}
        {preview.metrics?.length ? (
          <ModuleKpiGrid>
            {preview.metrics.map((metric) => (
              <ModuleKpiCard key={metric.label} label={metric.label} value={metric.value} />
            ))}
          </ModuleKpiGrid>
        ) : null}

        {/* Compare View (Placeholder for Receiving) */}
        <ModuleSection
          title={isZh ? "收货对比视图" : "Receiving Compare View"}
          description={isZh ? "监控收货时效与验收差异。" : "Monitor receiving efficiency and inspection variance."}
        >
          <ModuleCompareGrid>
            <ModuleCompareCard
              label={isZh ? "待处理 PO" : "Pending POs"}
              value={8}
              target="Goal: 0"
              percent={60}
              note={isZh ? "有 8 笔 PO 等待卸货记录。" : "8 POs awaiting unloading records."}
            />
            <ModuleCompareCard
              label={isZh ? "验收差异率" : "Inspection Variance"}
              value="1.2%"
              target="Max: 2.0%"
              percent={40}
              note={isZh ? "差异率在安全范围内。" : "Variance rate within safe range."}
            />
            <ModuleCompareCard
              label={isZh ? "平均卸货时间" : "Avg Unloading Time"}
              value="45min"
              target="Target: 30min"
              percent={80}
              note={isZh ? "卸货效率需要提升。" : "Unloading efficiency needs improvement."}
            />
            <ModuleCompareCard
              label={isZh ? "冷链达标率" : "Cold Chain Compliance"}
              value="100%"
              target="Req: 100%"
              percent={100}
              note={isZh ? "今日所有冷链收货均达标。" : "All cold chain receiving compliant today."}
            />
          </ModuleCompareGrid>
        </ModuleSection>

        {/* Main Content */}
        <ModuleTwoColumn>
          <ModuleSection
            title={isZh ? "收货运营矩阵" : "Receiving Operating Matrix"}
            description={isZh ? "管理所有到货单据的验收与入库进度。" : "Manage inspection and storage progress for all arrivals."}
          >
            <ModuleMatrixTable
              gridTemplateColumns="1fr 1.2fr 1fr 1.2fr 1fr 1fr"
              columns={[
                isZh ? "收货单" : "Receiving No",
                isZh ? "供应商" : "Supplier",
                isZh ? "仓库" : "Warehouse",
                isZh ? "到货时间" : "Arrival",
                isZh ? "状态" : "Status",
                isZh ? "动作" : "Action",
              ]}
            >
              {preview.sections
                .filter((s) => s.kind === "table")
                .flatMap((s) => (s.kind === "table" ? s.rows : []))
                .map((row, idx) => (
                  <ModuleMatrixRow
                    key={idx}
                    gridTemplateColumns="1fr 1.2fr 1fr 1.2fr 1fr 1fr"
                    href={`/psi/receiving/${row[0]}`}
                  >
                    <p className={moduleVisual.title}>{row[0]}</p>
                    <p className={moduleVisual.body}>{row[1]}</p>
                    <p className={moduleVisual.body}>{row[2] || "Main"}</p>
                    <p className={moduleVisual.body}>{row[3] || "Today"}</p>
                    <div>
                      <ModuleStatusPill>{row[4] || "Pending"}</ModuleStatusPill>
                    </div>
                    <p className="text-sm font-medium text-primary hover:underline">{isZh ? "查看" : "View"}</p>
                  </ModuleMatrixRow>
                ))}
            </ModuleMatrixTable>
          </ModuleSection>

          <ModuleSidePanel title={isZh ? "收货观察" : "Receiving Watch"}>
            <ModuleActivityList>
              <ModuleShortcutCard
                title={isZh ? "今日预计到货" : "Expected Arrivals Today"}
                description={isZh ? "今天还有 4 笔供应商到货计划。" : "4 supplier arrivals scheduled for today."}
                metric={4}
              />
              <ModuleShortcutCard
                title={isZh ? "差异待处理" : "Disputes Pending"}
                description={isZh ? "2 笔验收差异单据需要与供应商确认。" : "2 inspection disputes need supplier confirmation."}
                metric={2}
              />
            </ModuleActivityList>
          </ModuleSidePanel>
        </ModuleTwoColumn>

        {/* Lower Content */}
        <ModuleTwoColumn>
          <ModuleSection
            title={isZh ? "今日收货动态" : "Today Receiving Activity"}
            description={isZh ? "显示收货、验收与入库的最新活动。" : "Latest activity across receiving, inspection, and storage."}
          >
            <ModuleActivityList>
              {preview.timeline?.items.map((item, idx) => (
                <div
                  key={idx}
                  className={cn(moduleVisual.card, moduleVisual.cardHover)}
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className={moduleVisual.title}>{item.title}</p>
                      <p className={cn("mt-1", moduleVisual.body)}>{item.description}</p>
                    </div>
                    <span className="text-xs font-medium text-muted-foreground">{item.time}</span>
                  </div>
                </div>
              ))}
            </ModuleActivityList>
          </ModuleSection>

          <ModuleSidePanel title={isZh ? "收货风险摘要" : "Receiving Risk Summary"}>
            <ModuleActivityList>
              <ModuleShortcutCard
                title={isZh ? "温度异常" : "Temp Anomaly"}
                description={isZh ? "FreshPro 的冷冻品到货温度略高。" : "FreshPro frozen goods arrival temp slightly high."}
                metric="Risk"
              />
              <ModuleShortcutCard
                title={isZh ? "延迟到货" : "Delayed Arrival"}
                description={isZh ? "ABC Food Supply 预计延迟 2 小时。" : "ABC Food Supply expected 2h delay."}
                metric="Late"
              />
            </ModuleActivityList>
          </ModuleSidePanel>
        </ModuleTwoColumn>

        {/* Module Shortcuts */}
        <ModuleSection
          title={isZh ? "模块入口" : "Module Shortcuts"}
          description={isZh ? "快速切换至 PSI 其他功能模块。" : "Quickly switch to other PSI functional modules."}
        >
          <ModuleShortcutGrid>
            <ModuleShortcutCard
              title={isZh ? "采购管理" : "Procurement"}
              description={isZh ? "管理采购申请、审批与 PO。" : "Manage purchase requests, approvals and POs."}
              href="/psi/procurement"
            />
            <ModuleShortcutCard
              title={isZh ? "库存管理" : "Inventory"}
              description={isZh ? "实时追踪 SKU 库存水位与变动。" : "Real-time tracking of SKU stock levels and movements."}
              href="/psi/inventory"
            />
            <ModuleShortcutCard
              title={isZh ? "供应商管理" : "Supplier"}
              description={isZh ? "管理供应商档案、绩效与合同。" : "Manage supplier profiles, performance and contracts."}
              href="/psi/supplier"
            />
            <ModuleShortcutCard
              title={isZh ? "PSI 总览" : "PSI Overview"}
              description={isZh ? "查看供应链核心运营指标。" : "View core supply chain operating metrics."}
              href="/psi"
            />
          </ModuleShortcutGrid>
        </ModuleSection>
      </ModulePageStack>
    </ErpShell>
  );
}
