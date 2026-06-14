import { Button } from '../atoms/button';
import { Input } from '../atoms/input';
import { Label } from '../atoms/label';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

export type FilmCatalogFilterValues = {
  q: string;
  genreIds: string;
  tagIds: string;
  countryIds: string;
  yearFrom: string;
  yearTo: string;
  ratingFrom: string;
  ratingTo: string;
  sortBy: string;
  sortOrder: string;
  pageSize: string;
};

type FilmCatalogFiltersProps = {
  values: FilmCatalogFilterValues;
};

export function FilmCatalogFilters({ values }: FilmCatalogFiltersProps) {
  return (
    <Card className="border-slate-200/80 bg-white/90">
      <CardHeader className="space-y-2 pb-4">
        <CardTitle className="text-xl">Filters</CardTitle>
        <p className="text-sm leading-6 text-slate-600">
          All query parameters are wired through to the public films endpoint.
        </p>
      </CardHeader>
      <CardContent>
        <form className="grid gap-4 lg:grid-cols-2" action="/films" method="get">
          <input name="page" type="hidden" value="1" />

          <div className="grid gap-2 lg:col-span-2">
            <Label htmlFor="q">Search</Label>
            <Input
              id="q"
              name="q"
              placeholder="Title, original title, keywords..."
              defaultValue={values.q}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="yearFrom">Year from</Label>
            <Input
              id="yearFrom"
              name="yearFrom"
              inputMode="numeric"
              placeholder="1990"
              defaultValue={values.yearFrom}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="yearTo">Year to</Label>
            <Input
              id="yearTo"
              name="yearTo"
              inputMode="numeric"
              placeholder="2026"
              defaultValue={values.yearTo}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="ratingFrom">Rating from</Label>
            <Input
              id="ratingFrom"
              name="ratingFrom"
              inputMode="decimal"
              placeholder="7.0"
              defaultValue={values.ratingFrom}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="ratingTo">Rating to</Label>
            <Input
              id="ratingTo"
              name="ratingTo"
              inputMode="decimal"
              placeholder="10.0"
              defaultValue={values.ratingTo}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="sortBy">Sort by</Label>
            <select
              id="sortBy"
              name="sortBy"
              className="h-11 rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-950 shadow-sm outline-none transition-colors focus:border-slate-300 focus:ring-4 focus:ring-slate-950/5"
              defaultValue={values.sortBy}
            >
              <option value="date">Release date</option>
              <option value="rating">Rating</option>
              <option value="popularity">Popularity</option>
            </select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="sortOrder">Sort order</Label>
            <select
              id="sortOrder"
              name="sortOrder"
              className="h-11 rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-950 shadow-sm outline-none transition-colors focus:border-slate-300 focus:ring-4 focus:ring-slate-950/5"
              defaultValue={values.sortOrder}
            >
              <option value="desc">Descending</option>
              <option value="asc">Ascending</option>
            </select>
          </div>

          <div className="grid gap-2 lg:col-span-2">
            <Label htmlFor="genreIds">Genre IDs</Label>
            <Input
              id="genreIds"
              name="genreIds"
              placeholder="id1,id2"
              defaultValue={values.genreIds}
            />
          </div>

          <div className="grid gap-2 lg:col-span-2">
            <Label htmlFor="tagIds">Tag IDs</Label>
            <Input
              id="tagIds"
              name="tagIds"
              placeholder="id1,id2"
              defaultValue={values.tagIds}
            />
          </div>

          <div className="grid gap-2 lg:col-span-2">
            <Label htmlFor="countryIds">Country IDs</Label>
            <Input
              id="countryIds"
              name="countryIds"
              placeholder="id1,id2"
              defaultValue={values.countryIds}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="pageSize">Page size</Label>
            <select
              id="pageSize"
              name="pageSize"
              className="h-11 rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-950 shadow-sm outline-none transition-colors focus:border-slate-300 focus:ring-4 focus:ring-slate-950/5"
              defaultValue={values.pageSize}
            >
              <option value="12">12</option>
              <option value="24">24</option>
              <option value="48">48</option>
            </select>
          </div>

          <div className="flex items-end justify-end gap-3 lg:col-span-2">
            <Button href="/films" variant="ghost">
              Reset
            </Button>
            <Button type="submit">Apply filters</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
