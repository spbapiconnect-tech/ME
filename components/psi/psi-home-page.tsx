"use client";

import Link from "next/link";
import { AlertTriangle, ArrowRight, CircleDot } from "lucide-react";
import { ErpPageHeader, ErpShell } from "@/components/erp";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { PsiLocale } from "@/config/psi-language-copy";
import { getPsiOverviewPageData } from "@/lib/page-data/psi/overview-page-data";
import { useUiPreferencesStore } from "@/stores/ui-preferences";
import { ModulePageStack, ModuleSection, ModuleTwoColumn, moduleVisual } from "@/components/erp/module-shell";

const flowKeys = ["Supplier Master", "Procurement", "Receiving", "Inventory", "Variance / Reorder"];

export function PsiHomePage() {
  const rawLocale = useUiPreferencesStore((state) => state.locale);
  const currentLocale: PsiLocale = rawLocale === "zh" ? "zh" : "en";
  const isZh = currentLocale === "zh";
  const pageData = getPsiOverviewPageData(currentLocale);

  return (
    <ErpShell activeHref="/psi">
      <ModulePageStack className="space-y-3 pb-24 md:pb-0">
        <ErpPageHeader
          breadcrumbs={["ME", "PSI", isZh ? "指挥中心" : "Command Center"]}
          title={isZh ? "PSI 指挥中心" : "PSI Command Center"}
          subtitle={isZh ? "供应商→采购→收货→库存的跨模块运行视图。" : "Cross-module view from supplier to procurement, receiving, and inventory."}
          actions={
            <div className="flex items-center gap-2">
              <Button asChild size="sm" variant="outline">
                <Link href="/reports">{isZh ? "PSI 报表" : "PSI Report"}</Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/psi/procurement">{isZh ? "进入采购" : "Open Procurement"}</Link>
              </Button>
            </div>
          }
        />

        <ModuleSection title={isZh ? "模块入口" : "PSI Modules"} description={isZh ? "采购、供应商、库存与收货流程控制。" : "Procurement, Supplier, Inventory, and Receiving workflow control."} className="p-3 md:hidden">
          <div className="grid gap-2">
            {[
              { title: "Procurement", desc: "PR / PO queue and approval control", href: "/psi/procurement", count: pageData.snapshot[0]?.value ?? "-" },
              { title: "Supplier", desc: "Supplier master and risk watch", href: "/psi/supplier", count: pageData.snapshot[1]?.value ?? "-" },
              { title: "Inventory", desc: "SKU stock and reorder view", href: "/psi/inventory", count: pageData.snapshot[2]?.value ?? "-" },
              { title: "Receiving", desc: "GRN and variance check", href: "/psi/receiving", count: pageData.snapshot[3]?.value ?? "-" },
            ].map((item) => (
              <Link key={item.href} href={item.href} className="rounded-md border border-border/60 bg-card px-3 py-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2">
                    <span className="mt-1 inline-block h-2 w-2 rounded-full bg-primary" />
                    <div>
                    <p className={moduleVisual.title}>{item.title}</p>
                    <p className={moduleVisual.muted}>{item.desc}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs">{item.count}</Badge>
                </div>
              </Link>
            ))}
          </div>
        </ModuleSection>

        <ModuleSection title={isZh ? "支持工具" : "Support Tools"} className="p-3 md:hidden">
          <div className="grid gap-2">
            {[
              { title: "Actions", href: "/psi/actions", count: "2" },
              { title: "Issues", href: "/psi/issues", count: String(pageData.activity.length) },
            ].map((item) => (
              <Link key={item.href} href={item.href} className="rounded-md border border-border/60 bg-card px-3 py-2">
                <div className="flex items-center justify-between gap-2">
                  <p className={moduleVisual.title}>{item.title}</p>
                  <Badge variant="outline" className="text-xs">{item.count}</Badge>
                </div>
              </Link>
            ))}
          </div>
        </ModuleSection>

        <ModuleTwoColumn className="hidden xl:grid-cols-[minmax(0,1fr)_21rem] md:grid">
          <div className="space-y-3">
            <ModuleSection title={isZh ? "PSI Workflow Overview" : "PSI Workflow Overview"} className="p-3">
              <div className="flex flex-wrap items-center gap-2">
                {flowKeys.map((item, idx) => (
                  <div key={item} className="flex items-center gap-2">
                    <Badge variant="outline" className="h-7 rounded-md px-2.5 text-xs">{item}</Badge>
                    {idx < flowKeys.length - 1 ? <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" /> : null}
                  </div>
                ))}
              </div>
            </ModuleSection>

            <ModuleSection title={isZh ? "Exception Queue" : "Exception Queue"} className="p-3">
              <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-3">
                {[
                  { label: isZh ? "Supplier Pending" : "Supplier Pending", value: pageData.riskSummary[1]?.desc ?? "-", href: "/psi/supplier" },
                  { label: isZh ? "PR Waiting Approval" : "PR Waiting Approval", value: pageData.snapshot[2]?.hint ?? "-", href: "/psi/procurement" },
                  { label: isZh ? "Receiving Variance" : "Receiving Variance", value: pageData.riskSummary[2]?.desc ?? "-", href: "/psi/receiving" },
                  { label: isZh ? "Low Stock" : "Low Stock", value: pageData.riskSummary[0]?.desc ?? "-", href: "/psi/inventory" },
                  { label: isZh ? "Expiry Watch" : "Expiry Watch", value: isZh ? "2 个批次接近效期" : "2 lots close to expiry", href: "/psi/inventory" },
                ].map((row) => (
                  <Link key={row.label} href={row.href} className="rounded-md border border-border/60 px-3 py-2 hover:bg-muted/30">
                    <p className={moduleVisual.title}>{row.label}</p>
                    <p className={moduleVisual.muted}>{row.value}</p>
                  </Link>
                ))}
              </div>
            </ModuleSection>

            <ModuleSection title={isZh ? "Recent Linked Records" : "Recent Linked Records"} className="p-3">
              <div className="space-y-2">
                {pageData.activity.map((item, index) => (
                  <Link key={`${item.time}-${item.title}`} href={item.href} className="flex items-start gap-2 rounded-md border border-border/60 px-3 py-2 hover:bg-muted/30">
                    <CircleDot className="mt-0.5 h-3.5 w-3.5 text-primary" />
                    <div className="flex-1">
                      <p className={moduleVisual.title}>
                        {index === 0 ? "PR linked to PO" : index === 1 ? "PO linked to GRN" : "GRN linked to SKU movement"}
                      </p>
                      <p className={moduleVisual.muted}>{item.desc}</p>
                    </div>
                    <p className={moduleVisual.muted}>{item.time}</p>
                  </Link>
                ))}
              </div>
            </ModuleSection>

            <ModuleSection title={isZh ? "模块入口" : "Workspace Shortcuts"} className="p-3">
              <div className="grid gap-2 md:grid-cols-2">
                {pageData.moduleShortcuts.map((item) => (
                  <Link key={item.href} href={item.href} className="rounded-md border border-border/60 px-3 py-2 hover:bg-muted/30">
                    <p className={moduleVisual.title}>{item.title}</p>
                    <p className={moduleVisual.muted}>{item.description}</p>
                    <p className="mt-1 text-xs text-primary">{item.metric}</p>
                  </Link>
                ))}
              </div>
            </ModuleSection>
          </div>

          <div className="xl:sticky xl:top-4 self-start space-y-3">
            <ModuleSection title={isZh ? "分支上下文" : "Branch Context"} className="p-3">
              <p className={moduleVisual.body}>{isZh ? "当前: All Branches" : "Current: All Branches"}</p>
              <p className={moduleVisual.muted}>{isZh ? "供应链链路覆盖采购、收货、库存与供应商。" : "Coverage includes procurement, receiving, inventory, and supplier."}</p>
            </ModuleSection>

            <ModuleSection title={isZh ? "PSI Health" : "PSI Health"} className="p-3">
              <div className="space-y-1.5 text-xs">
                {pageData.snapshot.map((item) => (
                  <div key={item.label} className="flex items-center justify-between rounded-md border border-border/60 px-2 py-1.5">
                    <span>{item.label}</span>
                    <span className="font-semibold">{item.value}</span>
                  </div>
                ))}
              </div>
            </ModuleSection>

            <ModuleSection title={isZh ? "状态说明" : "Status"} className="p-3">
              <div className="space-y-2">
                <div className="rounded-md border border-border/60 px-2.5 py-2 text-xs">
                  <p className={moduleVisual.title}>{isZh ? "Data Source" : "Data Source"}</p>
                  <p className={moduleVisual.muted}>Mock / UI only</p>
                </div>
                <div className="rounded-md border border-yellow-500/30 bg-yellow-500/10 px-2.5 py-2 text-xs">
                  <p className="flex items-center gap-1 font-semibold text-yellow-300"><AlertTriangle className="h-3.5 w-3.5" />{isZh ? "Guardrail" : "Guardrail"}</p>
                  <p className="text-yellow-200/90">{isZh ? "不执行审批、过账或库存写入。" : "No approval execution, stock posting, or write operations."}</p>
                </div>
              </div>
            </ModuleSection>
          </div>
        </ModuleTwoColumn>
      </ModulePageStack>
    </ErpShell>
  );
}
