"use client";

import * as React from "react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getPsiCopy, type PsiLocale } from "@/config/psi-language-copy";
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

function optionLabel(value: string, psiCopy: ReturnType<typeof getPsiCopy>) {
  const map: Record<string, string> = {
    all: psiCopy.actions.options.all,
    procurement: psiCopy.actions.options.procurement,
    supplier: psiCopy.actions.options.supplier,
    inventory: psiCopy.actions.options.inventory,
    receiving: psiCopy.actions.options.receiving,
    issue: psiCopy.actions.options.issue,
    stock: psiCopy.actions.options.stock,
    system: psiCopy.actions.options.system,
    create: psiCopy.actions.options.create,
    "update-placeholder": psiCopy.actions.options.updatePlaceholder,
    review: psiCopy.actions.options.review,
    "approve-placeholder": psiCopy.actions.options.approvePlaceholder,
    receive: psiCopy.actions.options.receive,
    adjust: psiCopy.actions.options.adjust,
    transfer: psiCopy.actions.options.transfer,
    "report-issue": psiCopy.actions.options.reportIssue,
    suggest: psiCopy.actions.options.suggest,
    configure: psiCopy.actions.options.configure,
    placeholder: psiCopy.actions.options.placeholder,
    draft: psiCopy.actions.options.draft,
    "preview-only": psiCopy.actions.options.previewOnly,
    "coming-soon": psiCopy.actions.options.comingSoon,
    blocked: psiCopy.actions.options.blocked,
    disabled: psiCopy.actions.options.disabled,
  };

  return map[value] ?? value;
}

export function PsiActionsPage({ actions }: PsiActionsPageProps) {
  const rawLocale = useUiPreferencesStore((state) => (state.hydrated ? state.locale : "en"));
  const currentLocale: SupportedLocale = rawLocale === "zh" ? "zh" : "en";
  const psiLocale: PsiLocale = currentLocale === "zh" ? "zh" : "en";
  const psiCopy = getPsiCopy(psiLocale);

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

  const statCards = [
    [psiCopy.actions.total, stats.total],
    [psiCopy.shared.procurement, stats.procurement],
    [psiCopy.shared.supplier, stats.supplier],
    [psiCopy.shared.inventory, stats.inventory],
    [psiCopy.actions.placeholder, stats.placeholder],
    [psiCopy.actions.fields, stats.fields],
    [psiCopy.actions.requiredFields, stats.requiredFields],
  ];

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>{psiCopy.actions.title}</CardTitle>
          <CardDescription>{psiCopy.actions.description}</CardDescription>
          <CardDescription>{psiCopy.actions.notice}</CardDescription>
        </CardHeader>
      </Card>

      <Card size="sm">
        <CardHeader>
          <CardTitle className="text-sm">{psiCopy.actions.statsTitle}</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-2 text-xs md:grid-cols-4">
          {statCards.map(([label, value]) => (
            <div key={String(label)} className="rounded-xl border p-2">
              {label}: {value}
            </div>
          ))}
        </CardContent>
      </Card>

      <Card size="sm">
        <CardHeader>
          <CardTitle className="text-sm">{psiCopy.actions.filters}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Select value={category} onValueChange={(value) => setCategory(value as PsiActionDraftCategory | "all")}>
            <SelectTrigger className="h-8 text-xs">
              <SelectValue placeholder={psiCopy.actions.category} />
            </SelectTrigger>
            <SelectContent>
              {categoryOptions.map((value) => (
                <SelectItem key={value} value={value}>
                  {optionLabel(value, psiCopy)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={intent} onValueChange={(value) => setIntent(value as PsiActionDraftIntent | "all")}>
            <SelectTrigger className="h-8 text-xs">
              <SelectValue placeholder={psiCopy.actions.intent} />
            </SelectTrigger>
            <SelectContent>
              {intentOptions.map((value) => (
                <SelectItem key={value} value={value}>
                  {optionLabel(value, psiCopy)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={status} onValueChange={(value) => setStatus(value as PsiActionDraftStatus | "all")}>
            <SelectTrigger className="h-8 text-xs">
              <SelectValue placeholder={psiCopy.actions.status} />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((value) => (
                <SelectItem key={value} value={value}>
                  {optionLabel(value, psiCopy)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={moduleCode} onValueChange={setModuleCode}>
            <SelectTrigger className="h-8 text-xs">
              <SelectValue placeholder={psiCopy.actions.module} />
            </SelectTrigger>
            <SelectContent>
              {moduleOptions.map((value) => (
                <SelectItem key={value} value={value}>
                  {optionLabel(value, psiCopy)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <section className="grid gap-4 lg:grid-cols-2">
        <Card size="sm">
          <CardHeader>
            <CardTitle className="text-sm">{psiCopy.actions.actionDrafts}</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-2">
            {filteredActions.map((item) => (
              <button key={item.key} type="button" className="text-left" onClick={() => setSelectedKey(item.key)}>
                <PsiActionCard action={item} locale={currentLocale} />
              </button>
            ))}
            {filteredActions.length === 0 ? <div className="text-xs text-muted-foreground">{psiCopy.actions.noActionDraftFound}</div> : null}
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
