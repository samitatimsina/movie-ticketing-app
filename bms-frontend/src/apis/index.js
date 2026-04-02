import axios from "axios";
import { axiosWrapper } from "./axiosWrapper";

//list all endpoints

export const getRecommendedMovies = () => axiosWrapper.get("/movies/recommended");
export const getAllMovies = () => axiosWrapper.get("/movies");
export const getMovieById = (data) =>
  axiosWrapper.get(`/movies/${data}`);
export const getShowsByMoviesAndLocation = (movieId, state, date) =>
    axiosWrapper.get("/shows",{
        params: {
            movieId, state, date
        }
    });
export const getShowById = (id) =>
  axiosWrapper.get(`/shows/${id}`); 
export const rateMovie = (movieId, rating) =>
  axiosWrapper.post("/movies/rate", { movieId, rating });
export const getBanners = async () => {
  const res = await axios.get("http://localhost:9000/api/v1/banners");
  return res.data;
};
export const searchMovies = async (query) => {
  const { data } = await axios.get(`/api/movies?search=${query}`);
  return data;
};