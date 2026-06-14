import { publicUrls } from './public.urls';
import { requestJson } from '../http/fetch-json';
import type { CreatedFilmReview, FilmReview, UpdatedFilmReview } from '../../types/api';

export interface ReviewPayload {
  title: string;
  body: string;
}

export function getFilmReviews(id: string, accessToken?: string): Promise<FilmReview[]> {
  return requestJson(publicUrls.reviews.byFilm(id), {
    method: 'GET',
    headers: accessToken
      ? {
          Authorization: `Bearer ${accessToken}`,
        }
      : undefined,
  });
}

export function createFilmReview(
  id: string,
  accessToken: string,
  payload: ReviewPayload,
): Promise<CreatedFilmReview> {
  return requestJson(publicUrls.reviews.byFilm(id), {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    body: payload,
  });
}

export function updateFilmReview(
  id: string,
  accessToken: string,
  payload: ReviewPayload,
): Promise<UpdatedFilmReview> {
  return requestJson(publicUrls.reviews.byFilm(id), {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    body: payload,
  });
}
