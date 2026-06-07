import { adminUrls } from '@/lib/api/admin.urls';
import { requestJson } from '@/lib/http/http-client';
import type { GetTagsParams, PaginationResponse, Tag, TagStatus } from '@/types/admin';

export interface CreateTagPayload {
  name: string;
  slug: string;
  description?: string;
  status?: TagStatus;
}

export interface UpdateTagPayload {
  name?: string;
  slug?: string;
  description?: string | null;
  status?: TagStatus;
}

export function getTagsRequest(
  params: GetTagsParams = {},
): Promise<PaginationResponse<Tag>> {
  return requestJson({
    method: 'GET',
    url: adminUrls.tags.list,
    params,
  });
}

export function createTagRequest(payload: CreateTagPayload): Promise<Tag> {
  return requestJson({
    method: 'POST',
    url: adminUrls.tags.list,
    data: payload,
  });
}

export function updateTagRequest(id: string, payload: UpdateTagPayload): Promise<Tag> {
  return requestJson({
    method: 'PATCH',
    url: adminUrls.tags.byId(id),
    data: payload,
  });
}

export function deleteTagRequest(id: string): Promise<{ deleted: true }> {
  return requestJson({
    method: 'DELETE',
    url: adminUrls.tags.delete(id),
  });
}
