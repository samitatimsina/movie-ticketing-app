import express from "express";
import movieRouter from "../modules/movie/movie.route";
import theaterRouter from "../modules/theater/theater.routes";
import showRouter from "../modules/show/show.routes";
import bannerRouter from "../modules/banner/banner.route";
import userRouter from "../modules/user/user.route";
import authRouter from "../modules/user/user.route";

const router = express.Router();

router.use("/movies",movieRouter);
router.use("/theaters",theaterRouter);
router.use("/api/v1/shows",showRouter);
router.use("/api/v1/banners", bannerRouter);
router.use("/users", userRouter);
router.use("/auth",authRouter);

export default router;