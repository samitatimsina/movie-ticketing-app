import React from 'react';
import { useNavigate } from "react-router-dom";

const MovieCard = ({ movie }) => {
  console.log(movie);
  const navigate = useNavigate();

  if (!movie) return null;

  const handleClick = () => {
    const slug = movie.title?.toLowerCase().replace(/\s+/g, "-");

    navigate(
      `/movies/koshi province/${slug}/${movie._id}/ticket`
    );
  };

  return (
    <div
      onClick={handleClick}
      className='w-40 md:52 cursor-pointer'
    >
      <img
        src={movie.img || '/placeholder.png'}
        alt={movie.title || 'No title'}
        className='rounded-lg shadow-md'
      />
      <p className='mt-2 font-medium'>{movie.title || 'No title'}</p>
      <p className='text-xs text-gray-500'>
        {movie.rating || 'N/A'} | {movie.votes || 'N/A'}
      </p>
      <p className='text-sm text-gray-600'>{movie.age || 'N/A'}</p>
      <p className='text-sm text-gray-500 truncate'>
        {Array.isArray(movie.languages)
          ? movie.languages.join(" | ")
          : 'N/A'}
      </p>
    </div>
  );
};

export default MovieCard;