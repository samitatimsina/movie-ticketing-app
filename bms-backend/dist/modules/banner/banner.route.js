"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// backend/modules/banner/banner.route.ts
const express_1 = __importDefault(require("express"));
const movie_model_1 = require("../movie/movie.model"); // adjust path to your Movie model
const router = express_1.default.Router();
// GET /api/v1/banners
router.get("/", async (req, res) => {
    try {
        // Fetch top 5 movies as banners
        const banners = await movie_model_1.MovieModel.find({})
            .limit(5) // you can adjust number of banners
            .select("_id title posterUrl description"); // only needed fields
        res.json(banners);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to fetch banners" });
    }
});
exports.default = router;
