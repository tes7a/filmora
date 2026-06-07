import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

type AdminEmptyStateProps = {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
};

export function AdminEmptyState({
  title,
  description,
  actionLabel,
  onAction,
}: AdminEmptyStateProps) {
  return (
    <Card className="border-dashed border-slate-200 bg-white/70 shadow-none">
      <CardContent className="grid gap-4 p-6 text-center">
        <div className="grid gap-2">
          <h3 className="text-lg font-semibold text-slate-950">{title}</h3>
          <p className="text-sm text-slate-600">{description}</p>
        </div>
        {actionLabel && onAction ? (
          <div>
            <Button variant="secondary" onClick={onAction}>
              {actionLabel}
            </Button>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
