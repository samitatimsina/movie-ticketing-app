import React, { useState } from 'react';
import { languages } from "../../utils/constants";

const MovieFilters = ({ onFilterChange }) => {

  const [selectedLang, setSelectedLang] = useState([]);

  const toggleLanguage = (lang) => {

    const updated = selectedLang.includes(lang)
      ? selectedLang.filter(l => l !== lang)   
      : [...selectedLang, lang];              

    setSelectedLang(updated);

    // send to parent
    onFilterChange(prev => ({
      ...prev,
      languages: updated
    }));
  };

  const clearLanguages = () => {
    setSelectedLang([]);

    onFilterChange(prev => ({
      ...prev,
      languages: []
    }));
  };

  return (
    <div className='w-full md:w-1/4 p-4 space-y-6'>
      <h2 className='text-2xl font-semibold'>Filters</h2>

      {/* LANGUAGE */}
      <div className='bg-white p-4 rounded-md'>
        <div className='flex justify-between items-center mb-2'>
          <span className='font-medium'>Languages</span>

          <button
            onClick={clearLanguages}
            className='text-[#f74366] cursor-pointer'
          >
            Clear
          </button>
        </div>

        <div className='flex flex-wrap gap-2'>
          {languages.map((lang, i) => (
            <span
              key={i}
              onClick={() => toggleLanguage(lang)}   // ✅ ADD CLICK
              className={`border px-3 py-1 text-sm rounded cursor-pointer transition
                ${
                  selectedLang.includes(lang)
                    ? "bg-[#f74362] text-white border-[#f74362]"
                    : "border-gray-200 text-[#f74362] hover:bg-gray-100"
                }
              `}
            >
              {lang}
            </span>
          ))}
        </div>
      </div>

      {/* placeholders (unchanged) */}
      <div className='bg-white mt-3 p-4 rounded'>
        <div className='flex justify-between items-center mb-2'>
          <span className='font-medium'>Genres</span>
          <button className='text-[#f74366] cursor-pointer'>Clear</button>
        </div>
      </div>

      <div className='bg-white mt-3 p-4 rounded'>
        <div className='flex justify-between items-center mb-2'>
          <span className='font-medium'>Format</span>
          <button className='text-[#f74366] cursor-pointer'>Clear</button>
        </div>
      </div>

      <button className='w-full border border-[#f74362] text-[#f74362] py-1 rounded hover:text-white transition'>
        Browse Cinemas
      </button>

    </div>
  );
};

export default MovieFilters;