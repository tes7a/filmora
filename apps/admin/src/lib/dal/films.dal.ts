import { adminUrls } from '@/lib/api/admin.urls';
import { requestJson } from '@/lib/http/http-client';
import type {
  AdminFilm,
  FilmStatus,
  GetFilmsParams,
  PaginationResponse,
} from '@/types/admin';

export interface CreateFilmPayload {
  title: string;
  originalTitle: string;
  description?: string;
  releaseYear: number;
  durationMin: number;
  ageRating?: string;
  status?: FilmStatus;
  popularityScore?: number;
}

export interface UpdateFilmPayload {
  title?: string;
  originalTitle?: string;
  description?: string | null;
  releaseYear?: number;
  durationMin?: number;
  ageRating?: string | null;
  status?: FilmStatus;
  popularityScore?: number;
}

export function getFilmsRequest(
  params: GetFilmsParams = {},
): Promise<PaginationResponse<AdminFilm>> {
  return requestJson({
    method: 'GET',
    url: adminUrls.films.list,
    params,
  });
}

export function createFilmRequest(payload: CreateFilmPayload): Promise<AdminFilm> {
  return requestJson({
    method: 'POST',
    url: adminUrls.films.list,
    data: payload,
  });
}

export function updateFilmRequest(
  id: string,
  payload: UpdateFilmPayload,
): Promise<AdminFilm> {
  return requestJson({
    method: 'PATCH',
    url: adminUrls.films.byId(id),
    data: payload,
  });
}

export function deleteFilmRequest(id: string): Promise<{ deleted: true }> {
  return requestJson({
    method: 'DELETE',
    url: adminUrls.films.delete(id),
  });
}
