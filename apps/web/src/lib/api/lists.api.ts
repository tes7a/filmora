import { publicUrls } from './public.urls';
import { requestJson } from '../http/fetch-json';
import type { UserList } from '../../types/api';

export interface CreateCustomListPayload {
  name: string;
  isPublic?: boolean;
}

export interface UpdateListPayload {
  name?: string;
  isPublic?: boolean;
}

export interface AddFilmToListPayload {
  filmId: string;
  position?: number | null;
  note?: string | null;
}

export function getMyLists(accessToken: string): Promise<UserList[]> {
  return requestJson(publicUrls.auth.lists, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export function createCustomList(
  accessToken: string,
  payload: CreateCustomListPayload,
): Promise<UserList> {
  return requestJson(publicUrls.lists.root, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    body: payload,
  });
}

export function updateList(
  accessToken: string,
  listId: string,
  payload: UpdateListPayload,
): Promise<UserList> {
  return requestJson(publicUrls.lists.byId(listId), {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    body: payload,
  });
}

export function addFilmToList(
  accessToken: string,
  listId: string,
  payload: AddFilmToListPayload,
): Promise<UserList> {
  return requestJson(publicUrls.lists.items(listId), {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    body: payload,
  });
}

export function removeFilmFromList(
  accessToken: string,
  listId: string,
  filmId: string,
): Promise<UserList> {
  return requestJson(publicUrls.lists.itemByFilm(listId, filmId), {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
