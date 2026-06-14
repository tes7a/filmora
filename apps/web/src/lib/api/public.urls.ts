export const publicUrls = {
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    me: '/auth/me',
    logout: '/auth/logout',
    lists: '/me/lists',
  },
  lists: {
    root: '/lists',
    byId: (id: string) => `/lists/${id}`,
    items: (id: string) => `/lists/${id}/items`,
    itemByFilm: (id: string, filmId: string) => `/lists/${id}/items/${filmId}`,
  },
  recommendations: {
    popular: '/recommendations/popular',
    new: '/recommendations/new',
  },
  films: {
    list: '/films',
    details: (id: string) => `/films/${id}`,
    full: (id: string) => `/films/${id}/full`,
    similar: (id: string) => `/films/${id}/similar`,
    rating: (id: string) => `/films/${id}/rating`,
    myRating: (id: string) => `/films/${id}/rating/me`,
  },
  reviews: {
    byFilm: (id: string) => `/reviews/${id}`,
  },
} as const;
