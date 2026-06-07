import { adminUrls } from '@/lib/api/admin.urls';
import { requestJson } from '@/lib/http/http-client';
import type { Country, GetCountriesParams, PaginationResponse } from '@/types/admin';

export interface CreateCountryPayload {
  code: string;
  name: string;
}

export interface UpdateCountryPayload {
  code?: string;
  name?: string;
}

export function getCountriesRequest(
  params: GetCountriesParams = {},
): Promise<PaginationResponse<Country>> {
  return requestJson({
    method: 'GET',
    url: adminUrls.countries.list,
    params,
  });
}

export function createCountryRequest(payload: CreateCountryPayload): Promise<Country> {
  return requestJson({
    method: 'POST',
    url: adminUrls.countries.list,
    data: payload,
  });
}

export function updateCountryRequest(
  id: string,
  payload: UpdateCountryPayload,
): Promise<Country> {
  return requestJson({
    method: 'PATCH',
    url: adminUrls.countries.byId(id),
    data: payload,
  });
}

export function deleteCountryRequest(id: string): Promise<{ deleted: true }> {
  return requestJson({
    method: 'DELETE',
    url: adminUrls.countries.delete(id),
  });
}
