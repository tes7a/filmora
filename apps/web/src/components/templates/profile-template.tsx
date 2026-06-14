import type { AuthMeUser } from '../../types/auth';
import { Button } from '../atoms/button';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { ListsManager } from '../organisms/lists-manager';
import { SiteHeader } from '../organisms/site-header';
import type { UserList } from '../../types/api';

type ProfileTemplateProps = {
  user: AuthMeUser;
  lists: UserList[];
  accessToken: string;
  onLogout: () => void | Promise<void>;
  loggingOut?: boolean;
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(value));
}

export function ProfileTemplate({
  user,
  lists,
  accessToken,
  onLogout,
  loggingOut = false,
}: ProfileTemplateProps) {
  const totalItems = lists.reduce((sum, list) => sum + list.items.length, 0);
  const customLists = lists.filter((list) => list.type === 'custom');
  const systemLists = lists.filter((list) => list.type !== 'custom');
  const recentItems = lists
    .flatMap((list) =>
      list.items.map((item) => ({
        ...item,
        listName: list.name,
        listType: list.type,
      })),
    )
    .sort((left, right) => right.createdAt.localeCompare(left.createdAt))
    .slice(0, 6);

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(249,115,22,0.16),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(14,165,233,0.12),_transparent_28%),linear-gradient(180deg,#fff7ed_0%,#f8fafc_45%,#e2e8f0_100%)]">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <SiteHeader />

        <Card className="overflow-hidden border-slate-200/80 bg-white/90">
          <div className="h-1.5 bg-gradient-to-r from-orange-400 via-amber-300 to-sky-400" />
          <CardHeader className="space-y-3 p-6 sm:p-8">
            <Badge variant="secondary" className="w-fit rounded-full px-3 py-1">
              Account
            </Badge>
            <CardTitle className="text-3xl sm:text-4xl">Profile</CardTitle>
            <p className="max-w-3xl text-sm leading-6 text-slate-600 sm:text-base">
              Current authenticated session loaded from the API.
            </p>
          </CardHeader>
        </Card>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Card className="border-slate-200/80 bg-white/90">
            <CardHeader className="space-y-1">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Lists</p>
              <CardTitle className="text-2xl">{lists.length}</CardTitle>
              <p className="text-sm text-slate-600">All your collections.</p>
            </CardHeader>
          </Card>
          <Card className="border-slate-200/80 bg-white/90">
            <CardHeader className="space-y-1">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Items</p>
              <CardTitle className="text-2xl">{totalItems}</CardTitle>
              <p className="text-sm text-slate-600">Films saved across lists.</p>
            </CardHeader>
          </Card>
          <Card className="border-slate-200/80 bg-white/90">
            <CardHeader className="space-y-1">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Custom</p>
              <CardTitle className="text-2xl">{customLists.length}</CardTitle>
              <p className="text-sm text-slate-600">Your editable lists.</p>
            </CardHeader>
          </Card>
          <Card className="border-slate-200/80 bg-white/90">
            <CardHeader className="space-y-1">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500">System</p>
              <CardTitle className="text-2xl">{systemLists.length}</CardTitle>
              <p className="text-sm text-slate-600">Watchlist and watched.</p>
            </CardHeader>
          </Card>
        </div>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
          <Card className="border-slate-200/80 bg-white/90">
            <CardHeader className="space-y-2">
              <CardTitle className="text-xl">Recent activity</CardTitle>
              <p className="text-sm leading-6 text-slate-600">
                Latest items saved into your lists.
              </p>
            </CardHeader>
            <CardContent className="grid gap-3">
              {recentItems.length ? (
                recentItems.map((item) => (
                  <div
                    key={item.id}
                    className="grid gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="text-sm font-medium text-slate-950">
                        {item.note ?? item.filmId}
                      </p>
                      <Badge
                        variant={item.listType === 'custom' ? 'secondary' : 'accent'}
                        className="rounded-full px-3 py-1"
                      >
                        {item.listName}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                      <span className="font-mono">{item.filmId}</span>
                      <span>{formatDate(item.createdAt)}</span>
                      {item.position !== null ? (
                        <span>Position {item.position}</span>
                      ) : null}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-600">No recent list activity.</p>
              )}
            </CardContent>
          </Card>

          <Card className="border-slate-200/80 bg-white/90">
            <CardHeader className="space-y-2">
              <CardTitle className="text-xl">Quick actions</CardTitle>
              <p className="text-sm leading-6 text-slate-600">
                Common destinations while browsing the catalog.
              </p>
            </CardHeader>
            <CardContent className="grid gap-3">
              <Button href="/films" variant="outline" className="w-full justify-start">
                Browse films
              </Button>
              <Button href="/" variant="outline" className="w-full justify-start">
                Back to home
              </Button>
              <Button href="/films" variant="ghost" className="w-full justify-start">
                Open catalog
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
          <Card className="border-slate-200/80 bg-white/90">
            <CardHeader className="space-y-2">
              <CardTitle className="text-xl">Identity</CardTitle>
              <p className="text-sm leading-6 text-slate-600">
                User identity and session state.
              </p>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid gap-1">
                <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Name</p>
                <p className="text-lg font-semibold text-slate-950">{user.displayName}</p>
              </div>
              <div className="grid gap-1">
                <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
                  Email
                </p>
                <p className="text-sm text-slate-700">{user.email}</p>
              </div>
              <div className="grid gap-2">
                <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
                  Roles
                </p>
                <div className="flex flex-wrap gap-2">
                  {user.roles.map((role) => (
                    <Badge
                      key={role}
                      variant="outline"
                      className="rounded-full px-3 py-1"
                    >
                      {role}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="grid gap-1">
                <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
                  Status
                </p>
                <Badge
                  variant={
                    user.status === 'active'
                      ? 'default'
                      : user.status === 'blocked'
                        ? 'accent'
                        : 'secondary'
                  }
                  className="w-fit rounded-full px-3 py-1"
                >
                  {user.status}
                </Badge>
              </div>
              <div className="grid gap-1">
                <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
                  User ID
                </p>
                <p className="break-all font-mono text-sm text-slate-600">{user.id}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200/80 bg-white/90">
            <CardHeader className="space-y-2">
              <CardTitle className="text-xl">Session actions</CardTitle>
              <p className="text-sm leading-6 text-slate-600">
                Logout clears the local session and invalidates refresh cookie on the API.
              </p>
            </CardHeader>
            <CardContent className="grid gap-4">
              <Button
                type="button"
                variant="outline"
                className="w-full"
                disabled={loggingOut}
                onClick={() => void onLogout()}
              >
                {loggingOut ? 'Signing out...' : 'Logout'}
              </Button>
              <p className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-600">
                If the token becomes invalid, you will be redirected back to the login
                screen.
              </p>
            </CardContent>
          </Card>
        </div>

        <ListsManager accessToken={accessToken} initialLists={lists} />
      </div>
    </main>
  );
}
