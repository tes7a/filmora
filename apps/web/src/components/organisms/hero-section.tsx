import { Eyebrow } from '../atoms/eyebrow';
import { Stat } from '../atoms/stat';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../atoms/button';

type HeroSectionProps = {
  title: string;
  description: string;
};

export function HeroSection({ title, description }: HeroSectionProps) {
  return (
    <section className="grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)] lg:items-stretch">
      <Card className="relative overflow-hidden border-slate-200/80 bg-white/85">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-orange-400 via-amber-300 to-sky-400" />
        <CardHeader className="space-y-5 p-6 sm:p-8">
          <div className="flex flex-wrap items-center gap-3">
            <Eyebrow text="Movie platform" />
            <Badge variant="secondary" className="rounded-full px-3 py-1">
              Live API
            </Badge>
          </div>

          <div className="grid gap-4">
            <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
              {title}
            </h1>
            <p className="max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
              {description}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button href="#features">Explore features</Button>
            <Button href="/register" variant="outline">
              Create account
            </Button>
          </div>
        </CardHeader>
      </Card>

      <Card className="overflow-hidden border-slate-950 bg-slate-950 text-white shadow-[0_30px_100px_rgba(15,23,42,0.35)]">
        <div className="h-1 bg-gradient-to-r from-amber-400 via-orange-500 to-sky-400" />
        <CardContent className="grid gap-6 p-6 sm:p-8">
          <div className="grid gap-2">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Focus</p>
            <CardTitle className="text-white">Atomic UI for frontend apps</CardTitle>
            <p className="text-sm leading-6 text-slate-300">
              Clean structure for scalable UI composition, shared API integration, and
              fast iteration.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <Stat value="2" label="frontend apps" />
            <Stat value="1" label="shared backend" />
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
