import { IMovie } from "./movie.interface";
import { MovieModel } from "./movie.model";

//create movie
export const createMovie = async (movie:IMovie)=>{
    return await MovieModel.create(movie);
}

//get all movies
export const getAllMovies = async () => {
    return await MovieModel.find().sort({releaseDate:-1});
}

//getMovieById
export const getMovieById = async (id:string) => {
    return await MovieModel.findById(id);
}

//get top movie by votes
export const getTopMovieByVotes = async (limit:number) => {
    return await MovieModel.find().sort({votes : -1}).limit(limit);
}