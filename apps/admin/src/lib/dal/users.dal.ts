import { adminUrls } from '@/lib/api/admin.urls';
import { requestJson } from '@/lib/http/http-client';
import type {
  AdminUser,
  AddUserRolePayload,
  GetUsersParams,
  PaginationResponse,
  UpdateUserStatusPayload,
} from '@/types/admin';

export function getUsersRequest(
  params: GetUsersParams = {},
): Promise<PaginationResponse<AdminUser>> {
  return requestJson({
    method: 'GET',
    url: adminUrls.users.list,
    params,
  });
}

export function updateUserStatusRequest(
  userId: string,
  payload: UpdateUserStatusPayload,
): Promise<AdminUser> {
  return requestJson({
    method: 'PATCH',
    url: adminUrls.users.status(userId),
    data: payload,
  });
}

export function addUserRoleRequest(
  userId: string,
  payload: AddUserRolePayload,
): Promise<AdminUser> {
  return requestJson({
    method: 'PATCH',
    url: adminUrls.users.roles(userId),
    data: payload,
  });
}

export function blockUserRequest(userId: string, reason: string): Promise<AdminUser> {
  return requestJson({
    method: 'POST',
    url: adminUrls.users.block(userId),
    data: { reason },
  });
}
