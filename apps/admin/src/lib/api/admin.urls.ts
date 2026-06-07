export const adminUrls = {
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    confirmEmail: '/auth/confirm-email',
    refresh: '/auth/refresh',
    logout: '/auth/logout',
    me: '/auth/me',
  },
  users: {
    list: '/admin/users',
    status: (userId: string) => `/admin/users/${userId}/status`,
    roles: (userId: string) => `/admin/users/${userId}/roles`,
    block: (userId: string) => `/admin/users/${userId}/block`,
  },
  films: {
    list: '/admin/films',
    byId: (filmId: string) => `/admin/films/${filmId}`,
    delete: (filmId: string) => `/admin/films/${filmId}`,
  },
  genres: {
    list: '/admin/genres',
    byId: (genreId: string) => `/admin/genres/${genreId}`,
    merge: (genreId: string) => `/admin/genres/${genreId}/merge`,
    delete: (genreId: string) => `/admin/genres/${genreId}`,
  },
  tags: {
    list: '/admin/tags',
    byId: (tagId: string) => `/admin/tags/${tagId}`,
    delete: (tagId: string) => `/admin/tags/${tagId}`,
  },
  countries: {
    list: '/admin/countries',
    byId: (countryId: string) => `/admin/countries/${countryId}`,
    delete: (countryId: string) => `/admin/countries/${countryId}`,
  },
  persons: {
    list: '/admin/persons',
    byId: (personId: string) => `/admin/persons/${personId}`,
    delete: (personId: string) => `/admin/persons/${personId}`,
  },
  moderation: {
    reviewHide: (reviewId: string) => `/admin/reviews/${reviewId}/hide`,
    reviewUnhide: (reviewId: string) => `/admin/reviews/${reviewId}/unhide`,
    reviewDelete: (reviewId: string) => `/admin/reviews/${reviewId}/delete`,
    commentHide: (commentId: string) => `/admin/comments/${commentId}/hide`,
    commentUnhide: (commentId: string) => `/admin/comments/${commentId}/unhide`,
    commentDelete: (commentId: string) => `/admin/comments/${commentId}/delete`,
    complaints: '/admin/complaints',
  },
} as const;
