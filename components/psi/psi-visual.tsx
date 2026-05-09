import Link from "next/link";
import type { ReactNode } from "react";

export const psiVisual = {
  pageStack: "space-y-6",
  moduleGrid: "grid gap-3 md:grid-cols-2 xl:grid-cols-4",
  metricGrid: "grid gap-3 md:grid-cols-2 xl:grid-cols-3",
  fieldGrid: "grid gap-3 md:grid-cols-2 xl:grid-cols-4",

  section:
    "rounded-xl border border-border bg-card p-5 shadow-sm",
  sectionSoft:
    "rounded-xl border border-border/70 bg-card/95 p-5 shadow-sm",

  card:
    "rounded-[20px] border border-border/70 bg-card p-4 shadow-sm transition",
  cardHover:
    "hover:-translate-y-0.5 hover:border-primary/35 hover:bg-muted/35 hover:shadow-md",
  softCard:
    "rounded-[10px] border border-border bg-muted/35 px-4 py-3 text-sm",
  noteCard:
    "rounded-[20px] border border-border/70 bg-muted/35 p-4",
  warningCard:
    "rounded-[20px] border border-border/70 bg-muted/35 p-4",

  sectionTitle: "text-sm font-semibold text-foreground",
  sectionDescription: "mt-1 text-sm leading-6 text-muted-foreground",

  eyebrow:
    "text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground",
  title: "text-sm font-semibold text-foreground",
  value: "mt-1.5 text-sm font-semibold text-foreground",
  metric:
    "text-[1.55rem] font-semibold tracking-[-0.02em] text-foreground",
  body: "text-sm leading-6 text-muted-foreground",
  muted: "text-xs leading-5 text-muted-foreground",
  pill:
    "mt-3 inline-flex rounded-full border border-border bg-muted px-3 py-1 text-xs font-medium text-muted-foreground",
};

export function PsiSection({
  title,
  description,
  children,
  className = "",
}: {
  title: ReactNode;
  description?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`${psiVisual.section} ${className}`}>
      <div>
        <h2 className={psiVisual.sectionTitle}>{title}</h2>
        {description ? <p className={psiVisual.sectionDescription}>{description}</p> : null}
      </div>
      <div className="mt-6">{children}</div>
    </section>
  );
}

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
      <p className={`mt-1 ${psiVisual.body}`}>{description}</p>
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
