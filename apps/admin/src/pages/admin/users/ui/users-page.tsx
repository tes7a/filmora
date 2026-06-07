import { type FormEvent, useCallback, useMemo, useState } from 'react';

import { AdminEmptyState } from '@/components/molecules/admin-empty-state';
import { AdminPagination } from '@/components/molecules/admin-pagination';
import { StatusBadge } from '@/components/molecules/status-badge';
import { AdminResourceTemplate } from '@/components/templates/admin-resource-template';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import {
  addUserRoleRequest,
  blockUserRequest,
  getUsersRequest,
  updateUserStatusRequest,
} from '@/lib/dal/users.dal';
import { formatDateTime } from '@/lib/utils/admin-format';
import { useResourceList } from '@/pages/admin/_shared/use-resource-list';
import type { AdminUser, GetUsersParams, RoleCode, UserStatus } from '@/types/admin';

const userStatusTone: Record<string, 'neutral' | 'success' | 'warning' | 'danger'> = {
  active: 'success',
  blocked: 'danger',
  pending: 'warning',
  deleted: 'neutral',
};

const userSortOptions: NonNullable<GetUsersParams['sortBy']>[] = [
  'createdAt',
  'updatedAt',
  'lastLoginAt',
  'email',
  'displayName',
  'status',
];

