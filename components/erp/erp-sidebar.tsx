import Link from "next/link";
import { erpNavigation } from "@/lib/erp/erp-module-schema";

const groups = ["Dashboard", "Store Operations", "PSI", "Workforce", "Business", "System"] as const;

export function ErpSidebar({ activeHref = "/" }: { activeHref?: string }) {
  return (
    <aside className="min-h-screen w-[224px] border-r border-border bg-card">
      <div className="flex h-14 items-center gap-3 px-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-xs font-bold text-primary-foreground">
          ME
        </div>
        <div>
          <div className="text-sm font-semibold text-foreground">ME Branch ERP</div>
          <div className="text-xs text-muted-foreground">Restaurant Operations</div>
        </div>
      </div>

      <nav className="space-y-5 px-3 py-4">
        {groups.map((group) => {
          const items = erpNavigation.filter((item) => item.group === group);
          if (!items.length) return null;

          return (
            <section key={group}>
              {group !== "Dashboard" ? (
                <div className="mb-2 px-3 text-xs font-semibold text-muted-foreground">{group}</div>
              ) : null}
              <div className="space-y-1">
                {items.map((item) => {
                  const active = activeHref === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`relative flex h-9 items-center rounded-lg px-3 pl-7 text-sm font-medium transition ${
                        active ? "bg-blue-50 text-blue-700" : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      }`}
                    >
                      {active ? <span className="absolute left-0 top-1.5 h-6 w-1 rounded-r bg-blue-600" /> : null}
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </section>
          );
        })}
      </nav>
    </aside>
  );
}
