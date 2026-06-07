import { LogOut, Menu } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/auth.store';

import { AdminSidebar } from './admin-sidebar';

function getPageTitle(pathname: string): string {
  if (pathname === '/admin') return 'Dashboard';
  if (pathname.startsWith('/admin/users')) return 'Users';
  if (pathname.startsWith('/admin/films')) return 'Films';
  if (pathname.startsWith('/admin/genres')) return 'Genres';
  if (pathname.startsWith('/admin/tags')) return 'Tags';
  if (pathname.startsWith('/admin/countries')) return 'Countries';
  if (pathname.startsWith('/admin/persons')) return 'Persons';
  if (pathname.startsWith('/admin/complaints')) return 'Complaints';
  if (pathname.startsWith('/admin/moderation')) return 'Moderation';

  return 'Admin';
}

export function AdminShell() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);

  const pageTitle = useMemo(() => getPageTitle(location.pathname), [location.pathname]);

  async function handleLogout() {
    await logout();
    navigate('/login', { replace: true });
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(15,23,42,0.08),_transparent_38%),linear-gradient(180deg,#f8fafc_0%,#e2e8f0_100%)] text-slate-950">
      <div className="grid min-h-screen lg:grid-cols-[300px_minmax(0,1fr)]">
        <div className="hidden lg:block">
          <AdminSidebar />
        </div>

        {mobileNavOpen ? (
          <div className="fixed inset-0 z-40 lg:hidden">
            <button
              aria-label="Close navigation"
              className="absolute inset-0 bg-slate-950/40"
              type="button"
              onClick={() => setMobileNavOpen(false)}
            />
            <div className="absolute left-0 top-0 h-full w-[280px] max-w-[88vw] shadow-2xl">
              <AdminSidebar onNavigate={() => setMobileNavOpen(false)} />
            </div>
          </div>
        ) : null}

        <div className="flex min-w-0 flex-col">
          <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/75 backdrop-blur">
            <div className="flex items-center justify-between gap-3 px-3 py-3 sm:px-6 lg:px-8">
              <div className="flex items-center gap-3">
                <button
                  aria-label="Open navigation"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-900 lg:hidden"
                  type="button"
                  onClick={() => setMobileNavOpen(true)}
                >
                  <Menu className="h-4 w-4" />
                </button>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.26em] text-slate-500">
                    {pageTitle}
                  </p>
                  <h1 className="text-lg font-semibold sm:text-xl">{pageTitle}</h1>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="hidden text-right sm:block">
                  <p className="text-sm font-medium text-slate-950">
                    {user?.displayName ?? 'Admin user'}
                  </p>
                  <p className="text-xs text-slate-500">{user?.email ?? 'Signed in'}</p>
                </div>
                <Button variant="secondary" onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span className="hidden sm:inline">Logout</span>
                </Button>
              </div>
            </div>
          </header>

          <main className="flex-1 px-3 py-4 sm:px-6 sm:py-6 lg:px-8">
            <div className="mx-auto w-full max-w-7xl">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
