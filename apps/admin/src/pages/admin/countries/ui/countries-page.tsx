import { type FormEvent, useCallback, useState } from 'react';

import { AdminEmptyState } from '@/components/molecules/admin-empty-state';
import { AdminPagination } from '@/components/molecules/admin-pagination';
import { AdminResourceTemplate } from '@/components/templates/admin-resource-template';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import {
  createCountryRequest,
  deleteCountryRequest,
  getCountriesRequest,
} from '@/lib/dal/countries.dal';
import { formatDateTime } from '@/lib/utils/admin-format';
import { useResourceList } from '@/pages/admin/_shared/use-resource-list';
import type { Country, GetCountriesParams } from '@/types/admin';

const sortOptions: NonNullable<GetCountriesParams['sortBy']>[] = [
  'name',
  'code',
  'createdAt',
  'updatedAt',
];

export function CountriesPage() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [q, setQ] = useState('');
  const [sortBy, setSortBy] =
    useState<NonNullable<GetCountriesParams['sortBy']>>('createdAt');
  const [sortOrder, setSortOrder] =
    useState<NonNullable<GetCountriesParams['sortOrder']>>('desc');
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const request = useCallback(
    () =>
      getCountriesRequest({
        page,
        limit,
        q: q.trim() || undefined,
        sortBy,
        sortOrder,
      }),
    [page, limit, q, sortBy, sortOrder],
  );

  const { data, total, loading, error, reload } = useResourceList<Country>(request);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setFormError(null);
    try {
      await createCountryRequest({ code, name });
      reload();
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Failed to create country');
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete(id: string) {
    setBusy(true);
    setFormError(null);
    try {
      await deleteCountryRequest(id);
      reload();
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Failed to delete country');
      setBusy(false);
    }
  }

  return (
    <AdminResourceTemplate
      title="Countries"
      description="Maintain production countries used in film metadata."
      summary={
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
          <Card>
            <CardContent className="p-5">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
                Total countries
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
                Search and sort countries from the API.
              </p>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="country-q">Search</Label>
              <Input
                id="country-q"
                value={q}
                onChange={(event) => setQ(event.target.value)}
                placeholder="Code or name"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="country-sort-by">Sort by</Label>
              <Select
                id="country-sort-by"
                value={sortBy}
                onChange={(event) =>
                  setSortBy(
                    event.target.value as NonNullable<GetCountriesParams['sortBy']>,
                  )
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
              <Label htmlFor="country-sort-order">Sort order</Label>
              <Select
                id="country-sort-order"
                value={sortOrder}
                onChange={(event) =>
                  setSortOrder(
                    event.target.value as NonNullable<GetCountriesParams['sortOrder']>,
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
                Create country
              </p>
              <p className="text-sm text-slate-600">Add a new country record.</p>
            </div>
            <form className="grid gap-3" onSubmit={handleSubmit}>
              <div className="grid gap-2">
                <Label htmlFor="country-code">Code</Label>
                <Input
                  id="country-code"
                  value={code}
                  onChange={(event) => setCode(event.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="country-name">Name</Label>
                <Input
                  id="country-name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                />
              </div>
              <Button disabled={busy || !code.trim() || !name.trim()} type="submit">
                Create country
              </Button>
            </form>
            {formError ? <p className="text-sm text-rose-700">{formError}</p> : null}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="grid gap-4 p-5">
            {loading ? (
              <p className="text-sm text-slate-600">Loading countries...</p>
            ) : error ? (
              <AdminEmptyState
                title="Countries failed to load"
                description={error}
                actionLabel="Retry"
                onAction={reload}
              />
            ) : data.length === 0 ? (
              <AdminEmptyState
                title="No countries yet"
                description="Create the first country using the form on the left."
              />
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200 text-left">
                  <thead>
                    <tr className="text-xs uppercase tracking-[0.22em] text-slate-500">
                      <th className="px-3 py-3">Code</th>
                      <th className="px-3 py-3">Name</th>
                      <th className="px-3 py-3">Updated</th>
                      <th className="px-3 py-3">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {data.map((country) => (
                      <tr key={country.id}>
                        <td className="px-3 py-4 font-medium text-slate-950">
                          {country.code}
                        </td>
                        <td className="px-3 py-4 text-sm text-slate-700">
                          {country.name}
                        </td>
                        <td className="px-3 py-4 text-sm text-slate-600">
                          {formatDateTime(country.updatedAt)}
                        </td>
                        <td className="px-3 py-4">
                          <Button
                            variant="secondary"
                            disabled={busy}
                            onClick={() => handleDelete(country.id)}
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
