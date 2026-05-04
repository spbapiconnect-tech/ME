import type { ReactNode } from "react";

interface MobileShellProps {
  children: ReactNode;
  title: string;
  copy: string;
}

export function MobileShell({ children, title, copy }: MobileShellProps) {
  return (
    <section className="shell-layout shell-mobile">
      <header className="shell-header">
        <div>
          <h2 className="shell-title">{title}</h2>
          <p className="shell-copy">{copy}</p>
        </div>
        <div className="shell-badge">375-767px</div>
      </header>
      <div className="shell-pane">{children}</div>
      <footer className="shell-footer">
        <div className="chrome-list">
          <div className="chrome-item">
            <span>Top Bar</span>
            <span>Ready</span>
          </div>
          <div className="chrome-item">
            <span>Bottom Navigation</span>
            <span>Placeholder</span>
          </div>
          <div className="chrome-item">
            <span>Floating Action</span>
            <span>Reserved</span>
          </div>
        </div>
      </footer>
    </section>
  );
}
