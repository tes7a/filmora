export interface PaginationResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface FilmCardGenre {
  id: string;
  name: string;
  slug: string;
}

export interface FilmCard {
  id: string;
  title: string;
  originalTitle: string;
  releaseYear: number;
  durationMin: number;
  ageRating: string | null;
  averageRating: number;
  ratingsCount: number;
  createdAt: string;
  genres: FilmCardGenre[];
}

export interface FilmCountry {
  id: string;
  code: string;
  name: string;
}

export interface FilmTag {
  id: string;
  name: string;
  slug: string;
}

export interface FilmPerson {
  personId: string;
  fullName: string;
  slug: string;
  roleType: string;
  characterName: string | null;
  billingOrder: number | null;
}

export interface FilmDetails extends FilmCard {
  description: string | null;
  tags: FilmTag[];
  countries: FilmCountry[];
  persons: FilmPerson[];
  updatedAt: string;
}

export interface FilmFull extends FilmDetails {
  similarFilms: FilmCard[];
  samePersonFilms: FilmCard[];
}

export interface SimilarFilm {
  film: FilmCard;
  reason: string;
}

export interface PaginatedSimilarFilms {
  items: SimilarFilm[];
  total: number;
  page: number;
  pageSize: number;
}

export interface ReviewUser {
  id: string;
  displayName: string;
}

export interface ReviewVersion {
  id: string;
  versionNumber: number;
  title: string;
  body: string;
  createdAt: string;
}

export interface FilmReview {
  reviewId: string;
  status: string;
  createdAt: string;
  user: ReviewUser;
  currentVersion: ReviewVersion | null;
}

export interface CreatedFilmReview {
  reviewId: string;
  filmId: string;
  userId: string;
  currentVersionId: string;
  versionNumber: number;
  title: string;
  body: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpdatedFilmReview {
  reviewId: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  currentVersion: ReviewVersion;
}

export interface MyFilmRating {
  filmId: string;
  userScore: number | null;
}

export interface FilmRatingStats {
  filmId: string;
  userScore: number;
  averageRating: number;
  ratingsCount: number;
}

export interface ListItem {
  id: string;
  filmId: string;
  position: number | null;
  note: string | null;
  createdAt: string;
}

export interface UserList {
  id: string;
  name: string;
  type: string;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
  items: ListItem[];
}
