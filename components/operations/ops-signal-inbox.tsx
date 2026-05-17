"use client";

import { Inbox, Search } from "lucide-react";
import { useMemo, useState } from "react";

import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

import { OpsStatusChip, type OpsTone, resolveOpsTone } from "./ops-status-chip";

export type OpsSignalSource =
  | "grabfood_review"
  | "grabfood_insight"
  | "feedme_pos_alert"
  | "whatsapp_group"
  | "manual_inspection"
  | "outlet_execution"
  | "store_inspection"
  | "incident_center"
  | "fefo_waste"
  | "branch_control";

export type OpsSignalItem = {
  id: string;
  title: string;
  source: OpsSignalSource;
  message: string;
  branch?: string;
  time?: string;
  status?: string;
  tone?: OpsTone;
  meta?: string;
};

function sourceLabel(source: OpsSignalSource) {
  const labels: Record<OpsSignalSource, string> = {
    grabfood_review: "GrabFood Review",
    grabfood_insight: "GrabFood Insight",
    feedme_pos_alert: "FeedMe POS",
    whatsapp_group: "WhatsApp",
    manual_inspection: "Manual",
    outlet_execution: "Outlet Execution",
    store_inspection: "Store Inspection",
    incident_center: "Incident",
    fefo_waste: "FEFO / Waste",
    branch_control: "Branch Control",
  };

  return labels[source];
}

export function OpsSignalInbox({
  title = "Signal Inbox",
  description = "Operational signals and source feed.",
  signals,
  selectedSignalId,
  onSelectSignal,
  emptyText = "No signals in this inbox.",
}: {
  title?: string;
  description?: string;
  signals: OpsSignalItem[];
  selectedSignalId?: string;
  onSelectSignal?: (signal: OpsSignalItem) => void;
  emptyText?: string;
}) {
  const [query, setQuery] = useState("");

  const filteredSignals = useMemo(() => {
    const text = query.trim().toLowerCase();
    if (!text) return signals;

    return signals.filter((signal) => {
      return [signal.title, signal.message, signal.branch, signal.status, signal.meta, sourceLabel(signal.source)]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(text);
    });
  }, [query, signals]);

  return (
    <Card>
      <CardHeader className="space-y-3 pb-3">
        <div>
          <CardTitle className="flex items-center gap-2 text-base">
            <Inbox className="h-4 w-4 text-primary" />
            {title}
          </CardTitle>
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        </div>

        <div className="relative">
          <Search className="pointer-events-none absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search signal, source, branch..."
            className="pl-8"
          />
        </div>
      </CardHeader>

      <CardContent className="space-y-2">
        {!filteredSignals.length ? (
          <div className="rounded-xl border border-dashed p-4 text-sm text-muted-foreground">{emptyText}</div>
        ) : null}

        {filteredSignals.map((signal) => {
          const tone = signal.tone ?? resolveOpsTone(signal.status);

          return (
            <button
              key={signal.id}
              type="button"
              onClick={() => onSelectSignal?.(signal)}
              className={cn(
                "w-full rounded-xl border p-3 text-left transition hover:border-primary/70",
                selectedSignalId === signal.id ? "border-primary bg-primary/10" : "bg-card"
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <OpsStatusChip tone="neutral">{sourceLabel(signal.source)}</OpsStatusChip>
                    {signal.status ? <OpsStatusChip tone={tone}>{signal.status}</OpsStatusChip> : null}
                  </div>
                  <p className="mt-2 text-sm font-semibold">{signal.title}</p>
                  <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{signal.message}</p>
                </div>
              </div>

              <div className="mt-2 flex flex-wrap gap-2 text-[11px] text-muted-foreground">
                {signal.branch ? <span>{signal.branch}</span> : null}
                {signal.time ? <span>{signal.time}</span> : null}
                {signal.meta ? <span>{signal.meta}</span> : null}
              </div>
            </button>
          );
        })}
      </CardContent>
    </Card>
  );
}
