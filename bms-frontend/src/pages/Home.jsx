import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import BannerSlider from '../components/shared/BannerSlider';
import Recommended from '../components/shared/Recommended';
import { searchMovies } from '../apis'; 

const Home = () => {
  const [searchQuery] = useState("");

  const { data: searchResults, isLoading, error } = useQuery({
  queryKey: ["search", searchQuery],
  queryFn: () => searchMovies(searchQuery),
  enabled: !!searchQuery,
  
});
  return (
    <div>
       {/* Existing Sections */}
      <BannerSlider />
      <Recommended />
      {/* Search Results */}
      {searchQuery && (
        <div className="search-results" style={{ margin: "1rem 0" }}>
          {isLoading && <p>Loading...</p>}
          {error && <p>Error fetching results</p>}
          {searchResults?.length > 0 ? (
            searchResults.map((movie) => (
              <div key={movie._id} style={{ marginBottom: "1rem" }}>
                <h3>{movie.title}</h3>
                <img src={movie.poster} alt={movie.title} width={150} />
              </div>
            ))
          ) : (
            <p>No results found for "{searchQuery}"</p>
          )}
        </div>
      )}

     
    </div>
  );
};

export default Home;