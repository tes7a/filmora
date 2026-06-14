import type { HTMLAttributes } from 'react';

import { cn } from '../../lib/utils/cn';

type SeparatorProps = HTMLAttributes<HTMLHRElement> & {
  orientation?: 'horizontal' | 'vertical';
};

function Separator({ className, orientation = 'horizontal', ...props }: SeparatorProps) {
  return (
    <hr
      className={cn(
        orientation === 'horizontal' ? 'h-px w-full' : 'h-full w-px',
        'border-0 bg-slate-200',
        className,
      )}
      {...props}
    />
  );
}

export { Separator };
