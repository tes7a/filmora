import type { FilmCard } from '../../types/api';
import { FilmCardView } from '../molecules/film-card';

type FilmRailProps = {
  title: string;
  description: string;
  films: FilmCard[];
  buildHref?: (film: FilmCard) => string;
};

export function FilmRail({ title, description, films, buildHref }: FilmRailProps) {
  return (
    <section className="grid gap-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div className="grid gap-1">
          <p className="text-xs font-semibold uppercase tracking-[0.34em] text-slate-500">
            Collection
          </p>
          <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
            {title}
          </h2>
        </div>
        <p className="max-w-2xl text-sm leading-6 text-slate-600">{description}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {films.map((film) => (
          <FilmCardView
            key={film.id}
            film={film}
            href={buildHref ? buildHref(film) : undefined}
          />
        ))}
      </div>
    </section>
  );
}
