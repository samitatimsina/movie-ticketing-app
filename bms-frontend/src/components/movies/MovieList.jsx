import React from 'react';
import MovieCard from './MovieCard';
import { languages } from '../../utils/constants';

const MovieList = ({allMovies}) => {
  return (
    <div className='w-full md:w-3/4 p-4'>
      <div className='flex flex-wrap gap-2 mb-4'>
        {languages?.map((lang, i) => (
          <span
            key={i}
            className='bg-white border-gray-200 text-[#f74362] px-2 py-1 rounded-[2px] text-sm cursor-pointer hover:bg-gray-100'
          >
            {lang}
          </span>
        ))}
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
