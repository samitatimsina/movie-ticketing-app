import express from "express";
import * as MovieController from "./movie.controller";
import { validate } from "../../middlewares/validate";
import { MovieSchema } from "./movie.validation";
import Movie from "./movie.model";

const router = express.Router();

router.post('/',validate(MovieSchema), MovieController.createMovie);
//router.post('/',MovieController.createMovie);
router.get('/',MovieController.getMovies);
router.get('/recommended',MovieController.getTopRecommendedMovies);
router.get('/:id',MovieController.getMovieById);
router.get("/search", async (req, res) => {
  const { search } = req.query; 
  try {
    const movies = await Movie.find(
      search ? { title: { $regex: search, $options: "i" } } : {}
    );
    res.json(movies);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;

