"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Visual tokens for ERP module pages, unified with /branches design.
 */
export const moduleVisual = {
  pageStack: "space-y-4",
  
  // Containers
  section: "rounded-xl border border-border bg-card p-4 shadow-sm",
  card: "rounded-[20px] border border-border/70 bg-card p-4 shadow-sm transition",
  cardHover: "hover:-translate-y-0.5 hover:border-primary/35 hover:bg-muted/35 hover:shadow-md",
  
  // Grids
  kpiGrid: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4",
  compareGrid: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3",
  shortcutGrid: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3",
  twoColumn: "grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]",
  
  // Typography
  title: "text-sm font-semibold text-foreground",
  description: "mt-1 text-sm leading-6 text-muted-foreground",
  eyebrow: "text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground",
  metric: "text-[1.55rem] font-semibold tracking-[-0.02em] text-foreground",
  body: "text-sm leading-6 text-muted-foreground",
  muted: "text-xs leading-5 text-muted-foreground",
  
  // Table / Matrix
  tableWrapper: "overflow-hidden rounded-xl border border-border bg-card",
  tableScroll: "overflow-x-auto",
  tableContent: "max-h-[620px] min-w-[980px] overflow-y-auto xl:min-w-0",
  tableHeader: "sticky top-0 z-10 grid border-b border-border bg-muted/80 px-4 py-3 backdrop-blur",
  tableRow: "grid items-center border-b border-border/70 px-4 py-2.5 transition hover:bg-muted/30 last:border-b-0",
  
  // Pills / Badges
  pill: "inline-flex rounded-full border border-border bg-muted px-3 py-1 text-xs font-medium text-muted-foreground",
};

export function ModulePageStack({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn(moduleVisual.pageStack, className)}>{children}</div>;
}

export function ModuleSection({
  title,
  description,
  children,
  className,
  headerActions,
}: {
  title: ReactNode;
  description?: ReactNode;
  children: ReactNode;
  className?: string;
  headerActions?: ReactNode;
}) {
  return (
    <section className={cn(moduleVisual.section, className)}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className={moduleVisual.title}>{title}</h2>
          {description && <p className={moduleVisual.description}>{description}</p>}
        </div>
        {headerActions && <div className="flex items-center gap-2">{headerActions}</div>}
      </div>
      <div className="mt-6">{children}</div>
    </section>
  );
}

export function ModuleKpiGrid({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn(moduleVisual.kpiGrid, className)}>{children}</div>;
}

export function ModuleKpiCard({
  label,
  value,
  hint,
  href,
}: {
  label: string;
  value: string | number;
  hint?: string;
  href?: string;
}) {
  const content = (
    <>
      <p className={moduleVisual.eyebrow}>{label}</p>
      <p className={moduleVisual.metric}>{value}</p>
      {hint && <p className={cn("mt-1", moduleVisual.muted)}>{hint}</p>}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={cn(moduleVisual.card, moduleVisual.cardHover)}>
        {content}
      </Link>
    );
  }

  return <div className={moduleVisual.card}>{content}</div>;
}

export function ModuleCompareGrid({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn(moduleVisual.compareGrid, className)}>{children}</div>;
}

export function ModuleCompareCard({
  label,
  value,
  target,
  percent,
  note,
  href,
}: {
  label: string;
  value: string | number;
  target?: string;
  percent?: number;
  note?: string;
  href?: string;
}) {
  const content = (
    <>
      <p className={moduleVisual.eyebrow}>{label}</p>
      <div className="mt-3 flex items-end justify-between gap-3">
        <p className={moduleVisual.metric}>{value}</p>
        {target && <p className={moduleVisual.muted}>{target}</p>}
      </div>
      {percent !== undefined && (
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary"
            style={{ width: `${Math.min(100, Math.max(0, percent))}%` }}
          />
        </div>
      )}
      {note && <p className={cn("mt-3", moduleVisual.body)}>{note}</p>}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={cn(moduleVisual.card, moduleVisual.cardHover)}>
        {content}
      </Link>
    );
  }

  return <div className={moduleVisual.card}>{content}</div>;
}

export function ModuleMatrixTable({
  columns,
  children,
  className,
  gridTemplateColumns,
}: {
  columns: string[];
  children: ReactNode;
  className?: string;
  gridTemplateColumns?: string;
}) {
  return (
    <div className={cn(moduleVisual.tableWrapper, className)}>
      <div className={moduleVisual.tableScroll}>
        <div className={moduleVisual.tableContent}>
          <div
            className={moduleVisual.tableHeader}
            style={gridTemplateColumns ? { gridTemplateColumns } : undefined}
          >
            {columns.map((col) => (
              <div key={col} className={moduleVisual.eyebrow}>
                {col}
              </div>
            ))}
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}

export function ModuleMatrixRow({
  children,
  href,
  className,
  gridTemplateColumns,
}: {
  children: ReactNode;
  href?: string;
  className?: string;
  gridTemplateColumns?: string;
}) {
  const style = gridTemplateColumns ? { gridTemplateColumns } : undefined;
  
  if (href) {
    return (
      <Link href={href} className={cn(moduleVisual.tableRow, className)} style={style}>
        {children}
      </Link>
    );
  }

  return <div className={cn(moduleVisual.tableRow, className)} style={style}>{children}</div>;
}

export function ModuleSidePanel({
  title,
  description,
  children,
  className,
}: {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("space-y-6", className)}>
      <ModuleSection title={title} description={description}>
        {children}
      </ModuleSection>
    </div>
  );
}

export function ModuleActivityList({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("grid gap-3", className)}>{children}</div>;
}

export function ModuleShortcutGrid({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn(moduleVisual.shortcutGrid, className)}>{children}</div>;
}

export function ModuleShortcutCard({
  title,
  description,
  metric,
  href,
}: {
  title: string;
  description: string;
  metric?: string | number;
  href?: string;
}) {
  const content = (
    <>
      <div className={moduleVisual.title}>{title}</div>
      <p className={cn("mt-1", moduleVisual.body)}>{description}</p>
      {metric && <div className={moduleVisual.pill}>{metric}</div>}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={cn(moduleVisual.card, moduleVisual.cardHover)}>
        {content}
      </Link>
    );
  }

  return <div className={moduleVisual.card}>{content}</div>;
}

export function ModuleStatusPill({ children, className }: { children: ReactNode; className?: string }) {
  return <span className={cn(moduleVisual.pill, className)}>{children}</span>;
}


export function ModuleTwoColumn({
  children,
  className = "",
}: {
  children: import("react").ReactNode;
  className?: string;
}) {
  return (
    <div className={`grid gap-4 xl:grid-cols-[minmax(0,1fr)_21rem] ${className}`}>
      {children}
    </div>
  );
}
