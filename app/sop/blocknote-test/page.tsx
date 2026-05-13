import { ErpShell } from "@/components/erp/erp-shell";
import { SopBlockNoteEditor } from "@/components/sop/sop-blocknote-editor";

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
