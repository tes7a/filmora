import type { FilmCard, PaginationResponse } from '../../types/api';
import { SiteHeader } from '../organisms/site-header';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { FilmCardView } from '../molecules/film-card';
import { PaginationControls } from '../molecules/pagination-controls';
import {
  FilmCatalogFilters,
  type FilmCatalogFilterValues,
} from '../organisms/film-catalog-filters';

type FilmCatalogTemplateProps = {
  title: string;
  description: string;
  response: PaginationResponse<FilmCard>;
  filters: FilmCatalogFilterValues;
  buildHref: (page: number) => string;
};

export function FilmCatalogTemplate({
  title,
  description,
  response,
  filters,
  buildHref,
}: FilmCatalogTemplateProps) {
  const totalPages = Math.max(1, Math.ceil(response.total / response.pageSize));

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(249,115,22,0.16),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(14,165,233,0.12),_transparent_28%),linear-gradient(180deg,#fff7ed_0%,#f8fafc_45%,#e2e8f0_100%)]">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <SiteHeader />

        <Card className="border-slate-200/80 bg-white/90">
          <CardHeader className="space-y-3">
            <Badge variant="secondary" className="w-fit rounded-full px-3 py-1">
              Public catalog
            </Badge>
            <CardTitle className="text-3xl sm:text-4xl">{title}</CardTitle>
            <p className="max-w-3xl text-sm leading-6 text-slate-600 sm:text-base">
              {description}
            </p>
          </CardHeader>
        </Card>

        <FilmCatalogFilters values={filters} />

        <Card className="border-slate-200/80 bg-white/90">
          <CardContent className="flex flex-col gap-3 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="grid gap-1">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
                Results
              </p>
              <p className="text-sm text-slate-600">
                Showing{' '}
                <span className="font-medium text-slate-950">
                  {response.items.length}
                </span>{' '}
                of <span className="font-medium text-slate-950">{response.total}</span>
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">Page {response.page}</Badge>
              <Badge variant="outline">Page size {response.pageSize}</Badge>
              <Badge variant="outline">Total pages {totalPages}</Badge>
            </div>
          </CardContent>
        </Card>

        {response.items.length ? (
          <>
            <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {response.items.map((film) => (
                <FilmCardView key={film.id} film={film} href={`/films/${film.id}`} />
              ))}
            </section>

            <PaginationControls
              buildHref={buildHref}
              page={response.page}
              pageSize={response.pageSize}
              totalPages={totalPages}
            />
          </>
        ) : (
          <Card className="border-slate-200/80 bg-white/90">
            <CardContent className="p-6">
              <p className="text-sm text-slate-600">
                No films match the current filters.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  );
}
