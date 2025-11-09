const BASE_URL = "http://localhost:8888";

export const API = {
  MOVIES: `${BASE_URL}/api/auth/movies`,
  ADD_MOVIE: `${BASE_URL}/api/auth/addMovie`,
  UPDATE_MOVIE: (id) => `${BASE_URL}/api/auth/updateMovie/${id}`,
  DELETE_MOVIE: (id) => `${BASE_URL}/api/auth/deleteMovie/${id}`,
};

export const ROUTES = {
  ADD_MOVIE: "/dashboard/add-movie",
  EDIT_MOVIE: (id) => `/dashboard/edit-movie/${id}`,
};

export const IMG_URL = (imgName) => `${BASE_URL}/img/${imgName}`;
