import React from 'react';
import MovieCard from './MovieCard';

const MovieList = ({allMovies}) => {
  return (
    <div className='w-full md:w-3/4 p-4'>
      <div className='flex flex-wrap gap-2 mb-4'>
      </div>

      <div className='flex justify-between items-center bg-white px-6 py-6 rounded mb-6'>
        <h3 className='font-semibold text-xl'>Movies List</h3>
      </div>

      <div className='flex flex-wrap gap-6'>
        {allMovies?.map((movie, i) => (
          <MovieCard key={i} movie={movie} />
        ))}
      </div>
    </div>
    
  );
};

export default MovieList;
