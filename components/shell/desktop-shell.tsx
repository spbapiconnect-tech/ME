import type { ReactNode } from "react";

import {
  Bell,
  Blend,
  LayoutGrid,
  PanelRightClose,
  Search,
  Settings2,
  Sparkles,
  Workflow,
} from "lucide-react";

interface DesktopShellProps {
  children: ReactNode;
  title: string;
  copy: string;
}

export function DesktopShell({ children, title, copy }: DesktopShellProps) {
  return (
    <section className="shell-layout shell-desktop">
      <aside className="shell-sidebar shell-desktop-sidebar">
        <div className="shell-sidebar-header">
          <span className="shell-eyebrow">ME</span>
          <h2 className="shell-title">{title}</h2>
          <p className="shell-copy">{copy}</p>
        </div>

        <div className="shell-vertical-stack">
          <div className="shell-side-link shell-side-link--active">
            <LayoutGrid size={16} />
            <span>Global Sidebar</span>
          </div>
          <div className="shell-side-link">
            <Workflow size={16} />
            <span>Operations Console</span>
          </div>
          <div className="shell-side-link">
            <Blend size={16} />
            <span>Workspace Layers</span>
          </div>
        </div>

        <div className="chrome-list">
          <div className="chrome-item">
            <span>Navigation</span>
            <span>Stable</span>
          </div>
          <div className="chrome-item">
            <span>Module Rails</span>
            <span>Placeholder</span>
          </div>
          <div className="chrome-item">
            <span>Admin Density</span>
            <span>Prepared</span>
          </div>
        </div>
      </aside>

      <div className="shell-column shell-desktop-main">
        <header className="shell-header shell-desktop-header">
          <div>
            <span className="shell-eyebrow">Desktop Console</span>
            <h2 className="shell-title">Enterprise Workspace</h2>
          </div>
          <div className="shell-toolbar-cluster">
            <div className="shell-search-placeholder shell-search-placeholder--toolbar">
              <Search size={16} />
              <span>Search modules, records, and issues</span>
            </div>
            <button className="shell-icon-button" type="button" aria-label="Notifications placeholder">
              <Bell size={18} />
            </button>
            <button className="shell-icon-button" type="button" aria-label="Settings placeholder">
              <Settings2 size={18} />
            </button>
          </div>
        </header>

        <div className="shell-module-tabs" aria-label="Module tabs placeholder">
          <button className="shell-tab shell-tab--active" type="button">Overview</button>
          <button className="shell-tab" type="button">Workspace</button>
          <button className="shell-tab" type="button">Operations</button>
          <button className="shell-tab" type="button">Insights</button>
        </div>

        <div className="shell-pane shell-bulk-bar">
          <div className="shell-bulk-summary">
            <Sparkles size={16} />
            <span>Bulk action bar placeholder for future admin workflows</span>
          </div>
          <div className="shell-inline-actions">
            <span className="shell-badge">Review</span>
            <span className="shell-badge">Assign</span>
            <span className="shell-badge">Export</span>
          </div>
        </div>

        <div className="shell-pane shell-desktop-canvas">
          <div className="shell-content-intro">
            <p className="shell-copy">{copy}</p>
            <span className="shell-badge">1200px+ data canvas</span>
          </div>
          <div className="shell-content-slot">{children}</div>
        </div>
      </div>

      <aside className="shell-sidebar shell-right-panel desktop-right-rail">
        <div className="shell-panel-heading">
          <span className="shell-eyebrow">Right Panel</span>
          <h3 className="shell-title">Admin Context</h3>
        </div>
        <div className="chrome-list">
          <div className="chrome-item">
            <span>Panel State</span>
            <span>Ready</span>
          </div>
          <div className="chrome-item">
            <span>Detail Drawer</span>
            <span>Placeholder</span>
          </div>
          <div className="chrome-item">
            <span>Settings View</span>
            <span>Reserved</span>
          </div>
        </div>
        <div className="shell-inline-chip shell-inline-chip--wide">
          <PanelRightClose size={16} />
          <span>Right-side workspace utilities</span>
        </div>
      </aside>
    </section>
  );
}
