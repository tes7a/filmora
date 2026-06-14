import type { FilmFull } from '../../types/api';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { FilmEngagementPanel } from '../organisms/film-engagement-panel';
import { SiteHeader } from '../organisms/site-header';
import { FilmRail } from '../organisms/film-rail';

type FilmDetailTemplateProps = {
  film: FilmFull;
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(value));
}

export function FilmDetailTemplate({ film }: FilmDetailTemplateProps) {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(249,115,22,0.16),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(14,165,233,0.12),_transparent_28%),linear-gradient(180deg,#fff7ed_0%,#f8fafc_45%,#e2e8f0_100%)]">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <SiteHeader />

        <Card className="overflow-hidden border-slate-200/80 bg-white/90">
          <div className="h-1.5 bg-gradient-to-r from-orange-400 via-amber-300 to-sky-400" />
          <CardHeader className="space-y-4 p-6 sm:p-8">
            <div className="flex flex-wrap items-center gap-3">
              <Badge variant="secondary" className="rounded-full px-3 py-1">
                Film details
              </Badge>
              <Badge variant="outline" className="rounded-full px-3 py-1">
                {film.ageRating ?? 'NR'}
              </Badge>
            </div>

            <div className="grid gap-3">
              <CardTitle className="text-3xl sm:text-4xl lg:text-5xl">
                {film.title}
              </CardTitle>
              <p className="text-base text-slate-500">{film.originalTitle}</p>
              {film.description ? (
                <p className="max-w-4xl text-sm leading-7 text-slate-600 sm:text-base">
                  {film.description}
                </p>
              ) : null}
            </div>

            <div className="flex flex-wrap gap-2">
              {film.genres.map((genre) => (
                <Badge
                  key={genre.id}
                  variant="outline"
                  className="rounded-full px-3 py-1"
                >
                  {genre.name}
                </Badge>
              ))}
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <Card className="border-slate-200/80 bg-slate-50">
                <CardContent className="p-4">
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
                    Year
                  </p>
                  <p className="mt-2 text-2xl font-semibold text-slate-950">
                    {film.releaseYear}
                  </p>
                </CardContent>
              </Card>
              <Card className="border-slate-200/80 bg-slate-50">
                <CardContent className="p-4">
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
                    Duration
                  </p>
                  <p className="mt-2 text-2xl font-semibold text-slate-950">
                    {film.durationMin}m
                  </p>
                </CardContent>
              </Card>
              <Card className="border-slate-200/80 bg-slate-50">
                <CardContent className="p-4">
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
                    Rating
                  </p>
                  <p className="mt-2 text-2xl font-semibold text-slate-950">
                    {film.averageRating.toFixed(1)}
                  </p>
                </CardContent>
              </Card>
              <Card className="border-slate-200/80 bg-slate-50">
                <CardContent className="p-4">
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
                    Votes
                  </p>
                  <p className="mt-2 text-2xl font-semibold text-slate-950">
                    {film.ratingsCount}
                  </p>
                </CardContent>
              </Card>
            </div>
          </CardHeader>
        </Card>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <Card className="border-slate-200/80 bg-white/90">
            <CardHeader className="space-y-2">
              <CardTitle className="text-xl">Metadata</CardTitle>
              <p className="text-sm leading-6 text-slate-600">
                Core film data and related entities from the API.
              </p>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid gap-2">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                  Countries
                </p>
                <div className="flex flex-wrap gap-2">
                  {film.countries.map((country) => (
                    <Badge
                      key={country.id}
                      variant="secondary"
                      className="rounded-full px-3 py-1"
                    >
                      {country.name}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="grid gap-2">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                  Tags
                </p>
                <div className="flex flex-wrap gap-2">
                  {film.tags.map((tag) => (
                    <Badge
                      key={tag.id}
                      variant="outline"
                      className="rounded-full px-3 py-1"
                    >
                      {tag.name}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="grid gap-2">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                  Updated
                </p>
                <p className="text-sm text-slate-600">{formatDate(film.updatedAt)}</p>
              </div>

              <div className="grid gap-2">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                  Created
                </p>
                <p className="text-sm text-slate-600">{formatDate(film.createdAt)}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200/80 bg-white/90">
            <CardHeader className="space-y-2">
              <CardTitle className="text-xl">People</CardTitle>
              <p className="text-sm leading-6 text-slate-600">
                Cast and crew involved in the film.
              </p>
            </CardHeader>
            <CardContent className="grid gap-3">
              {film.persons.map((person) => (
                <div
                  key={`${person.personId}-${person.roleType}-${person.characterName ?? ''}`}
                  className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                >
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div className="grid gap-1">
                      <p className="font-medium text-slate-950">{person.fullName}</p>
                      <p className="text-sm text-slate-600">
                        {person.roleType}
                        {person.characterName ? ` · ${person.characterName}` : ''}
                      </p>
                    </div>
                    {person.billingOrder !== null ? (
                      <Badge variant="outline" className="rounded-full px-2.5 py-1">
                        #{person.billingOrder}
                      </Badge>
                    ) : null}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <FilmEngagementPanel filmId={film.id} />

        <FilmRail
          buildHref={(filmItem) => `/films/${filmItem.id}`}
          description="Films with overlapping context from the full film response."
          films={film.similarFilms}
          title="Similar films"
        />

        <FilmRail
          buildHref={(filmItem) => `/films/${filmItem.id}`}
          description="Other films featuring the same people."
          films={film.samePersonFilms}
          title="Same people, other films"
        />
      </div>
    </main>
  );
}
