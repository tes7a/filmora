import { Card, CardContent } from '@/components/ui/card';

type StatCardProps = {
  label: string;
  value: string;
  description: string;
};

export function StatCard({ label, value, description }: StatCardProps) {
  return (
    <Card className="border-slate-200 bg-white/90 shadow-sm">
      <CardContent className="grid gap-2 p-4 sm:p-5">
        <p className="text-xs font-medium uppercase tracking-[0.24em] text-slate-500">
          {label}
        </p>
        <p className="text-2xl font-semibold text-slate-950 sm:text-3xl">{value}</p>
        <p className="text-sm text-slate-600">{description}</p>
      </CardContent>
    </Card>
  );
}
