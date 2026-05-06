"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { usePathname } from "next/navigation";

import { getNavigationMap, resolveNavigationLabel } from "@/lib/navigation";
import type { MeNavigationItem, MeNavigationLocale } from "@/types/navigation";

interface MeBreadcrumbsProps {
  locale?: MeNavigationLocale;
}

function findNavigationItemByHref(pathname: string): MeNavigationItem | undefined {
  const map = getNavigationMap();
  const items = [...map.primaryItems, ...map.footerItems, ...map.groups.flatMap((group) => group.items)];

  return items.find((item) => item.href === pathname)
    ?? items
      .filter((item) => item.href !== "/" && pathname.startsWith(`${item.href}/`))
      .sort((a, b) => b.href.length - a.href.length)[0];
}

function fallbackLabel(segment: string) {
  return segment
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function MeBreadcrumbs({ locale = "en" }: MeBreadcrumbsProps) {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  const crumbs = segments.map((segment, index) => {
    const href = `/${segments.slice(0, index + 1).join("/")}`;
    const item = findNavigationItemByHref(href);

    return {
      href,
      label: item ? resolveNavigationLabel(item, locale) : fallbackLabel(segment),
    };
  });

  return (
    <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1 text-xs text-muted-foreground">
      <Link href="/" className="hover:text-foreground">
        ME
      </Link>
      {pathname === "/" ? (
        <>
          <ChevronRight className="size-3" />
          <span>{locale === "zh" ? "仪表盘" : "Dashboard"}</span>
        </>
      ) : null}
      {crumbs.map((crumb, index) => (
        <span key={crumb.href} className="flex items-center gap-1">
          <ChevronRight className="size-3" />
          {index === crumbs.length - 1 ? (
            <span className="text-foreground">{crumb.label}</span>
          ) : (
            <Link href={crumb.href} className="hover:text-foreground">
              {crumb.label}
            </Link>
          )}
        </span>
      ))}
    </nav>
  );
}
