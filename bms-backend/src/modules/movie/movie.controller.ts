import { Request,Response,NextFunction } from "express";
import * as MovieService from "./movie.service";

export const createMovie = async (req:Request, res:Response, next:NextFunction) => {
    try{
        const movie = await MovieService.createMovie(req.body);
        res.status(201).json({})
    }catch(error) {
        next(error);
    }
}

export const getMovies = async (req:Request,res:Response,next:NextFunction) =>{
    try{
        const movies = await MovieService.getAllMovies();
        res.status(200).json({movies})
    } catch(error){
        next(error);
    }
}

export const getMovieById = async (req:Request,res:Response,next:NextFunction) =>{
    try{
        const { id } = req.params;
        const movie = await MovieService.getMovieById(id);
        res.status(200).json({movie});
    } catch(error){
        next(error);
    }
}

export const getTopRecommendedMovies = async (req:Request,res:Response,next:NextFunction) =>{
    try{
        const topMovies = await MovieService.getTopMovieByVotes(5);
        res.status(200).json({
            topMovies})
    } catch(error){
        next(error);
    }
}