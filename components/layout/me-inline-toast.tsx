"use client";

import { CheckCircle2, Loader2, XCircle } from "lucide-react";

import { cn } from "@/lib/utils";

interface MeInlineToastProps {
  message: string;
  tone?: "success" | "loading" | "error";
}

export function MeInlineToast({ message, tone = "success" }: MeInlineToastProps) {
  const Icon = tone === "loading" ? Loader2 : tone === "error" ? XCircle : CheckCircle2;

  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-[10px] border px-3 py-2 text-sm shadow-[0_1px_2px_rgba(15,23,42,0.04)]",
        tone === "success" && "border-emerald-200 bg-emerald-50 text-emerald-700",
        tone === "loading" && "border-blue-200 bg-blue-50 text-blue-700",
        tone === "error" && "border-rose-200 bg-rose-50 text-rose-700",
      )}
    >
      <Icon className={cn("size-4", tone === "loading" && "animate-spin")} />
      <span>{message}</span>
    </div>
  );
}
