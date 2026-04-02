import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AiOutlineArrowLeft } from "react-icons/ai";

const BookingHistory = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const staticBookings = [
      {
        id: "1",
        movie: "KGF Chapter 2",
        posterUrl: "https://stat4.bollywoodhungama.in/wp-content/uploads/2019/03/K.G.F-%E2%80%93-Chapter-2-2.jpg", 
        theater: "Galaxy Cinema",
        date: "2026-04-10",
        time: "6:30 PM",
        seats: ["C1", "C2", "C3"],
        amount: 1500,
      },
      {
        id: "2",
        movie: "Dimag Kharab",
        posterUrl: "https://i.ytimg.com/vi/SqVRyqG-2PI/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4C",
        theater: "Central Theater",
        date: "2026-04-12",
        time: "8:00 PM",
        seats: ["D4", "D5"],
        amount: 1000,
      },
    ];

    setBookings(staticBookings);
  }, []);

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Header with back arrow */}
      <div className='flex items-center gap-3 p-4 bg-white shadow mb-6'>
        <AiOutlineArrowLeft
          size={24}
          className='cursor-pointer text-gray-700 hover:text-gray-900'
          onClick={() => navigate("/")} // back to homepage
        />
        <h1 className='text-xl font-semibold'>Your Orders</h1>
      </div>

      <div className='px-6'>
        {bookings.length === 0 ? (
          <p className="text-center text-gray-500 mt-20">You have no bookings yet.</p>
        ) : (
          bookings.map((order) => (
            <div key={order.id} className='bg-white p-5 rounded-md mb-4 flex gap-5'>
              <img
                src={order.posterUrl}
                alt={order.movie}
                className='w-24 h-36 object-cover rounded'
              />
              <div className='flex-1'>
                <p className='font-semibold text-lg'>{order.movie}</p>
                <p className='text-sm text-gray-500'>{order.theater}</p>
                <p className='text-sm text-gray-500'>{order.date} | {order.time}</p>
                <p className='text-sm text-gray-500'>Seats: {order.seats.join(", ")}</p>
                <p className='text-sm text-gray-500 font-semibold'>Amount: Rs {order.amount}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default BookingHistory;