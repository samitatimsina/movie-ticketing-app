import React from 'react'
import BannerSlider from '../components/shared/BannerSlider';
import MovieFilters from '../components/movies/MovieFilters';
import MovieList from '../components/movies/MovieList';
import MovieCard from '../components/movies/MovieCard';
import { getAllMovies } from '../apis';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Movies = () => {
  const { data: allMovies, isError } = useQuery({
    queryKey:["allMovies"],
    queryFn: async()=>{
      return await getAllMovies();
    },
    placeholderData: keepPreviousData,
  });
  if(isError){
    toast.error("Something went wrong!!");
  }
  return (
    <div>
        <BannerSlider />
        <div className='flex flex-col md:flex-row bg-[#f5f5f5] min-h-screen
        md:px-[100px] pb-10 pt-8'>
            <MovieFilters />
            <MovieList  allMovies={allMovies}/>
            <MovieCard />
        </div>
    </div>
  )
}

export default Movies;