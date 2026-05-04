"use client";

import type { ReactNode } from "react";
import { useMemo, useSyncExternalStore } from "react";

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

const MOBILE_QUERY = "(max-width: 767px)";
const TABLET_QUERY = "(min-width: 768px) and (max-width: 1199px)";

function getViewportMode(): ViewportMode {
  if (typeof window === "undefined") {
    return "desktop";
  }

  if (window.matchMedia(MOBILE_QUERY).matches) {
    return "mobile";
  }

  if (window.matchMedia(TABLET_QUERY).matches) {
    return "tablet";
  }

  return "desktop";
}

function subscribe(onStoreChange: () => void) {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  const mobileMedia = window.matchMedia(MOBILE_QUERY);
  const tabletMedia = window.matchMedia(TABLET_QUERY);

  mobileMedia.addEventListener("change", onStoreChange);
  tabletMedia.addEventListener("change", onStoreChange);
  window.addEventListener("resize", onStoreChange);

  return () => {
    mobileMedia.removeEventListener("change", onStoreChange);
    tabletMedia.removeEventListener("change", onStoreChange);
    window.removeEventListener("resize", onStoreChange);
  };
}

function getServerSnapshot(): ViewportMode {
  return "desktop";
}

export function ResponsiveShell({ children, labels }: ResponsiveShellProps) {
  const viewport = useSyncExternalStore(subscribe, getViewportMode, getServerSnapshot);

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

  return <div data-shell-mode={viewport}>{shell}</div>;
}
