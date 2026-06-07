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
  createFilmRequest,
  deleteFilmRequest,
  getFilmsRequest,
} from '@/lib/dal/films.dal';
import { formatNumber } from '@/lib/utils/admin-format';
import { useResourceList } from '@/pages/admin/_shared/use-resource-list';
import type { AdminFilm, FilmStatus, GetFilmsParams } from '@/types/admin';

const filmStatusTone: Record<FilmStatus, 'neutral' | 'success' | 'warning' | 'danger'> = {
  visible: 'success',
  hidden: 'danger',
  deleted: 'neutral',
};

const sortOptions: NonNullable<GetFilmsParams['sortBy']>[] = [
  'title',
  'status',
  'releaseYear',
  'averageRating',
  'ratingsCount',
  'popularityScore',
  'createdAt',
  'updatedAt',
];

export function FilmsPage() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [q, setQ] = useState('');
  const [status, setStatus] = useState<FilmStatus | ''>('');
  const [yearFrom, setYearFrom] = useState('');
  const [yearTo, setYearTo] = useState('');
  const [ratingFrom, setRatingFrom] = useState('');
  const [ratingTo, setRatingTo] = useState('');
  const [sortBy, setSortBy] =
    useState<NonNullable<GetFilmsParams['sortBy']>>('createdAt');
  const [sortOrder, setSortOrder] =
    useState<NonNullable<GetFilmsParams['sortOrder']>>('desc');
  const [title, setTitle] = useState('');
  const [originalTitle, setOriginalTitle] = useState('');
  const [releaseYear, setReleaseYear] = useState('1999');
  const [durationMin, setDurationMin] = useState('120');
  const [ageRating, setAgeRating] = useState('');
  const [popularityScore, setPopularityScore] = useState('0');
  const [createStatus, setCreateStatus] = useState<FilmStatus>('visible');
  const [formError, setFormError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const request = useCallback(
    () =>
      getFilmsRequest({
        page,
        limit,
        q: q.trim() || undefined,
        status: status || undefined,
        yearFrom: yearFrom ? Number(yearFrom) : undefined,
        yearTo: yearTo ? Number(yearTo) : undefined,
        ratingFrom: ratingFrom ? Number(ratingFrom) : undefined,
        ratingTo: ratingTo ? Number(ratingTo) : undefined,
        sortBy,
        sortOrder,
      }),
    [page, limit, q, status, yearFrom, yearTo, ratingFrom, ratingTo, sortBy, sortOrder],
  );

  const { data, total, loading, error, reload } = useResourceList<AdminFilm>(request);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setFormError(null);
    try {
      await createFilmRequest({
        title,
        originalTitle,
        releaseYear: Number(releaseYear),
        durationMin: Number(durationMin),
        ageRating: ageRating || undefined,
        popularityScore: Number(popularityScore),
        status: createStatus,
      });
      reload();
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Failed to create film');
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete(id: string) {
    setBusy(true);
    setFormError(null);
    try {
      await deleteFilmRequest(id);
      reload();
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Failed to delete film');
      setBusy(false);
    }
  }

  return (
    <AdminResourceTemplate
      title="Films"
      description="Create, edit, and review catalog films."
      summary={
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
          <Card>
            <CardContent className="p-5">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
                Total films
              </p>
              <p className="mt-2 text-3xl font-semibold text-slate-950">{total}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
                Avg rating
              </p>
              <p className="mt-2 text-3xl font-semibold text-slate-950">
                {data.length
                  ? formatNumber(
                      data.reduce((sum, item) => sum + item.averageRating, 0) /
                        data.length,
                    )
                  : '—'}
              </p>
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
                Search, filter, and sort films through backend params.
              </p>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="film-q">Search</Label>
              <Input
                id="film-q"
                value={q}
                onChange={(event) => setQ(event.target.value)}
                placeholder="Title or original title"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="film-status-filter">Status</Label>
              <Select
                id="film-status-filter"
                value={status}
                onChange={(event) => setStatus(event.target.value as FilmStatus | '')}
              >
                <option value="">all</option>
                <option value="visible">visible</option>
                <option value="hidden">hidden</option>
                <option value="deleted">deleted</option>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="film-year-from">Year from</Label>
              <Input
                id="film-year-from"
                type="number"
                value={yearFrom}
                onChange={(event) => setYearFrom(event.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="film-year-to">Year to</Label>
              <Input
                id="film-year-to"
                type="number"
                value={yearTo}
                onChange={(event) => setYearTo(event.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="film-rating-from">Rating from</Label>
              <Input
                id="film-rating-from"
                type="number"
                step="0.1"
                value={ratingFrom}
                onChange={(event) => setRatingFrom(event.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="film-rating-to">Rating to</Label>
              <Input
                id="film-rating-to"
                type="number"
                step="0.1"
                value={ratingTo}
                onChange={(event) => setRatingTo(event.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="film-sort-by">Sort by</Label>
              <Select
                id="film-sort-by"
                value={sortBy}
                onChange={(event) =>
                  setSortBy(event.target.value as NonNullable<GetFilmsParams['sortBy']>)
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
              <Label htmlFor="film-sort-order">Sort order</Label>
              <Select
                id="film-sort-order"
                value={sortOrder}
                onChange={(event) =>
                  setSortOrder(
                    event.target.value as NonNullable<GetFilmsParams['sortOrder']>,
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
                Create film
              </p>
              <p className="text-sm text-slate-600">Add a new film to the catalog.</p>
            </div>
            <form className="grid gap-3" onSubmit={handleSubmit}>
              <div className="grid gap-2">
                <Label htmlFor="film-title">Title</Label>
                <Input
                  id="film-title"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="film-original-title">Original title</Label>
                <Input
                  id="film-original-title"
                  value={originalTitle}
                  onChange={(event) => setOriginalTitle(event.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="film-year">Release year</Label>
                <Input
                  id="film-year"
                  type="number"
                  value={releaseYear}
                  onChange={(event) => setReleaseYear(event.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="film-duration">Duration min</Label>
                <Input
                  id="film-duration"
                  type="number"
                  value={durationMin}
                  onChange={(event) => setDurationMin(event.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="film-age-rating">Age rating</Label>
                <Input
                  id="film-age-rating"
                  value={ageRating}
                  onChange={(event) => setAgeRating(event.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="film-popularity">Popularity score</Label>
                <Input
                  id="film-popularity"
                  type="number"
                  value={popularityScore}
                  onChange={(event) => setPopularityScore(event.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="film-create-status">Create status</Label>
                <Select
                  id="film-create-status"
                  value={createStatus}
                  onChange={(event) => setCreateStatus(event.target.value as FilmStatus)}
                >
                  <option value="visible">visible</option>
                  <option value="hidden">hidden</option>
                  <option value="deleted">deleted</option>
                </Select>
              </div>
              <Button
                disabled={busy || !title.trim() || !originalTitle.trim()}
                type="submit"
              >
                Create film
              </Button>
            </form>
            {formError ? <p className="text-sm text-rose-700">{formError}</p> : null}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="grid gap-4 p-5">
            {loading ? (
              <p className="text-sm text-slate-600">Loading films...</p>
            ) : error ? (
              <AdminEmptyState
                title="Films failed to load"
                description={error}
                actionLabel="Retry"
                onAction={reload}
              />
            ) : data.length === 0 ? (
              <AdminEmptyState
                title="No films yet"
                description="Create the first film using the form on the left."
              />
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200 text-left">
                  <thead>
                    <tr className="text-xs uppercase tracking-[0.22em] text-slate-500">
                      <th className="px-3 py-3">Film</th>
                      <th className="px-3 py-3">Status</th>
                      <th className="px-3 py-3">Year</th>
                      <th className="px-3 py-3">Rating</th>
                      <th className="px-3 py-3">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {data.map((film) => (
                      <tr key={film.id}>
                        <td className="px-3 py-4">
                          <div className="grid gap-1">
                            <p className="font-medium text-slate-950">{film.title}</p>
                            <p className="text-sm text-slate-500">{film.originalTitle}</p>
                          </div>
                        </td>
                        <td className="px-3 py-4">
                          <StatusBadge
                            value={film.status}
                            tone={filmStatusTone[film.status]}
                          />
                        </td>
                        <td className="px-3 py-4 text-sm text-slate-600">
                          {film.releaseYear}
                        </td>
                        <td className="px-3 py-4 text-sm text-slate-600">
                          {formatNumber(film.averageRating)} / {film.ratingsCount}
                        </td>
                        <td className="px-3 py-4">
                          <Button
                            variant="secondary"
                            disabled={busy}
                            onClick={() => handleDelete(film.id)}
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