export function UsersPage() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] =
    useState<NonNullable<GetUsersParams['sortBy']>>('createdAt');
  const [sortOrder, setSortOrder] =
    useState<NonNullable<GetUsersParams['sortOrder']>>('desc');
  const [targetUserId, setTargetUserId] = useState('');
  const [status, setStatus] = useState<UserStatus>('active');
  const [role, setRole] = useState<RoleCode>('user');
  const [reason, setReason] = useState('');
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const request = useCallback(
    () =>
      getUsersRequest({
        page,
        limit,
        search: search.trim() || undefined,
        sortBy,
        sortOrder,
      }),
    [page, limit, search, sortBy, sortOrder],
  );

  const { data, total, loading, error, reload } = useResourceList<AdminUser>(request);

  const selectedUser = useMemo(
    () => data.find((item) => item.id === targetUserId) ?? null,
    [data, targetUserId],
  );

  function handleSearchSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPage(1);
  }

  async function handleStatusSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!targetUserId) return;
    setActionLoading(true);
    setActionError(null);
    try {
      await updateUserStatusRequest(targetUserId, { status });
      reload();
    } catch (error) {
      setActionError(
        error instanceof Error ? error.message : 'Failed to update user status',
      );
    } finally {
      setActionLoading(false);
    }
  }

  async function handleRoleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!targetUserId) return;
    setActionLoading(true);
    setActionError(null);
    try {
      await addUserRoleRequest(targetUserId, { role });
      reload();
    } catch (error) {
      setActionError(error instanceof Error ? error.message : 'Failed to add user role');
    } finally {
      setActionLoading(false);
    }
  }

  async function handleBlockSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!targetUserId || !reason.trim()) return;
    setActionLoading(true);
    setActionError(null);
    try {
      await blockUserRequest(targetUserId, reason.trim());
      reload();
    } catch (error) {
      setActionError(error instanceof Error ? error.message : 'Failed to block user');
    } finally {
      setActionLoading(false);
    }
  }

  return (
    <AdminResourceTemplate
      title="Users"
      description="Manage user accounts, statuses, and assigned roles."
      summary={
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
          <Card>
            <CardContent className="p-5">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
                Total users
              </p>
              <p className="mt-2 text-3xl font-semibold text-slate-950">{total}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
                Loaded rows
              </p>
              <p className="mt-2 text-3xl font-semibold text-slate-950">{data.length}</p>
            </CardContent>
          </Card>
        </div>
      }
    >
      <div className="grid gap-4 xl:grid-cols-[360px_minmax(0,1fr)]">
        <Card className="xl:col-span-1">
          <CardContent className="grid gap-4 p-5">
            <div className="grid gap-1">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
                Target user
              </p>
              <p className="text-sm text-slate-600">
                {selectedUser
                  ? `${selectedUser.displayName} (${selectedUser.email})`
                  : 'Select a user from the table'}
              </p>
            </div>

            <form className="grid gap-3" onSubmit={handleSearchSubmit}>
              <div className="grid gap-2">
                <Label htmlFor="user-search">Search</Label>
                <Input
                  id="user-search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Email or display name"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="user-sort-by">Sort by</Label>
                <Select
                  id="user-sort-by"
                  value={sortBy}
                  onChange={(event) =>
                    setSortBy(event.target.value as NonNullable<GetUsersParams['sortBy']>)
                  }
                >
                  {userSortOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="user-sort-order">Sort order</Label>
                <Select
                  id="user-sort-order"
                  value={sortOrder}
                  onChange={(event) =>
                    setSortOrder(
                      event.target.value as NonNullable<GetUsersParams['sortOrder']>,
                    )
                  }
                >
                  <option value="desc">desc</option>
                  <option value="asc">asc</option>
                </Select>
              </div>
              <Button type="submit">Apply filters</Button>
            </form>

            <div className="grid gap-2">
              <Label htmlFor="target-user">User</Label>
              <Select
                id="target-user"
                value={targetUserId}
                onChange={(event) => setTargetUserId(event.target.value)}
              >
                <option value="">Select user</option>
                {data.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.displayName}
                  </option>
                ))}
              </Select>
            </div>

            <form className="grid gap-3" onSubmit={handleStatusSubmit}>
              <div className="grid gap-2">
                <Label htmlFor="user-status">Status</Label>
                <Select
                  id="user-status"
                  value={status}
                  onChange={(event) => setStatus(event.target.value as UserStatus)}
                >
                  <option value="active">active</option>
                  <option value="blocked">blocked</option>
                  <option value="pending">pending</option>
                  <option value="deleted">deleted</option>
                </Select>
              </div>
              <Button disabled={actionLoading || !targetUserId} type="submit">
                Update status
              </Button>
            </form>

            <form className="grid gap-3" onSubmit={handleRoleSubmit}>
              <div className="grid gap-2">
                <Label htmlFor="user-role">Role</Label>
                <Select
                  id="user-role"
                  value={role}
                  onChange={(event) => setRole(event.target.value as RoleCode)}
                >
                  <option value="user">user</option>
                  <option value="moderator">moderator</option>
                  <option value="admin">admin</option>
                </Select>
              </div>
              <Button
                variant="secondary"
                disabled={actionLoading || !targetUserId}
                type="submit"
              >
                Add role
              </Button>
            </form>

            <form className="grid gap-3" onSubmit={handleBlockSubmit}>
              <div className="grid gap-2">
                <Label htmlFor="block-reason">Block reason</Label>
                <Input
                  id="block-reason"
                  value={reason}
                  onChange={(event) => setReason(event.target.value)}
                  placeholder="Reason for blocking"
                />
              </div>
              <Button
                variant="secondary"
                disabled={actionLoading || !targetUserId || !reason.trim()}
                type="submit"
              >
                Block user
              </Button>
            </form>
            {actionError ? <p className="text-sm text-rose-700">{actionError}</p> : null}
          </CardContent>
        </Card>

        <Card className="xl:col-span-2">
          <CardContent className="grid gap-4 p-5">
            {loading ? (
              <p className="text-sm text-slate-600">Loading users...</p>
            ) : error ? (
              <AdminEmptyState
                title="Users failed to load"
                description={error}
                actionLabel="Retry"
                onAction={reload}
              />
            ) : data.length === 0 ? (
              <AdminEmptyState
                title="No users yet"
                description="Seed the database or create users from the auth flow."
              />
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200 text-left">
                  <thead>
                    <tr className="text-xs uppercase tracking-[0.22em] text-slate-500">
                      <th className="px-3 py-3">User</th>
                      <th className="px-3 py-3">Status</th>
                      <th className="px-3 py-3">Roles</th>
                      <th className="px-3 py-3">Created</th>
                      <th className="px-3 py-3">Last login</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {data.map((user) => (
                      <tr key={user.id} className="align-top">
                        <td className="px-3 py-4">
                          <div className="grid gap-1">
                            <p className="font-medium text-slate-950">
                              {user.displayName}
                            </p>
                            <p className="text-sm text-slate-500">{user.email}</p>
                          </div>
                        </td>
                        <td className="px-3 py-4">
                          <StatusBadge
                            value={user.status}
                            tone={userStatusTone[user.status] ?? 'neutral'}
                          />
                        </td>
                        <td className="px-3 py-4">
                          <div className="flex flex-wrap gap-2">
                            {user.roles.map((roleName) => (
                              <StatusBadge key={roleName} value={roleName} tone="info" />
                            ))}
                          </div>
                        </td>
                        <td className="px-3 py-4 text-sm text-slate-600">
                          {formatDateTime(user.createdAt)}
                        </td>
                        <td className="px-3 py-4 text-sm text-slate-600">
                          {formatDateTime(user.lastLoginAt)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <AdminPagination
              page={page}
              limit={limit}
              total={total}
              onPageChange={setPage}
              onLimitChange={(nextLimit) => {
                setLimit(nextLimit);
                setPage(1);
              }}
            />
          </CardContent>
        </Card>
      </div>
    </AdminResourceTemplate>
  );
}
