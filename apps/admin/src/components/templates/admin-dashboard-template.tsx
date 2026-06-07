import { Link } from 'react-router-dom';

import { adminNavigation } from '@/constants/admin-navigation';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { StatCard } from '@/components/molecules/stat-card';

export function AdminDashboardTemplate() {
  return (
    <section className="grid gap-4 sm:gap-6">
      <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
        <div className="grid gap-2">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
            Admin overview
          </p>
          <h2 className="text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
            Control all content and moderation from one place
          </h2>
          <p className="max-w-2xl text-sm text-slate-600">
            Use the sidebar to manage users, films, taxonomy, and moderation queues.
          </p>
        </div>

        <Button asChild variant="default" className="w-full sm:w-auto">
          <Link to="/admin/users">Open users</Link>
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Users"
          value="7"
          description="Seeded admin accounts and test users"
        />
        <StatCard
          label="Films"
          value="8"
          description="Moderation-ready content catalog"
        />
        <StatCard
          label="Reports"
          value="3"
          description="Complaints and moderation actions"
        />
        <StatCard
          label="Taxonomy"
          value="4"
          description="Genres, tags, countries, persons"
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.25fr)_minmax(320px,0.75fr)]">
        <Card className="overflow-hidden">
          <CardHeader className="space-y-1.5">
            <CardTitle>Quick actions</CardTitle>
            <CardDescription>Jump into the most common admin workflows.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 px-4 pb-4 sm:px-6 sm:pb-6">
            {adminNavigation.slice(1, 5).map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="flex flex-col gap-1 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-900 transition-colors hover:bg-slate-100 sm:flex-row sm:items-center sm:justify-between"
              >
                <span>{item.label}</span>
                <span className="text-xs text-slate-500">{item.description}</span>
              </Link>
            ))}
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardHeader className="space-y-1.5">
            <CardTitle>Session</CardTitle>
            <CardDescription>Current admin session status.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 px-4 pb-4 text-sm text-slate-600 sm:px-6 sm:pb-6">
            <p>This shell is ready for protected admin routes.</p>
            <p>The dashboard and section routes are wired to live admin modules.</p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
