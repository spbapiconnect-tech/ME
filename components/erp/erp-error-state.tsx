import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function ErpErrorState({
  title,
  description,
  retryLabel,
  onRetry,
}: {
  title: string;
  description?: string;
  retryLabel?: string;
  onRetry?: () => void;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm text-destructive">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-start gap-3 text-sm text-muted-foreground">
        {description ? <p>{description}</p> : null}
        {retryLabel && onRetry ? (
          <Button size="sm" variant="outline" onClick={onRetry}>
            {retryLabel}
          </Button>
        ) : null}
      </CardContent>
    </Card>
  );
}
