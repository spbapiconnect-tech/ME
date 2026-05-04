import type { ReactNode } from "react";

import {
  Bell,
  Building2,
  Grid2x2,
  Home,
  Menu,
  Plus,
  Search,
  Sparkles,
} from "lucide-react";

interface MobileShellProps {
  children: ReactNode;
  title: string;
  copy: string;
}

export function MobileShell({ children, title, copy }: MobileShellProps) {
  return (
    <section className="shell-layout shell-mobile">
      <header className="shell-mobile-topbar">
        <div className="shell-brand-lockup">
          <button className="shell-icon-button" type="button" aria-label="Open navigation">
            <Menu size={18} />
          </button>
          <div>
            <span className="shell-eyebrow">ME</span>
            <h2 className="shell-title">{title}</h2>
          </div>
        </div>
        <div className="shell-toolbar-actions">
          <button className="shell-icon-button" type="button" aria-label="Search placeholder">
            <Search size={18} />
          </button>
          <button className="shell-icon-button" type="button" aria-label="Notifications placeholder">
            <Bell size={18} />
          </button>
        </div>
      </header>

      <div className="shell-mobile-utility-row">
        <div className="shell-inline-chip">
          <Building2 size={16} />
          <span>Store / Tenant</span>
        </div>
        <div className="shell-inline-chip shell-inline-chip--muted">
          <Sparkles size={16} />
          <span>375-767px</span>
        </div>
      </div>

      <div className="shell-search-placeholder">
        <Search size={16} />
        <span>Search dashboard, modules, and tasks</span>
      </div>

      <div className="shell-pane shell-mobile-content">
        <div className="shell-content-intro">
          <p className="shell-copy">{copy}</p>
          <span className="shell-badge">Quick execution workspace</span>
        </div>
        <div className="shell-content-slot">{children}</div>
      </div>

      <footer className="shell-footer shell-mobile-footer">
        <nav className="shell-mobile-nav" aria-label="Mobile navigation placeholder">
          <button className="shell-mobile-nav-item shell-mobile-nav-item--active" type="button">
            <Home size={18} />
            <span>Home</span>
          </button>
          <button className="shell-mobile-nav-item" type="button">
            <Grid2x2 size={18} />
            <span>Modules</span>
          </button>
          <button className="shell-mobile-nav-item" type="button">
            <Sparkles size={18} />
            <span>Tasks</span>
          </button>
          <button className="shell-mobile-nav-item" type="button">
            <Bell size={18} />
            <span>Inbox</span>
          </button>
        </nav>

        <button className="shell-fab" type="button" aria-label="Quick action placeholder">
          <Plus size={20} />
        </button>
      </footer>
    </section>
  );
}
