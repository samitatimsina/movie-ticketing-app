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

/**
 * SINGLE SEAT COMPONENT (CLEAN)
 */
const Seat = ({
  seat,
  row,
  selectedSeats,
  lockedSeats,
  bookedSeats,
  myLocks,
  onClick,
}) => {
  const seatId = `${row}${seat.number}`;

  const isLocked = lockedSeats.includes(seatId);
  const isBooked = bookedSeats.includes(seatId);
  const isMine = myLocks.includes(seatId);
  const isSelected = selectedSeats.includes(seatId);

  const isDisabled =
    seat.status === "BOOKED" || isLocked || isBooked;

  return (
    <button
      className={`w-9 h-9 m-[2px] rounded-lg border text-sm transition-all
        ${
          isBooked || seat.status === "BOOKED"
            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
            : isLocked || isMine
            ? "bg-gray-300 text-gray-600 cursor-not-allowed"
            : isSelected
            ? "bg-[#6e52fa] text-white border-[#cec4f7]"
            : "hover:bg-gray-100 border-black"
        }`}
      disabled={isDisabled}
      onClick={onClick}
    >
      {isDisabled ? "X" : seat.number}
    </button>
  );
};

const SeatLayout = () => {
  const { showId } = useParams();

  const { selectedSeats, setSelectedSeats, setCurrentShow } =
    useSeatContext();

  const [lockedSeats, setLockedSeats] = useState([]);
  const [bookedSeats, setBookedSeats] = useState([]);
  const [pendingSeats, setPendingSeats] = useState([]);

  /**
   * SHOW DATA
   */
  const { data: showData } = useQuery({
    queryKey: ["show", showId],
    queryFn: async () => await getShowById(showId),
    enabled: !!showId,
    select: (res) => res.data,
  });

  useEffect(() => {
    if (showData) setCurrentShow(showData);
  }, [showData]);

  /**
   * SOCKET SETUP
   */
  useEffect(() => {
    if (!showId) return;

    const init = async () => {
      if (!socket.connected) {
        socket.connect();
        await new Promise((res) => socket.once("connect", res));
      }

      socket.emit("join-show", { showId });
    };

    init();

    const handleReconnect = () => {
      socket.emit("join-show", { showId });
    };

    socket.io.on("reconnect", handleReconnect);

    /**
     * INITIAL SYNC
     */
    const handleSeatSync = ({ lockedSeats = [], bookedSeats = [] }) => {
      setLockedSeats(lockedSeats);
      setBookedSeats(bookedSeats);
    };

    /**
     * REALTIME LOCK
     */
    const handleSeatLocked = ({ seatIds = [] }) => {
      setLockedSeats((prev) => [...new Set([...prev, ...seatIds])]);
    };

    /**
     * REALTIME UNLOCK
     */
    const handleSeatUnlocked = ({ seatIds = [] }) => {
      setLockedSeats((prev) =>
        prev.filter((id) => !seatIds.includes(id))
      );
    };

    /**
     * BOOKING CONFIRMED
     */
    const handleBookingCompleted = ({ seatIds = [] }) => {
      setBookedSeats((prev) => [...new Set([...prev, ...seatIds])]);

      setLockedSeats((prev) =>
        prev.filter((id) => !seatIds.includes(id))
      );
    };

    socket.on("seat-sync", handleSeatSync);
    socket.on("seat-locked", handleSeatLocked);
    socket.on("seat-unlocked", handleSeatUnlocked);
    socket.on("booking-completed", handleBookingCompleted);

    return () => {
      socket.off("seat-sync", handleSeatSync);
      socket.off("seat-locked", handleSeatLocked);
      socket.off("seat-unlocked", handleSeatUnlocked);
      socket.off("booking-completed", handleBookingCompleted);

      socket.io.off("reconnect", handleReconnect);
    };
  }, [showId]);

  /**
   * SEAT CLICK HANDLER
   */
  const handleSelectSeat = useCallback(
    (seatObj) => {
      const seatId = `${seatObj.row}${seatObj.number}`;

      if (
        lockedSeats.includes(seatId) ||
        bookedSeats.includes(seatId)
      ) {
        toast.error("Seat not available");
        return;
      }

      const exists = selectedSeats.find((s) => s.id === seatId);

      if (exists) {
        setPendingSeats((prev) =>
          prev.filter((id) => id !== seatId)
        );

        setSelectedSeats((prev) =>
          prev.filter((s) => s.id !== seatId)
        );

        socket.emit("unlock-seats", {
          showId,
          seatIds: [seatId],
        });

        return;
      }

      setPendingSeats((prev) => [...prev, seatId]);

      setSelectedSeats((prev) => [
        ...prev,
        { ...seatObj, id: seatId },
      ]);

      socket.emit("lock-seats", {
        showId,
        seatIds: [seatId],
      });
    },
    [lockedSeats, bookedSeats, selectedSeats, showId]
  );

  return (
    <div className="h-screen overflow-y-hidden">
      <div className="fixed top-0 left-0 w-full z-10">
        <Header showData={showData} />
      </div>

      <div className="max-w-7xl mx-auto mt-[210px] px-6 pb-4 bg-white h-[calc(100vh-320px)] overflow-y-scroll">
        {showData?.seatLayout && (
          <div className="flex flex-col items-center">
            {Object.entries(
              showData.seatLayout.reduce((acc, seatRow) => {
                if (!acc[seatRow.type])
                  acc[seatRow.type] = {
                    price: seatRow.price,
                    rows: [],
                  };

                acc[seatRow.type].rows.push(seatRow);
                return acc;
              }, {})
            ).map(([type, { price, rows }]) => (
              <div key={type} className="mb-10 text-center">
                <h2 className="font-semibold mb-3">
                  {type} - ₹{price}
                </h2>

                {rows.map((rowObj) => (
                  <div
                    key={rowObj.row}
                    className="flex items-center justify-center mb-1"
                  >
                    <span className="w-6 mr-2 text-sm">
                      {rowObj.row}
                    </span>

                    <div className="flex gap-1">
                      {rowObj.seats.map((seat, i) => {
                        const seatId = `${rowObj.row}${seat.number}`;

                        return (
                          <Seat
                            key={i}
                            seat={seat}
                            row={rowObj.row}
                            selectedSeats={selectedSeats.map(
                              (s) => s.id
                            )}
                            lockedSeats={lockedSeats}
                            bookedSeats={bookedSeats}
                            myLocks={pendingSeats}
                            onClick={() =>
                              handleSelectSeat({
                                row: rowObj.row,
                                number: seat.number,
                                type: rowObj.type,
                                price: rowObj.price,
                              })
                            }
                          />
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-center mt-6">
          <img src={screenImg} className="w-[300px] opacity-80" />
        </div>
      </div>

      <div className="fixed bottom-0 left-0 w-full h-[100px] z-10">
        <Footer location={showData?.location} />
      </div>
    </div>
  );
};

export default SeatLayout;