import { type FormEvent, useCallback, useState } from 'react';

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
  createPersonRequest,
  deletePersonRequest,
  getPersonsRequest,
} from '@/lib/dal/persons.dal';
import { formatDateTime } from '@/lib/utils/admin-format';
import { useResourceList } from '@/pages/admin/_shared/use-resource-list';
import type { GetPersonsParams, Person, PersonStatus } from '@/types/admin';

const tone: Record<PersonStatus, 'neutral' | 'success' | 'warning' | 'danger'> = {
  visible: 'success',
  hidden: 'danger',
  merged: 'warning',
  deleted: 'neutral',
};

const sortOptions: NonNullable<GetPersonsParams['sortBy']>[] = [
  'fullName',
  'status',
  'createdAt',
  'updatedAt',
];

export function PersonsPage() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [q, setQ] = useState('');
  const [status, setStatus] = useState<PersonStatus | ''>('');
  const [sortBy, setSortBy] =
    useState<NonNullable<GetPersonsParams['sortBy']>>('createdAt');
  const [sortOrder, setSortOrder] =
    useState<NonNullable<GetPersonsParams['sortOrder']>>('desc');
  const [fullName, setFullName] = useState('');
  const [slug, setSlug] = useState('');
  const [bio, setBio] = useState('');
  const [createStatus, setCreateStatus] = useState<PersonStatus>('visible');
  const [formError, setFormError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const request = useCallback(
    () =>
      getPersonsRequest({
        page,
        limit,
        q: q.trim() || undefined,
        status: status || undefined,
        sortBy,
        sortOrder,
      }),
    [page, limit, q, status, sortBy, sortOrder],
  );

  const { data, total, loading, error, reload } = useResourceList<Person>(request);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setFormError(null);
    try {
      await createPersonRequest({
        fullName,
        slug,
        bio: bio || undefined,
        status: createStatus,
      });
      reload();
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Failed to create person');
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete(id: string) {
    setBusy(true);
    setFormError(null);
    try {
      await deletePersonRequest(id);
      reload();
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Failed to delete person');
      setBusy(false);
    }
  }

  return (
    <AdminResourceTemplate
      title="Persons"
      description="Manage actors, directors, writers, and other people."
      summary={
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
          <Card>
            <CardContent className="p-5">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
                Total persons
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
        <Card>
          <CardContent className="grid gap-4 p-5">
            <div className="grid gap-1">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Query</p>
              <p className="text-sm text-slate-600">
                Use search, status, and sort parameters from the API.
              </p>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="person-q">Search</Label>
              <Input
                id="person-q"
                value={q}
                onChange={(event) => setQ(event.target.value)}
                placeholder="Full name or slug"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="person-filter-status">Status</Label>
              <Select
                id="person-filter-status"
                value={status}
                onChange={(event) => setStatus(event.target.value as PersonStatus | '')}
              >
                <option value="">all</option>
                <option value="visible">visible</option>
                <option value="hidden">hidden</option>
                <option value="merged">merged</option>
                <option value="deleted">deleted</option>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="person-sort-by">Sort by</Label>
              <Select
                id="person-sort-by"
                value={sortBy}
                onChange={(event) =>
                  setSortBy(event.target.value as NonNullable<GetPersonsParams['sortBy']>)
                }
              >
                {sortOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="person-sort-order">Sort order</Label>
              <Select
                id="person-sort-order"
                value={sortOrder}
                onChange={(event) =>
                  setSortOrder(
                    event.target.value as NonNullable<GetPersonsParams['sortOrder']>,
                  )
                }
              >
                <option value="desc">desc</option>
                <option value="asc">asc</option>
              </Select>
            </div>
            <div className="grid gap-1 rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600">
              <p className="font-medium text-slate-900">Pagination</p>
              <p>Page {page}</p>
              <p>Limit {limit}</p>
            </div>
            <div className="grid gap-1 border-t border-slate-200 pt-4">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
                Create person
              </p>
              <p className="text-sm text-slate-600">Add a new person record.</p>
            </div>
            <form className="grid gap-3" onSubmit={handleSubmit}>
              <div className="grid gap-2">
                <Label htmlFor="person-name">Full name</Label>
                <Input
                  id="person-name"
                  value={fullName}
                  onChange={(event) => setFullName(event.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="person-slug">Slug</Label>
                <Input
                  id="person-slug"
                  value={slug}
                  onChange={(event) => setSlug(event.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="person-bio">Bio</Label>
                <Input
                  id="person-bio"
                  value={bio}
                  onChange={(event) => setBio(event.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="person-status">Create status</Label>
                <Select
                  id="person-status"
                  value={createStatus}
                  onChange={(event) =>
                    setCreateStatus(event.target.value as PersonStatus)
                  }
                >
                  <option value="visible">visible</option>
                  <option value="hidden">hidden</option>
                  <option value="merged">merged</option>
                  <option value="deleted">deleted</option>
                </Select>
              </div>
              <Button disabled={busy || !fullName.trim() || !slug.trim()} type="submit">
                Create person
              </Button>
            </form>
            {formError ? <p className="text-sm text-rose-700">{formError}</p> : null}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="grid gap-4 p-5">
            {loading ? (
              <p className="text-sm text-slate-600">Loading persons...</p>
            ) : error ? (
              <AdminEmptyState
                title="Persons failed to load"
                description={error}
                actionLabel="Retry"
                onAction={reload}
              />
            ) : data.length === 0 ? (
              <AdminEmptyState
                title="No persons yet"
                description="Create the first person using the form on the left."
              />
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200 text-left">
                  <thead>
                    <tr className="text-xs uppercase tracking-[0.22em] text-slate-500">
                      <th className="px-3 py-3">Name</th>
                      <th className="px-3 py-3">Status</th>
                      <th className="px-3 py-3">Slug</th>
                      <th className="px-3 py-3">Updated</th>
                      <th className="px-3 py-3">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {data.map((person) => (
                      <tr key={person.id}>
                        <td className="px-3 py-4">
                          <div className="grid gap-1">
                            <p className="font-medium text-slate-950">
                              {person.fullName}
                            </p>
                            <p className="text-sm text-slate-500">
                              {formatDateTime(person.birthDate)} -{' '}
                              {formatDateTime(person.deathDate)}
                            </p>
                          </div>
                        </td>
                        <td className="px-3 py-4">
                          <StatusBadge value={person.status} tone={tone[person.status]} />
                        </td>
                        <td className="px-3 py-4 text-sm text-slate-600">
                          {person.slug}
                        </td>
                        <td className="px-3 py-4 text-sm text-slate-600">
                          {formatDateTime(person.updatedAt)}
                        </td>
                        <td className="px-3 py-4">
                          <Button
                            variant="secondary"
                            disabled={busy}
                            onClick={() => handleDelete(person.id)}
                          >
                            Delete
                          </Button>
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
