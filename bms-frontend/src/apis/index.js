import { axiosWrapper } from "./axiosWrapper";

// Movies
export const getRecommendedMovies = () =>
  axiosWrapper.get("/movies/recommended");

export const getAllMovies = () =>
  axiosWrapper.get("/movies");

export const getMovieById = (id) =>
  axiosWrapper.get(`/movies/${id}`);

// Shows
export const getShowsByMoviesAndLocation = (movieId, state, date) =>
  axiosWrapper.get("/shows", {
    params: { movieId, state, date },
  });

export const getShowById = (id) =>
  axiosWrapper.get(`/shows/${id}`);

// Rating
export const rateMovie = (movieId, rating) =>
  axiosWrapper.post("/movies/rate", { movieId, rating });

// Banners (FIXED)
export const getBanners = () =>
  axiosWrapper.get("/banners");

// Search (FIXED)
export const searchMovies = (query) =>
  axiosWrapper.get("/movies", {
    params: { search: query },
  });