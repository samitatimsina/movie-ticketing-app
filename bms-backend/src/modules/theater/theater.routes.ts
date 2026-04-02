import express from "express";
import * as TheaterController from "./theater.controller";
import { TheaterSchema } from "./theater.validation";
import { validate } from "../../middlewares/validate";

const router = express.Router();

router.post("/",validate(TheaterSchema), TheaterController.createTheater);
router.get('/', TheaterController.getTheaters);

export default router;