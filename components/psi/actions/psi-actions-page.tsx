"use client";

import * as React from "react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  countPsiActionDraftFields,
  countPsiActionDraftRequiredFields,
  getPlaceholderPsiActionDrafts,
  getPsiActionDraftsByCategory,
} from "@/lib/psi-actions";
import { useUiPreferencesStore } from "@/stores/ui-preferences";
import type {
  PsiActionDraftCategory,
  PsiActionDraftContract,
  PsiActionDraftIntent,
  PsiActionDraftStatus,
} from "@/types/psi/actions";
import type { SupportedLocale } from "@/types/module";

import { PsiActionCard } from "./psi-action-card";
import { PsiActionFormPreview } from "./psi-action-form-preview";
import { PsiActionPreviewCard } from "./psi-action-preview-card";
import { PsiActionSourceCard } from "./psi-action-source-card";

const categoryOptions: Array<PsiActionDraftCategory | "all"> = [
  "all",
  "procurement",
  "supplier",
  "inventory",
  "receiving",
  "issue",
  "stock",
  "system",
];

const intentOptions: Array<PsiActionDraftIntent | "all"> = [
  "all",
  "create",
  "update-placeholder",
  "review",
  "approve-placeholder",
  "receive",
  "adjust",
  "transfer",
  "report-issue",
  "suggest",
  "configure",
  "placeholder",
];

const statusOptions: Array<PsiActionDraftStatus | "all"> = [
  "all",
  "draft",
  "placeholder",
  "preview-only",
  "coming-soon",
  "blocked",
  "disabled",
];

interface PsiActionsPageProps {
  actions: PsiActionDraftContract[];
}

export function PsiActionsPage({ actions }: PsiActionsPageProps) {
  const locale = useUiPreferencesStore((state) => (state.hydrated ? state.locale : "en"));
  const currentLocale: SupportedLocale = locale;

  const [category, setCategory] = React.useState<PsiActionDraftCategory | "all">("all");
  const [intent, setIntent] = React.useState<PsiActionDraftIntent | "all">("all");
  const [status, setStatus] = React.useState<PsiActionDraftStatus | "all">("all");
  const [moduleCode, setModuleCode] = React.useState<string>("all");
  const [selectedKey, setSelectedKey] = React.useState(actions[0]?.key ?? "");

  const moduleOptions = React.useMemo(() => ["all", ...Array.from(new Set(actions.map((item) => item.source.moduleCode))).sort()], [actions]);

  const filteredActions = React.useMemo(() => {
    return actions.filter((item) => {
      if (category !== "all" && item.category !== category) return false;
      if (intent !== "all" && item.intent !== intent) return false;
      if (status !== "all" && item.status !== status) return false;
      if (moduleCode !== "all" && item.source.moduleCode !== moduleCode) return false;
      return true;
    });
  }, [actions, category, intent, moduleCode, status]);

  const selectedAction = React.useMemo(
    () => filteredActions.find((item) => item.key === selectedKey) ?? filteredActions[0],
    [filteredActions, selectedKey],
  );

  const stats = React.useMemo(() => {
    const total = actions.length;
    const procurement = getPsiActionDraftsByCategory("procurement").length;
    const supplier = getPsiActionDraftsByCategory("supplier").length;
    const inventory = getPsiActionDraftsByCategory("inventory").length;
    const placeholder = getPlaceholderPsiActionDrafts().length;
    const fields = actions.reduce((sum, item) => sum + countPsiActionDraftFields(item), 0);
    const requiredFields = actions.reduce((sum, item) => sum + countPsiActionDraftRequiredFields(item), 0);
    return { total, procurement, supplier, inventory, placeholder, fields, requiredFields };
  }, [actions]);

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>ME PSI Actions</CardTitle>
          <CardDescription>Action Draft / Form Placeholder Design</CardDescription>
          <CardDescription>
            Placeholder only. No real submit, no database/API, no write action, no approval engine, no stock posting, and
            no task/notification/workflow execution.
          </CardDescription>
        </CardHeader>
      </Card>

      <Card size="sm">
        <CardHeader>
          <CardTitle className="text-sm">Stats</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-2 text-xs md:grid-cols-4">
          <div className="rounded-xl border p-2">total: {stats.total}</div>
          <div className="rounded-xl border p-2">procurement: {stats.procurement}</div>
          <div className="rounded-xl border p-2">supplier: {stats.supplier}</div>
          <div className="rounded-xl border p-2">inventory: {stats.inventory}</div>
          <div className="rounded-xl border p-2">placeholder: {stats.placeholder}</div>
          <div className="rounded-xl border p-2">fields: {stats.fields}</div>
          <div className="rounded-xl border p-2">required fields: {stats.requiredFields}</div>
        </CardContent>
      </Card>

      <Card size="sm">
        <CardHeader>
          <CardTitle className="text-sm">Filters</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Select value={category} onValueChange={(value) => setCategory(value as PsiActionDraftCategory | "all")}>
            <SelectTrigger size="sm">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categoryOptions.map((value) => (
                <SelectItem key={value} value={value}>
                  {value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={intent} onValueChange={(value) => setIntent(value as PsiActionDraftIntent | "all")}>
            <SelectTrigger size="sm">
              <SelectValue placeholder="Intent" />
            </SelectTrigger>
            <SelectContent>
              {intentOptions.map((value) => (
                <SelectItem key={value} value={value}>
                  {value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={status} onValueChange={(value) => setStatus(value as PsiActionDraftStatus | "all")}>
            <SelectTrigger size="sm">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((value) => (
                <SelectItem key={value} value={value}>
                  {value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={moduleCode} onValueChange={setModuleCode}>
            <SelectTrigger size="sm">
              <SelectValue placeholder="Module" />
            </SelectTrigger>
            <SelectContent>
              {moduleOptions.map((value) => (
                <SelectItem key={value} value={value}>
                  {value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <section className="grid gap-4 lg:grid-cols-2">
        <Card size="sm">
          <CardHeader>
            <CardTitle className="text-sm">Action Drafts</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-2">
            {filteredActions.map((item) => (
              <button key={item.key} type="button" className="text-left" onClick={() => setSelectedKey(item.key)}>
                <PsiActionCard action={item} locale={currentLocale} />
              </button>
            ))}
            {filteredActions.length === 0 ? <div className="text-xs text-muted-foreground">No action draft found.</div> : null}
          </CardContent>
        </Card>

        <div className="grid gap-4">
          {selectedAction ? <PsiActionFormPreview action={selectedAction} locale={currentLocale} /> : null}
          {selectedAction ? <PsiActionPreviewCard action={selectedAction} locale={currentLocale} /> : null}
          {selectedAction ? <PsiActionSourceCard action={selectedAction} locale={currentLocale} /> : null}
        </div>
      </section>
    </main>
  );
}
