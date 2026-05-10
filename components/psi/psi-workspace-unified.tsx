"use client";

import Link from "next/link";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

import { ErpPageHeader, ErpShell } from "@/components/erp";
import { Button } from "@/components/ui/button";
import type { PsiLocale } from "@/config/psi-language-copy";
import { getPsiCopy } from "@/config/psi-language-copy";
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
import type { DisplayRecord } from "@/types/display-model";

interface PsiWorkspaceUnifiedProps {
  title: string;
  subtitle: string;
  stats: Array<{ label: string; value: string | number }>;
  records: DisplayRecord[];
  issueRecords: DisplayRecord[];
  detailBasePath: string;
}

export function PsiWorkspaceUnified({
  title,
  subtitle,
  stats,
  records,
  issueRecords,
  detailBasePath,
}: PsiWorkspaceUnifiedProps) {
  const rawLocale = useUiPreferencesStore((state) => state.locale);
  const currentLocale: PsiLocale = rawLocale === "zh" ? "zh" : "en";
  const isZh = currentLocale === "zh";
  const psiCopy = getPsiCopy(currentLocale);

  // Determine if this is procurement, supplier, or inventory based on detailBasePath
  const isProcurement = detailBasePath.includes("procurement");
  const isSupplier = detailBasePath.includes("supplier");

  return (
    <ErpShell activeHref={detailBasePath}>
      <ModulePageStack>
        <ErpPageHeader
          breadcrumbs={["ME", "PSI", isProcurement ? psiCopy.shared.procurement : isSupplier ? psiCopy.shared.supplier : psiCopy.shared.inventory]}
          title={title}
          subtitle={subtitle}
          actions={
            <div className="flex items-center gap-2">
              <Button size="sm">{isZh ? "创建申请" : "Create Request"}</Button>
              <Button size="sm" variant="secondary">{isZh ? "待办事项" : "Open Issues"}</Button>
              <Button size="sm" variant="outline" className="hidden md:inline-flex">{isZh ? "打开报表" : "Open Reports"}</Button>
              <Button size="sm" variant="outline" className="hidden md:inline-flex">{isZh ? "记录收货" : "Record Receiving"}</Button>
            </div>
          }
        />

        {/* KPI Row */}
        <ModuleKpiGrid>
          {stats.map((stat) => (
            <ModuleKpiCard key={stat.label} label={stat.label} value={stat.value} />
          ))}
        </ModuleKpiGrid>

        {/* Compare View */}
        <ModuleSection
          title={isZh ? "采购对比视图" : "Procurement Compare View"}
          description={isZh ? "判断采购效率与供应商响应能力。" : "Judge procurement efficiency and supplier responsiveness."}
        >
          <ModuleCompareGrid>
            <ModuleCompareCard
              label={isZh ? "PR 待审核" : "PR Awaiting Review"}
              value={12}
              target="Target: < 24h"
              percent={75}
              note={isZh ? "大部分申请在 12 小时内处理。" : "Most requests handled within 12h."}
            />
            <ModuleCompareCard
              label={isZh ? "PR → PO 转化率" : "PR → PO Conversion"}
              value="92%"
              target="Goal: 95%"
              percent={92}
              note={isZh ? "本周转化率保持稳定。" : "Conversion rate stable this week."}
            />
            <ModuleCompareCard
              label={isZh ? "供应商响应 SLA" : "Supplier Response SLA"}
              value="4.2h"
              target="SLA: 6.0h"
              percent={85}
              note={isZh ? "供应商响应速度优于平均水平。" : "Supplier response faster than average."}
            />
            <ModuleCompareCard
              label={isZh ? "收货 / GRN 风险" : "Receiving / GRN Risk"}
              value={3}
              target="High Risk"
              percent={30}
              note={isZh ? "发现 3 笔异常收货记录。" : "Found 3 abnormal receiving records."}
            />
          </ModuleCompareGrid>
        </ModuleSection>

        {/* Main Content */}
        <ModuleTwoColumn>
          <ModuleSection
            title={isZh ? "采购运营矩阵" : "Procurement Operating Matrix"}
            description={isZh ? "追踪每一笔采购申请的实时进度。" : "Track real-time progress of every purchase request."}
          >
            <ModuleMatrixTable
              gridTemplateColumns="1fr 0.8fr 1.2fr 1fr 1.2fr 1.2fr 1.2fr 0.8fr 0.8fr"
              columns={[
                isZh ? "记录" : "Record",
                isZh ? "门店" : "Branch",
                isZh ? "供应商" : "Supplier",
                isZh ? "需求日期" : "Need By",
                isZh ? "采购进度" : "Purchase Flow",
                isZh ? "PO 状态" : "PO Status",
                isZh ? "GRN / 收货" : "GRN / Receiving",
                isZh ? "风险" : "Risk",
                isZh ? "动作" : "Action",
              ]}
            >
              {/* Example Rows from prompt */}
              {[
                { id: "PR-1001", branch: "KCH", supplier: "ABC Food Supply", date: "2026-05-05", flow: "PR Created", po: "Awaiting PO", grn: "Pending", risk: "High", action: "Open" },
                { id: "PR-1002", branch: "BTU", supplier: "Northwind Supply", date: "2026-05-06", flow: "PO Issued", po: "Supplier Confirmed", grn: "Not Received", risk: "Medium", action: "Open" },
                { id: "PR-1003", branch: "KCH", supplier: "FreshPro", date: "2026-05-07", flow: "PO Sent", po: "Delayed Reply", grn: "-", risk: "High", action: "Open" },
              ].map((row) => (
                <ModuleMatrixRow
                  key={row.id}
                  href={`${detailBasePath}/${row.id}`}
                  gridTemplateColumns="1fr 0.8fr 1.2fr 1fr 1.2fr 1.2fr 1.2fr 0.8fr 0.8fr"
                >
                  <p className={moduleVisual.title}>{row.id}</p>
                  <p className={moduleVisual.body}>{row.branch}</p>
                  <p className={moduleVisual.body}>{row.supplier}</p>
                  <p className={moduleVisual.body}>{row.date}</p>
                  <p className={moduleVisual.body}>{row.flow}</p>
                  <p className={moduleVisual.body}>{row.po}</p>
                  <p className={moduleVisual.body}>{row.grn}</p>
                  <div>
                    <ModuleStatusPill className={row.risk === "High" ? "text-destructive border-destructive/30 bg-destructive/5" : ""}>
                      {row.risk}
                    </ModuleStatusPill>
                  </div>
                  <p className="text-sm font-medium text-primary hover:underline">{row.action}</p>
                </ModuleMatrixRow>
              ))}
              
              {/* Dynamic Records */}
              {records.slice(0, 5).map((record) => (
                <ModuleMatrixRow
                  key={record.id}
                  href={`${detailBasePath}/${record.id}`}
                  gridTemplateColumns="1fr 0.8fr 1.2fr 1fr 1.2fr 1.2fr 1.2fr 0.8fr 0.8fr"
                >
                  <p className={moduleVisual.title}>{record.id}</p>
                  <p className={moduleVisual.body}>{record.subtitle.split(" · ")[0]}</p>
                  <p className={moduleVisual.body}>{record.subtitle.split(" · ")[1] || "N/A"}</p>
                  <p className={moduleVisual.body}>{record.meta.find(m => m.label.en === "Need By")?.value || "N/A"}</p>
                  <p className={moduleVisual.body}>{record.status}</p>
                  <p className={moduleVisual.body}>-</p>
                  <p className={moduleVisual.body}>-</p>
                  <div>
                    <ModuleStatusPill>{record.priority}</ModuleStatusPill>
                  </div>
                  <p className="text-sm font-medium text-primary hover:underline">{isZh ? "查看" : "View"}</p>
                </ModuleMatrixRow>
              ))}
            </ModuleMatrixTable>
          </ModuleSection>

          <ModuleSidePanel title={isZh ? "采购观察" : "Procurement Watch"}>
            <ModuleActivityList>
              <ModuleShortcutCard
                title={isZh ? "待审批申请" : "Pending Approvals"}
                description={isZh ? "5 笔采购申请等待您的最终审批。" : "5 purchase requests awaiting your final approval."}
                metric={5}
                href="/psi/procurement?filter=pending"
              />
              <ModuleShortcutCard
                title={isZh ? "供应商风险" : "Supplier Risk"}
                description={isZh ? "FreshPro 的交付延迟率近期有所上升。" : "FreshPro delivery delay rate has increased recently."}
                metric="High"
                href="/psi/supplier/risk"
              />
              <ModuleShortcutCard
                title={isZh ? "需要操作" : "Approval Needed"}
                description={isZh ? "有 2 笔超过 48 小时未处理的异常单据。" : "2 abnormal documents pending for over 48 hours."}
                metric={2}
              />
            </ModuleActivityList>
          </ModuleSidePanel>
        </ModuleTwoColumn>

        {/* Lower Content */}
        <ModuleTwoColumn>
          <ModuleSection
            title={isZh ? "今日采购活动" : "Today Procurement Activity"}
            description={isZh ? "记录采购环节的最新动态。" : "Latest updates in the procurement process."}
          >
            <ModuleActivityList>
              {records.slice(0, 3).map((item) => (
                <Link
                  key={item.id}
                  href={`${detailBasePath}/${item.id}`}
                  className={cn(moduleVisual.card, moduleVisual.cardHover)}
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className={moduleVisual.title}>{item.title}</p>
                      <p className={cn("mt-1", moduleVisual.body)}>{item.description}</p>
                    </div>
                    <span className="text-xs font-medium text-muted-foreground">{item.status}</span>
                  </div>
                </Link>
              ))}
            </ModuleActivityList>
          </ModuleSection>

          <ModuleSidePanel title={isZh ? "采购风险摘要" : "Procurement Risk Summary"}>
            <ModuleActivityList>
              {issueRecords.slice(0, 3).map((item) => (
                <Link
                  key={item.id}
                  href={`/psi/issues/${item.id}`}
                  className={cn(moduleVisual.card, moduleVisual.cardHover)}
                >
                  <p className={moduleVisual.title}>{item.title}</p>
                  <p className={cn("mt-1", moduleVisual.body)}>{item.description}</p>
                </Link>
              ))}
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
              title={isZh ? "供应商管理" : "Supplier Management"}
              description={isZh ? "管理供应商档案、绩效与合同。" : "Manage supplier profiles, performance and contracts."}
              href="/psi/supplier"
            />
            <ModuleShortcutCard
              title={isZh ? "库存管理" : "Inventory Management"}
              description={isZh ? "实时追踪 SKU 库存水位与变动。" : "Real-time tracking of SKU stock levels and movements."}
              href="/psi/inventory"
            />
            <ModuleShortcutCard
              title={isZh ? "收货管理" : "Receiving Management"}
              description={isZh ? "处理 PO 到货、验收与入库。" : "Process PO arrivals, inspection and storage."}
              href="/psi/receiving"
            />
            <ModuleShortcutCard
              title={isZh ? "PSI 报表" : "PSI Reports"}
              description={isZh ? "查看采购分析与供应链看板。" : "View procurement analytics and supply chain dashboards."}
              href="/reports"
            />
          </ModuleShortcutGrid>
        </ModuleSection>
      </ModulePageStack>
    </ErpShell>
  );
}
