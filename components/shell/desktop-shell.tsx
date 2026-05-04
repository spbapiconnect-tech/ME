import type { ReactNode } from "react";

interface DesktopShellProps {
  children: ReactNode;
  title: string;
  copy: string;
}

export function DesktopShell({ children, title, copy }: DesktopShellProps) {
  return (
    <section className="shell-layout shell-desktop">
      <aside className="shell-sidebar">
        <h2 className="shell-title">{title}</h2>
        <p className="shell-copy">{copy}</p>
        <div className="chrome-list">
          <div className="chrome-item">
            <span>Global Sidebar</span>
            <span>Ready</span>
          </div>
          <div className="chrome-item">
            <span>Module Tabs</span>
            <span>Placeholder</span>
          </div>
          <div className="chrome-item">
            <span>Filter Bar</span>
            <span>Reserved</span>
          </div>
        </div>
      </aside>
      <div className="shell-column">
        <header className="shell-header">
          <div>
            <h2 className="shell-title">Enterprise Workspace</h2>
            <p className="shell-copy">1181px and above</p>
          </div>
          <div className="shell-badge">Desktop</div>
        </header>
        <div className="shell-pane">{children}</div>
      </div>
      <aside className="shell-sidebar desktop-right-rail">
        <h2 className="shell-title">Operations Rail</h2>
        <p className="shell-copy">Analytics, settings, and detail panes stay modular.</p>
        <div className="chrome-list">
          <div className="chrome-item">
            <span>Detail Drawer</span>
            <span>Reserved</span>
          </div>
          <div className="chrome-item">
            <span>Settings Panel</span>
            <span>Reserved</span>
          </div>
          <div className="chrome-item">
            <span>Bulk Action Bar</span>
            <span>Reserved</span>
          </div>
        </div>
      </aside>
    </section>
  );
}
