export type UserStatus = 'active' | 'blocked' | 'deleted' | 'pending';
export type FilmStatus = 'visible' | 'hidden' | 'deleted';
export type GenreStatus = 'active' | 'hidden' | 'deleted';
export type TagStatus = 'active' | 'hidden' | 'deleted';
export type PersonStatus = 'visible' | 'hidden' | 'merged' | 'deleted';
export type ComplaintStatus = 'pending' | 'in_review' | 'resolved' | 'rejected';
export type TargetType = 'review' | 'comment' | 'user' | 'film';
export type TargetTypeExt = 'review' | 'comment' | 'user' | 'film';
export type ActionType =
  | 'hide_review'
  | 'unhide_review'
  | 'delete_review'
  | 'hide_comment'
  | 'unhide_comment'
  | 'delete_comment'
  | 'block_user'
  | 'unblock_user';
export type RoleCode = 'user' | 'moderator' | 'admin';

export interface PaginationResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}

export interface AdminUser {
  id: string;
  email: string;
  displayName: string;
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
  lastLoginAt: string | null;
  roles: string[];
}

export interface ComplaintUser {
  id: string;
  displayName: string;
}

export interface Complaint {
  id: string;
  userId: string;
  targetType: TargetType;
  targetId: string;
  reason: string;
  status: ComplaintStatus;
  createdAt: string;
  updatedAt: string;
  resolvedAt: string | null;
}

export interface ComplaintListItem extends Complaint {
  user: ComplaintUser;
}

export interface ModerationAction {
  id: string;
  moderatorId: string;
  targetType: TargetTypeExt;
  targetId: string;
  actionType: ActionType;
  reason: string | null;
  complaintId: string | null;
  createdAt: string;
  reviewStatus?: 'visible' | 'hidden' | 'deleted';
  commentStatus?: 'visible' | 'hidden' | 'deleted';
}

export interface Genre {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  status: GenreStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  status: TagStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Country {
  id: string;
  code: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface Person {
  id: string;
  fullName: string;
  slug: string;
  birthDate: string | null;
  deathDate: string | null;
  bio: string | null;
  status: PersonStatus;
  createdAt: string;
  updatedAt: string;
}

export interface AdminFilm {
  id: string;
  title: string;
  originalTitle: string;
  description: string | null;
  releaseYear: number;
  durationMin: number;
  ageRating: string | null;
  status: FilmStatus;
  averageRating: number;
  ratingsCount: number;
  popularityScore: number;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateUserStatusPayload {
  status: UserStatus;
}

export interface AddUserRolePayload {
  role: RoleCode;
}

export interface ModeratePayload {
  reason: string;
  complaintId?: string;
}

export interface GetUsersParams {
  page?: number;
  limit?: number;
  sortBy?: 'createdAt' | 'updatedAt' | 'lastLoginAt' | 'email' | 'displayName' | 'status';
  sortOrder?: 'asc' | 'desc';
  search?: string;
}

export interface GetGenresParams {
  q?: string;
  status?: GenreStatus;
  page?: number;
  limit?: number;
  sortBy?: 'name' | 'status' | 'createdAt' | 'updatedAt';
  sortOrder?: 'asc' | 'desc';
}

export interface GetTagsParams {
  q?: string;
  status?: TagStatus;
  page?: number;
  limit?: number;
  sortBy?: 'name' | 'status' | 'createdAt' | 'updatedAt';
  sortOrder?: 'asc' | 'desc';
}

export interface GetCountriesParams {
  q?: string;
  page?: number;
  limit?: number;
  sortBy?: 'name' | 'code' | 'createdAt' | 'updatedAt';
  sortOrder?: 'asc' | 'desc';
}

export interface GetPersonsParams {
  q?: string;
  status?: PersonStatus;
  page?: number;
  limit?: number;
  sortBy?: 'fullName' | 'status' | 'createdAt' | 'updatedAt';
  sortOrder?: 'asc' | 'desc';
}

export interface GetFilmsParams {
  q?: string;
  status?: FilmStatus;
  yearFrom?: number;
  yearTo?: number;
  ratingFrom?: number;
  ratingTo?: number;
  page?: number;
  limit?: number;
  sortBy?:
    | 'title'
    | 'status'
    | 'releaseYear'
    | 'averageRating'
    | 'ratingsCount'
    | 'popularityScore'
    | 'createdAt'
    | 'updatedAt';
  sortOrder?: 'asc' | 'desc';
}

export interface GetComplaintsParams {
  status?: ComplaintStatus;
  page?: number;
  limit?: number;
}
