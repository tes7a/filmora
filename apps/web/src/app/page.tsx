import { LandingTemplate } from '../components/templates/landing-template';
import { getNewRecommendations, getPopularRecommendations } from '../lib/api';

export default async function HomePage() {
  const [popularResponse, newResponse] = await Promise.all([
    getPopularRecommendations({ pageSize: 6 }),
    getNewRecommendations({ pageSize: 6 }),
  ]);

  return (
    <LandingTemplate
      title="Filmora web frontend"
      description="A clean Next.js base for the public client, built on the same atomic frontend rules as the admin app."
      popularFilms={popularResponse.items}
      newFilms={newResponse.items}
    />
  );
}
