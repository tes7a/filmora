import type { ReactNode } from 'react';
import Link from 'next/link';

import { BrandMark } from '../atoms/brand-mark';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Separator } from '../ui/separator';

type AuthShellProps = {
  title: string;
  description: string;
  children: ReactNode;
  footer?: ReactNode;
};

export function AuthShell({ title, description, children, footer }: AuthShellProps) {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(249,115,22,0.18),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(14,165,233,0.14),_transparent_28%),linear-gradient(180deg,#fff7ed_0%,#f8fafc_45%,#e2e8f0_100%)] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-6xl flex-col justify-center gap-6">
        <div className="flex items-center justify-between rounded-3xl border border-white/60 bg-white/70 px-4 py-4 shadow-[0_18px_60px_rgba(15,23,42,0.06)] backdrop-blur">
          <BrandMark />
          <Link
            className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
            href="/"
          >
            Back to home
          </Link>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(360px,0.75fr)] lg:items-center">
          <section className="grid gap-4">
            <Badge variant="secondary" className="w-fit rounded-full px-3 py-1">
              Account access
            </Badge>
            <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
              {title}
            </h1>
            <p className="max-w-2xl text-base leading-7 text-slate-600">{description}</p>

            <Card className="border-slate-200/80 bg-white/80">
              <CardHeader className="space-y-2 pb-4">
                <CardTitle className="text-lg">What you get</CardTitle>
                <CardDescription>
                  A cleaner form surface, shared button/input primitives, and room for
                  future auth states.
                </CardDescription>
              </CardHeader>
              <Separator />
              <CardContent className="grid gap-3 pt-4 text-sm text-slate-600">
                <p>
                  • Consistent form controls across login, register, and recovery screens.
                </p>
                <p>• Tailwind v4 + shadcn-compatible primitives in the web app.</p>
                <p>• Ready for email confirmation and password reset endpoints.</p>
              </CardContent>
            </Card>
          </section>

          <Card className="overflow-hidden border-slate-200/80 bg-white/90">
            <div className="h-1 bg-gradient-to-r from-orange-400 via-amber-300 to-sky-400" />
            <CardHeader className="space-y-2 pb-4">
              <CardTitle className="text-2xl">{title}</CardTitle>
              <CardDescription className="text-sm leading-6 text-slate-600">
                {description}
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">{children}</CardContent>
          </Card>
        </div>

        {footer ? <div className="text-center">{footer}</div> : null}
      </div>
    </main>
  );
}
