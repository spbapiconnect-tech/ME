interface LoadingStateProps {
  variant?: "compact" | "card" | "table";
}

export function LoadingState({ variant = "card" }: LoadingStateProps) {
  const blocks = variant === "table" ? 6 : variant === "compact" ? 3 : 4;

  return (
    <div className="me-state-card me-loading-state" data-variant={variant}>
      {Array.from({ length: blocks }).map((_, index) => (
        <div key={index} className="me-skeleton-block" />
      ))}
    </div>
  );
}
