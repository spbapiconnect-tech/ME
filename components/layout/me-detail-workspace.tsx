import type { ReactNode } from "react";

export function MeDetailWorkspace({
  main,
  context,
}: {
  main: ReactNode;
  context?: ReactNode;
}) {
  return (
    <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_18rem] 2xl:grid-cols-[minmax(0,1fr)_19rem] 2xl:gap-4">
      <div className="grid gap-3 xl:gap-4">{main}</div>
      {context ? <div className="grid gap-4">{context}</div> : null}
    </div>
  );
}
