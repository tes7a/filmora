import { NavLink } from 'react-router-dom';

import { cn } from '@/lib/utils/cn';

import type { AdminNavItem } from '@/constants/admin-navigation';

type NavLinkProps = {
  item: AdminNavItem;
  onNavigate?: () => void;
};

export function AdminNavLink({ item, onNavigate }: NavLinkProps) {
  const Icon = item.icon;

  return (
    <NavLink
      to={item.path}
      end={item.path === '/admin'}
      onClick={onNavigate}
      className={({ isActive }) =>
        cn(
          'group flex items-center gap-3 rounded-xl border px-3 py-2.5 transition-colors sm:items-start sm:py-3',
          isActive
            ? 'border-slate-900 bg-slate-900 text-white'
            : 'border-slate-200 bg-white/80 text-slate-700 hover:border-slate-300 hover:bg-slate-50',
        )
      }
    >
      {({ isActive }) => (
        <>
          <span
            className={cn(
              'mt-0.5 inline-flex h-9 w-9 items-center justify-center rounded-lg border',
              isActive
                ? 'border-white/20 bg-white/10 text-white'
                : 'border-slate-200 bg-slate-50 text-slate-900',
            )}
          >
            <Icon className="h-4 w-4" />
          </span>
          <span className="grid gap-0.5">
            <span className="text-sm font-semibold leading-none">{item.label}</span>
            <span
              className={cn(
                'hidden text-xs leading-snug sm:block',
                isActive ? 'text-slate-200' : 'text-slate-500',
              )}
            >
              {item.description}
            </span>
          </span>
        </>
      )}
    </NavLink>
  );
}
