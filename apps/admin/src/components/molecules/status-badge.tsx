import { cn } from '@/lib/utils/cn';

type StatusBadgeProps = {
  value: string;
  tone?: 'neutral' | 'success' | 'warning' | 'danger' | 'info';
};

const toneClasses: Record<NonNullable<StatusBadgeProps['tone']>, string> = {
  neutral: 'border-slate-200 bg-slate-100 text-slate-700',
  success: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  warning: 'border-amber-200 bg-amber-50 text-amber-700',
  danger: 'border-rose-200 bg-rose-50 text-rose-700',
  info: 'border-sky-200 bg-sky-50 text-sky-700',
};

export function StatusBadge({ value, tone = 'neutral' }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium capitalize',
        toneClasses[tone],
      )}
    >
      {value}
    </span>
  );
}
