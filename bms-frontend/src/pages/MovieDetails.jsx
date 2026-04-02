import { useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getMovieById, rateMovie } from "../apis";
import ShowTimeSection from "./ShowTimeSection";
import { HiOutlineShare } from "react-icons/hi";

const MovieDetails = () => {
  const { id } = useParams(); // get movie id from URL
  const location = useLocation();
  const bannerMovie = location.state; // if clicked from banner

  const [userRating, setUserRating] = useState(0);

  // Fetch movie details dynamically from backend only if no banner data
  const { data, isLoading } = useQuery({
    queryKey: ["movie", id],
    queryFn: () => getMovieById(id),
    enabled: !bannerMovie, // only fetch if bannerMovie is undefined
  });

  // Decide which movie data to use
  const movie = bannerMovie || data?.data?.movie;

  const handleRating = (value) => {
    setUserRating(value);
    if (!bannerMovie) {
      rateMovie(id, value); // call backend to save rating only if dynamic
    }
  };

  if (!movie) {
    if (isLoading) return <div className="text-center py-10">Loading movie...</div>;
    return <div className="text-center py-10">Movie not found</div>;
  }

  return (
    <>
      {/* Banner / Poster */}
      <div
        className="relative text-white font-sans px-4 py-10"
        style={{
          backgroundImage: `url(${movie.posterUrl})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="absolute inset-0 bg-black/70" />
        <div className="relative z-10 max-w-7xl mx-auto flex flex-col lg:flex-row gap-10">
          <img src={movie.posterUrl} alt={movie.title} className="rounded-xl w-52 shadow-xl" />

          <div className="flex flex-col flex-1">
            <h1 className="text-4xl font-bold mb-4">{movie.title}</h1>

            {/* Rating */}
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-[#3a3a3a] px-4 py-2 rounded-md flex items-center gap-2 text-sm">
                <span className="text-pink-500 font-bold">⭐ {movie.rating || 0}/10</span>
                <span className="text-gray-300">{movie.votes || 0} Votes</span>
                {!bannerMovie && (
                  <div className="mt-3">
                    <p className="text-sm mb-1">Rate this movie:</p>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => handleRating(star)}
                          className={`text-2xl ${
                            star <= userRating ? "text-yellow-400" : "text-gray-400"
                          }`}
                        >
                          ★
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Format & Language */}
            <div className="flex items-center gap-3 text-sm mb-4">
              {movie.format && <span className="bg-[#3a3a3a] px-3 py-1 rounded">{movie.format.join(", ")}</span>}
              {movie.languages && <span className="bg-[#3a3a3a] px-3 py-1 rounded">{movie.languages.join(", ")}</span>}
            </div>

            {/* Meta */}
            <p className="text-sm text-gray-300 mb-4">
              {movie.duration} • {movie.genre?.join(", ")} • {movie.certification} •{" "}
              {movie.releaseDate ? new Date(movie.releaseDate).toLocaleDateString() : ""}
            </p>

            {/* About */}
            <h2 className="text-xl font-bold mb-2">About the movie</h2>
            <p className="text-sm text-gray-300 leading-relaxed">{movie.description}</p>
          </div>
        </div>
      </div>

      {/* Showtimes */}
      {!bannerMovie && (
        <div className="max-w-7xl mx-auto px-4">
          <ShowTimeSection movieId={id} location="Bhadrapur" />
        </div>
      )}
    </>
  );
};

export default MovieDetails;