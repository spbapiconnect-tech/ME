import type { ReactNode } from "react";

export function MeDetailWorkspace({
  main,
  context,
}: {
  main: ReactNode;
  context?: ReactNode;
}) {
  return (
    <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_18.5rem]">
      <div className="grid gap-4">{main}</div>
      {context ? <div className="grid gap-4">{context}</div> : null}
    </div>
  );
}
