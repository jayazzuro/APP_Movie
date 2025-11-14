const BASE_URL = "http://localhost:8888";

export const API = {
  MOVIES: `${BASE_URL}/api/auth/movies`,
  ADD_MOVIE: `${BASE_URL}/api/auth/addMovie`,
  UPDATE_MOVIE: (id) => `${BASE_URL}/api/auth/updateMovie/${id}`,
  DELETE_MOVIE: (id) => `${BASE_URL}/api/auth/deleteMovie/${id}`,
  USERS: `${BASE_URL}/api/auth/users`,
  USER_DETAIL: (id) => `${BASE_URL}/api/auth/users/${id}`,
  PACK: `${BASE_URL}/api/auth/pack`,
  UPDATE_PACKAGE: (id) => `${BASE_URL}/api/auth/updatePackage/${id}`,
  DELETE_PACKAGE: (id) => `${BASE_URL}/api/auth/deletePack/${id}`,
  ADD_PACKAGE: `${BASE_URL}/api/auth/addPack`,
};

export const ROUTES = {
  ADD_MOVIE: "/dashboard/add-movie",
  EDIT_MOVIE: (id) => `/dashboard/edit-movie/${id}`,
  DETAIL_USER: (id) => `/dashboard/detail-user/${id}`,
};

export const IMG_URL = (imgName) => `${BASE_URL}/img/${imgName}`;
