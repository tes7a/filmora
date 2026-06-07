import { Link } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

type AdminSectionTemplateProps = {
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
};

export function AdminSectionTemplate({
  title,
  description,
  actionLabel,
  actionHref,
}: AdminSectionTemplateProps) {
  return (
    <section className="grid gap-4 sm:gap-6">
      <div className="flex flex-col gap-3 sm:gap-4 md:flex-row md:items-end md:justify-between">
        <div className="grid gap-2">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
            Admin module
          </p>
          <h2 className="text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
            {title}
          </h2>
          <p className="max-w-2xl text-sm text-slate-600">{description}</p>
        </div>

        {actionLabel && actionHref ? (
          <Button asChild variant="secondary">
            <Link to={actionHref}>{actionLabel}</Link>
          </Button>
        ) : null}
      </div>

      <Card className="overflow-hidden">
        <CardHeader className="space-y-1.5">
          <CardTitle>{title} workspace</CardTitle>
          <CardDescription>
            This section is wired into the admin shell and ready for API-backed tables.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 px-4 pb-4 text-sm text-slate-600 sm:px-6 sm:pb-6">
          <p>This section is ready for live filters, tables, and CRUD flows.</p>
        </CardContent>
      </Card>
    </section>
  );
}
