import { adminUrls } from '@/lib/api/admin.urls';
import { requestJson } from '@/lib/http/http-client';
import type {
  Genre,
  GetGenresParams,
  PaginationResponse,
  GenreStatus,
} from '@/types/admin';

export interface CreateGenrePayload {
  name: string;
  slug: string;
  description?: string;
  status?: GenreStatus;
}

export interface UpdateGenrePayload {
  name?: string;
  slug?: string;
  description?: string | null;
  status?: GenreStatus;
}

export function getGenresRequest(
  params: GetGenresParams = {},
): Promise<PaginationResponse<Genre>> {
  return requestJson({
    method: 'GET',
    url: adminUrls.genres.list,
    params,
  });
}

export function createGenreRequest(payload: CreateGenrePayload): Promise<Genre> {
  return requestJson({
    method: 'POST',
    url: adminUrls.genres.list,
    data: payload,
  });
}

export function updateGenreRequest(
  id: string,
  payload: UpdateGenrePayload,
): Promise<Genre> {
  return requestJson({
    method: 'PATCH',
    url: adminUrls.genres.byId(id),
    data: payload,
  });
}

export function deleteGenreRequest(id: string): Promise<{ deleted: true }> {
  return requestJson({
    method: 'DELETE',
    url: adminUrls.genres.delete(id),
  });
}
