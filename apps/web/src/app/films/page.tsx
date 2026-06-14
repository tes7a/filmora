import { FilmCatalogTemplate } from '../../components/templates/film-catalog-template';
import type { FilmCatalogFilterValues } from '../../components/organisms/film-catalog-filters';
import { getFilms } from '../../lib/api';

type SearchParams = Record<string, string | string[] | undefined>;

function firstValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function parseNumber(value: string | undefined) {
  if (!value) {
    return undefined;
  }

  const parsed = Number(value);

  return Number.isFinite(parsed) ? parsed : undefined;
}

function parseCsv(value: string | undefined) {
  return value
    ?.split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

function buildHref(baseParams: FilmCatalogFilterValues, page: number) {
  const params = new URLSearchParams();

  params.set('page', String(page));

  Object.entries(baseParams).forEach(([key, value]) => {
    if (value) {
      params.set(key, value);
    }
  });

  const query = params.toString();

  return query ? `/films?${query}` : '/films';
}

export default async function FilmsPage({
  searchParams,
}: {
  searchParams?: SearchParams | Promise<SearchParams>;
}) {
  const params = await Promise.resolve(searchParams ?? {});

  const filters: FilmCatalogFilterValues = {
    q: firstValue(params.q) ?? '',
    genreIds: firstValue(params.genreIds) ?? '',
    tagIds: firstValue(params.tagIds) ?? '',
    countryIds: firstValue(params.countryIds) ?? '',
    yearFrom: firstValue(params.yearFrom) ?? '',
    yearTo: firstValue(params.yearTo) ?? '',
    ratingFrom: firstValue(params.ratingFrom) ?? '',
    ratingTo: firstValue(params.ratingTo) ?? '',
    sortBy: firstValue(params.sortBy) ?? 'date',
    sortOrder: firstValue(params.sortOrder) ?? 'desc',
    pageSize: firstValue(params.pageSize) ?? '12',
  };

  const page = parseNumber(firstValue(params.page)) ?? 1;
  const pageSize = parseNumber(filters.pageSize) ?? 12;

  const response = await getFilms({
    q: filters.q || undefined,
    genreIds: parseCsv(filters.genreIds),
    tagIds: parseCsv(filters.tagIds),
    countryIds: parseCsv(filters.countryIds),
    yearFrom: parseNumber(filters.yearFrom),
    yearTo: parseNumber(filters.yearTo),
    ratingFrom: parseNumber(filters.ratingFrom),
    ratingTo: parseNumber(filters.ratingTo),
    sortBy: filters.sortBy as 'rating' | 'date' | 'popularity',
    sortOrder: filters.sortOrder as 'asc' | 'desc',
    page,
    pageSize,
  });

  return (
    <FilmCatalogTemplate
      buildHref={(nextPage) => buildHref(filters, nextPage)}
      description="Search, filter, and browse the public film catalog using the live API."
      filters={filters}
      response={response}
      title="Film catalog"
    />
  );
}
