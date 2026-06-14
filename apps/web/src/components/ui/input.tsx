import type { InputHTMLAttributes } from 'react';

import { cn } from '../../lib/utils/cn';

type InputProps = InputHTMLAttributes<HTMLInputElement>;

function Input({ className, type = 'text', ...props }: InputProps) {
  return (
    <input
      type={type}
      className={cn(
        'flex h-11 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-950 shadow-sm outline-none transition-colors placeholder:text-slate-400 focus:border-slate-300 focus:ring-4 focus:ring-slate-950/5 disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...props}
    />
  );
}

export { Input };
