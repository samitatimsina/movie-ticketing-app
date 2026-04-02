import  Express  from "express";
import { Router } from "express";
import * as ShowController from "./show.controller";

const router = Router();

router.post('/',ShowController.createShow);
router.get('/',ShowController.getShowsByMovieDateLocation);
router.get('/:id',ShowController.getShowById);
router.patch('/:showId/seats',ShowController.updateSeatStatus);

export default router;