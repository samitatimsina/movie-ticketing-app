import React from 'react';
import { useSeatContext } from "../../context/SeatContext";
import { useAuth } from "../../context/useAuth";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Footer = ({ location }) => {
  const { selectedSeats, currentShow } = useSeatContext();
  const { user } = useAuth();
  const navigate = useNavigate();

  const isSelected = selectedSeats.length > 0;

  const handleProceed = () => {
    if (!user) {
      toast.error("Please sign in first");
      navigate(`/signin?redirect=/shows/${currentShow?._id}/${location}/checkout`);
      return;
    }

    if (selectedSeats.length === 0) {
      toast.error("Please select at least one seat");
      return;
    }

if (!currentShow?._id) {
  toast.error("Show data not loaded yet");
  return;
}

    // ✅ redirect to checkout page
    navigate(`/checkout`);
  };

  return (
    <>
      {isSelected ? (
        <div className='bg-white py-3 px-6 flex items-center justify-between z-10'>
          <p className='text-gray-700 font-medium text-base'>{selectedSeats.length} Selected</p>
          <button 
            onClick={handleProceed}
            className='bg-black cursor-pointer text-white px-6 py-2 rounded-lg font-semibold'
          >
            Proceed
          </button>
        </div>
      ) : (
        <div className='flex flex-col items-center'>
          <p className='text-xs font-bold text-purple-600 tracking-wider'>
            SCREEN THIS WAY
          </p>
          <div className="flex items-center justify-center gap-6 text-sm mt-2">

            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border border-gray-500 rounded"></div>
              <span>Available</span>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-400 rounded-[4px] flex items-center justify-center">X</div>
              <span>Occupied</span>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-purple-600 rounded"></div>
              <span>Selected</span>
            </div>

          </div>
        </div>
      )}
    </>
  );
};

export default Footer;