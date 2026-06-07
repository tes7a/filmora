import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';

type AdminPaginationProps = {
  page: number;
  limit: number;
  total: number;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
};

export function AdminPagination({
  page,
  limit,
  total,
  onPageChange,
  onLimitChange,
}: AdminPaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const from = total === 0 ? 0 : (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);

  return (
    <div className="flex flex-col gap-3 border-t border-slate-200 pt-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-slate-600">
        Showing {from}-{to} of {total}
      </p>
      <div className="flex flex-wrap items-center gap-2">
        <Select
          className="w-24"
          value={String(limit)}
          onChange={(event) => onLimitChange(Number(event.target.value))}
        >
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="50">50</option>
          <option value="100">100</option>
        </Select>
        <Button
          variant="secondary"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
        >
          Prev
        </Button>
        <span className="min-w-24 text-center text-sm text-slate-600">
          Page {page} of {totalPages}
        </span>
        <Button
          variant="secondary"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
