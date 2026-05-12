import { Suspense } from "react";
import { OutletExecutionCommandCenter } from "@/components/tasks/outlet-execution-command-center";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <OutletExecutionCommandCenter />
    </Suspense>
  );
}
