import type { FilmCard } from '../../types/api';
import { Button } from '../atoms/button';
import { FeatureCard } from '../molecules/feature-card';
import { FilmRail } from '../organisms/film-rail';
import { HeroSection } from '../organisms/hero-section';
import { SiteHeader } from '../organisms/site-header';

type LandingTemplateProps = {
  title: string;
  description: string;
  popularFilms: FilmCard[];
  newFilms: FilmCard[];
};

const features = [
  {
    title: 'Atomic structure',
    description:
      'Separate atoms, molecules, organisms, and templates from the start so the UI stays readable as it grows.',
  },
  {
    title: 'Shared API layer',
    description:
      'Keep fetch logic in lib modules and push page-specific behavior into the right layer.',
  },
  {
    title: 'Monorepo-ready',
    description:
      'Follow the same workspace conventions as admin so scripts, linting, and formatting stay aligned.',
  },
];

export function LandingTemplate({
  title,
  description,
  popularFilms,
  newFilms,
}: LandingTemplateProps) {
  return (
    <main className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(249,115,22,0.18),_transparent_32%),radial-gradient(circle_at_bottom_right,_rgba(14,165,233,0.14),_transparent_28%),linear-gradient(180deg,#fff7ed_0%,#f8fafc_45%,#e2e8f0_100%)]">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-10 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <SiteHeader />

        <HeroSection title={title} description={description} />

        <section className="flex flex-wrap gap-3">
          <Button href="/login">Sign in</Button>
          <Button href="/register" variant="secondary">
            Create account
          </Button>
          <Button href="/forgot-password" variant="ghost">
            Recover password
          </Button>
        </section>

        <section id="features" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {features.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </section>

        <FilmRail
          buildHref={(film) => `/films/${film.id}`}
          title="Popular now"
          description="Live recommendations from the public API."
          films={popularFilms}
        />

        <FilmRail
          buildHref={(film) => `/films/${film.id}`}
          title="New releases"
          description="Recently added films sorted by release date."
          films={newFilms}
        />
      </div>
    </main>
  );
}
