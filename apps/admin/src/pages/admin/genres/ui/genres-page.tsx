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
  createGenreRequest,
  deleteGenreRequest,
  getGenresRequest,
} from '@/lib/dal/genres.dal';
import { formatDateTime } from '@/lib/utils/admin-format';
import { useResourceList } from '@/pages/admin/_shared/use-resource-list';
import type { Genre, GenreStatus, GetGenresParams } from '@/types/admin';

const statusTone: Record<GenreStatus, 'neutral' | 'success' | 'warning' | 'danger'> = {
  active: 'success',
  hidden: 'danger',
  deleted: 'neutral',
};

const sortOptions: NonNullable<GetGenresParams['sortBy']>[] = [
  'name',
  'status',
  'createdAt',
  'updatedAt',
];

export function GenresPage() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [q, setQ] = useState('');
  const [status, setStatus] = useState<GenreStatus | ''>('');
  const [sortBy, setSortBy] =
    useState<NonNullable<GetGenresParams['sortBy']>>('createdAt');
  const [sortOrder, setSortOrder] =
    useState<NonNullable<GetGenresParams['sortOrder']>>('desc');
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [createStatus, setCreateStatus] = useState<GenreStatus>('active');
  const [formError, setFormError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const request = useCallback(
    () =>
      getGenresRequest({
        page,
        limit,
        q: q.trim() || undefined,
        status: status || undefined,
        sortBy,
        sortOrder,
      }),
    [page, limit, q, status, sortBy, sortOrder],
  );

  const { data, total, loading, error, reload } = useResourceList<Genre>(request);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setFormError(null);

    try {
      await createGenreRequest({
        name,
        slug,
        description: description || undefined,
        status: createStatus,
      });
      reload();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Failed to create genre');
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete(id: string) {
    setBusy(true);
    setFormError(null);

    try {
      await deleteGenreRequest(id);
      reload();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Failed to delete genre');
      setBusy(false);
    }
  }

  return (
    <AdminResourceTemplate
      title="Genres"
      description="Maintain the genre dictionary and merge duplicates."
      summary={
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
          <Card>
            <CardContent className="p-5">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
                Total genres
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
        <Card className="border-slate-200 bg-white/90 shadow-sm">
          <CardContent className="grid gap-4 p-5">
            <div className="grid gap-1">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Query</p>
              <p className="text-sm text-slate-600">
                Use the backend filters and sort order.
              </p>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="genre-q">Search</Label>
              <Input
                id="genre-q"
                value={q}
                onChange={(event) => setQ(event.target.value)}
                placeholder="Name or slug"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="genre-filter-status">Status</Label>
              <Select
                id="genre-filter-status"
                value={status}
                onChange={(event) => setStatus(event.target.value as GenreStatus | '')}
              >
                <option value="">all</option>
                <option value="active">active</option>
                <option value="hidden">hidden</option>
                <option value="deleted">deleted</option>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="genre-sort-by">Sort by</Label>
              <Select
                id="genre-sort-by"
                value={sortBy}
                onChange={(event) =>
                  setSortBy(event.target.value as NonNullable<GetGenresParams['sortBy']>)
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
              <Label htmlFor="genre-sort-order">Sort order</Label>
              <Select
                id="genre-sort-order"
                value={sortOrder}
                onChange={(event) =>
                  setSortOrder(
                    event.target.value as NonNullable<GetGenresParams['sortOrder']>,
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
                Create genre
              </p>
              <p className="text-sm text-slate-600">Add a new catalog genre.</p>
            </div>
            <form className="grid gap-3" onSubmit={handleSubmit}>
              <div className="grid gap-2">
                <Label htmlFor="genre-name">Name</Label>
                <Input
                  id="genre-name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="genre-slug">Slug</Label>
                <Input
                  id="genre-slug"
                  value={slug}
                  onChange={(event) => setSlug(event.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="genre-description">Description</Label>
                <Input
                  id="genre-description"
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="genre-status">Create status</Label>
                <Select
                  id="genre-status"
                  value={createStatus}
                  onChange={(event) => setCreateStatus(event.target.value as GenreStatus)}
                >
                  <option value="active">active</option>
                  <option value="hidden">hidden</option>
                  <option value="deleted">deleted</option>
                </Select>
              </div>
              <Button disabled={busy || !name.trim() || !slug.trim()} type="submit">
                Create genre
              </Button>
            </form>
            {formError ? <p className="text-sm text-rose-700">{formError}</p> : null}
          </CardContent>
        </Card>

        <Card className="border-slate-200 bg-white/90 shadow-sm">
          <CardContent className="grid gap-4 p-5">
            {loading ? (
              <p className="text-sm text-slate-600">Loading genres...</p>
            ) : error ? (
              <AdminEmptyState
                title="Genres failed to load"
                description={error}
                actionLabel="Retry"
                onAction={reload}
              />
            ) : data.length === 0 ? (
              <AdminEmptyState
                title="No genres yet"
                description="Create the first genre using the form on the left."
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
                    {data.map((genre) => (
                      <tr key={genre.id}>
                        <td className="px-3 py-4 font-medium text-slate-950">
                          {genre.name}
                        </td>
                        <td className="px-3 py-4">
                          <StatusBadge
                            value={genre.status}
                            tone={statusTone[genre.status] ?? 'neutral'}
                          />
                        </td>
                        <td className="px-3 py-4 text-sm text-slate-600">{genre.slug}</td>
                        <td className="px-3 py-4 text-sm text-slate-600">
                          {formatDateTime(genre.updatedAt)}
                        </td>
                        <td className="px-3 py-4">
                          <Button
                            variant="secondary"
                            disabled={busy}
                            onClick={() => handleDelete(genre.id)}
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
