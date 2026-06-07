import { adminUrls } from '@/lib/api/admin.urls';
import { requestJson } from '@/lib/http/http-client';
import type {
  ComplaintListItem,
  GetComplaintsParams,
  ModeratePayload,
  ModerationAction,
  PaginationResponse,
} from '@/types/admin';

export function getComplaintsRequest(
  params: GetComplaintsParams = {},
): Promise<PaginationResponse<ComplaintListItem>> {
  return requestJson({
    method: 'GET',
    url: adminUrls.moderation.complaints,
    params,
  });
}

export function hideReviewRequest(
  reviewId: string,
  payload: ModeratePayload,
): Promise<ModerationAction> {
  return requestJson({
    method: 'POST',
    url: adminUrls.moderation.reviewHide(reviewId),
    data: payload,
  });
}

export function unhideReviewRequest(
  reviewId: string,
  payload: ModeratePayload,
): Promise<ModerationAction> {
  return requestJson({
    method: 'POST',
    url: adminUrls.moderation.reviewUnhide(reviewId),
    data: payload,
  });
}

export function deleteReviewRequest(
  reviewId: string,
  payload: ModeratePayload,
): Promise<ModerationAction> {
  return requestJson({
    method: 'POST',
    url: adminUrls.moderation.reviewDelete(reviewId),
    data: payload,
  });
}

export function hideCommentRequest(
  commentId: string,
  payload: ModeratePayload,
): Promise<ModerationAction> {
  return requestJson({
    method: 'POST',
    url: adminUrls.moderation.commentHide(commentId),
    data: payload,
  });
}

export function unhideCommentRequest(
  commentId: string,
  payload: ModeratePayload,
): Promise<ModerationAction> {
  return requestJson({
    method: 'POST',
    url: adminUrls.moderation.commentUnhide(commentId),
    data: payload,
  });
}

export function deleteCommentRequest(
  commentId: string,
  payload: ModeratePayload,
): Promise<ModerationAction> {
  return requestJson({
    method: 'POST',
    url: adminUrls.moderation.commentDelete(commentId),
    data: payload,
  });
}
