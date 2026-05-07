"use client";

import { ReactNode } from "react";
import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";

export function MainShell({ children }: { children: ReactNode }) {
  return (
    <div className="app-shell">
      <Sidebar />
      <div className="content-area">
        <Topbar />
        <main className="main-content">
          {children}
        </main>
      </div>
    </div>
  );
}
