"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTopMovieByVotes = exports.getMovieById = exports.getAllMovies = exports.createMovie = void 0;
const movie_model_1 = require("./movie.model");
//create movie
const createMovie = async (movie) => {
    return await movie_model_1.MovieModel.create(movie);
};
exports.createMovie = createMovie;
//get all movies
const getAllMovies = async () => {
    return await movie_model_1.MovieModel.find().sort({ releaseDate: -1 });
};
exports.getAllMovies = getAllMovies;
//getMovieById
const getMovieById = async (id) => {
    return await movie_model_1.MovieModel.findById(id);
};
exports.getMovieById = getMovieById;
//get top movie by votes
const getTopMovieByVotes = async (limit) => {
    return await movie_model_1.MovieModel.find().sort({ votes: -1 }).limit(limit);
};
exports.getTopMovieByVotes = getTopMovieByVotes;
