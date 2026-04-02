import React from "react";

const PaymentModal = ({ type, bookingId, amount, onClose, onContinue }) => {
  const isSuccess = type === "success";

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-sm w-full p-6 relative">
        {/* Close button */}
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 font-bold"
          onClick={onClose}
        >
          ✕
        </button>

        <div className="flex flex-col items-center space-y-4">
          {/* Success / Fail Icon */}
          <div className={`text-6xl ${isSuccess ? "text-green-500" : "text-red-500"}`}>
            {isSuccess ? "✓" : "✕"}
          </div>

          {/* Heading */}
          <h2 className="text-xl font-semibold">
            {isSuccess ? "Payment Successful!" : "Payment Failed!"}
          </h2>

          {/* Booking info */}
          <p className="text-gray-600">Booking ID: {bookingId}</p>
          {amount && <p className="text-gray-600">Amount: ₹{amount}</p>}

          {/* Action button */}
          <button
            className={`mt-4 px-6 py-2 rounded-lg font-semibold ${
              isSuccess
                ? "bg-green-600 text-white hover:bg-green-700"
                : "bg-red-600 text-white hover:bg-red-700"
            }`}
            onClick={isSuccess ? onContinue : onClose} // ✅ call onContinue if success
          >
            {isSuccess ? "Continue" : "Try Again"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;