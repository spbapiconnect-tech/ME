export function ErpEmptyState({ title = "No records found", description }: { title?: string; description?: string }) {
  return (
    <div className="flex min-h-40 flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card p-8 text-center">
      <div className="text-sm font-semibold text-foreground">{title}</div>
      {description ? <p className="mt-2 max-w-sm text-sm text-muted-foreground">{description}</p> : null}
    </div>
  );
}
