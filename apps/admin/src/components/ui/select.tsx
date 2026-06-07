import type { SelectHTMLAttributes } from 'react';

import { cn } from '@/lib/utils/cn';

type SelectProps = SelectHTMLAttributes<HTMLSelectElement>;

export function Select({ className, ...props }: SelectProps) {
  return (
    <select
      className={cn(
        'h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/20',
        className,
      )}
      {...props}
    />
  );
}
