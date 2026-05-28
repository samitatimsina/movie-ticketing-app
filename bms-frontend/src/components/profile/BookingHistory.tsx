import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AiOutlineArrowLeft } from "react-icons/ai";

const BookingHistory = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<any[]>([]);;

 const token = localStorage.getItem("token");

useEffect(() => {
  const fetchBookings = async () => {
    try {
      const res = await fetch(
        "http://localhost:9000/api/v1/booking/user",
        {
          credentials:"include",
          cache:"no-store",
          // method: "GET",
          // headers: {
          //   "Content-Type": "application/json",
          //   Authorization: `Bearer ${token}`,
          // },
        }
      );

      const data = await res.json();

      console.log("BOOKINGS:", data);

      setBookings(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load bookings", err);
    }
  };

  fetchBookings();
}, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex items-center gap-3 p-4 bg-white shadow mb-6">
        <AiOutlineArrowLeft
          size={24}
          className="cursor-pointer text-gray-700 hover:text-gray-900"
          onClick={() => navigate("/")}
        />

        <h1 className="text-xl font-semibold">
          Your Orders
        </h1>
      </div>

      <div className="px-6">
        {bookings.length === 0 ? (
          <p className="text-center text-gray-500 mt-20">
            You have no bookings yet.
          </p>
        ) : (
          bookings.map((order:any) => (
            <div
              key={order._id}
              className="bg-white p-5 rounded-md mb-4 flex gap-5"
            >
              <img
                src={order.movie?.posterUrl}
                alt={order.movie?.title}
                className="w-24 h-36 object-cover rounded"
              />

              <div className="flex-1">
                <p className="font-semibold text-lg">
                  {order.movie?.title}
                </p>

                <p className="text-sm text-gray-500">
                  {order.theater?.name}
                </p>

                <p className="text-sm text-gray-500">
                  {new Date(order.datetime).toLocaleString()}
                </p>

                <p className="text-sm text-gray-500">
                  Seats: {order.seats.join(", ")}
                </p>

                <p className="text-sm text-gray-500 font-semibold">
                  Amount: Rs {order.total}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default BookingHistory;