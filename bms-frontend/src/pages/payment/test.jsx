import { useSearchParams, useNavigate } from "react-router-dom";
import React from "react";
import PaymentModal from "../../components/PaymentModal";

const PaymentTestPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const bookingId = searchParams.get("bookingId");
  const amount = searchParams.get("amount");

  const handleSuccess = () => {
    navigate(`/payment/success?bookingId=${bookingId}`);
  };

  const handleFail = () => {
    navigate(`/payment/fail?bookingId=${bookingId}`);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white shadow-lg rounded-lg max-w-md w-full">
        {/* Header */}
        <div className="bg-blue-600 text-white text-center py-4 rounded-t-lg font-semibold text-lg">
          eSewa Payment Test
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          {/* Booking Info */}
          <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
            <p className="text-sm text-gray-500">Booking ID</p>
            <p className="text-lg font-semibold">{bookingId}</p>
          </div>

          <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
            <p className="text-sm text-gray-500">Amount</p>
            <p className="text-lg font-semibold text-green-600">Rs. {amount}</p>
          </div>

          <p className="text-center text-gray-600 text-sm">
            This is a mock payment page for testing purposes. Click the button to simulate payment success or failure.
          </p>

          {/* Buttons */}
          <div className="flex flex-col gap-3 mt-4">
            <button
              onClick={handleSuccess}
              className="w-full bg-green-600 text-white font-semibold py-3 rounded-lg hover:bg-green-700 transition-colors"
            >
              Pay Now (Success)
            </button>
            <button
              onClick={handleFail}
              className="w-full bg-red-600 text-white font-semibold py-3 rounded-lg hover:bg-red-700 transition-colors"
            >
              Cancel Payment (Fail)
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 text-center py-3 text-gray-500 text-sm rounded-b-lg">
          Powered by Mock eSewa
        </div>
      </div>
    </div>
  );
};

export default PaymentTestPage;