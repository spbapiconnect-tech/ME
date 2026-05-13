"use client";

import dynamic from "next/dynamic";

import { ErpShell } from "@/components/erp/erp-shell";

const SopBlockNoteEditor = dynamic(
  () => import("@/components/sop/sop-blocknote-editor").then((mod) => mod.SopBlockNoteEditor),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-[640px] bg-background px-10 py-8">
        <div className="mx-auto max-w-4xl rounded-3xl border bg-card p-8 text-sm text-muted-foreground">
          Loading BlockNote editor...
        </div>
      </div>
    ),
  },
);

export default function SopBlockNoteTestPage() {
  return (
    <ErpShell>
      <div className="min-h-screen bg-background">
        <div className="border-b px-6 py-4">
          <div className="text-sm text-muted-foreground">SOP Editor Experiment</div>
          <h1 className="text-2xl font-semibold tracking-tight">BlockNote SOP Workspace</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Test document-style SOP writing before replacing the current builder.
          </p>
        </div>

        <SopBlockNoteEditor />
      </div>
    </ErpShell>
  );
}
