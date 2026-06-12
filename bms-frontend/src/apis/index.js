import { axiosWrapper } from "./axiosWrapper";

// Movies
export const getRecommendedMovies = () =>
  axiosWrapper.get("/api/v1/movies/recommended");

export const getAllMovies = () =>
  axiosWrapper.get("/api/v1/movies");

export const getMovieById = (id) =>
  axiosWrapper.get(`/api/v1/movies/${id}`);

// Shows
export const getShowsByMoviesAndLocation = (movieId, state, date) =>
  axiosWrapper.get("/api/v1/shows", {
    params: { movieId, state, date },
  });

export const getShowById = (id) =>
  axiosWrapper.get(`/api/v1/shows/${id}`);

// Rating
export const rateMovie = (movieId, rating) =>
  axiosWrapper.post("/api/v1/movies/rate", { movieId, rating });

// Banners (FIXED)
export const getBanners = () =>
  axiosWrapper.get("/api/v1/banners");

// Search (FIXED)
export const searchMovies = (query) =>
  axiosWrapper.get("/api/v1/movies", {
    params: { search: query },
  });