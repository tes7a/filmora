import { publicUrls } from './public.urls';
import { requestJson } from '../http/fetch-json';
import type {
  FilmCard,
  FilmDetails,
  FilmFull,
  FilmRatingStats,
  PaginatedSimilarFilms,
  PaginationResponse,
  MyFilmRating,
} from '../../types/api';

export interface GetFilmsParams {
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

export function getFilms(
  params: GetFilmsParams = {},
): Promise<PaginationResponse<FilmCard>> {
  return requestJson(publicUrls.films.list, {
    params: {
      ...params,
      sortBy: params.sortBy ?? 'date',
      sortOrder: params.sortOrder ?? 'desc',
      page: params.page ?? 1,
      pageSize: params.pageSize ?? 12,
    },
  });
}

export function getFilmById(id: string): Promise<FilmDetails> {
  return requestJson(publicUrls.films.details(id));
}

export function getFilmFullById(id: string): Promise<FilmFull> {
  return requestJson(publicUrls.films.full(id));
}

export interface GetSimilarFilmsParams {
  q?: string;
  genreIds?: string[];
  tagIds?: string[];
  countryIds?: string[];
  yearFrom?: number;
  yearTo?: number;
  ratingFrom?: number;
  ratingTo?: number;
  sortBy?: 'similarity' | 'rating' | 'date' | 'popularity';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  pageSize?: number;
}

export function getSimilarFilms(
  id: string,
  params: GetSimilarFilmsParams = {},
): Promise<PaginatedSimilarFilms> {
  return requestJson(publicUrls.films.similar(id), {
    params: {
      ...params,
      sortBy: params.sortBy ?? 'similarity',
      sortOrder: params.sortOrder ?? 'desc',
      page: params.page ?? 1,
      pageSize: params.pageSize ?? 12,
    },
  });
}

export function getMyFilmRating(id: string, accessToken: string): Promise<MyFilmRating> {
  return requestJson(publicUrls.films.myRating(id), {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export function updateFilmRating(
  id: string,
  accessToken: string,
  score: number,
): Promise<FilmRatingStats> {
  return requestJson(publicUrls.films.rating(id), {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    body: { score },
  });
}
