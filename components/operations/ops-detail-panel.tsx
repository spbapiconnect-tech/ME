"use client";

import type { ReactNode } from "react";
import { ArrowRight, History, PanelRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { OpsStatusChip, type OpsTone, resolveOpsTone } from "./ops-status-chip";

export type OpsDetailFact = {
  label: string;
  value: ReactNode;
};

export type OpsDetailAction = {
  label: string;
  onClick?: () => void;
  disabled?: boolean;
  variant?: "default" | "outline" | "secondary" | "ghost";
};

export type OpsDetailActivity = {
  id: string;
  title: string;
  description?: string;
  time?: string;
  tone?: OpsTone;
};

export function OpsDetailPanel({
  title = "Detail",
  subtitle,
  status,
  tone,
  facts,
  actions = [],
  proofItems = [],
  activity = [],
  emptyText = "Select an item to review the detail.",
}: {
  title?: string;
  subtitle?: string;
  status?: string;
  tone?: OpsTone;
  facts?: OpsDetailFact[];
  actions?: OpsDetailAction[];
  proofItems?: string[];
  activity?: OpsDetailActivity[];
  emptyText?: string;
}) {
  const hasDetail = Boolean(facts?.length || subtitle || status || actions.length || proofItems.length || activity.length);

  return (
    <Card>
      <CardHeader className="space-y-2 pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <PanelRight className="h-4 w-4 text-primary" />
          {title}
        </CardTitle>
        {subtitle ? <p className="text-sm text-muted-foreground">{subtitle}</p> : null}
        {status ? <OpsStatusChip tone={tone ?? resolveOpsTone(status)}>{status}</OpsStatusChip> : null}
      </CardHeader>

      <CardContent className="space-y-4">
        {!hasDetail ? <div className="rounded-xl border border-dashed p-4 text-sm text-muted-foreground">{emptyText}</div> : null}

        {facts?.length ? (
          <div className="space-y-2">
            {facts.map((fact) => (
              <div key={fact.label} className="flex items-start justify-between gap-3 rounded-lg border px-3 py-2 text-sm">
                <span className="text-muted-foreground">{fact.label}</span>
                <span className="text-right font-medium">{fact.value}</span>
              </div>
            ))}
          </div>
        ) : null}

        {proofItems.length ? (
          <div className="space-y-2">
            <p className="text-sm font-semibold">Proof / Attachments</p>
            {proofItems.map((item) => (
              <div key={item} className="rounded-lg border bg-muted/20 px-3 py-2 text-sm text-muted-foreground">
                {item}
              </div>
            ))}
          </div>
        ) : null}

        {actions.length ? (
          <div className="grid gap-2">
            {actions.map((action) => (
              <Button
                key={action.label}
                type="button"
                variant={action.variant ?? "outline"}
                disabled={action.disabled}
                onClick={action.onClick}
                className="justify-between"
              >
                <span>{action.label}</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            ))}
          </div>
        ) : null}

        {activity.length ? (
          <div className="space-y-2">
            <p className="flex items-center gap-2 text-sm font-semibold">
              <History className="h-4 w-4 text-primary" />
              History
            </p>
            {activity.map((item) => (
              <div key={item.id} className="rounded-lg border px-3 py-2 text-sm">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium">{item.title}</p>
                    {item.description ? <p className="mt-0.5 text-xs text-muted-foreground">{item.description}</p> : null}
                  </div>
                  {item.time ? <span className="text-[11px] text-muted-foreground">{item.time}</span> : null}
                </div>
              </div>
            ))}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
