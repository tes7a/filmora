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
import { createTagRequest, deleteTagRequest, getTagsRequest } from '@/lib/dal/tags.dal';
import { formatDateTime } from '@/lib/utils/admin-format';
import { useResourceList } from '@/pages/admin/_shared/use-resource-list';
import type { GetTagsParams, Tag, TagStatus } from '@/types/admin';

const tone: Record<TagStatus, 'neutral' | 'success' | 'warning' | 'danger'> = {
  active: 'success',
  hidden: 'danger',
  deleted: 'neutral',
};

const sortOptions: NonNullable<GetTagsParams['sortBy']>[] = [
  'name',
  'status',
  'createdAt',
  'updatedAt',
];

export function TagsPage() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [q, setQ] = useState('');
  const [status, setStatus] = useState<TagStatus | ''>('');
  const [sortBy, setSortBy] = useState<NonNullable<GetTagsParams['sortBy']>>('createdAt');
  const [sortOrder, setSortOrder] =
    useState<NonNullable<GetTagsParams['sortOrder']>>('desc');
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [createStatus, setCreateStatus] = useState<TagStatus>('active');
  const [formError, setFormError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const request = useCallback(
    () =>
      getTagsRequest({
        page,
        limit,
        q: q.trim() || undefined,
        status: status || undefined,
        sortBy,
        sortOrder,
      }),
    [page, limit, q, status, sortBy, sortOrder],
  );

  const { data, total, loading, error, reload } = useResourceList<Tag>(request);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setFormError(null);
    try {
      await createTagRequest({
        name,
        slug,
        description: description || undefined,
        status: createStatus,
      });
      reload();
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Failed to create tag');
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete(id: string) {
    setBusy(true);
    setFormError(null);
    try {
      await deleteTagRequest(id);
      reload();
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Failed to delete tag');
      setBusy(false);
    }
  }

  return (
    <AdminResourceTemplate
      title="Tags"
      description="Manage tags used across films and moderation workflows."
      summary={
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
          <Card>
            <CardContent className="p-5">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
                Total tags
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
                Use search, status, and sorting from the API.
              </p>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="tag-q">Search</Label>
              <Input
                id="tag-q"
                value={q}
                onChange={(event) => setQ(event.target.value)}
                placeholder="Name or slug"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="tag-filter-status">Status</Label>
              <Select
                id="tag-filter-status"
                value={status}
                onChange={(event) => setStatus(event.target.value as TagStatus | '')}
              >
                <option value="">all</option>
                <option value="active">active</option>
                <option value="hidden">hidden</option>
                <option value="deleted">deleted</option>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="tag-sort-by">Sort by</Label>
              <Select
                id="tag-sort-by"
                value={sortBy}
                onChange={(event) =>
                  setSortBy(event.target.value as NonNullable<GetTagsParams['sortBy']>)
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
              <Label htmlFor="tag-sort-order">Sort order</Label>
              <Select
                id="tag-sort-order"
                value={sortOrder}
                onChange={(event) =>
                  setSortOrder(
                    event.target.value as NonNullable<GetTagsParams['sortOrder']>,
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
                Create tag
              </p>
              <p className="text-sm text-slate-600">Add a new tag dictionary entry.</p>
            </div>
            <form className="grid gap-3" onSubmit={handleSubmit}>
              <div className="grid gap-2">
                <Label htmlFor="tag-name">Name</Label>
                <Input
                  id="tag-name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="tag-slug">Slug</Label>
                <Input
                  id="tag-slug"
                  value={slug}
                  onChange={(event) => setSlug(event.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="tag-description">Description</Label>
                <Input
                  id="tag-description"
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="tag-status">Create status</Label>
                <Select
                  id="tag-status"
                  value={createStatus}
                  onChange={(event) => setCreateStatus(event.target.value as TagStatus)}
                >
                  <option value="active">active</option>
                  <option value="hidden">hidden</option>
                  <option value="deleted">deleted</option>
                </Select>
              </div>
              <Button disabled={busy || !name.trim() || !slug.trim()} type="submit">
                Create tag
              </Button>
            </form>
            {formError ? <p className="text-sm text-rose-700">{formError}</p> : null}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="grid gap-4 p-5">
            {loading ? (
              <p className="text-sm text-slate-600">Loading tags...</p>
            ) : error ? (
              <AdminEmptyState
                title="Tags failed to load"
                description={error}
                actionLabel="Retry"
                onAction={reload}
              />
            ) : data.length === 0 ? (
              <AdminEmptyState
                title="No tags yet"
                description="Create the first tag using the form on the left."
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
                    {data.map((tag) => (
                      <tr key={tag.id}>
                        <td className="px-3 py-4 font-medium text-slate-950">
                          {tag.name}
                        </td>
                        <td className="px-3 py-4">
                          <StatusBadge value={tag.status} tone={tone[tag.status]} />
                        </td>
                        <td className="px-3 py-4 text-sm text-slate-600">{tag.slug}</td>
                        <td className="px-3 py-4 text-sm text-slate-600">
                          {formatDateTime(tag.updatedAt)}
                        </td>
                        <td className="px-3 py-4">
                          <Button
                            variant="secondary"
                            disabled={busy}
                            onClick={() => handleDelete(tag.id)}
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
