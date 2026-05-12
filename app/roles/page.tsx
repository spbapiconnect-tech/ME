"use client";

import { ModulePageShell } from "@/components/module/module-page-shell";
import { modulePages } from "@/components/module/module-pages";

export default function Page() {
  return <ModulePageShell moduleKey="roles" config={modulePages["roles"]} />;
}
