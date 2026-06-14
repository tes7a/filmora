import type { FilmCard } from '../../types/api';
import { Button } from '../atoms/button';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/card';

type FilmCardProps = {
  film: FilmCard;
  href?: string;
};

export function FilmCardView({ film, href }: FilmCardProps) {
  return (
    <Card className="group h-full overflow-hidden border-slate-200/80 bg-white/92 transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-[0_24px_70px_rgba(15,23,42,0.11)]">
      <div className="h-1.5 bg-gradient-to-r from-orange-400 via-amber-300 to-sky-400" />
      <CardHeader className="gap-4 pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="grid gap-1">
            <CardTitle className="text-lg">{film.title}</CardTitle>
            <p className="text-sm text-slate-500">{film.originalTitle}</p>
          </div>
          <Badge className="rounded-full px-2.5 py-1 text-xs" variant="default">
            {film.averageRating.toFixed(1)}
          </Badge>
        </div>
        <div className="flex flex-wrap gap-2">
          {film.genres.slice(0, 3).map((genre) => (
            <Badge key={genre.id} variant="outline" className="rounded-full px-3 py-1">
              {genre.name}
            </Badge>
          ))}
        </div>
      </CardHeader>
      <CardContent className="grid grid-cols-3 gap-3 text-sm text-slate-600">
        <div className="rounded-2xl bg-slate-50 px-3 py-2">
          <p className="text-[0.65rem] uppercase tracking-[0.24em] text-slate-400">
            Year
          </p>
          <p className="mt-1 font-medium text-slate-900">{film.releaseYear}</p>
        </div>
        <div className="rounded-2xl bg-slate-50 px-3 py-2">
          <p className="text-[0.65rem] uppercase tracking-[0.24em] text-slate-400">
            Duration
          </p>
          <p className="mt-1 font-medium text-slate-900">{film.durationMin}m</p>
        </div>
        <div className="rounded-2xl bg-slate-50 px-3 py-2">
          <p className="text-[0.65rem] uppercase tracking-[0.24em] text-slate-400">
            Votes
          </p>
          <p className="mt-1 font-medium text-slate-900">{film.ratingsCount}</p>
        </div>
      </CardContent>
      {href ? (
        <CardFooter className="pt-0">
          <Button href={href} variant="outline" size="sm" className="w-full">
            View details
          </Button>
        </CardFooter>
      ) : null}
    </Card>
  );
}
