import type { ReactNode } from "react";

interface TabletShellProps {
  children: ReactNode;
  title: string;
  copy: string;
}

export function TabletShell({ children, title, copy }: TabletShellProps) {
  return (
    <section className="shell-layout shell-tablet">
      <aside className="shell-sidebar">
        <h2 className="shell-title">{title}</h2>
        <p className="shell-copy">{copy}</p>
        <div className="chrome-list">
          <div className="chrome-item">
            <span>Left Sidebar</span>
            <span>Ready</span>
          </div>
          <div className="chrome-item">
            <span>Global Search</span>
            <span>Placeholder</span>
          </div>
          <div className="chrome-item">
            <span>Context Drawer</span>
            <span>Reserved</span>
          </div>
        </div>
      </aside>
      <div className="shell-column">
        <header className="shell-header">
          <div>
            <h2 className="shell-title">Adaptive Workspace</h2>
            <p className="shell-copy">768-1180px</p>
          </div>
          <div className="shell-badge">Tablet</div>
        </header>
        <div className="shell-pane">{children}</div>
      </div>
    </section>
  );
}
