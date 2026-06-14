import Link from 'next/link';

import { Button } from '../atoms/button';

type PaginationControlsProps = {
  page: number;
  pageSize: number;
  totalPages: number;
  buildHref: (nextPage: number) => string;
};

function getVisiblePages(page: number, totalPages: number) {
  const pages = new Set<number>([1, totalPages, page - 1, page, page + 1]);

  return Array.from(pages)
    .filter((value) => value >= 1 && value <= totalPages)
    .sort((left, right) => left - right);
}

export function PaginationControls({
  page,
  pageSize,
  totalPages,
  buildHref,
}: PaginationControlsProps) {
  const visiblePages = getVisiblePages(page, totalPages);

  return (
    <div className="flex flex-col gap-3 rounded-3xl border border-slate-200/80 bg-white/90 p-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-slate-600">
        Page <span className="font-medium text-slate-950">{page}</span> of{' '}
        <span className="font-medium text-slate-950">{totalPages}</span> ·{' '}
        <span className="font-medium text-slate-950">{pageSize}</span> per page
      </p>

      <div className="flex flex-wrap items-center gap-2">
        <Button
          href={page > 1 ? buildHref(page - 1) : buildHref(1)}
          variant="outline"
          size="sm"
        >
          Prev
        </Button>

        {visiblePages.map((value) => (
          <Link
            key={value}
            className={
              value === page
                ? 'inline-flex h-9 min-w-9 items-center justify-center rounded-full bg-slate-950 px-3 text-sm font-medium text-white'
                : 'inline-flex h-9 min-w-9 items-center justify-center rounded-full border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50'
            }
            href={buildHref(value)}
          >
            {value}
          </Link>
        ))}

        <Button
          href={page < totalPages ? buildHref(page + 1) : buildHref(totalPages)}
          variant="outline"
          size="sm"
        >
          Next
        </Button>
      </div>
    </div>
  );
}
