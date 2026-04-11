import React,{useState} from 'react';
import BannerSlider from '../components/shared/BannerSlider';
import MovieFilters from '../components/movies/MovieFilters';
import MovieList from '../components/movies/MovieList';
import MovieCard from '../components/movies/MovieCard';
import { getAllMovies } from '../apis';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Movies = () => {
    const [filters, setFilters] = useState({
    languages: [],
    genres: [],
    formats: []
  });
  

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
  console.log(allMovies);
  const movies = allMovies?.data?.movies || [];

  const filteredMovies = movies.filter((movie)=> {
    const matchLanguage = 
    filters.languages?.length === 0 ||
    filters.languages?.includes(movie?.language);

    const matchGenre = filters.genres?.length === 0 ||
    filters.genres?.includes(movie?.genre);

    const matchFormat =
      filters.formats.length === 0 ||
      filters.formats.includes(movie.format);

    return matchLanguage && matchGenre && matchFormat;
  });
  return (
    <div>
        <BannerSlider />
        <div className='flex flex-col md:flex-row bg-[#f5f5f5] min-h-screen
        md:px-[100px] pb-10 pt-8'>
            <MovieFilters onFilterChnage = {setFilters} />
            <MovieList  allMovies={filteredMovies}/>
        </div>
    </div>
  )
}

export default Movies;