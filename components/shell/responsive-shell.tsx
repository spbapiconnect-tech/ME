"use client";

import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";

import { DesktopShell } from "@/components/shell/desktop-shell";
import { MobileShell } from "@/components/shell/mobile-shell";
import { TabletShell } from "@/components/shell/tablet-shell";

interface ResponsiveShellProps {
  children: ReactNode;
  labels: {
    mobile: string;
    tablet: string;
    desktop: string;
    mobileCopy: string;
    tabletCopy: string;
    desktopCopy: string;
  };
}

type ViewportMode = "mobile" | "tablet" | "desktop";

function getViewportMode(width: number): ViewportMode {
  if (width < 768) {
    return "mobile";
  }

  if (width < 1181) {
    return "tablet";
  }

  return "desktop";
}

export function ResponsiveShell({ children, labels }: ResponsiveShellProps) {
  const [viewport, setViewport] = useState<ViewportMode>("desktop");

  useEffect(() => {
    const updateViewport = () => setViewport(getViewportMode(window.innerWidth));

    updateViewport();
    window.addEventListener("resize", updateViewport);

    return () => window.removeEventListener("resize", updateViewport);
  }, []);

  const shell = useMemo(() => {
    if (viewport === "mobile") {
      return (
        <MobileShell title={labels.mobile} copy={labels.mobileCopy}>
          {children}
        </MobileShell>
      );
    }

    if (viewport === "tablet") {
      return (
        <TabletShell title={labels.tablet} copy={labels.tabletCopy}>
          {children}
        </TabletShell>
      );
    }

    return (
      <DesktopShell title={labels.desktop} copy={labels.desktopCopy}>
        {children}
      </DesktopShell>
    );
  }, [children, labels, viewport]);

  return <>{shell}</>;
}
