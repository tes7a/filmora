import { Link } from 'react-router-dom';

import { adminNavigation } from '@/constants/admin-navigation';

import { AdminNavLink } from '../molecules/nav-link';

type AdminSidebarProps = {
  onNavigate?: () => void;
};

export function AdminSidebar({ onNavigate }: AdminSidebarProps) {
  return (
    <aside className="flex h-full w-full flex-col overflow-y-auto border-r border-slate-200 bg-white/80 backdrop-blur">
      <div className="border-b border-slate-200 px-5 py-4 sm:px-6 sm:py-5">
        <Link to="/admin" className="grid gap-1">
          <span className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
            Filmora Admin
          </span>
          <span className="text-lg font-semibold text-slate-950">Operations console</span>
        </Link>
      </div>

      <nav className="flex-1 space-y-2 px-3 py-3 sm:py-4">
        {adminNavigation.map((item) => (
          <AdminNavLink key={item.path} item={item} onNavigate={onNavigate} />
        ))}
      </nav>
    </aside>
  );
}
