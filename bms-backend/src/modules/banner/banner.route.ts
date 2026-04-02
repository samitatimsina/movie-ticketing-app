// backend/modules/banner/banner.route.ts
import express from "express";
import { MovieModel } from "../movie/movie.model"; // adjust path to your Movie model

const router = express.Router();

// GET /api/v1/banners
router.get("/", async (req, res) => {
  try {
    // Fetch top 5 movies as banners
    const banners = await MovieModel.find({})
      .limit(5) // you can adjust number of banners
      .select("_id title posterUrl description"); // only needed fields

    res.json(banners);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch banners" });
  }
});

export default router;