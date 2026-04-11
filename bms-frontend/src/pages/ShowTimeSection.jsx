import { useState } from "react";
import dayjs from "dayjs";
import { filters } from "../utils/constants";
import { useQuery } from "@tanstack/react-query";
import { getShowsByMoviesAndLocation } from "../apis";
import { useNavigate } from "react-router-dom";

// Generate next N days dynamically
const generateDates = (days = 7) =>
  Array.from({ length: days }, (_, i) => {
    const date = dayjs().add(i, "day");
    return {
      key: date.format("YYYY-MM-DD"),
      date: date.format("DD"),
      day: date.format("ddd"),
      fullDate: date,
    };
  });

export default function ShowtimesSection({ movieId, location }) {
  const navigate = useNavigate(); 

  const safeLocation =
    typeof location === "string" && location !== "null"
      ? location.trim()
      : "koshi province";

  const [selectedDate, setSelectedDate] = useState(0);
  const dates = generateDates(7);
  const selectedFullDate = dates[selectedDate].fullDate.format("YYYY-MM-DD");

  const { data: showData = [], isLoading, isError } = useQuery({
    queryKey: ["show", movieId, safeLocation, selectedFullDate],
    queryFn: async () => {
      const res = await getShowsByMoviesAndLocation(
        movieId,
        safeLocation,
        selectedFullDate
      );
      return res.data || [];
    },
    enabled: !!movieId && !!safeLocation,
  });

  // Group shows by theatre name
  const groupedShows = showData.reduce((acc, show) => {
    const theatreName = show.theater?.name || show.theatre?.name || "Unknown";
    if (!acc[theatreName]) acc[theatreName] = [];
    acc[theatreName].push(show);
    return acc;
  }, {});

  return (
    <section className="mt-6">
      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-5">
        {filters.map((item) => (
          <button
            key={item}
            className="px-4 py-1.5 text-sm border rounded-full text-gray-700 hover:border-gray-500 hover:text-gray-500 transition"
          >
            {item}
          </button>
        ))}
      </div>

      {/* Dates */}
      <div className="flex gap-3 mb-8 overflow-x-auto">
        {dates.map((d, index) => (
          <div
            key={d.key}
            onClick={() => setSelectedDate(index)}
            className={`w-14 py-2 rounded-md text-center cursor-pointer transition shrink-0 ${
              selectedDate === index
                ? "bg-gray-800 text-white"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            <div className="text-base font-semibold">{d.date}</div>
            <div className="text-xs uppercase">{d.day}</div>
          </div>
        ))}
      </div>

      {/* Theatres */}
      <div className="space-y-6">
        {isLoading && (
          <div className="text-center text-gray-500">Loading shows...</div>
        )}
        {isError && (
          <div className="text-center text-red-500">
            Failed to fetch shows
          </div>
        )}
        {showData.length === 0 && !isLoading && (
          <div className="text-center text-gray-500">
            No shows available for selected date
          </div>
        )}

        {Object.entries(groupedShows).map(([theatreName, shows]) => (
          <div key={theatreName} className="border-b border-gray-200 pb-6">
            {/* Theatre Name */}
            <div className="flex items-center gap-3 mb-3">
              <h3 className="font-semibold text-gray-900">{theatreName}</h3>
            </div>

            {/* Show timings */}
            <div className="flex flex-wrap gap-3">
              {shows.map((show) => {
                const theaterId = show.theater?._id || show.theatre?._id;
                const movieName = show.movie?.title || "movie";

                return (
                  <button
                    onClick={() =>
                      navigate(
                        `/movies/${movieId}/${movieName}/${safeLocation}/${theaterId}/show/${show._id}/seat-layout`
                      )
                    }
                    key={show._id}
                    className="px-4 py-2 text-sm border rounded hover:bg-gray-300 hover:border-gray-400"
                  >
                    <div>{dayjs(show.startTime).format("hh:mm A")}</div>
                    <div className="text-[10px] text-gray-500">
                      {show.format}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}