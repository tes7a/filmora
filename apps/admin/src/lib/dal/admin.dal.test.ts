import type { AxiosResponse } from 'axios';
import { describe, expect, it, vi } from 'vitest';

import {
  blockUserRequest,
  deleteCommentRequest,
  deleteReviewRequest,
  getComplaintsRequest,
  getCountriesRequest,
  getFilmsRequest,
  getGenresRequest,
  hideCommentRequest,
  hideReviewRequest,
  getPersonsRequest,
  getTagsRequest,
  getUsersRequest,
  unhideCommentRequest,
  unhideReviewRequest,
} from '@/lib/dal';
import { httpClient } from '@/lib/http/http-client';

describe('admin DAL', () => {
  it('requests users list from /admin/users', async () => {
    const requestSpy = vi.spyOn(httpClient, 'request');
    requestSpy.mockResolvedValueOnce({
      data: { items: [], total: 0, page: 1, limit: 20 },
    } as AxiosResponse);

    await getUsersRequest({ page: 2, limit: 10, search: 'john' });

    expect(requestSpy).toHaveBeenCalledWith({
      method: 'GET',
      url: '/admin/users',
      params: { page: 2, limit: 10, search: 'john' },
    });
  });

  it('requests films list from /admin/films', async () => {
    const requestSpy = vi.spyOn(httpClient, 'request');
    requestSpy.mockResolvedValueOnce({
      data: { items: [], total: 0, page: 1, limit: 20 },
    } as AxiosResponse);

    await getFilmsRequest({ page: 1, limit: 20 });

    expect(requestSpy).toHaveBeenCalledWith({
      method: 'GET',
      url: '/admin/films',
      params: { page: 1, limit: 20 },
    });
  });

  it('requests genres list from /admin/genres', async () => {
    const requestSpy = vi.spyOn(httpClient, 'request');
    requestSpy.mockResolvedValueOnce({
      data: { items: [], total: 0, page: 1, limit: 20 },
    } as AxiosResponse);

    await getGenresRequest({ q: 'sci-fi' });

    expect(requestSpy).toHaveBeenCalledWith({
      method: 'GET',
      url: '/admin/genres',
      params: { q: 'sci-fi' },
    });
  });

  it('requests tags list from /admin/tags', async () => {
    const requestSpy = vi.spyOn(httpClient, 'request');
    requestSpy.mockResolvedValueOnce({
      data: { items: [], total: 0, page: 1, limit: 20 },
    } as AxiosResponse);

    await getTagsRequest({ status: 'active' });

    expect(requestSpy).toHaveBeenCalledWith({
      method: 'GET',
      url: '/admin/tags',
      params: { status: 'active' },
    });
  });

  it('requests countries list from /admin/countries', async () => {
    const requestSpy = vi.spyOn(httpClient, 'request');
    requestSpy.mockResolvedValueOnce({
      data: { items: [], total: 0, page: 1, limit: 20 },
    } as AxiosResponse);

    await getCountriesRequest({ q: 'uni' });

    expect(requestSpy).toHaveBeenCalledWith({
      method: 'GET',
      url: '/admin/countries',
      params: { q: 'uni' },
    });
  });

  it('requests persons list from /admin/persons', async () => {
    const requestSpy = vi.spyOn(httpClient, 'request');
    requestSpy.mockResolvedValueOnce({
      data: { items: [], total: 0, page: 1, limit: 20 },
    } as AxiosResponse);

    await getPersonsRequest({ status: 'visible' });

    expect(requestSpy).toHaveBeenCalledWith({
      method: 'GET',
      url: '/admin/persons',
      params: { status: 'visible' },
    });
  });

  it('requests complaints list from /admin/complaints', async () => {
    const requestSpy = vi.spyOn(httpClient, 'request');
    requestSpy.mockResolvedValueOnce({
      data: { items: [], total: 0, page: 1, limit: 20 },
    } as AxiosResponse);

    await getComplaintsRequest({ page: 3, limit: 15 });

    expect(requestSpy).toHaveBeenCalledWith({
      method: 'GET',
      url: '/admin/complaints',
      params: { page: 3, limit: 15 },
    });
  });

  it('requests block user action from /admin/users/:id/block', async () => {
    const requestSpy = vi.spyOn(httpClient, 'request');
    requestSpy.mockResolvedValueOnce({ data: { id: 'action-1' } } as AxiosResponse);

    await blockUserRequest('user-1', 'Violation');

    expect(requestSpy).toHaveBeenCalledWith({
      method: 'POST',
      url: '/admin/users/user-1/block',
      data: { reason: 'Violation' },
    });
  });

  it('requests hide review action from /admin/reviews/:id/hide', async () => {
    const requestSpy = vi.spyOn(httpClient, 'request');
    requestSpy.mockResolvedValueOnce({ data: { id: 'action-2' } } as AxiosResponse);

    await hideReviewRequest('review-1', { reason: 'Spam', complaintId: 'complaint-1' });

    expect(requestSpy).toHaveBeenCalledWith({
      method: 'POST',
      url: '/admin/reviews/review-1/hide',
      data: { reason: 'Spam', complaintId: 'complaint-1' },
    });
  });

  it('requests unhide review action from /admin/reviews/:id/unhide', async () => {
    const requestSpy = vi.spyOn(httpClient, 'request');
    requestSpy.mockResolvedValueOnce({ data: { id: 'action-3' } } as AxiosResponse);

    await unhideReviewRequest('review-1', { reason: 'Appeal approved' });

    expect(requestSpy).toHaveBeenCalledWith({
      method: 'POST',
      url: '/admin/reviews/review-1/unhide',
      data: { reason: 'Appeal approved' },
    });
  });

  it('requests delete review action from /admin/reviews/:id/delete', async () => {
    const requestSpy = vi.spyOn(httpClient, 'request');
    requestSpy.mockResolvedValueOnce({ data: { id: 'action-4' } } as AxiosResponse);

    await deleteReviewRequest('review-1', { reason: 'Policy violation' });

    expect(requestSpy).toHaveBeenCalledWith({
      method: 'POST',
      url: '/admin/reviews/review-1/delete',
      data: { reason: 'Policy violation' },
    });
  });

  it('requests hide comment action from /admin/comments/:id/hide', async () => {
    const requestSpy = vi.spyOn(httpClient, 'request');
    requestSpy.mockResolvedValueOnce({ data: { id: 'action-5' } } as AxiosResponse);

    await hideCommentRequest('comment-1', { reason: 'Abuse' });

    expect(requestSpy).toHaveBeenCalledWith({
      method: 'POST',
      url: '/admin/comments/comment-1/hide',
      data: { reason: 'Abuse' },
    });
  });

  it('requests unhide comment action from /admin/comments/:id/unhide', async () => {
    const requestSpy = vi.spyOn(httpClient, 'request');
    requestSpy.mockResolvedValueOnce({ data: { id: 'action-6' } } as AxiosResponse);

    await unhideCommentRequest('comment-1', { reason: 'Appeal approved' });

    expect(requestSpy).toHaveBeenCalledWith({
      method: 'POST',
      url: '/admin/comments/comment-1/unhide',
      data: { reason: 'Appeal approved' },
    });
  });

  it('requests delete comment action from /admin/comments/:id/delete', async () => {
    const requestSpy = vi.spyOn(httpClient, 'request');
    requestSpy.mockResolvedValueOnce({ data: { id: 'action-7' } } as AxiosResponse);

    await deleteCommentRequest('comment-1', { reason: 'Policy violation' });

    expect(requestSpy).toHaveBeenCalledWith({
      method: 'POST',
      url: '/admin/comments/comment-1/delete',
      data: { reason: 'Policy violation' },
    });
  });
});
