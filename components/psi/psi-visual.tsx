import Link from "next/link";
import type { ReactNode } from "react";

export const psiVisual = {
  pageStack: "space-y-6",
  moduleGrid: "grid gap-3 md:grid-cols-2 xl:grid-cols-4",
  metricGrid: "grid gap-3 md:grid-cols-2 xl:grid-cols-3",
  fieldGrid: "grid gap-3 md:grid-cols-2 xl:grid-cols-4",

  section: "border border-border/70 bg-card/95 shadow-sm",
  sectionSoft: "border border-border/70 bg-card/95 shadow-sm",

  card:
    "rounded-[24px] border border-border/70 bg-card/95 p-4 shadow-sm transition",
  cardHover:
    "hover:-translate-y-0.5 hover:border-primary/30 hover:bg-muted/30 hover:shadow-md",
  softCard:
    "rounded-[10px] border border-border bg-[var(--surface-soft)] px-4 py-3 text-sm text-[var(--text-secondary)]",
  noteCard:
    "rounded-[20px] border border-border/70 bg-muted/35 p-4",
  warningCard:
    "rounded-[20px] border border-border/70 bg-muted/35 p-4",

  eyebrow:
    "text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--text-muted)]",
  title: "text-sm font-semibold text-[var(--text-primary)]",
  value: "mt-1.5 text-sm font-semibold text-[var(--text-primary)]",
  metric:
    "text-[1.55rem] font-semibold tracking-[-0.02em] text-[var(--text-primary)]",
  body: "text-sm leading-6 text-[var(--text-secondary)]",
  muted: "text-xs leading-5 text-[var(--text-secondary)]",
  pill:
    "mt-3 inline-flex rounded-full border border-border/70 bg-muted/50 px-3 py-1 text-xs font-medium text-muted-foreground",
};

export function PsiSoftCard({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={`${psiVisual.softCard} ${className}`}>{children}</div>;
}

export function PsiModuleCard({
  href,
  title,
  description,
  metric,
}: {
  href?: string;
  title: ReactNode;
  description: ReactNode;
  metric?: ReactNode;
}) {
  const content = (
    <>
      <div className={psiVisual.title}>{title}</div>
      <p className={`mt-1 ${psiVisual.muted}`}>{description}</p>
      {metric ? <div className={psiVisual.pill}>{metric}</div> : null}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={`${psiVisual.card} ${psiVisual.cardHover}`}>
        {content}
      </Link>
    );
  }

  return <div className={psiVisual.card}>{content}</div>;
}
