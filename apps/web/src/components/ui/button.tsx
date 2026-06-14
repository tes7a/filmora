import type { ButtonHTMLAttributes, ReactNode } from 'react';
import Link from 'next/link';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '../../lib/utils/cn';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950/15 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-slate-950 text-white shadow-sm hover:bg-slate-800',
        secondary: 'bg-slate-100 text-slate-900 hover:bg-slate-200',
        outline: 'border border-slate-200 bg-white text-slate-900 hover:bg-slate-50',
        ghost: 'bg-transparent text-slate-700 hover:bg-slate-100 hover:text-slate-950',
        link: 'bg-transparent text-slate-900 underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-11 px-5 py-3',
        sm: 'h-9 rounded-full px-4',
        lg: 'h-12 rounded-full px-6 text-base',
        icon: 'h-10 w-10 rounded-full',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
    href?: string;
    children: ReactNode;
  };

export function Button({
  asChild = false,
  className,
  variant,
  size,
  href,
  children,
  type,
  ...props
}: ButtonProps) {
  const classes = cn(buttonVariants({ variant, size }), className);

  if (href) {
    return (
      <Link className={classes} href={href}>
        {children}
      </Link>
    );
  }

  const Comp = asChild ? Slot : 'button';

  return (
    <Comp className={classes} type={type ?? 'button'} {...props}>
      {children}
    </Comp>
  );
}

export { buttonVariants };
