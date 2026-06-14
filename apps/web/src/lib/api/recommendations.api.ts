import { publicUrls } from './public.urls';
import { requestJson } from '../http/fetch-json';
import type { FilmCard, PaginationResponse } from '../../types/api';

export interface GetRecommendationsParams {
  q?: string;
  genreIds?: string[];
  tagIds?: string[];
  countryIds?: string[];
  yearFrom?: number;
  yearTo?: number;
  ratingFrom?: number;
  ratingTo?: number;
  sortBy?: 'rating' | 'date' | 'popularity';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  pageSize?: number;
}

export function getPopularRecommendations(
  params: GetRecommendationsParams = {},
): Promise<PaginationResponse<FilmCard>> {
  return requestJson(publicUrls.recommendations.popular, {
    params: {
      ...params,
      sortBy: params.sortBy ?? 'rating',
      sortOrder: params.sortOrder ?? 'desc',
      page: params.page ?? 1,
      pageSize: params.pageSize ?? 6,
    },
  });
}

export function getNewRecommendations(
  params: GetRecommendationsParams = {},
): Promise<PaginationResponse<FilmCard>> {
  return requestJson(publicUrls.recommendations.new, {
    params: {
      ...params,
      sortBy: params.sortBy ?? 'date',
      sortOrder: params.sortOrder ?? 'desc',
      page: params.page ?? 1,
      pageSize: params.pageSize ?? 6,
    },
  });
}
