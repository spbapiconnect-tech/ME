"use client";

import Link from "next/link";
import * as React from "react";

import { PackageCard } from "@/components/packages/package-card";
import { PackageGroupCard } from "@/components/packages/package-group-card";
import { PackagePreviewCard } from "@/components/packages/package-preview-card";
import { PackageSourceCard } from "@/components/packages/package-source-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { packageContracts, packageGroups } from "@/config/packages";
import {
  getEnterprisePackages,
  getPackageByKey,
  getPlaceholderPackages,
} from "@/lib/packages";
import { useUiPreferencesStore } from "@/stores/ui-preferences";
import type { SupportedLocale } from "@/types/module";
import type { PackageCategory, PackageStatus, PackageTier } from "@/types/package";

const categoryOptions: Array<PackageCategory | "all"> = ["all", "base-plan", "module-pack", "role-pack", "industry-pack", "add-on", "enterprise", "system"];
const tierOptions: Array<PackageTier | "all"> = ["all", "starter", "ops", "pro", "enterprise", "custom"];
const statusOptions: Array<PackageStatus | "all"> = ["all", "active", "preview-only", "placeholder", "coming-soon", "blocked", "disabled"];

function groupBy(values: string[]) {
  return values.reduce<Record<string, number>>((acc, value) => {
    acc[value] = (acc[value] ?? 0) + 1;
    return acc;
  }, {});
}

