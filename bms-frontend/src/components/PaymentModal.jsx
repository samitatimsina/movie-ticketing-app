import React, { useState } from "react";

const PaymentModal = ({
  type,              // "processing" | "success" | "failed"
  bookingId,
  amount,
  onClose,
  onSuccess,
  onRetry,
}) => {
  const [loading, setLoading] = useState(false);

  const isSuccess = type === "success";
  const isFailed = type === "failed";
  const isProcessing = type === "processing";

  const handleAction = async () => {
    try {
      setLoading(true);

      if (isSuccess && onSuccess) {
        await onSuccess();
      }

      if (isFailed && onRetry) {
        await onRetry();
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-sm w-full p-6 relative">

        {/* Close */}
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 font-bold"
          onClick={onClose}
          disabled={loading}
        >
          ✕
        </button>

        <div className="flex flex-col items-center space-y-4">

          {/* ICON */}
          <div className="text-6xl">
            {isProcessing && "⏳"}
            {isSuccess && "✓"}
            {isFailed && "✕"}
          </div>

          {/* TITLE */}
          <h2 className="text-xl font-semibold">
            {isProcessing && "Processing Payment..."}
            {isSuccess && "Payment Successful!"}
            {isFailed && "Payment Failed!"}
          </h2>

          {/* INFO */}
          <p className="text-gray-600">Booking ID: {bookingId}</p>
          {amount && <p className="text-gray-600">Amount: ₹{amount}</p>}

          {/* BUTTON */}
          {!isProcessing && (
            <button
              disabled={loading}
              className={`mt-4 px-6 py-2 rounded-lg font-semibold text-white ${
                isSuccess
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-red-600 hover:bg-red-700"
              }`}
              onClick={handleAction}
            >
              {loading
                ? "Please wait..."
                : isSuccess
                ? "Continue"
                : "Try Again"}
            </button>
          )}

          {/* optional hint */}
          {isProcessing && (
            <p className="text-sm text-gray-500">
              Please wait while we confirm your payment...
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;