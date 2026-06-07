import { adminUrls } from '@/lib/api/admin.urls';
import { requestJson } from '@/lib/http/http-client';
import type {
  GetPersonsParams,
  PaginationResponse,
  Person,
  PersonStatus,
} from '@/types/admin';

export interface CreatePersonPayload {
  fullName: string;
  slug: string;
  birthDate?: string;
  deathDate?: string;
  bio?: string;
  status?: PersonStatus;
}

export interface UpdatePersonPayload {
  fullName?: string;
  slug?: string;
  birthDate?: string | null;
  deathDate?: string | null;
  bio?: string | null;
  status?: PersonStatus;
}

export function getPersonsRequest(
  params: GetPersonsParams = {},
): Promise<PaginationResponse<Person>> {
  return requestJson({
    method: 'GET',
    url: adminUrls.persons.list,
    params,
  });
}

export function createPersonRequest(payload: CreatePersonPayload): Promise<Person> {
  return requestJson({
    method: 'POST',
    url: adminUrls.persons.list,
    data: payload,
  });
}

export function updatePersonRequest(
  id: string,
  payload: UpdatePersonPayload,
): Promise<Person> {
  return requestJson({
    method: 'PATCH',
    url: adminUrls.persons.byId(id),
    data: payload,
  });
}

export function deletePersonRequest(id: string): Promise<{ deleted: true }> {
  return requestJson({
    method: 'DELETE',
    url: adminUrls.persons.delete(id),
  });
}
