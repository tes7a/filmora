import { useCallback, useState } from 'react';

import { AdminEmptyState } from '@/components/molecules/admin-empty-state';
import { AdminPagination } from '@/components/molecules/admin-pagination';
import { StatusBadge } from '@/components/molecules/status-badge';
import { AdminResourceTemplate } from '@/components/templates/admin-resource-template';
import { Card, CardContent } from '@/components/ui/card';
import { Select } from '@/components/ui/select';
import { getComplaintsRequest } from '@/lib/dal/complaints.dal';
import { formatDateTime } from '@/lib/utils/admin-format';
import { useResourceList } from '@/pages/admin/_shared/use-resource-list';
import type { ComplaintListItem, ComplaintStatus } from '@/types/admin';

const tone: Record<ComplaintStatus, 'neutral' | 'success' | 'warning' | 'danger'> = {
  pending: 'warning',
  in_review: 'neutral',
  resolved: 'success',
  rejected: 'danger',
};

export function ComplaintsPage() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [status, setStatus] = useState<ComplaintStatus | ''>('');

  const request = useCallback(
    () =>
      getComplaintsRequest({
        page,
        limit,
        status: status || undefined,
      }),
    [page, limit, status],
  );

  const { data, total, loading, error, reload } =
    useResourceList<ComplaintListItem>(request);

  return (
    <AdminResourceTemplate
      title="Complaints"
      description="Review reports and execute moderation actions."
      summary={
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
          <Card>
            <CardContent className="p-5">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
                Total complaints
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
      <Card>
        <CardContent className="grid gap-4 p-5">
          <div className="grid gap-2 md:max-w-xs">
            <label
              className="text-sm font-medium text-slate-900"
              htmlFor="complaint-status"
            >
              Filter status
            </label>
            <Select
              id="complaint-status"
              value={status}
              onChange={(event) => setStatus(event.target.value as ComplaintStatus | '')}
            >
              <option value="">all</option>
              <option value="pending">pending</option>
              <option value="in_review">in_review</option>
              <option value="resolved">resolved</option>
              <option value="rejected">rejected</option>
            </Select>
          </div>

          {loading ? (
            <p className="text-sm text-slate-600">Loading complaints...</p>
          ) : error ? (
            <AdminEmptyState
              title="Complaints failed to load"
              description={error}
              actionLabel="Retry"
              onAction={reload}
            />
          ) : data.length === 0 ? (
            <AdminEmptyState
              title="No complaints yet"
              description="New complaints will appear here."
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 text-left">
                <thead>
                  <tr className="text-xs uppercase tracking-[0.22em] text-slate-500">
                    <th className="px-3 py-3">User</th>
                    <th className="px-3 py-3">Target</th>
                    <th className="px-3 py-3">Status</th>
                    <th className="px-3 py-3">Reason</th>
                    <th className="px-3 py-3">Created</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {data.map((complaint) => (
                    <tr key={complaint.id}>
                      <td className="px-3 py-4">
                        <div className="grid gap-1">
                          <p className="font-medium text-slate-950">
                            {complaint.user.displayName}
                          </p>
                          <p className="text-sm text-slate-500">{complaint.userId}</p>
                        </div>
                      </td>
                      <td className="px-3 py-4 text-sm text-slate-600">
                        {complaint.targetType}:{' '}
                        <span className="font-mono text-xs">{complaint.targetId}</span>
                      </td>
                      <td className="px-3 py-4">
                        <StatusBadge
                          value={complaint.status}
                          tone={tone[complaint.status]}
                        />
                      </td>
                      <td className="px-3 py-4 text-sm text-slate-600">
                        {complaint.reason}
                      </td>
                      <td className="px-3 py-4 text-sm text-slate-600">
                        {formatDateTime(complaint.createdAt)}
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
    </AdminResourceTemplate>
  );
}
