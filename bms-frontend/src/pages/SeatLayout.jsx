import React, { useEffect, useState, useCallback } from "react";
import Header from "../components/seat-layout/Header";
import Footer from "../components/seat-layout/Footer";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getShowById } from "../apis";
import screenImg from "../assets/screen.png";
import { useSeatContext } from "../context/SeatContext";
import { socket } from "../utils/socket";
import toast from "react-hot-toast";

/* Seat Component */
const Seat = ({ seat, row, selectedSeats, lockedSeats, onClick }) => {
  const seatId = `${row}${seat.number}`;
  const isLocked = lockedSeats?.includes(seatId) || false;
  const isSelected = selectedSeats?.includes(seatId);

  return (
    <button
      className={`w-9 h-9 m-[2px] rounded-lg border text-sm
        ${
          seat.status === "occupied"
            ? "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed"
            : isLocked
            ? "bg-gray-200 border-gray-300 text-gray-400 cursor-not-allowed"
            : isSelected
            ? "bg-[#6e52fa] text-white border-[#cec4f7] border-2"
            : "hover:bg-gray-100 border-black"
        }`}
      disabled={seat.status === "occupied" || isLocked}
      onClick={onClick}
    >
      {seat.status === "occupied" || isLocked ? "X" : seat.number}
    </button>
  );
};

/* Main Component */
const SeatLayout = () => {
  const { showId } = useParams();
  const { selectedSeats, setSelectedSeats, setCurrentShow } = useSeatContext();
  const [lockedSeats, setLockedSeats] = useState([]);

  /* Fetch Show */
  const { data: showData } = useQuery({
    queryKey: ["show", showId],
    queryFn: async () => await getShowById(showId),
    enabled: !!showId,
    select: (res) => res.data,
  });

  /* Set current show in context */
  useEffect(() => {
    if (showData) setCurrentShow(showData);
  }, [showData, setCurrentShow]);

  /* Seat Selection */
  const handleSelectSeat = useCallback(
    (seatObj) => {
      const seatId = `${seatObj.row}${seatObj.number}`;

      setSelectedSeats((prev) => {
        const exists = prev.find((s) => s.id === seatId);
        if (exists) {
          return prev.filter((s) => s.id !== seatId);
        } else {
          return [...prev, { ...seatObj, id: seatId }];
        }
      });

      socket.emit("lock-seats", { showId, seatIds: [seatId] });
    },
    [showId, setSelectedSeats]
  );

  /* Socket Logic */
  useEffect(() => {
    if (!showId) return;

    socket.emit("join-show", { showId });

    const handleInitial = ({ seatIds }) => setLockedSeats(seatIds || []);
    const handleLock = ({ seatIds, showId: incomingShowId }) => {
      if (incomingShowId !== showId) return;
      setLockedSeats((prev) => [...new Set([...prev, ...seatIds])]);
    };
    const handleUnlock = ({ seatIds, showId: incomingShowId }) => {
      if (incomingShowId !== showId) return;
      setLockedSeats((prev) => prev.filter((id) => !seatIds.includes(id)));
    };
    const handleFail = ({ alreadyLocked }) => {
      toast.error(`Some seats are already locked: ${alreadyLocked.join(", ")}`);
    };

    socket.on("locked-seats-initials", handleInitial);
    socket.on("seat-locked", handleLock);
    socket.on("seat-unlocked", handleUnlock);
    socket.on("seat-locked-failed", handleFail);

    return () => {
      socket.off("locked-seats-initials", handleInitial);
      socket.off("seat-locked", handleLock);
      socket.off("seat-unlocked", handleUnlock);
      socket.off("seat-locked-failed", handleFail);
    };
  }, [showId, setSelectedSeats]);

  /* Group seats by type and row for rendering */
  const groupedSeats = React.useMemo(() => {
    if (!showData?.seatLayout) return {};

    const grouped = {};
    showData.seatLayout.forEach((seat) => {
      const row = seat.row;
      if (!grouped[row]) grouped[row] = [];
      grouped[row].push({
        number: seat.number,
        type: seat.type,
        price: seat.price,
        status: seat.status || "available",
      });
    });
    return grouped;
  }, [showData]);

  /* UI */
  return (
    <div className="h-screen overflow-y-hidden">
      <div className="fixed top-0 left-0 w-full z-10">
        <Header showData={showData} />
      </div>

      <div className="max-w-7xl mx-auto mt-[210px] px-6 pb-4 bg-white h-[calc(100vh-320px)] overflow-y-scroll scrollbar-hide">
        <div className="flex flex-col items-center justify-center">
          {showData?.seatLayout && (
            <div className="flex flex-col items-center">
              {Object.entries(
                showData.seatLayout.reduce((acc, seatRow) => {
                  if (!acc[seatRow.type]) acc[seatRow.type] = { price: seatRow.price, rows: [] };
                  acc[seatRow.type].rows.push(seatRow);
                  return acc;
                }, {})
              ).map(([type, { price, rows }]) => (
                <div key={type} className="mb-12 text-center">
                  <h2 className="font-semibold text-lg mb-4">
                    {type} : ₹{price}
                  </h2>
                  {rows.map((rowObj) => (
                    <div key={rowObj.row} className="flex items-center justify-center mb-1">
                      <span className="w-6 text-right mr-2 text-sm text-gray-600">
                        {rowObj.row}
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {rowObj.seats.map((seat, i) => (
                          <Seat
                            key={i}
                            seat={seat}
                            row={rowObj.row}
                            selectedSeats={selectedSeats.map((s) => s.id)}
                            lockedSeats={lockedSeats}
                            onClick={() =>
                              handleSelectSeat({
                                row: rowObj.row,
                                number: seat.number,
                                type: rowObj.type,
                                price: rowObj.price,
                              })
                            }
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-center mt-5">
            <img src={screenImg} alt="Screen" className="w-[300px] md:w-[400px] opacity-80" />
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 w-full h-[100px] z-10">
        <Footer location={showData?.location} />
      </div>
    </div>
  );
};

export default SeatLayout;