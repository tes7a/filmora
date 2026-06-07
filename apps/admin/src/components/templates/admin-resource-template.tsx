import type { ReactNode } from 'react';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

type AdminResourceTemplateProps = {
  title: string;
  description: string;
  summary?: ReactNode;
  children: ReactNode;
};

export function AdminResourceTemplate({
  title,
  description,
  summary,
  children,
}: AdminResourceTemplateProps) {
  return (
    <section className="grid gap-4 sm:gap-6">
      <div className="grid gap-2">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
          Admin module
        </p>
        <h2 className="text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
          {title}
        </h2>
        <p className="max-w-2xl text-sm text-slate-600">{description}</p>
      </div>

      {summary}

      <Card className="overflow-hidden">
        <CardHeader className="space-y-1.5">
          <CardTitle>{title} records</CardTitle>
          <CardDescription>Live data loaded from the admin API.</CardDescription>
        </CardHeader>
        <CardContent className="px-4 pb-4 sm:px-6 sm:pb-6">{children}</CardContent>
      </Card>
    </section>
  );
}
