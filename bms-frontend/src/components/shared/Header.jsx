import React, { useState, useRef, useEffect } from "react";
import mainLogo from "../../assets/movie-tickets.png";
import { FaSearch } from "react-icons/fa";
import { useLocation } from "../../context/LocationContext";
import map from "../../assets/pin.gif";
import { useNavigate, NavLink, Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../context/useAuth";
import { FaUserCircle } from "react-icons/fa";

const Header = ({onSearch}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const { user, logout } = useAuth();
  const { location } = useLocation();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [movies, setMovies] = useState([]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch movies
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await axios.get("http://localhost:9000/api/v1/movies");

        setMovies(res.data?.data?.movies || res.data?.movies || []);
      } catch (err) {
        console.error("Failed to fetch movies for search", err);
      }
    };

    fetchMovies();
  }, []);

  const handleSearch = () => {
    const trimmedQuery = searchQuery.trim();
    if (!trimmedQuery) return;

    const matchedMovie = Array.isArray(movies)
      ? movies.find((movie) =>
          movie?.title?.toLowerCase().includes(trimmedQuery.toLowerCase())
        )
      : null;

    if (matchedMovie) {
      navigate(`/movies/${matchedMovie._id}`);
    } else {
    onSearch(trimmedQuery);    }

    setSearchQuery("");
  };

  return (
    <div className="w-full text-sm bg-white">
      {/* Top navbar */}
      <div className="px-4 md:px-8">
        <div className="max-w-screen-xl mx-auto py-3">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3">

            {/* Left */}
            <div className="flex flex-1 min-w-0 gap-3 items-center">
              <img
                src={mainLogo}
                alt="logo"
                className="h-8 md:h-9 max-w-[170px] object-contain cursor-pointer flex-shrink-0"
                onClick={() => navigate("/")}
              />

              <div className="relative w-full min-w-0">
                <input
                  type="text"
                  placeholder="Search for Movies"
                  className="w-full border border-gray-300 rounded px-4 py-2 text-sm outline-none truncate"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />

                <FaSearch
                  className="absolute right-2 top-3 text-gray-500 text-xs cursor-pointer"
                  onClick={handleSearch}
                />
              </div>
            </div>

            {/* Right */}
            <div className="flex items-center gap-4 mt-2 md:mt-0 flex-shrink-0">
              {location && (
                <div className="flex items-center gap-2 text-sm font-medium cursor-pointer shrink-0">
                  <img src={map} alt="location" className="w-10 h-10" />
                  <p className="truncate max-w-[100px]">{location} 🔻</p>
                </div>
              )}

              <div className="relative shrink-0" ref={dropdownRef}>
                {user ? (
                  <>
                    <FaUserCircle
                      size={28}
                      className="cursor-pointer text-gray-700"
                      onClick={() => setShowDropdown((prev) => !prev)}
                    />

                    {showDropdown && (
                      <div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-lg z-50">
                        <p className="px-4 py-2 text-sm border-b">
                          {user?.name}
                        </p>

                        <button
                          className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                          onClick={() => {
                            navigate("/profile");
                            setShowDropdown(false);
                          }}
                        >
                          Profile
                        </button>

                        <button
                          className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 text-red-500"
                          onClick={() => {
                            logout();
                            navigate("/");
                            setShowDropdown(false);
                          }}
                        >
                          Logout
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <Link to="/signin" className="text-sm font-medium">
                    Sign In
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom navbar */}
      <div className="bg-[#f2f2f2] px-4 md:px-8">
        <div className="max-w-screen-xl mx-auto flex items-center space-x-6 py-2 text-gray-700">
          <NavLink
            to="/movies"
            end
            className={({ isActive }) =>
              `cursor-pointer ${
                isActive
                  ? "text-red-500 font-semibold border-b-2 border-red-500"
                  : "hover:text-red-500"
              }`
            }
          >
            Movies
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default Header;