import { type ReactNode, useEffect } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';

import { AdminShell } from '@/components/organisms/admin-shell';
import { LoginPage } from '@/pages/login/ui/login-page';
import { ComplaintsPage } from '@/pages/admin/complaints/ui/complaints-page';
import { CountriesPage } from '@/pages/admin/countries/ui/countries-page';
import { DashboardPage } from '@/pages/admin/dashboard/ui/dashboard-page';
import { FilmsPage } from '@/pages/admin/films/ui/films-page';
import { GenresPage } from '@/pages/admin/genres/ui/genres-page';
import { ModerationPage } from '@/pages/admin/moderation/ui/moderation-page';
import { PersonsPage } from '@/pages/admin/persons/ui/persons-page';
import { TagsPage } from '@/pages/admin/tags/ui/tags-page';
import { UsersPage } from '@/pages/admin/users/ui/users-page';
import { useAuthStore } from '@/store/auth.store';

function AuthBootstrap() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const user = useAuthStore((state) => state.user);
  const fetchMe = useAuthStore((state) => state.fetchMe);

  useEffect(() => {
    if (accessToken && !user) {
      void fetchMe();
    }
  }, [accessToken, fetchMe, user]);

  return null;
}

function PublicRoute({ children }: { children: ReactNode }) {
  const accessToken = useAuthStore((state) => state.accessToken);
  const user = useAuthStore((state) => state.user);
  const status = useAuthStore((state) => state.status);

  if (status === 'loading' && accessToken) {
    return <RouteLoader />;
  }

  if (accessToken && user) {
    return <Navigate replace to="/admin" />;
  }

  return children;
}

function ProtectedRoute({ children }: { children: ReactNode }) {
  const accessToken = useAuthStore((state) => state.accessToken);
  const user = useAuthStore((state) => state.user);
  const status = useAuthStore((state) => state.status);
  const location = useLocation();

  if (status === 'loading' && accessToken) {
    return <RouteLoader />;
  }

  if (!accessToken || !user) {
    return <Navigate replace state={{ from: location }} to="/login" />;
  }

  return children;
}

function RouteLoader() {
  return (
    <div className="grid min-h-screen place-items-center bg-slate-950 text-white">
      <p className="text-sm uppercase tracking-[0.3em] text-slate-300">
        Loading admin shell
      </p>
    </div>
  );
}

export function App() {
  return (
    <BrowserRouter>
      <AuthBootstrap />
      <Routes>
        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminShell />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="films" element={<FilmsPage />} />
          <Route path="genres" element={<GenresPage />} />
          <Route path="tags" element={<TagsPage />} />
          <Route path="countries" element={<CountriesPage />} />
          <Route path="persons" element={<PersonsPage />} />
          <Route path="complaints" element={<ComplaintsPage />} />
          <Route path="moderation" element={<ModerationPage />} />
        </Route>
        <Route
          path="*"
          element={
            <Navigate
              replace
              to={useAuthStore.getState().accessToken ? '/admin' : '/login'}
            />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
