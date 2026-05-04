import type { ReactNode } from "react";

import {
  Activity,
  Bell,
  Building2,
  ChevronRight,
  LayoutPanelLeft,
  Search,
  ShieldCheck,
  Split,
} from "lucide-react";

interface TabletShellProps {
  children: ReactNode;
  title: string;
  copy: string;
}

export function TabletShell({ children, title, copy }: TabletShellProps) {
  return (
    <section className="shell-layout shell-tablet">
      <aside className="shell-sidebar shell-tablet-sidebar">
        <div className="shell-sidebar-header">
          <span className="shell-eyebrow">ME</span>
          <h2 className="shell-title">{title}</h2>
          <p className="shell-copy">{copy}</p>
        </div>

        <div className="shell-inline-chip shell-inline-chip--wide">
          <Building2 size={16} />
          <span>Manager Tenant</span>
          <ChevronRight size={14} />
        </div>

        <div className="chrome-list">
          <div className="chrome-item">
            <span>Left Sidebar</span>
            <span>Ready</span>
          </div>
          <div className="chrome-item">
            <span>Split View</span>
            <span>Contextual</span>
          </div>
          <div className="chrome-item">
            <span>Drawer State</span>
            <span>Reserved</span>
          </div>
        </div>

        <div className="shell-vertical-stack">
          <div className="shell-side-link shell-side-link--active">
            <LayoutPanelLeft size={16} />
            <span>Workspace</span>
          </div>
          <div className="shell-side-link">
            <Split size={16} />
            <span>Review Queue</span>
          </div>
          <div className="shell-side-link">
            <ShieldCheck size={16} />
            <span>Approvals</span>
          </div>
        </div>
      </aside>

      <div className="shell-column shell-tablet-main">
        <header className="shell-header shell-tablet-toolbar">
          <div>
            <span className="shell-eyebrow">Tablet Workspace</span>
            <h2 className="shell-title">Manager View</h2>
          </div>
          <div className="shell-toolbar-cluster">
            <div className="shell-search-placeholder shell-search-placeholder--toolbar">
              <Search size={16} />
              <span>Global search placeholder</span>
            </div>
            <div className="shell-inline-chip shell-inline-chip--success">
              <Activity size={16} />
              <span>API Health</span>
            </div>
            <button className="shell-icon-button" type="button" aria-label="Notifications placeholder">
              <Bell size={18} />
            </button>
          </div>
        </header>

        <div className="shell-tablet-workspace">
          <div className="shell-pane shell-tablet-canvas">
            <div className="shell-content-intro">
              <p className="shell-copy">{copy}</p>
              <span className="shell-badge">768-1199px split workspace</span>
            </div>
            <div className="shell-content-slot">{children}</div>
          </div>

          <aside className="shell-pane shell-context-drawer">
            <div className="shell-panel-heading">
              <span className="shell-eyebrow">Context Drawer</span>
              <h3 className="shell-title">Review Context</h3>
            </div>
            <div className="chrome-list">
              <div className="chrome-item">
                <span>Right Drawer</span>
                <span>Ready</span>
              </div>
              <div className="chrome-item">
                <span>Alerts</span>
                <span>Placeholder</span>
              </div>
              <div className="chrome-item">
                <span>Recent Actions</span>
                <span>Reserved</span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
