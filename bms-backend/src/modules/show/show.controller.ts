import { Request, Response, NextFunction } from "express";
import * as ShowService from "./show.services";
import { ShowSchema, GetShowsQuerySchema, UpdateSeatStatusSchema } from "./show.validation";

// CREATE SHOW
export const createShow = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validatedData = ShowSchema.parse(req.body);
    const show = await ShowService.createShow(validatedData);
    res.status(201).json(show);
  } catch (error) {
    next(error);
  }
};

//GET SHOWS
export const getShowsByMovieDateLocation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log("Incoming query:", req.query);

    const validatedQuery = GetShowsQuerySchema.parse(req.query);

    const loc = (validatedQuery.location ?? validatedQuery.state ?? "")
      .trim()
      .toLowerCase();

    const shows = await ShowService.getShowsByMovieDateLocation(
      validatedQuery.movieId,
      validatedQuery.date,
      loc
    );

    console.log(
      "Fetching shows for",
      validatedQuery.movieId,
      loc,
      validatedQuery.date
    );

    res.status(200).json(shows);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

// GET SHOW BY ID
export const getShowById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const show = await ShowService.getShowById(req.params.id);
    res.status(200).json(show);
  } catch (error) {
    next(error);
  }
};

// UPDATE SEAT
export const updateSeatStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validatedData = UpdateSeatStatusSchema.parse(req.body);

    const updatedShow = await ShowService.updateSeatStatus(
      req.params.showId,
      validatedData.row,
      validatedData.seatNumber,
      validatedData.status
    );

    res.status(201).json(updatedShow);
  } catch (error) {
    next(error);
  }
};