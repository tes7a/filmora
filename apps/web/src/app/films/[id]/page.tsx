import { notFound } from 'next/navigation';

import { FilmDetailTemplate } from '../../../components/templates/film-detail-template';
import { getFilmFullById } from '../../../lib/api';

export default async function FilmDetailsPage({
  params,
}: {
  params: Promise<{ id: string }> | { id: string };
}) {
  const { id } = await Promise.resolve(params);

  try {
    const film = await getFilmFullById(id);

    return <FilmDetailTemplate film={film} />;
  } catch (error) {
    const message = error instanceof Error ? error.message : '';

    if (message.includes('404') || message.includes('Cannot GET')) {
      notFound();
    }

    throw error;
  }
}