export function PackagesPage() {
  const locale = useUiPreferencesStore((state) => state.locale);
  const theme = useUiPreferencesStore((state) => state.theme);
  const hydrated = useUiPreferencesStore((state) => state.hydrated);
  const hydrate = useUiPreferencesStore((state) => state.hydrate);

  React.useEffect(() => {
    hydrate();
  }, [hydrate]);

  React.useEffect(() => {
    if (!hydrated) return;
    document.documentElement.dataset.theme = theme;
    document.documentElement.lang = locale === "zh" ? "zh-CN" : "en";
  }, [hydrated, locale, theme]);

  const currentLocale: SupportedLocale = hydrated ? locale : "en";

  const [categoryFilter, setCategoryFilter] = React.useState<PackageCategory | "all">("all");
  const [tierFilter, setTierFilter] = React.useState<PackageTier | "all">("all");
  const [statusFilter, setStatusFilter] = React.useState<PackageStatus | "all">("all");
  const [moduleFilter, setModuleFilter] = React.useState<string>("all");
  const [selectedPackageKey, setSelectedPackageKey] = React.useState<string>(packageContracts[0]?.key ?? "");

  const modules = React.useMemo(() => {
    const allModules = Array.from(new Set(packageContracts.flatMap((item) => item.modules))).sort();
    return ["all", ...allModules];
  }, []);

  const filteredPackages = React.useMemo(() => {
    return packageContracts.filter((item) => {
      if (categoryFilter !== "all" && item.category !== categoryFilter) return false;
      if (tierFilter !== "all" && item.tier !== tierFilter) return false;
      if (statusFilter !== "all" && item.status !== statusFilter) return false;
      if (moduleFilter !== "all" && !item.modules.includes(moduleFilter)) return false;
      return true;
    });
  }, [categoryFilter, tierFilter, statusFilter, moduleFilter]);

  const selectedPackage = React.useMemo(() => {
    if (!selectedPackageKey) return undefined;
    return filteredPackages.find((item) => item.key === selectedPackageKey) ?? getPackageByKey(selectedPackageKey);
  }, [filteredPackages, selectedPackageKey]);

  const stats = React.useMemo(() => {
    return {
      total: packageContracts.length,
      active: packageContracts.filter((item) => item.status === "active").length,
      placeholder: getPlaceholderPackages().length,
      enterprise: getEnterprisePackages().length,
      byCategory: groupBy(packageContracts.map((item) => item.category)),
      byTier: groupBy(packageContracts.map((item) => item.tier)),
      byModule: groupBy(packageContracts.flatMap((item) => item.modules)),
    };
  }, []);

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-8">
      <Card>
        <CardHeader className="gap-2">
          <CardTitle className="text-xl">ME Packages</CardTitle>
          <CardDescription>Module Package / SaaS Plan Builder Contract</CardDescription>
          <CardDescription>
            {currentLocale === "zh"
              ? "该页面仅用于方案与模块包元数据预览，不执行真实计费、支付、订阅门禁、租户开通、模块运行时启停、API/后端/数据库或会话查询。"
              : "Metadata-only package/plan preview. No real billing, payment, subscription enforcement, tenant provisioning, runtime module enable/disable, API/backend/database, or session lookup."}
          </CardDescription>
          <div className="flex flex-wrap gap-2">
            <Button asChild variant="outline" size="sm"><Link href="/">Back To Dashboard</Link></Button>
            <Button asChild variant="outline" size="sm"><Link href="/rules">ME Rules</Link></Button>
            <Button asChild variant="outline" size="sm"><Link href="/reports">ME Reports</Link></Button>
            <Button asChild variant="outline" size="sm"><Link href="/notifications">ME Notifications</Link></Button>
            <Button asChild variant="outline" size="sm"><Link href="/workflow">ME Workflow</Link></Button>
            <Button asChild variant="outline" size="sm"><Link href="/action-contracts">ME Action Contracts</Link></Button>
            <Button asChild variant="outline" size="sm"><Link href="/access-control">ME Access Control</Link></Button>
            <Button asChild variant="outline" size="sm"><Link href="/audit-trail">ME Audit Trail</Link></Button>
            <Button asChild variant="outline" size="sm"><Link href="/psi">ME PSI</Link></Button>
            <Button asChild variant="outline" size="sm"><Link href="/system-foundation">ME System Foundation</Link></Button>
          </div>
        </CardHeader>
      </Card>

      <Card size="sm">
        <CardHeader className="gap-1"><CardTitle className="text-sm">Package Stats</CardTitle></CardHeader>
        <CardContent className="grid gap-3">
          <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
            <div className="rounded-xl bg-muted/40 p-3"><div className="text-xs text-muted-foreground">Total</div><div className="text-lg font-semibold">{stats.total}</div></div>
            <div className="rounded-xl bg-muted/40 p-3"><div className="text-xs text-muted-foreground">Active</div><div className="text-lg font-semibold">{stats.active}</div></div>
            <div className="rounded-xl bg-muted/40 p-3"><div className="text-xs text-muted-foreground">Placeholder</div><div className="text-lg font-semibold">{stats.placeholder}</div></div>
            <div className="rounded-xl bg-muted/40 p-3"><div className="text-xs text-muted-foreground">Enterprise</div><div className="text-lg font-semibold">{stats.enterprise}</div></div>
          </div>
          <div className="flex flex-wrap gap-1.5 text-xs">{Object.entries(stats.byCategory).map(([k, v]) => <Badge key={k} variant="secondary">{k}: {v}</Badge>)}</div>
          <div className="flex flex-wrap gap-1.5 text-xs">{Object.entries(stats.byTier).map(([k, v]) => <Badge key={k} variant="outline">{k}: {v}</Badge>)}</div>
          <div className="flex flex-wrap gap-1.5 text-xs">{Object.entries(stats.byModule).map(([k, v]) => <Badge key={k} variant="outline">{k}: {v}</Badge>)}</div>
        </CardContent>
      </Card>

      <Card size="sm">
        <CardHeader className="gap-1"><CardTitle className="text-sm">Filters</CardTitle></CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Select value={categoryFilter} onValueChange={(value) => setCategoryFilter(value as PackageCategory | "all")}>
            <SelectTrigger size="sm"><SelectValue placeholder="Category" /></SelectTrigger>
            <SelectContent>{categoryOptions.map((value) => <SelectItem key={value} value={value}>{value}</SelectItem>)}</SelectContent>
          </Select>
          <Select value={tierFilter} onValueChange={(value) => setTierFilter(value as PackageTier | "all")}>
            <SelectTrigger size="sm"><SelectValue placeholder="Tier" /></SelectTrigger>
            <SelectContent>{tierOptions.map((value) => <SelectItem key={value} value={value}>{value}</SelectItem>)}</SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as PackageStatus | "all")}>
            <SelectTrigger size="sm"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>{statusOptions.map((value) => <SelectItem key={value} value={value}>{value}</SelectItem>)}</SelectContent>
          </Select>
          <Select value={moduleFilter} onValueChange={setModuleFilter}>
            <SelectTrigger size="sm"><SelectValue placeholder="Module" /></SelectTrigger>
            <SelectContent>{modules.map((value) => <SelectItem key={value} value={value}>{value}</SelectItem>)}</SelectContent>
          </Select>
        </CardContent>
      </Card>

      <section className="grid gap-4 md:grid-cols-2">
        <Card size="sm">
          <CardHeader className="gap-1"><CardTitle className="text-sm">Package Catalog</CardTitle><CardDescription className="text-xs">{filteredPackages.length} / {packageContracts.length}</CardDescription></CardHeader>
          <CardContent className="grid gap-3">
            {filteredPackages.map((item) => (
              <button key={item.key} type="button" className="text-left" onClick={() => setSelectedPackageKey(item.key)}>
                <PackageCard pkg={item} locale={currentLocale} />
              </button>
            ))}
          </CardContent>
        </Card>
        <div className="grid gap-4">
          {selectedPackage ? <PackagePreviewCard pkg={selectedPackage} locale={currentLocale} /> : null}
          {selectedPackage ? <PackageSourceCard pkg={selectedPackage} locale={currentLocale} /> : null}
        </div>
      </section>

      <Card size="sm">
        <CardHeader className="gap-1"><CardTitle className="text-sm">Package Group Catalog</CardTitle></CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-2">
          {packageGroups.map((group) => <PackageGroupCard key={group.key} group={group} locale={currentLocale} />)}
        </CardContent>
      </Card>
    </main>
  );
}
