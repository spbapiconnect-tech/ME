import { ReactNode } from "react";

export function ErpPageHeader({
  breadcrumbs,
  title,
  zhTitle,
  subtitle,
  actions,
}: {
  breadcrumbs?: string[];
  title: string;
  zhTitle?: string;
  subtitle?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="space-y-4">
      {breadcrumbs?.length ? (
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          {breadcrumbs.map((crumb, index) => (
            <span key={`${crumb}-${index}`} className={index === breadcrumbs.length - 1 ? "font-medium text-foreground" : ""}>
              {index > 0 ? "› " : ""}
              {crumb}
            </span>
          ))}
        </div>
      ) : null}

      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            {title}
            {zhTitle ? <span className="ml-2 font-medium text-muted-foreground">{zhTitle}</span> : null}
          </h1>
          {subtitle ? <p className="mt-1 max-w-3xl text-sm leading-6 text-muted-foreground">{subtitle}</p> : null}
        </div>
        {actions ? <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div> : null}
      </div>
    </div>
  );
}
