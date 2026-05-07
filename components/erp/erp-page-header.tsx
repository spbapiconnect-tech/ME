import { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function ErpPageHeader({
  breadcrumbs,
  title,
  zhTitle,
  subtitle,
  actions,
  className,
}: {
  breadcrumbs?: string[];
  title: string;
  zhTitle?: string;
  subtitle?: string;
  actions?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("space-y-4", className)}>
      {breadcrumbs?.length ? (
        <nav className="flex items-center gap-1.5 text-xs text-muted-foreground">
          {breadcrumbs.map((crumb, index) => (
            <div key={`${crumb}-${index}`} className="flex items-center gap-1.5">
              <span className={cn(
                "hover:text-foreground cursor-default transition-colors",
                index === breadcrumbs.length - 1 && "font-medium text-foreground"
              )}>
                {crumb}
              </span>
              {index < breadcrumbs.length - 1 && (
                <span className="text-muted-foreground/50">/</span>
              )}
            </div>
          ))}
        </nav>
      ) : null}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-3">
            {title}
            {zhTitle && (
              <span className="text-xl font-medium text-muted-foreground/50">{zhTitle}</span>
            )}
          </h1>
          {subtitle && (
            <p className="max-w-[700px] text-sm text-muted-foreground">
              {subtitle}
            </p>
          )}
        </div>
        {actions && (
          <div className="flex shrink-0 items-center gap-2">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}
