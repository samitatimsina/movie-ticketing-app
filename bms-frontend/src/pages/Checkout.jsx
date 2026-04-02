import React, { useEffect, useState } from "react";
import Header from "../components/seat-layout/Header";
import dayjs from "dayjs";
import { calculateTotalPrice, groupSeatsByType } from "../utils";
import { FaInfoCircle } from "react-icons/fa";
import { BiSolidOffer } from "react-icons/bi";
import { CiUser } from "react-icons/ci";
import { useAuth } from "../context/useAuth";
import { useLocation, useNavigate } from "react-router-dom";
import { useSeatContext } from "../context/SeatContext";
import toast from "react-hot-toast";
import { socket } from "../utils/socket";
import PaymentModal from "../components/PaymentModal";

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading } = useAuth();
  const { selectedSeats, currentShow: showData } = useSeatContext();
  const [timeLeft, setTimeLeft] = useState(300); // 5 min timer
  const { base, tax, total } = calculateTotalPrice(selectedSeats);
  const [paymentModal, setPaymentModal] = useState(null);
  const [bookingData, setBookingData] = useState({ bookingId: "TEMP123", amount: total });

  // Redirect if not logged in or no seats/show
  useEffect(() => {
    if (loading) return;
    if (!user) {
      navigate(`/signin?redirect=${location.pathname}`, { replace: true });
      return;
    }
    if (!showData || selectedSeats.length === 0) {
      toast.error("No seats selected!");
      navigate("/", { replace: true });
    }
  }, [user, loading, showData, selectedSeats, navigate, location.pathname]);

  // Timer effect with socket seat unlock
  useEffect(() => {
    if (!showData || !user || selectedSeats.length === 0) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          socket.emit("unlock-seats", { showId: showData._id, userId: user._id });
          toast.error("Time expired!");
          navigate("/", { replace: true });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [showData, user, selectedSeats, navigate]);

  // Loading state
  if (loading || !showData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  // Handle checkout
  const handleCheckout = async () => {
    if (!user || selectedSeats.length === 0) {
      toast.error("Invalid checkout");
      return;
    }


    try {
      const mockBookingId = "BOOK" + Date.now();
      setBookingData({ bookingId: mockBookingId, amount: total });
      setPaymentModal("success"); // open modal
    } catch (err) {
      console.error(err);
      toast.error("Checkout failed");
    }
  };

  return (
    <div className="min-h-screen w-full bg-white">
      <Header />
      <div className="max-w-6xl mx-auto px-4 py-6">
        <p className="text-red-500 text-center mb-3 text-lg border rounded-[14px] border-dashed py-2 font-semibold">
          Time left: {String(Math.floor(timeLeft / 60)).padStart(2, "0")}:
          {String(timeLeft % 60).padStart(2, "0")}
        </p>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* LEFT */}
          <div className="flex-1 space-y-4">
            <div className="flex gap-4">
              <img
                src={showData?.movie?.posterUrl}
                alt={showData?.movie?.title}
                className="w-[60px] h-[90px] rounded object-cover"
              />
              <div>
                <h3 className="font-semibold text-lg">{showData?.movie?.title}</h3>
                <p className="text-sm text-gray-600">
                  {showData?.movie?.certification} • {showData?.movie?.languages?.join(", ")} • {showData?.movie?.format?.join(", ")}
                </p>
                <p className="text-sm text-gray-600">
                  {showData?.theater?.name}, {showData?.theater?.city}, {showData?.theater?.state}
                </p>
              </div>
            </div>

            <div className="border border-gray-200 rounded-[24px] px-6 py-5">
              <p className="text-md font-medium border-b pb-5">
                {dayjs(showData?.date, "DD-MM-YYYY").format("D MMMM YYYY")} • <span className="font-semibold">{showData?.startTime}</span>
              </p>
              <div className="flex justify-between mt-4 mb-4">
                <div>
                  <p className="font-semibold">{selectedSeats.length} ticket(s)</p>
                  <div className="text-sm text-gray-500">
                    {groupSeatsByType(selectedSeats).map(({ type, seats }) => (
                      <p key={type}>{type} - {seats.join(", ")}</p>
                    ))}
                  </div>
                </div>
                <p className="font-semibold">₹{base}</p>
              </div>
            </div>

            <div className="border rounded-[24px] px-6 py-5 text-yellow-800 flex items-center gap-2">
              <FaInfoCircle /> No cancellation/refund after payment
            </div>

            <div className="flex justify-between border rounded-[24px] px-6 py-5">
              <p className="flex items-center gap-2"><BiSolidOffer /> Available Offers</p>
              <p className="text-blue-600 cursor-pointer">View all offers</p>
            </div>
          </div>

          {/* RIGHT */}
          <div className="w-full lg:w-[300px] space-y-4">
            <h4 className="text-lg font-medium">Payment Summary</h4>
            <div className="border rounded-[24px] px-6 py-7">
              <div className="flex justify-between"><span>Order amount</span><span>₹{base}</span></div>
              <div className="flex justify-between pb-4"><span>Tax</span><span>₹{tax}</span></div>
              <div className="flex justify-between font-semibold border-t pt-4"><span>Total</span><span>₹{total}</span></div>
            </div>

            <h4 className="text-lg font-medium">Your details</h4>
            <div className="border flex items-start gap-3 border-gray-200 rounded-[24px] px-6 py-7">
              <CiUser size={24} />
              <div className="-mt-1">
                <p className="text-sm font-medium">{user?.name || "Guest"}</p>
                <p className="text-sm text-gray-600">+977-{user?.phone || "N/A"}</p>
                <p className="text-sm text-gray-600">{user?.email}</p>
              </div>
            </div>

            <div
              onClick={handleCheckout}
              className="bg-black text-white rounded-[24px] px-6 py-4 flex justify-between cursor-pointer"
            >
              <p>₹{total}</p>
              <p>Proceed To Pay</p>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {paymentModal && (
        <PaymentModal
          type={paymentModal}
          bookingId={bookingData.bookingId}
          amount={bookingData.amount}
          onClose={() => setPaymentModal(null)}
          onContinue={() => {
            setPaymentModal(null);
            navigate("/profile/orders");
          }}
        />
      )}
    </div>
  );
};

export default Checkout;